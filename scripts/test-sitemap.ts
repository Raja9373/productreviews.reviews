import { generateSitemapXml } from "../src/seo/sitemapGenerator";

try {
  console.log("[Test Script] Starting sitemap XML generation...");
  const xml = generateSitemapXml();
  
  if (!xml || xml.trim().length === 0) {
    console.error("[Test Script] Error: Generated XML is empty.");
  } else {
    console.log("[Test Script] XML successfully generated.");
    console.log("[Test Script] XML Preview (first 500 chars):");
    console.log(xml.substring(0, 500));
    console.log("[Test Script] XML length:", xml.length);
  }
} catch (err) {
  console.error("[Test Script] Unexpected error:", err);
}
