/**
 * Serverless Affiliate Redirector for Vercel & Node deployments.
 * Preserves all 14 regional Amazon Associate tracking tags and responds with 302 + X-Robots-Tag: noindex, nofollow.
 */
const GLOBAL_MARKET_STORES: Record<string, { domain: string; defaultTag: string }> = {
  IN: { domain: "amazon.in", defaultTag: "jaiguruji00-21" },
  US: { domain: "amazon.com", defaultTag: "jaiguruji00-20" },
  UK: { domain: "amazon.co.uk", defaultTag: "jaiguruji0002-21" },
  JP: { domain: "amazon.co.jp", defaultTag: "jaiguruji00-22" },
  DE: { domain: "amazon.de", defaultTag: "jaiguruji0004-21" },
  FR: { domain: "amazon.fr", defaultTag: "jaiguruji0005-21" },
  ES: { domain: "amazon.es", defaultTag: "jaiguruji0008-21" },
  IT: { domain: "amazon.it", defaultTag: "jaiguruji0007-21" },
  CA: { domain: "amazon.ca", defaultTag: "jaiguruji000b-20" },
  AU: { domain: "amazon.com.au", defaultTag: "jaiguruji00-20" },
  BR: { domain: "amazon.com.br", defaultTag: "jaiguruji00-20" },
  MX: { domain: "amazon.com.mx", defaultTag: "jaiguruji00-20" },
  NL: { domain: "amazon.nl", defaultTag: "jaiguruji0004-21" },
  SG: { domain: "amazon.sg", defaultTag: "jaiguruji00-20" }
};

export default function handler(req: any, res: any) {
  const queryParams = req.query || {};
  const market = String(queryParams.market || "US").toUpperCase();
  const query = String(queryParams.q || queryParams.query || "").trim();
  const asin = String(queryParams.asin || "").trim();

  const storeConfig = GLOBAL_MARKET_STORES[market] || GLOBAL_MARKET_STORES.US;
  const domain = storeConfig.domain;
  const tag = storeConfig.defaultTag;

  let targetUrl: string;
  if (asin && /^[A-Z0-9]{10}$/i.test(asin)) {
    targetUrl = `https://www.${domain}/dp/${encodeURIComponent(asin)}?tag=${encodeURIComponent(tag)}`;
  } else {
    const searchParam = encodeURIComponent(query || "best products");
    targetUrl = `https://www.${domain}/s?k=${searchParam}&tag=${encodeURIComponent(tag)}`;
  }

  res.statusCode = 302;
  res.setHeader("Location", targetUrl);
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.end();
}
