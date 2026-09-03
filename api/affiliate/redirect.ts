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

  // Map from market code to exact server environment variable
  const envTagMap: Record<string, string | undefined> = {
    IN: process.env.AMAZON_TAG_IN,
    US: process.env.AMAZON_TAG_US,
    UK: process.env.AMAZON_TAG_UK,
    JP: process.env.AMAZON_TAG_JP,
    DE: process.env.AMAZON_TAG_DE,
    FR: process.env.AMAZON_TAG_FR,
    ES: process.env.AMAZON_TAG_ES,
    IT: process.env.AMAZON_TAG_IT,
    CA: process.env.AMAZON_TAG_CA,
    AU: process.env.AMAZON_TAG_AU,
    BR: process.env.AMAZON_TAG_BR,
    MX: process.env.AMAZON_TAG_MX,
    NL: process.env.AMAZON_TAG_NL,
    SG: process.env.AMAZON_TAG_SG,
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
  const rawTag = envTagMap[market];
  const tag = rawTag && rawTag.trim() ? rawTag.trim() : undefined;

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
