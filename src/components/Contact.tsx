"use client";

import { m } from "motion/react";

const ease = [0.65, 0, 0.35, 1] as const;

const links = [
  { label: "Twitter", href: "https://x.com/jkasprzyk17" },
  { label: "GitHub", href: "https://github.com/jkasprzyk17" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jkasprzyk17/" },
];

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="py-14 border-t hairline">
      <h2 className="text-[13px] tracking-[0.04em] uppercase text-fg-3 mb-6">
        contact
      </h2>

      <m.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease }}
        className="text-[15px] leading-7 text-fg-2"
      >
        <p>
          Drop me a line on{" "}
          {links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && (i === links.length - 1 ? " or " : ", ")}
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="prose-link"
              >
                {l.label}
              </a>
            </span>
          ))}
          .
        </p>
      </m.div>

      <p className="mt-10 text-[12px] text-fg-3">
        © {year} Jakub Kasprzyk · Kraków, PL
      </p>
    </section>
  );
}
