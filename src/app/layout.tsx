import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Vercel exposes the stable production domain at build time; falls back to the
// dev server so relative metadata URLs still resolve locally.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description =
  "Jakub Kasprzyk, Mobile Software Engineer building with React Native and Expo. Based in Kraków, PL.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Jakub Kasprzyk",
  description,
  keywords: [
    "mobile developer",
    "react native",
    "expo",
    "typescript",
    "mobile software engineer",
    "nitro modules",
    "open source",
  ],
  openGraph: {
    type: "profile",
    siteName: "Jakub Kasprzyk",
    title: "Jakub Kasprzyk — Mobile Software Engineer",
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakub Kasprzyk — Mobile Software Engineer",
    description,
    creator: "@jkasprzyk17",
  },
  alternates: {
    canonical: "/",
  },
};

const themeInit = `(function() {
  try {
    var t = localStorage.getItem('theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
