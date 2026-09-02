import { searchAmazonPaapi } from '../../server/amazonPaapi';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let query = '';
    let categorySlug: string | undefined;
    let searchIndex: string | undefined;
    let itemCount = 10;
    let itemPage = 1;

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      query = body.query || '';
      categorySlug = body.categorySlug;
      searchIndex = body.searchIndex;
      itemCount = Number(body.itemCount) || 10;
      itemPage = Number(body.itemPage) || 1;
    } else {
      query = (req.query?.q as string) || '';
      categorySlug = (req.query?.cat as string) || undefined;
      searchIndex = (req.query?.index as string) || undefined;
    }

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const result = await searchAmazonPaapi({
      query: query.trim(),
      categorySlug,
      searchIndex,
      itemCount,
      itemPage,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[Vercel API /api/paapi/search] Error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to search products',
    });
  }
}
