// A year of someone's GitHub contributions, day by day. Server only: it is
// called while a page is being rendered, never from the browser.
//
// The source is the calendar GitHub draws on a profile, which it serves as a
// fragment of HTML to anyone, without a token. That is not a documented API,
// so everything read from it is checked and anything unexpected is an error:
// the caller decides what a missing calendar means. Moving to the GraphQL
// `contributionCalendar` (documented, but it needs a token in the
// environment) would change this file and nothing else.
import { get } from "node:https";

export type ContributionDay = {
  /** YYYY-MM-DD, in UTC, as GitHub dates it for a signed-out visitor. */
  date: string;
  /** GitHub's own bucket for the day: 0 none, 4 the busiest. */
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
};

// Deliberately not `fetch`. Next keeps what `fetch` returns in a cache of its
// own that outlives a build, and a build reads from it even when the entry is
// stale: a deploy would draw the calendar as it was at the previous one. A
// plain request is made every time a page that needs it is rendered.
function read(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    get(
      url,
      {
        headers: { "user-agent": "node" },
        // A hung request must not hold a build or a refresh of the page.
        signal: AbortSignal.timeout(8000),
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`GitHub answered ${res.statusCode}`));
          return;
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(body));
        res.on("error", reject);
      },
    ).on("error", reject);
  });
}

const attribute = (tag: string, name: string) =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

async function load(user: string): Promise<ContributionDay[]> {
  const html = await read(`https://github.com/users/${user}/contributions`);

  // What each day's tooltip says: "5 contributions on November 14th." or
  // "No contributions on …", keyed by the cell it belongs to.
  const counts = new Map<string, number>();
  for (const [, id, said] of html.matchAll(
    /<tool-tip[^>]*\sfor="([^"]+)"[^>]*>\s*(No|[\d,]+) contributions?\b/g,
  )) {
    counts.set(id, said === "No" ? 0 : Number(said.replace(/,/g, "")));
  }

  const days: ContributionDay[] = [];
  for (const [tag] of html.matchAll(/<td[^>]*\sdata-date="[^"]*"[^>]*>/g)) {
    const date = attribute(tag, "data-date");
    const level = Number(attribute(tag, "data-level"));
    const count = counts.get(attribute(tag, "id") ?? "");
    if (
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !(level >= 0 && level <= 4) ||
      count === undefined
    ) {
      throw new Error("GitHub's calendar has a day that can't be read");
    }
    days.push({ date, level: level as ContributionDay["level"], count });
  }
  // The table is laid out by weekday, not by date.
  days.sort((a, b) => (a.date < b.date ? -1 : 1));

  // A year of days, one after another with none missing. Anything else means
  // the markup has changed under us.
  const DAY = 24 * 60 * 60 * 1000;
  const consecutive = days.every(
    (day, i) =>
      i === 0 || Date.parse(day.date) - Date.parse(days[i - 1].date) === DAY,
  );
  if (days.length < 360 || days.length > 372 || !consecutive) {
    throw new Error(`GitHub's calendar has ${days.length} days, not a year`);
  }
  return days;
}

// One answer serves every render in the next few minutes: the two pages that
// draw the phone in one build, and every reload while developing, which would
// otherwise each be a request to GitHub. Far shorter than the hours between
// refreshes of a page, and a failure is never kept.
const KEEP = 5 * 60 * 1000;
const recent = new Map<
  string,
  { at: number; days: Promise<ContributionDay[]> }
>();

/** Oldest day first, today last. Rejects if GitHub can't be read. */
export function fetchContributions(user: string): Promise<ContributionDay[]> {
  const kept = recent.get(user);
  if (kept && Date.now() - kept.at < KEEP) return kept.days;
  const days = load(user);
  recent.set(user, { at: Date.now(), days });
  days.catch(() => {
    if (recent.get(user)?.days === days) recent.delete(user);
  });
  return days;
}
