import { sitemapRouteHandler } from "../src/seo/sitemapGenerator";

/**
 * Vercel Serverless Function to serve dynamic XML sitemap.
 * Includes comprehensive logging for crawl diagnostics.
 */
export default function handler(req: any, res: any) {
  console.log(`[Sitemap API] START: Received request for ${req.url}`);
  try {
    console.log("[Sitemap API] Invoking sitemapRouteHandler...");
    
    // Intercept status to log it explicitly
    const originalStatus = res.status;
    res.status = (code: number) => {
        console.log(`[Sitemap API] Explicitly setting response status: ${code}`);
        return originalStatus.call(res, code);
    };

    sitemapRouteHandler(req, res);
    
    // Explicitly logging completion
    console.log("[Sitemap API] END: sitemapRouteHandler successfully invoked.");
  } catch (err) {
    console.error("[Sitemap API] Error generating XML:", err);
    res.status(500).send("XML generation failed");
  }
}
