export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const market = String(req.query?.market || 'US').toUpperCase();
  const query = String(req.query?.q || req.query?.query || 'camera').trim();
  const asin = String(req.query?.asin || '').trim();

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
  const hasConfiguredTag = Boolean(rawTag && rawTag.trim().length > 0);

  let destinationPattern: string;
  if (asin && /^[A-Z0-9]{10}$/i.test(asin)) {
    destinationPattern = `https://www.${domain}/dp/${encodeURIComponent(asin)}${
      hasConfiguredTag ? '?tag=[CONFIGURED_SERVER_TAG]' : ''
    }`;
  } else {
    destinationPattern = `https://www.${domain}/s?k=${encodeURIComponent(query)}${
      hasConfiguredTag ? '&tag=[CONFIGURED_SERVER_TAG]' : ''
    }`;
  }

  return res.status(200).json({
    status: 'ok',
    market,
    domain,
    hasConfiguredTag,
    destinationType: asin && /^[A-Z0-9]{10}$/i.test(asin) ? 'PRODUCT_DETAIL' : 'MARKETPLACE_SEARCH',
    destinationPattern,
    affiliateCompliance: {
      tagExposedClientSide: false,
      commercialPricingVerified: false,
      disclosureRequired: true,
    },
    timestamp: new Date().toISOString(),
  });
}
