import { getCanonicalSitemapEntries } from "../src/seo/sitemapGenerator";

/**
 * Diagnostic endpoint to output plain-text log of sitemap generation process.
 * Accessible at: /api/sitemap-debug
 */
export default function handler(req: any, res: any) {
  try {
    console.log("[Sitemap Debug] Starting generation diagnostic...");
    
    const entries = getCanonicalSitemapEntries();
    
    let logOutput = `Sitemap Generation Diagnostic\n`;
    logOutput += `Timestamp: ${new Date().toISOString()}\n`;
    logOutput += `---------------------------------\n`;
    logOutput += `Total URLs discovered: ${entries.length}\n`;
    logOutput += `---------------------------------\n`;
    logOutput += `Sample URLs (first 5):\n`;
    
    entries.slice(0, 5).forEach((entry, index) => {
      logOutput += `${index + 1}: ${entry.loc}\n`;
    });

    console.log(`[Sitemap Debug] Discovered ${entries.length} URLs.`);
    
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(logOutput);
  } catch (err: any) {
    console.error("[Sitemap Debug] Error during generation:", err);
    return res.status(500).send(`Sitemap generation failed: ${err.message || String(err)}`);
  }
}
