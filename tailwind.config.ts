import type { Config } from "tailwindcss";

const config: Config = {
  // Emits hover: variants inside @media (hover: hover) and (pointer: fine), so
  // a tap on a touch screen doesn't leave the hover style stuck on.
  future: { hoverOnlyWhenSupported: true },
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        fg: "var(--fg)",
        "fg-2": "var(--fg-2)",
        "fg-3": "var(--fg-3)",
        line: "var(--line)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Both variables only exist on the home page (src/app/fonts.ts), so
        // the fallbacks live inside var(): an undefined variable would
        // otherwise invalidate the whole declaration on /cv and /links.
        display: ["var(--font-display, Georgia)", "Georgia", "serif"],
        mono: [
          "var(--font-mono, ui-monospace)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
