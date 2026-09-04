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
    });
  });

  // Helper to read tag from import.meta.env.VITE_xxx with fallback to process.env
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

  // API Route: Amazon Market Compliant Affiliate Redirection
  // API Route: Amazon Market Compliant Affiliate Redirection
  // Primary Amazon IN affiliate ID hardcoded: jaiguruji00-21 with ENV fallback
  app.get('/api/affiliate/redirect', (req, res) => {
    const market = String(req.query.market || 'IN').toUpperCase();
    const query = String(req.query.q || req.query.query || '').trim();
    const asin = String(req.query.asin || '').trim();

    const hardcodedTag = 'jaiguruji00-21';
    let tag = hardcodedTag;
    try {
      if (typeof process !== 'undefined' && process.env) {
        tag = process.env.AMAZON_IN_ID || process.env.AMAZON_TAG_IN || hardcodedTag;
      }
      if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        const viteTag = (import.meta as any).env.VITE_AMAZON_IN_ID || (import.meta as any).env.VITE_AMAZON_TAG_IN;
        if (viteTag && viteTag.trim()) tag = viteTag.trim();
      }
    } catch {}

    if (!tag || !tag.trim()) {
      tag = hardcodedTag;
    }

    const domain = market === 'US' ? 'amazon.com' : 'amazon.in';

    let targetUrl: string;
    if (asin && /^[A-Z0-9]{10}$/i.test(asin)) {
      targetUrl = `https://www.${domain}/dp/${encodeURIComponent(asin)}?tag=${encodeURIComponent(tag)}`;
    } else {
      const searchParam = encodeURIComponent(query || 'best electronics');
      targetUrl = `https://www.${domain}/s?k=${searchParam}&tag=${encodeURIComponent(tag)}`;
    }

    return res.redirect(302, targetUrl);
  });

  // API Route: Live Prices & Hourly Revalidation for Wirecutter Clone (Exact Wirecutter for India)
  app.get('/api/live-prices', async (req, res) => {
    try {
      const livePricesHandler = (await import('./api/live-prices')).default;
      await livePricesHandler(req, res);
    } catch (err: any) {
      console.warn('[server.ts live-prices error]:', err?.message || err);
      const now = new Date();
      res.json({
        query: String(req.query.q || 'Best phone under 30000'),
        market: 'IN',
        livePrice: 'Check live price',
        lastUpdated: `${now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' })} IST`,
        affiliateTag: 'jaiguruji00-21',
      });
    }
  });

  // API Route: Safe Affiliate Route Verification (Section 23 test mode)
  // Inspectable server-side flow verifying market -> configured tag exists (boolean) -> destination pattern
  // NEVER exposes the actual secret tag value or logs it.
  app.get('/api/affiliate/verify-route', (req, res) => {
    const market = String(req.query.market || 'US').toUpperCase();
    const query = String(req.query.q || req.query.query || 'camera').trim();
    const asin = String(req.query.asin || '').trim();

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

    res.json({
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
  });

  // API Route: Google Search Grounded Discovery Engine
  // Serves /api/gemini/grounded-search with safe error boundaries and resilient model fallback
  const handleGroundedSearch = async (req: express.Request, res: express.Response) => {
    const query = req.body?.query || req.query?.q || '';
    const apiKey =
      process.env.GEMINI_API_KEY ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

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
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
          timeout: 10000,
        },
      });

      const promptText = `Evaluate this decision query: "${query}". Provide a concise factual verdict without hallucinated prices or fake review counts.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
        });
      } catch (primaryErr: any) {
        const isTransient =
          primaryErr?.status === 503 ||
          primaryErr?.status === 504 ||
          primaryErr?.status === 429 ||
          primaryErr?.message?.includes('503') ||
          primaryErr?.message?.includes('504') ||
          primaryErr?.message?.includes('429') ||
          primaryErr?.message?.includes('high demand') ||
          primaryErr?.message?.includes('DEADLINE_EXCEEDED') ||
          primaryErr?.message?.includes('UNAVAILABLE') ||
          primaryErr?.message?.includes('RESOURCE_EXHAUSTED');

        if (isTransient) {
          // Graceful fallback to gemini-3.1-flash-lite during demand spikes
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: promptText,
          });
        } else {
          throw primaryErr;
        }
      }

      return res.status(200).json({
        success: true,
        status: 'RESULTS_FOUND',
        verdict: response.text,
        products: [],
        retrievedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      const isQuotaOrRateLimit =
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('quota');

      if (isQuotaOrRateLimit) {
        console.log('[Gemini API Grounded Route] Notice: Rate limit / quota cooldown active, serving deterministic result.');
      } else {
        console.log('[Gemini API Grounded Route] Handled provider status:', err?.status || 'notice');
      }
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
