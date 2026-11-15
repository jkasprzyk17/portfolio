import { ArrowUpRight } from "lucide-react";

export type GithubActivity = {
  /** Contributions in the last year, the figure GitHub puts on the profile,
      formatted: "3,873". A year, though fewer weeks are drawn: it is the
      number a visitor can check. */
  count: string;
  /** How many weeks are drawn, the last of them this one. */
  weeks: number;
  /** A character per day, oldest first, starting on a Sunday: GitHub's level
      for the day, "0" (nothing) to "4" (its busiest). It stops at today, so
      the last week is usually short. */
  days: string;
  /** Where a month's name goes: the week its first day falls in. */
  months: { week: number; label: string }[];
  /** The profile all of this is read from. */
  href: string;
};

// The grid's own units: a day is a CELL-sized square every PITCH, with its
// corners rounded by R.
const PITCH = 10;
const CELL = 8;
const R = 2;
const LEVELS = ["0", "1", "2", "3", "4"];

// Every day of one level as a single path, so the year is five elements
// rather than a few hundred. Each day is a square drawn R short of its edge
// all round; a round-joined stroke of the same colour (see the JSX) makes up
// the difference and rounds the corner.
function squares(days: string, level: string) {
  const side = CELL - 2 * R;
  let d = "";
  for (let i = 0; i < days.length; i++) {
    if (days[i] !== level) continue;
    const x = Math.floor(i / 7) * PITCH + R;
    const y = (i % 7) * PITCH + R;
    d += `M${x} ${y}h${side}v${side}h${-side}z`;
  }
  return d;
}

/**
 * The second home-screen widget: what Jakub has been doing on GitHub, a
 * square per day and a column per week, today in the bottom right. Like the
 * timeline above it, it is a picture of data rather than a description: the
 * days come from GitHub's own calendar when the page is built or refreshed
 * (see page.tsx), and nothing here knows what day it is.
 *
 * It is a link, the way a widget opens its app: this one's app is GitHub.
 */
export default function GithubWidget({
  count,
  weeks,
  days,
  months,
  href,
}: GithubActivity) {
  const width = weeks * PITCH - (PITCH - CELL);
  const height = 7 * PITCH - (PITCH - CELL);
  return (
    <a
      className="widget gh"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // Dragging a link would otherwise start the browser's own drag of it.
      draggable={false}
      aria-label={`GitHub: ${count} contributions in the last year. Opens the profile.`}
    >
      <div className="gh__line" aria-hidden>
        <span>
          <b>{count}</b> contributions
          {/* Left off where the line would not fit (see the CSS). */}
          <span className="gh__period"> in the last year</span>
        </span>
        <span className="gh__where">
          GitHub <ArrowUpRight size="1.05em" />
        </span>
      </div>
      <div className="gh__chart" aria-hidden>
        <div className="gh__months">
          {months.map(({ week, label }) => (
            <span
              key={week}
              style={{ left: `${((week * PITCH) / width) * 100}%` }}
            >
              {label}
            </span>
          ))}
        </div>
        <svg className="gh__grid" viewBox={`0 0 ${width} ${height}`}>
          {LEVELS.map((level) => (
            <path
              key={level}
              className={`gh__l${level}`}
              d={squares(days, level)}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={2 * R}
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    </a>
  );
}
