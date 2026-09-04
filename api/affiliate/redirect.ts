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

  // Helper with import.meta.env.VITE_xxx fallback to process.env
  const getEnvTag = (code: string): string | undefined => {
    try {
      if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        const viteVal =
          (import.meta as any).env[`VITE_AMAZON_TAG_${code}`] ||
          (import.meta as any).env[`VITE_AMAZON_${code}_ID`];
        if (viteVal && viteVal.trim()) return viteVal.trim();
      }
    } catch {}
    if (typeof process !== 'undefined' && process.env) {
      const procVal =
        process.env[`AMAZON_TAG_${code}`] ||
        process.env[`AMAZON_${code}_ID`];
      if (procVal && procVal.trim()) return procVal.trim();
    }
    return undefined;
  };

  // Map from market code to environment variable (Vite fallback to process.env)
  const envTagMap: Record<string, string | undefined> = {
    IN: getEnvTag('IN'),
    US: getEnvTag('US'),
    UK: getEnvTag('UK'),
    JP: getEnvTag('JP'),
    DE: getEnvTag('DE'),
    FR: getEnvTag('FR'),
    ES: getEnvTag('ES'),
    IT: getEnvTag('IT'),
    CA: getEnvTag('CA'),
    AU: getEnvTag('AU'),
    BR: getEnvTag('BR'),
    MX: getEnvTag('MX'),
    NL: getEnvTag('NL'),
    SG: getEnvTag('SG'),
  };

  const domainMap: Record<string, string> = {
    IN: 'amazon.in',
    US: 'amazon.com',
    UK: 'amazon.co.uk',
    JP: 'amazon.co.jp',
    DE: 'amazon.de',
    FR: 'amazon.fr',
    ES: 'amazon.es',
    IT: 'amazon.it',
    CA: 'amazon.ca',
    AU: 'amazon.com.au',
    BR: 'amazon.com.br',
    MX: 'amazon.com.mx',
    NL: 'amazon.nl',
    SG: 'amazon.sg',
  };

  const domain = domainMap[market] || 'amazon.com';

  // In api/affiliate/redirect.ts:
  // With import.meta.env.VITE_xxx fallback to process.env
  // and fallback: const tag = process.env.AMAZON_TAG_IN || process.env.AMAZON_TAG_US
  const tag =
    envTagMap[market] ||
    (typeof import.meta !== 'undefined' && ((import.meta as any).env?.VITE_AMAZON_TAG_IN || (import.meta as any).env?.VITE_AMAZON_TAG_US)) ||
    process.env.AMAZON_TAG_IN ||
    process.env.AMAZON_TAG_US;

  let targetUrl: string;
  if (asin && /^[A-Z0-9]{10}$/i.test(asin)) {
    targetUrl = `https://www.${domain}/dp/${encodeURIComponent(asin)}`;
    if (tag) {
      targetUrl += `?tag=${encodeURIComponent(tag)}`;
    }
  } else {
    const searchParam = encodeURIComponent(query || 'electronics');
    targetUrl = `https://www.${domain}/s?k=${searchParam}`;
    if (tag) {
      targetUrl += `&tag=${encodeURIComponent(tag)}`;
    }
  }

  // 302 Found redirect
  res.writeHead(302, { Location: targetUrl });
  return res.end();
}
