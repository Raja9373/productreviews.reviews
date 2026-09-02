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
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }
      body = body || {};
      query = body.query || '';
      targetLang = body.targetLang || 'en';
    } else {
      query = (req.query?.q as string) || (req.query?.query as string) || '';
      targetLang = (req.query?.lang as string) || (req.query?.targetLang as string) || 'en';
    }

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(200).json({
        success: true,
        status: 'NO_RESULTS',
        query: '',
        isGrounded: false,
        searchQueriesRun: [],
        groundingChunks: [],
        products: [],
        errorMessage: 'Query parameter is required',
        retrievedAt: new Date().toISOString(),
      });
    }

    const result = await searchProductsWithGrounding(query.trim(), targetLang);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[Vercel API /api/gemini/grounded-search] Handled Error:', err);
    // Return controlled HTTP 200 with status: "ERROR" so the client never encounters HTTP 500 crash
    return res.status(200).json({
      success: false,
      status: 'ERROR',
      query: (req.body?.query || req.query?.q || '').toString(),
      isGrounded: false,
      isRateLimited: err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED'),
      searchQueriesRun: [],
      groundingChunks: [],
      products: [],
      errorMessage: err?.status === 429 || err?.message?.includes('429')
        ? 'Search provider is temporarily rate-limited. Please retry shortly.'
        : 'Search service unavailable. Please retry in a few moments.',
      retrievedAt: new Date().toISOString(),
    });
  }
}
