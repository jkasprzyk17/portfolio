// Section headings double as the map legend: the square is the same colour
// the section's pins use in ClusterMap.
export default function SectionHeading({
  color,
  count,
  children,
}: {
  color: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-fg-3 mb-7">
      <span
        aria-hidden
        className="size-2 rounded-[2px] shrink-0"
        style={{ background: color }}
      />
      <span className="text-fg">{children}</span>
      <span aria-hidden className="flex-1 border-t hairline" />
      {count && <span className="tabular-nums">{count}</span>}
    </h2>
  );
}
