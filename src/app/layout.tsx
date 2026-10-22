import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    title: "Jakub Kasprzyk · Mobile Software Engineer",
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakub Kasprzyk · Mobile Software Engineer",
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
      <head>
        {/* A plain inline script so it runs before <body> paints. next/script's
            beforeInteractive only queues it until the Next runtime boots, so
            dark-mode visitors saw the light theme first on a slow load. */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
