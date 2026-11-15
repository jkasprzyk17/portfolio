"use client";

import Image from "next/image";
import { Github, Linkedin, Twitter, Sun, Moon } from "lucide-react";
import { toggleTheme } from "@/lib/theme";

const socials = [
  { label: "GitHub", href: "https://github.com/jkasprzyk17", Icon: Github },
  { label: "Twitter", href: "https://x.com/jkasprzyk17", Icon: Twitter },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jkasprzyk17/",
    Icon: Linkedin,
  },
];

export default function TopBar() {
  // The theme lives only on <html data-theme>: the toggle reads it at click
  // time (lib/theme.ts) and the icons follow it in CSS (.icon-swap), so
  // there is no React copy to sync and no wrong icon before hydration.
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b hairline">
      <div className="max-w-[72rem] mx-auto px-5 sm:px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/images/profile.jpg"
            alt=""
            width={28}
            height={28}
            priority
            className="rounded-full ring-1 ring-line"
          />
          <p className="truncate text-[14px] font-medium text-fg">
            Jakub Kasprzyk
            <span className="max-sm:hidden font-mono font-normal text-[12px] text-fg-3">
              {"  "}· mobile software engineer · Kraków, PL
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 text-fg-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg transition-colors"
              aria-label={label}
            >
              <Icon size={16} />
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hover:text-fg transition-colors"
          >
            <span className="icon-swap">
              <Moon size={16} data-shown-in="light" />
              <Sun size={16} data-shown-in="dark" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
