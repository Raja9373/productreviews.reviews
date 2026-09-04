export const revalidate = 3600; // ISR

const GLOBAL_AMAZON_MARKET_MAP: Record<string, { domain: string; defaultTag: string }> = {
  IN: { domain: 'amazon.in', defaultTag: 'jaiguruji00-21' },
  US: { domain: 'amazon.com', defaultTag: 'jaiguruji00-20' },
  UK: { domain: 'amazon.co.uk', defaultTag: 'jaiguruji0002-21' },
  JP: { domain: 'amazon.co.jp', defaultTag: 'jaiguruji00-22' },
  DE: { domain: 'amazon.de', defaultTag: 'jaiguruji0004-21' },
  FR: { domain: 'amazon.fr', defaultTag: 'jaiguruji0005-21' },
  ES: { domain: 'amazon.es', defaultTag: 'jaiguruji0008-21' },
  IT: { domain: 'amazon.it', defaultTag: 'jaiguruji0007-21' },
  CA: { domain: 'amazon.ca', defaultTag: 'jaiguruji000b-20' },
  AU: { domain: 'amazon.com.au', defaultTag: 'jaiguruji00-20' },
  BR: { domain: 'amazon.com.br', defaultTag: 'jaiguruji00-20' },
  MX: { domain: 'amazon.com.mx', defaultTag: 'jaiguruji00-20' },
  NL: { domain: 'amazon.nl', defaultTag: 'jaiguruji0004-21' },
  SG: { domain: 'amazon.sg', defaultTag: 'jaiguruji00-20' },
};

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const market = String(req.query?.market || 'US').toUpperCase();
  const query = String(req.query?.q || req.query?.query || '').trim();
  const asin = String(req.query?.asin || '').trim();
  const passedTag = String(req.query?.tag || '').trim();

  // Resolve domain and configured affiliate tag
  const marketInfo = GLOBAL_AMAZON_MARKET_MAP[market] || GLOBAL_AMAZON_MARKET_MAP.US;
  const domain = marketInfo.domain;
  let tag = passedTag || marketInfo.defaultTag;

  // Check environment variables if custom override is specified
  try {
    if (typeof process !== 'undefined' && process.env) {
      const envTag =
        process.env[`AMAZON_TAG_${market}`] ||
        process.env[`AMAZON_${market}_ID`];
      if (envTag && envTag.trim()) {
        tag = envTag.trim();
      }
    }
  } catch {}

  let targetUrl: string;
  if (asin && /^[A-Z0-9]{10}$/i.test(asin)) {
    targetUrl = `https://www.${domain}/dp/${encodeURIComponent(asin)}?tag=${encodeURIComponent(tag)}`;
  } else {
    const searchParam = encodeURIComponent(query || 'best products');
    targetUrl = `https://www.${domain}/s?k=${searchParam}&tag=${encodeURIComponent(tag)}`;
  }

  // 302 Found redirect
  res.writeHead(302, { Location: targetUrl });
  return res.end();
}
