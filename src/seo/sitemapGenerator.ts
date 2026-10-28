import { contentRepository } from "../content/store/contentRepository";
import { PILOT_PAGES } from "../ssr/pilotRenderer";

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

export const BASE_SITE_URL = "https://productreviews.review";

export const STATIC_CANONICAL_ROUTES: Array<{
  path: string;
  changefreq: SitemapEntry["changefreq"];
  priority: string;
}> = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.5" },
  { path: "/terms", changefreq: "yearly", priority: "0.4" },
  { path: "/affiliate-disclosure", changefreq: "monthly", priority: "0.5" }
];

export function getCanonicalSitemapEntries(baseUrl: string = BASE_SITE_URL): SitemapEntry[] {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const today = new Date().toISOString().split("T")[0];
  const entries: SitemapEntry[] = [];
  const seenLocs = new Set<string>();

  for (const route of STATIC_CANONICAL_ROUTES) {
    const loc = route.path === "/" ? `${cleanBase}/` : `${cleanBase}${route.path}`;
    if (!seenLocs.has(loc)) {
      seenLocs.add(loc);
      entries.push({
        loc,
        lastmod: today,
        changefreq: route.changefreq,
        priority: route.priority
      });
    }
  }

  try {
    const publishedProducts = contentRepository.getPublished();
    for (const prod of publishedProducts) {
      const loc = `${cleanBase}/review/${prod.slug}`;
      if (!seenLocs.has(loc)) {
        seenLocs.add(loc);
        entries.push({
          loc,
          lastmod: prod.lastUpdated || prod.publishedDate || today,
          changefreq: "weekly",
          priority: "0.9"
        });
      }
    }
  } catch (err) {
    console.warn("[sitemapGenerator] Warning gathering repository records:", err);
  }

  for (const page of PILOT_PAGES) {
    if (page.type === "compare") {
      const loc = `${cleanBase}${page.path}`;
      if (!seenLocs.has(loc)) {
        seenLocs.add(loc);
        entries.push({
          loc,
          lastmod: today,
          changefreq: "weekly",
          priority: "0.8"
        });
      }
    }
  }

  return entries;
}

export function generateSitemapXml(baseUrl: string = BASE_SITE_URL): string {
  const entries = getCanonicalSitemapEntries(baseUrl);
  const xmlUrls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}
