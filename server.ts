import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  searchAmazonPaapi,
  getOrFetchCategoryProducts,
  resolveSearchIndex,
} from './server/amazonPaapi';
import { searchProductsWithGrounding } from './server/geminiSearch';
import { CATEGORIES } from './src/data/categories';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // Canonical Domain Normalization (WWW to non-WWW 301 redirect)
  app.use((req, res, next) => {
    const host = req.headers.host || '';
    if (host.toLowerCase().startsWith('www.productreviews.review')) {
      const targetUrl = `https://productreviews.review${req.originalUrl}`;
      return res.redirect(301, targetUrl);
    }
    next();
  });

  // API Route: Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'productreviews.review-engine',
      mode: 'sitestripe_direct_affiliate',
      timestamp: new Date().toISOString(),
      partnerTag: process.env.AMAZON_TAG_IN || process.env.AMAZON_PARTNER_TAG || 'jaiguruji00-21',
      creatorsApiEnabled: false,
    });
  });

  // API Route: Google Search Grounded Discovery Engine
  // Serves /api/gemini/grounded-search, /api/grounded-search, and /grounded-search
  const handleGroundedSearchPost = async (req: express.Request, res: express.Response) => {
    try {
      const { query, targetLang = 'en' } = req.body || {};
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      console.log(`[Google Search Grounding] Running grounded live search for: "${query}"...`);
      const result = await searchProductsWithGrounding(query, targetLang);
      return res.json(result);
    } catch (err: any) {
      console.error('[API Grounded Search POST] Error:', err);
      return res.status(500).json({
        success: false,
        status: 'ERROR',
        error: err?.message || 'Failed to execute Google Search Grounding',
      });
    }
  };

  const handleGroundedSearchGet = async (req: express.Request, res: express.Response) => {
    try {
      const query = (req.query.q as string) || (req.query.query as string) || '';
      const targetLang = (req.query.lang as string) || (req.query.targetLang as string) || 'en';
      if (!query) {
        return res.status(400).json({ error: 'Query parameter q is required' });
      }

      const result = await searchProductsWithGrounding(query, targetLang);
      return res.json(result);
    } catch (err: any) {
      console.error('[API Grounded Search GET] Error:', err);
      return res.status(500).json({
        success: false,
        status: 'ERROR',
        error: err?.message || 'Failed to execute Google Search Grounding',
      });
    }
  };

  app.post('/api/gemini/grounded-search', handleGroundedSearchPost);
  app.post('/api/grounded-search', handleGroundedSearchPost);
  app.post('/grounded-search', handleGroundedSearchPost);

  app.get('/api/gemini/grounded-search', handleGroundedSearchGet);
  app.get('/api/grounded-search', handleGroundedSearchGet);
  app.get('/grounded-search', handleGroundedSearchGet);

  // API Route: Amazon PA-API Live Search
  app.post('/api/paapi/search', async (req, res) => {
    try {
      const { query, categorySlug, searchIndex, itemCount = 10, itemPage = 1 } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const result = await searchAmazonPaapi({
        query: query.trim(),
        categorySlug,
        searchIndex,
        itemCount: Number(itemCount),
        itemPage: Number(itemPage),
      });

      return res.json(result);
    } catch (err: any) {
      console.error('[API /api/paapi/search] Error:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Failed to search products',
      });
    }
  });

  // GET variant for easy browser/query testing
  app.get('/api/paapi/search', async (req, res) => {
    try {
      const query = (req.query.q as string) || '';
      const categorySlug = (req.query.cat as string) || undefined;
      const searchIndex = (req.query.index as string) || undefined;

      if (!query) {
        return res.status(400).json({ error: 'Query parameter q is required' });
      }

      const result = await searchAmazonPaapi({
        query: query.trim(),
        categorySlug,
        searchIndex,
        itemCount: 10,
      });

      return res.json(result);
    } catch (err: any) {
      console.error('[API GET /api/paapi/search] Error:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Failed to search products',
      });
    }
  });

  // API Route: Get category products with 24h caching
  app.get('/api/paapi/category/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const category = CATEGORIES.find((c) => c.slug === slug || c.id === slug);
      const categoryName = category ? category.name : slug.replace(/-/g, ' ');

      const result = await getOrFetchCategoryProducts(slug, categoryName);
      return res.json(result);
    } catch (err: any) {
      console.error('[API /api/paapi/category/:slug] Error:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Failed to fetch category products',
      });
    }
  });

  // API Route: Bulk index all 33 categories (for daily cron / on-demand warmup)
  app.post('/api/paapi/index-categories', async (req, res) => {
    try {
      console.log(`[Amazon PA-API] Starting warmup indexing for all ${CATEGORIES.length} categories...`);
      const results: Record<string, { count: number; isLive: boolean }> = {};

      for (const cat of CATEGORIES) {
        try {
          const catRes = await getOrFetchCategoryProducts(cat.slug, cat.name);
          results[cat.slug] = {
            count: catRes.items?.length || 0,
            isLive: catRes.isLive,
          };
        } catch (e: any) {
          results[cat.slug] = { count: 0, isLive: false };
        }
      }

      return res.json({
        success: true,
        message: `Warmup completed for ${CATEGORIES.length} categories`,
        categories: results,
      });
    } catch (err: any) {
      console.error('[API /api/paapi/index-categories] Error:', err);
      return res.status(500).json({ success: false, error: err?.message });
    }
  });

  // Serve ads.txt directly
  app.get('/ads.txt', (req, res) => {
    res.type('text/plain');
    res.send('google.com, pub-9048615701580913, DIRECT, f08c47fec0942fa0\n');
  });

  // Vite middleware in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        maxAge: '1y',
        immutable: true,
        index: false,
      })
    );
    app.all('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Real Product Engine Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
