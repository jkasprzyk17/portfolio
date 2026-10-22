import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { linkGroups } from "@/data/links";
import { displayUrl, siteUrl } from "@/lib/site";
import LinkList from "./LinkList";

const description =
  "Every way to reach Jakub Kasprzyk, Mobile Software Engineer, on one page built to sit behind a QR code.";

export const metadata: Metadata = {
  title: "Links · Jakub Kasprzyk",
  description,
  alternates: { canonical: "/links" },
  openGraph: {
    type: "profile",
    title: "Links · Jakub Kasprzyk",
    description,
    url: "/links",
  },
};

export default function Links() {
  // Keeps the row stagger running across group boundaries.
  let rendered = 0;

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-16 pt-14 sm:px-6">
      <header className="mb-10 flex flex-col items-center text-center">
        <Image
          src="/images/profile.jpg"
          alt="Jakub Kasprzyk"
          width={72}
          height={72}
          priority
          className="mb-5 rounded-full ring-1 ring-line"
        />
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Jakub Kasprzyk
        </h1>
        <p className="mt-2 text-balance text-[14px] leading-6 text-fg-2">
          Mobile Software Engineer building with React Native &amp; Expo. Kraków, PL.
        </p>
      </header>

      <div className="space-y-8">
        {linkGroups.map((group) => {
          const startIndex = rendered;
          rendered += group.links.length;

          return (
            <section key={group.title}>
              <h2 className="mb-3 text-[12px] uppercase tracking-[0.06em] text-fg-3">
                {group.title}
              </h2>
              <LinkList links={group.links} startIndex={startIndex} />
            </section>
          );
        })}
      </div>

      <footer className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-fg-3 transition-colors hover:text-fg"
        >
          <ArrowLeft size={13} />
          {displayUrl(siteUrl)}
        </Link>
      </footer>
    </main>
  );
}
