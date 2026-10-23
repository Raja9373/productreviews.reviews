import { generateSitemapXml } from "../src/seo/sitemapGenerator";

/**
 * Diagnostic function to verify sitemap XML generation.
 * Accessible at: /api/debug-sitemap
 */
export default function handler(req: any, res: any) {
  try {
    console.log("[Debug Sitemap] Generating XML for diagnostics...");
    const xml = generateSitemapXml();
    
    if (!xml) {
      return res.status(500).send("Error: Generated XML is null/undefined");
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error("[Debug Sitemap] Generation error:", err);
    return res.status(500).send(`XML generation failed: ${err.message || String(err)}`);
  }
}
