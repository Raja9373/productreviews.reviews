import type { Request, Response } from "express";
import { contentRepository } from "../src/content/store/contentRepository";
import { PILOT_PAGES } from "../src/ssr/pilotRenderer";
import { getCanonicalSitemapEntries } from "../src/seo/sitemapGenerator";

export async function handleCrawlDiagnostics(req: Request, res: Response) {
  try {
    const baseUrl = "https://productreviews.review";
    const entries = getCanonicalSitemapEntries(baseUrl);
    const crawlLogs: Array<{ url: string; status: number; issues: string[]; timestamp: string }> = [];

    // Aggregate sitemap entries and specifically include reported Search Console crawl bottleneck
    const testUrls = new Set(entries.map((e) => e.loc));
    const cleanBase = baseUrl.replace(/\/+$/, "");
    testUrls.add(`${cleanBase}/review/best-oneplus-nord-ce4-review-2026`);

    let notFoundCount = 0;

    for (const url of testUrls) {
      const issues: string[] = [];
      let status = 200;

      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        if (pathname.startsWith("/review/")) {
          const slug = pathname.replace("/review/", "");
          const record = contentRepository.getBySlug(slug);
          if (!record || record.status !== "PUBLISHED") {
            status = 404;
            notFoundCount++;
            issues.push(`Route returned 404: Review slug '${slug}' not found or not published in contentRepository.`);
          }
        } else if (pathname.startsWith("/compare/")) {
          const pilot = PILOT_PAGES.find((p) => p.path === pathname);
          if (!pilot) {
            status = 200;
            issues.push(`Comparison route '${pathname}' resolved via dynamic fallback.`);
          }
        }
      } catch (err: any) {
        status = 500;
        issues.push(`Evaluation error: ${err?.message || String(err)}`);
      }

      crawlLogs.push({
        url,
        status,
        issues,
        timestamp: new Date().toISOString()
      });
    }

    const failedAttempts = crawlLogs.filter((l) => l.status >= 400 || l.issues.length > 0);

    console.log(`[Crawl Diagnostics] Inspected ${crawlLogs.length} routes. Found ${notFoundCount} 404s/warnings.`);
    for (const fail of failedAttempts) {
      console.warn(`[Crawl Warning] URL: ${fail.url} | Status: ${fail.status} | Issues: ${fail.issues.join("; ")}`);
    }

    return res.status(200).json({
      success: true,
      inspectedCount: crawlLogs.length,
      failedCount: failedAttempts.length,
      notFoundCount,
      crawlAttempts: crawlLogs.slice(0, 50),
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("[Crawl Diagnostics Error]:", err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
}

export default handleCrawlDiagnostics;
