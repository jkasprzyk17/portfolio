import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jakub Kasprzyk",
  description:
    "Jakub Kasprzyk - Mobile Software Engineer specializing in React Native, Expo. Based in Kraków, PL.",
  keywords: [
    "mobile developer",
    "react native",
    "expo",
    "typescript",
    "mobile software engineer",
  ],
  icons: {
    icon: "/images/profile.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
