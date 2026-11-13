import type { ReactNode } from "react";

/** A section heading inside an app: a plain title, sentence case. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="sect">{children}</h3>;
}

export type InfoRow = { label: string; value: ReactNode };

/**
 * Facts as label–value rows with hairlines between them, the way a store
 * page lists who made an app and what it needs. Used instead of tag pills:
 * a row says what a value *is*, a pill only that it exists.
 */
export function Info({ rows }: { rows: InfoRow[] }) {
  return (
    <dl className="info">
      {rows.map((row) => (
        <div key={row.label} className="info__row">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A link shown as a value: the host or name, opening in a new tab. */
export function InfoLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/**
 * Short facts in a row with a dot between them. Where the row wraps, a fact
 * moves to the next line whole and the dot that would have led that line is
 * hidden, so no line starts or ends on a separator.
 */
export function Dots({
  items,
  className = "",
}: {
  items: ReactNode[];
  className?: string;
}) {
  return (
    <p className={`dots ${className}`}>
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </p>
  );
}
