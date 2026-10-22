import type { Request, Response } from "express";
import { generateSitemapXml, getCanonicalSitemapEntries } from "../src/seo/sitemapGenerator";

export async function generateSitemapHandler(req: Request, res: Response) {
  try {
    const xml = generateSitemapXml();
    const entries = getCanonicalSitemapEntries();
    res.json({
      success: true,
      count: entries.length,
      entries,
      sitemapXml: xml
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate sitemap", message: err?.message || String(err) });
  }
}

export default generateSitemapHandler;
