import { contentRepository } from "../src/content/store/contentRepository";
import { PILOT_PAGES } from "../src/ssr/pilotRenderer";
import type { Request, Response } from "express";

/**
 * Diagnostic endpoint to inspect contentRepository state.
 * Accessible at: /api/sitemap-diagnostic
 */
export default function handler(req: Request, res: Response) {
  try {
    const publishedProducts = contentRepository.getPublished();
    const pilotPages = PILOT_PAGES;

    const report = {
      timestamp: new Date().toISOString(),
      contentRepository: {
        totalPublished: publishedProducts.length,
        sampleSlugs: publishedProducts.slice(0, 5).map((p) => p.slug),
      },
      pilotPages: {
        total: pilotPages.length,
        types: [...new Set(pilotPages.map((p) => p.type))],
      },
    };

    console.log("[Sitemap Diagnostic] Repository state:", JSON.stringify(report, null, 2));

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error("[Sitemap Diagnostic] Error:", err);
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
