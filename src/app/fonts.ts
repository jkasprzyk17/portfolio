import { Fraunces, Geist_Mono } from "next/font/google";

// Home-page only. /cv, /links and /qr keep the plain Inter look (and /cv is
// what cv.pdf is printed from), so these are applied on the home <main>
// rather than in the root layout.
export const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
});

export const mono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
});
