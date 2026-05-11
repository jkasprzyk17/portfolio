"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Twitter, Sun, Moon } from "lucide-react";

export default function Navigation() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") ||
      "light") as "light" | "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  const navItems = [
    { name: "home", href: "#home" },
    { name: "work", href: "#experience" },
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
              className="hover:text-fg transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://x.com/jkasprzyk17"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/jkasprzyk17/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="hover:text-fg transition-colors"
              suppressHydrationWarning
            >
              {mounted && theme === "dark" ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
