import type { Request, Response } from "express";
import { sitemapRouteHandler, generateSitemapXml, getCanonicalSitemapEntries } from "../src/seo/sitemapGenerator";

export async function serveSitemapXml(req: Request, res: Response) {
  return sitemapRouteHandler(req, res);
}

export async function handleGenerateSitemapApi(req: Request, res: Response) {
  try {
    const entries = getCanonicalSitemapEntries();
    const xml = generateSitemapXml();
    res.json({
      success: true,
      totalUrls: entries.length,
      sampleUrls: entries.slice(0, 5).map((e) => e.loc),
      xmlPreview: xml.slice(0, 300) + "..."
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
}

export default serveSitemapXml;
