import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { qrTargets } from "@/data/links";
import { absoluteUrl } from "@/lib/site";
import QrStudio, { type Preset } from "./QrStudio";

export const metadata: Metadata = {
  title: "QR codes · Jakub Kasprzyk",
  description:
    "Generate and download QR codes for any link, and the codes hosted on this site.",
  // A personal tool rather than portfolio content.
  robots: { index: false },
};

const presets: Preset[] = qrTargets.map((target) => ({
  label: target.label,
  description: target.description,
  target: absoluteUrl(target.path),
  hostedUrl: absoluteUrl(`/qr/${target.slug}.svg`),
}));

export default async function QrPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string | string[] }>;
}) {
  // A repeated ?url= arrives as an array; only a single value is meaningful.
  const { url } = await searchParams;
  const initialValue =
    typeof url === "string" ? url : absoluteUrl("/links");

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-16 pt-14 sm:px-6">
      <header className="mb-9">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          QR codes
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-fg-2">
          Generated in your browser: nothing is uploaded, no watermark, no
          expiry.
        </p>
      </header>

      <QrStudio presets={presets} initialValue={initialValue} />

      <footer className="mt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-fg-3 transition-colors hover:text-fg"
        >
          <ArrowLeft size={13} />
          back to portfolio
        </Link>
      </footer>
    </main>
  );
}
