import { ArrowUpRight } from "lucide-react";
import { education } from "@/data/education";

export default function Education() {
  return (
    <section id="education" className="py-14 border-t hairline">
      <h2 className="text-[13px] tracking-[0.04em] uppercase text-fg-3 mb-6">
        education
      </h2>

      <ul className="rise-on-scroll space-y-6">
        {education.map((item) => (
          <li key={item.id} className="text-[15px] leading-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <div className="flex flex-wrap items-baseline gap-x-2 text-fg">
                <span className="font-medium">{item.field}</span>
                <span className="text-fg-3">·</span>
                {item.schoolUrl ? (
                  <a
                    href={item.schoolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prose-link inline-flex items-center gap-0.5"
                  >
                    {item.school}
                    <ArrowUpRight size={12} className="opacity-60" />
                  </a>
                ) : (
                  <span>{item.school}</span>
                )}
              </div>
              <span className="text-fg-3 text-[13px] tabular-nums">
                {item.period}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
