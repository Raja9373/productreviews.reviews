export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    status: 'ok',
    service: 'productreviews.review-engine',
    mode: 'sitestripe_direct_affiliate',
    timestamp: new Date().toISOString(),
    hasPartnerTag: Boolean(process.env.AMAZON_TAG_IN || process.env.AMAZON_PARTNER_TAG),
    creatorsApiEnabled: false,
  });
}
