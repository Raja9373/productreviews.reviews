import { searchProductsWithGrounding } from '../../server/geminiSearch';

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let query = '';
    let targetLang = 'en';

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      query = body.query || '';
      targetLang = body.targetLang || 'en';
    } else {
      query = (req.query?.q as string) || (req.query?.query as string) || '';
      targetLang = (req.query?.lang as string) || (req.query?.targetLang as string) || 'en';
    }

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const result = await searchProductsWithGrounding(query.trim(), targetLang);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[Vercel API /api/gemini/grounded-search] Error:', err);
    return res.status(500).json({
      success: false,
      status: 'ERROR',
      error: err?.message || 'Failed to execute Google Search Grounding',
    });
  }
}
