import { generateSitemapXml } from "../src/seo/sitemapGenerator";

/**
 * Clean, robust Vercel Serverless Function to serve sitemap.xml.
 * Uses direct generation to avoid potential Express-compat issues in serverless context.
 */
export default function handler(req: any, res: any) {
  try {
    const xml = generateSitemapXml("https://productreviews.review");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error("[Sitemap API] Production Crash:", err);
    
    // Safety fallback: returns a valid minimal sitemap to avoid 500
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://productreviews.review/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return res.status(200).send(fallbackXml);
  }
}
