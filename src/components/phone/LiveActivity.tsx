import {
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type Ref,
} from "react";
import { ArrowUpRight } from "lucide-react";

export type GithubWeek = {
  /** Contributions over the seven days, formatted: "43". */
  total: string;
  /** Whether that is exactly one, for the word after it. */
  one: boolean;
  /** The seven days, oldest first and today last: each one's share of the
      busiest (0 to 1), and its weekday's initial. */
  days: { share: number; day: string }[];
  /** The profile all of this is read from. */
  href: string;
};

// A bar per day. A day with nothing still gets a stub, so the week keeps its
// seven places.
function Bars({ week, className }: { week: GithubWeek; className: string }) {
  return (
    <span className={className} aria-hidden>
      {week.days.map(({ share }, i) => (
        <i
          key={i}
          data-empty={share === 0 || undefined}
          style={{ "--share": share, "--i": i } as CSSProperties}
        />
      ))}
    </span>
  );
}

const sentence = (week: GithubWeek) =>
  `${week.total} ${week.one ? "contribution" : "contributions"} in the last 7 days`;

/**
 * The island with something in it: the last seven days on GitHub, a bar per
 * day on one side of the camera and their total on the other. A live
 * activity in the sense the platform means it, something still going on that
 * stays in view over every app; the days are the tail of the same calendar
 * the home-screen widget draws (see page.tsx), so the two can't disagree.
 *
 * It only draws and reports a tap: what a tap does (the island opening into
 * the week, the way it opens into a notification) is Phone's. On Android
 * there is no island, and CSS makes this a chip in the status bar instead.
 */
export function LiveIsland({
  ref,
  week,
  expanded,
  disabled,
  onExpand,
  onPull,
}: {
  ref: Ref<HTMLButtonElement>;
  week: GithubWeek;
  /** The island is open on it right now. */
  expanded: boolean;
  /** Something else has the whole screen: out of reach. */
  disabled: boolean;
  onExpand: (viaKeyboard: boolean) => void;
  /** A press that may turn out to be a pull on the status bar under it. */
  onPull: (e: ReactPointerEvent) => void;
}) {
  // A press that became a pull also ends in a click; only a tap opens it.
  const down = useRef({ x: 0, y: 0 });
  return (
    <button
      ref={ref}
      type="button"
      className="live"
      aria-label={`GitHub: ${sentence(week)}. Show the week.`}
      aria-expanded={expanded}
      inert={disabled}
      onPointerDown={(e) => {
        down.current = { x: e.clientX, y: e.clientY };
        onPull(e);
      }}
      onClick={(e) => {
        const viaKeyboard = e.detail === 0;
        const moved = Math.hypot(
          e.clientX - down.current.x,
          e.clientY - down.current.y,
        );
        if (viaKeyboard || moved < 6) onExpand(viaKeyboard);
      }}
    >
      <Bars week={week} className="live__bars" />
      <span className="live__count" aria-hidden>
        {week.total}
      </span>
    </button>
  );
}

/**
 * The same week with room to say what it is: what the island (or, on
 * Android, a banner) holds once the activity has been tapped. Laid out like
 * a notification, with the chart where an app's icon would be.
 */
export function LiveDetail({ week }: { week: GithubWeek }) {
  return (
    <>
      <span className="live-week" aria-hidden>
        {week.days.map(({ share, day }, i) => (
          <span key={i} className="live-week__day">
            <i
              data-empty={share === 0 || undefined}
              style={{ "--share": share } as CSSProperties}
            />
            <small>{day}</small>
          </span>
        ))}
      </span>
      <span className="banner__text">
        <span className="banner__top">
          <span className="banner__app">GitHub</span>
          <ArrowUpRight size={13} aria-hidden />
        </span>
        <span className="banner__title">
          {week.total} {week.one ? "contribution" : "contributions"}
        </span>
        <span className="banner__body">in the last 7 days</span>
      </span>
    </>
  );
}
