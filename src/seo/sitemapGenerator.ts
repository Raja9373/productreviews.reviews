import { contentRepository } from "../content/store/contentRepository";
import { PILOT_PAGES } from "../ssr/pilotRenderer";
import type { Request, Response } from "express";

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
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/affiliate-disclosure", changefreq: "monthly", priority: "0.4" }
];

export function getCanonicalSitemapEntries(baseUrl: string = BASE_SITE_URL): SitemapEntry[] {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const today = new Date().toISOString().split("T")[0];
  const entries: SitemapEntry[] = [];
  const seenLocs = new Set<string>();

  // 1. Static canonical routes
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

  // 2. Published product reviews from contentRepository
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

  // 3. Comparison routes from PILOT_PAGES
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

export interface SitemapValidationReport {
  isValid: boolean;
  totalUrls: number;
  fullyQualified: boolean;
  errors: string[];
  verifiedUrls: string[];
}

export function verifySitemapRouteSync(baseUrl: string = BASE_SITE_URL): SitemapValidationReport {
  const entries = getCanonicalSitemapEntries(baseUrl);
  const errors: string[] = [];
  const verifiedUrls: string[] = [];
  let fullyQualified = true;

  // Strict regex pattern for expected path structures
  const expectedPattern = /^https:\/\/productreviews\.review(\/|\/about|\/contact|\/privacy|\/terms|\/affiliate-disclosure|\/review\/[a-z0-9-]+|\/compare\/[a-z0-9-]+)?$/;

  for (const entry of entries) {
    if (!entry.loc.startsWith("https://")) {
      fullyQualified = false;
      errors.push(`URL is not fully qualified with https://: ${entry.loc}`);
    }

    if (!expectedPattern.test(entry.loc)) {
      fullyQualified = false;
      errors.push(`URL failed strict regex path structure validation: ${entry.loc}`);
    } else {
      verifiedUrls.push(entry.loc);
    }
  }

  return {
    isValid: errors.length === 0 && fullyQualified,
    totalUrls: entries.length,
    fullyQualified,
    errors,
    verifiedUrls
  };
}

export function generateSitemapXml(baseUrl: string = BASE_SITE_URL): string {
  const validation = verifySitemapRouteSync(baseUrl);
  if (!validation.isValid) {
    console.warn("[sitemapGenerator] Sitemap validation warnings:", validation.errors);
  }

  const entries = getCanonicalSitemapEntries(baseUrl);

  const urlElements = entries
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
${urlElements}
</urlset>`;
}

export function sitemapRouteHandler(req: Request, res: Response): void {
  try {
    const xml = generateSitemapXml(BASE_SITE_URL);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.status(200).send(xml);
  } catch (err: any) {
    console.error("[sitemapRouteHandler] Generation error:", err);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://productreviews.review/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  }
}
