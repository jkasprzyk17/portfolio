// Vercel exposes the stable production domain at build time; falls back to the
// dev server so relative metadata URLs still resolve locally.
//
// Deliberately not derived from window.location: QR codes encode this value,
// and a preview deployment would otherwise bake its throwaway hostname into a
// code that has already been printed on a slide.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/** Absolute URL for a site-relative path, e.g. "/links" → "https://…/links". */
export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

/** How a URL reads when it is printed next to a QR code, without the scheme. */
export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
