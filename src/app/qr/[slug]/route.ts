import { qrTargets } from "@/data/links";
import { absoluteUrl } from "@/lib/site";
import { qrToSvg } from "@/lib/qr";

/**
 * Hosted QR codes: GET /qr/links.svg is a real image URL that can be dropped
 * into a slide, a README or an <img> and will keep working.
 *
 * Prerendered at build time from the qrTargets allowlist, with dynamicParams
 * off. There is deliberately no way to ask this endpoint to encode arbitrary
 * text, which would turn the domain into a QR generator for anyone who found
 * it.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  // Both spellings: /qr/links reads well, /qr/links.svg embeds well.
  return qrTargets.flatMap(({ slug }) => [
    { slug },
    { slug: `${slug}.svg` },
  ]);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const target = qrTargets.find(
    (t) => t.slug === slug.replace(/\.svg$/, ""),
  );

  if (!target) {
    return new Response("Not found", { status: 404 });
  }

  const url = absoluteUrl(target.path);
  const svg = qrToSvg(url, {
    size: 1024,
    standalone: true,
    title: `QR code for ${url}`,
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Disposition": `inline; filename="qr-${target.slug}.svg"`,
    },
  });
}
