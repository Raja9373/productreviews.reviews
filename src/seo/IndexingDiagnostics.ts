import { contentRepository } from "../content/store/contentRepository";
import { PILOT_PAGES } from "../ssr/pilotRenderer";
import { getCanonicalSitemapEntries, STATIC_CANONICAL_ROUTES } from "./sitemapGenerator";

export interface IndexingDiscrepancy {
  path: string;
  issue: string;
  severity: "error" | "warning";
}

export interface IndexingDiagnosticReport {
  timestamp: string;
  totalLiveRoutes: number;
  totalSitemapEntries: number;
  discrepanciesCount: number;
  discrepancies: IndexingDiscrepancy[];
  isFullySynced: boolean;
}

export function runIndexingDiagnostics(baseUrl: string = "https://productreviews.review"): IndexingDiagnosticReport {
  const sitemapEntries = getCanonicalSitemapEntries(baseUrl);
  const sitemapLocs = new Set(sitemapEntries.map((e) => e.loc));
  const discrepancies: IndexingDiscrepancy[] = [];

  // Gather all live app routes
  const livePaths = new Set<string>();
  for (const r of STATIC_CANONICAL_ROUTES) {
    livePaths.add(r.path === "/" ? `${baseUrl}/` : `${baseUrl}${r.path}`);
  }

  try {
    const published = contentRepository.getPublished();
    for (const prod of published) {
      livePaths.add(`${baseUrl}/review/${prod.slug}`);
    }
  } catch {}

  for (const page of PILOT_PAGES) {
    livePaths.add(`${baseUrl}${page.path}`);
  }

  // Cross-reference live routes against sitemap entries
  for (const liveUrl of livePaths) {
    if (!sitemapLocs.has(liveUrl)) {
      discrepancies.push({
        path: liveUrl,
        issue: "Live route exists in App repository but is missing from sitemap.xml entries.",
        severity: "error"
      });
    }
  }

  // Check document head canonical tag if running in browser
  if (typeof document !== "undefined") {
    const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalHref = canonicalEl?.getAttribute("href");
    if (!canonicalHref) {
      discrepancies.push({
        path: window.location.pathname,
        issue: "Current page is missing the required 'canonical' link tag in document head.",
        severity: "error"
      });
    } else if (!canonicalHref.startsWith("https://")) {
      discrepancies.push({
        path: window.location.pathname,
        issue: `Current page canonical link is not absolute: ${canonicalHref}`,
        severity: "warning"
      });
    }
  }

  const errorCount = discrepancies.filter((d) => d.severity === "error").length;

  return {
    timestamp: new Date().toISOString(),
    totalLiveRoutes: livePaths.size,
    totalSitemapEntries: sitemapEntries.length,
    discrepanciesCount: discrepancies.length,
    discrepancies,
    isFullySynced: errorCount === 0
  };
}
