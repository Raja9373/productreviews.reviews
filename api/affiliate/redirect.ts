export const revalidate = 3600; // ISR

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const market = String(req.query?.market || 'IN').toUpperCase();
  const query = String(req.query?.q || req.query?.query || '').trim();
  const asin = String(req.query?.asin || '').trim();

  // Primary Amazon Affiliate Tag for India (Exact Wirecutter Clone for India)
  // Hardcoded primary tag: jaiguruji00-21 with ENV fallback
  const hardcodedTag = 'jaiguruji00-21';
  let tag = hardcodedTag;

  try {
    if (typeof process !== 'undefined' && process.env) {
      tag = process.env.AMAZON_IN_ID || process.env.AMAZON_TAG_IN || hardcodedTag;
    }
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const viteTag = (import.meta as any).env.VITE_AMAZON_IN_ID || (import.meta as any).env.VITE_AMAZON_TAG_IN;
      if (viteTag && viteTag.trim()) {
        tag = viteTag.trim();
      }
    }
  } catch {}

  // Fallback to jaiguruji00-21 if empty
  if (!tag || !tag.trim()) {
    tag = hardcodedTag;
  }

  // Amazon India domain is primary; support US/global fallback gracefully
  const domain = market === 'US' ? 'amazon.com' : 'amazon.in';

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
