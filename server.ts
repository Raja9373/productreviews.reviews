import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

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
      service: 'productreviews.review-universal-decision-engine',
      timestamp: new Date().toISOString(),
      partnerTag: process.env.AMAZON_TAG_IN || process.env.AMAZON_PARTNER_TAG || 'jaiguruji00-21',
    });
  });

  // API Route: Google Search Grounded Discovery Engine
  // Serves /api/gemini/grounded-search with safe error boundaries
  const handleGroundedSearch = async (req: express.Request, res: express.Response) => {
    const query = req.body?.query || req.query?.q || '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        status: 'ERROR',
        products: [],
        errorMessage: 'GEMINI_API_KEY environment variable is not configured.',
      });
    }

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Evaluate this decision query: "${query}". Provide a concise factual verdict without hallucinated prices or fake review counts.`,
      });

      return res.status(200).json({
        success: true,
        status: 'RESULTS_FOUND',
        verdict: response.text,
        products: [],
        retrievedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('[Gemini API Grounded Route] Handled Notice:', err?.message || err);
      return res.status(200).json({
        success: false,
        status: 'ERROR',
        products: [],
        errorMessage: 'Search service is currently processing queries deterministically.',
      });
    }
  };

  app.post('/api/gemini/grounded-search', handleGroundedSearch);
  app.get('/api/gemini/grounded-search', handleGroundedSearch);

  // Serve ads.txt directly
  app.get('/ads.txt', (req, res) => {
    res.type('text/plain');
    res.send('google.com, pub-9048615701580913, DIRECT, f08c47fec0942fa0\n');
  });

  // Serve robots.txt directly
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://productreviews.review/sitemap.xml\n');
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
    console.log(`🚀 Universal Decision Engine Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
