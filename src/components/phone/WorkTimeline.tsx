"use client";

import { Fragment, useEffect, useState, type CSSProperties } from "react";

export type TimelineRole = {
  /** Short company name. */
  label: string;
  /** Months since year 0 (year * 12 + month index), inclusive. */
  from: number;
  /** Null while the role is the current one. */
  to: number | null;
  /** As written in the data, for the text alternative. */
  period: string;
};

// The month it is in Kraków right now, in the same unit as the roles.
function currentMonth() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  return get("year") * 12 + get("month") - 1;
}

/**
 * The home-screen widget: where Jakub has worked, drawn to scale. One bar
 * per job from the first one to this month, the current one in the accent
 * colour and running off the edge because it hasn't ended. It is a picture
 * of the data in src/data/experience.ts, not a description of it: add a job
 * there and a bar appears here.
 *
 * `builtAt` is the month the page was built, so the server and the first
 * client render agree; the effect then moves "now" to the real month.
 */
export default function WorkTimeline({
  roles,
  builtAt,
}: {
  roles: TimelineRole[];
  builtAt: number;
}) {
  const [now, setNow] = useState(builtAt);
  useEffect(() => setNow(currentMonth()), []);

  const start = Math.min(...roles.map((r) => r.from));
  const span = now - start + 1;
  const at = (month: number) => `${((month - start) / span) * 100}%`;

  const years: number[] = [];
  for (let y = Math.ceil(start / 12); y * 12 <= now; y++) years.push(y);

  return (
    <div
      className="timeline"
      role="img"
      aria-label={`Work history: ${roles
        .map((r) => `${r.label}, ${r.period}`)
        .join("; ")}.`}
      // A row for the year labels, then one per job. Spelled out so the
      // year lines can span "first row to last" (see the CSS).
      style={{ gridTemplateRows: `1.2em repeat(${roles.length}, auto)` }}
    >
      {/* Year lines run behind every row, labelled along the top. */}
      <div className="timeline__years" aria-hidden>
        {years.map((year) => (
          <span key={year} style={{ left: at(year * 12) }}>
            {year}
          </span>
        ))}
      </div>

      {roles.map((role, i) => {
        const current = role.to === null;
        const row = i + 2;
        return (
          <Fragment key={role.label}>
            <span
              aria-hidden
              className="timeline__name"
              data-current={current || undefined}
              style={{ gridRow: row }}
            >
              {role.label}
            </span>
            <span
              aria-hidden
              className="timeline__track"
              style={{ gridRow: row }}
            >
              <span
                className="timeline__bar"
                data-current={current || undefined}
                style={
                  {
                    left: at(role.from),
                    // A finished job ends where it ended; the current one
                    // has no end, so its bar is left open (see the CSS).
                    width: current
                      ? undefined
                      : `${((role.to! - role.from + 1) / span) * 100}%`,
                    "--i": i,
                  } as CSSProperties
                }
              />
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}
