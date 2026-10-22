"use client";

import { Github, Linkedin, Twitter, Sun, Moon } from "lucide-react";

export default function Navigation() {
  // The theme lives only on <html data-theme>: the toggle reads it at click
  // time and the icons follow it in CSS (.icon-swap), so there is no React
  // copy to sync and no wrong icon before hydration.
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const navItems = [
    { name: "home", href: "#home" },
    { name: "work", href: "#experience" },
    { name: "oss", href: "#open-source" },
    { name: "projects", href: "#projects" },
    { name: "contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b hairline">
      <div className="max-w-2xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-14 text-[14px]">
          <div className="flex items-center gap-5 sm:gap-7">
            {navItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className="text-fg-2 hover:text-fg transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-fg-2">
            <a
              href="https://github.com/jkasprzyk17"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block hover:text-fg transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://x.com/jkasprzyk17"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block hover:text-fg transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/jkasprzyk17/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block hover:text-fg transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <button
              type="button"
              onClick={toggle}
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
      </div>
    </nav>
  );
}
