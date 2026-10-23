import { sitemapRouteHandler } from "../src/seo/sitemapGenerator";

/**
 * Vercel Serverless Function to serve dynamic XML sitemap.
 * Wraps sitemap generation in try-catch to ensure crawlers receive a valid response.
 */
export default function handler(req: any, res: any) {
  console.log(`[Sitemap API] START: Received request for ${req.url}`);
  try {
    sitemapRouteHandler(req, res);
    console.log("[Sitemap API] END: sitemapRouteHandler invoked successfully.");
  } catch (err) {
    console.error("[Sitemap API] Critical Error during XML generation:", err);
    
    // Return a valid, minimal empty XML response with 200 status code
    // to prevent crawler errors while debugging.
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- SITEMAP GENERATION ERROR: See Vercel logs for details -->
  <url>
    <loc>https://productreviews.review/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  }
}
