import type { Metadata } from "next";
import Home from "../page";
import "./og.css";

// The Open Graph card: the home page's first screen, recomposed for a
// 1200×630 frame by og.css. src/app/opengraph-image.png is a screenshot of
// this page, so the link preview is the real headline and the real phone
// rather than a drawing of them. To refresh it after the home page changes:
//
//   npm run build && npm run start
//   chrome --headless --hide-scrollbars --window-size=1200,630 \
//     --force-device-scale-factor=2 --virtual-time-budget=5000 \
//     --screenshot=og.png http://localhost:3000/og
//   sips --resampleWidth 1200 og.png --out src/app/opengraph-image.png
//
// The phone's clock shows the time the shot is taken (the committed image
// was taken with it set to 9:41).
export const metadata: Metadata = {
  title: "Open Graph card",
  robots: { index: false, follow: false },
};

// Runs before the phone hydrates: one theme whatever the visitor's system
// says (?theme=light for the other), and no invitation banner over the shot.
const pin = `(function () {
  try {
    var t = new URLSearchParams(location.search).get('theme');
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
    sessionStorage.setItem('phone:invite', '1');
  } catch (e) {}
})();`;

export default function OgCard() {
  return (
    <div id="og">
      <script dangerouslySetInnerHTML={{ __html: pin }} />
      <Home />
    </div>
  );
}
