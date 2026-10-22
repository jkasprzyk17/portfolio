import {
  ArrowUpRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  Package,
  Phone,
  Smartphone,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import type { LinkEntry, LinkIcon } from "@/data/links";

const icons: Record<LinkIcon, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  phone: Phone,
  cv: FileText,
  app: Smartphone,
  package: Package,
};

// A server component with a CSS entrance, not a JS one: this page is opened by
// whoever scans a slide, often on poor wifi, and the links must be readable
// before any JavaScript arrives, and without it.
export default function LinkList({
  links,
  /** Stagger continues across groups, so later groups start further in. */
  startIndex = 0,
}: {
  links: LinkEntry[];
  startIndex?: number;
}) {
  return (
    <ul className="space-y-2">
      {links.map((link, i) => {
        const Icon = icons[link.icon];
        return (
          <li
            key={link.href}
            className="rise-in"
            style={{ animationDelay: `${60 + (startIndex + i) * 40}ms` }}
          >
            <a
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="pressable group flex items-center gap-4 rounded-xl border hairline bg-bg-2 px-4 py-3.5 [--press-scale:0.98] hover:border-fg-3"
            >
              <Icon
                size={18}
                className="shrink-0 text-fg-3 transition-colors group-hover:text-fg"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-fg">
                  {link.label}
                </span>
                <span className="block truncate text-[13px] text-fg-3">
                  {link.description}
                </span>
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden
                className="shrink-0 text-fg-3 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
