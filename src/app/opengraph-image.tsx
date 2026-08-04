import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Jakub Kasprzyk — Mobile Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colour tokens mirror :root / [data-theme="dark"] in globals.css.
const bg = "#0b0b0a";
const fg = "#ededeb";
const fg2 = "#a3a29a";
const fg3 = "#6c6b62";
const line = "#232220";

export default async function Image() {
  const photo = await readFile(
    join(process.cwd(), "public/images/profile.jpg")
  );
  const photoSrc = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt=""
            width={120}
            height={120}
            style={{ borderRadius: 120, border: `1px solid ${line}` }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 64, color: fg, letterSpacing: -1.5 }}>
              Jakub Kasprzyk
            </div>
            <div style={{ fontSize: 34, color: fg2 }}>
              Mobile Software Engineer
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 38,
            color: fg2,
            lineHeight: 1.45,
            maxWidth: 900,
          }}
        >
          Building cross-platform apps and open-source native modules for React
          Native.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ width: "100%", height: 1, background: line }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 26,
              color: fg3,
            }}
          >
            <div style={{ display: "flex" }}>
              TypeScript · Swift · Kotlin · C++
            </div>
            <div style={{ display: "flex" }}>Kraków, PL</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
