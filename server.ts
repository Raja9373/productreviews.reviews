import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { generateSitemapXml } from "./src/seo/sitemapGenerator";
import { exportFaqManifestJson } from "./src/seo/faqData";
import { getPilotPage, renderPilotHtml, render404Html } from "./src/ssr/pilotRenderer";
import { contentRepository } from "./src/content/store/contentRepository";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // Canonical domain redirect
  app.use((req, res, next) => {
    const host = (req.headers["host"] || req.hostname || "").toString().toLowerCase();
    const proto = (req.headers["x-forwarded-proto"] || req.protocol || "http").toString().toLowerCase();
    if (host.startsWith("www.productreviews.review") || (host === "productreviews.review" && proto === "http")) {
      const targetUrl = `https://productreviews.review${req.originalUrl || "/"}`;
      return res.redirect(301, targetUrl);
    }
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "productreviews.review-universal-decision-engine",
      timestamp: new Date().toISOString()
    });
  });

  // 1. Google AdSense Publisher verification ads.txt
  app.get("/ads.txt", (req, res) => {
    res.type("text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send("google.com, pub-9048615701580913, DIRECT, f08c47fec0942fa0\n");
  });

  // 2. Search Engine & AdSense Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(`User-agent: *
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://productreviews.review/sitemap.xml
Sitemap: https://productreviews.review/sitemap-main.xml
`);
  });

  // 3. Dynamic XML Sitemaps
  const serveDynamicSitemap = (req: express.Request, res: express.Response) => {
    try {
      const xml = generateSitemapXml("https://productreviews.review");
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.status(200).send(xml);
    } catch (err: any) {
      console.warn("[sitemap generation error]:", err);
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://productreviews.review/</loc></url>\n</urlset>');
    }
  };

  app.get("/sitemap.xml", serveDynamicSitemap);
  app.get("/sitemap-main.xml", serveDynamicSitemap);
  app.get("/api/sitemap", serveDynamicSitemap);

  // 4. Schema FAQ Manifest
  app.get("/faq-manifest.json", (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(exportFaqManifestJson("https://productreviews.review"));
  });
  app.get("/api/seo/faq-manifest", (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(exportFaqManifestJson("https://productreviews.review"));
  });

  // 5. Global Market & Geo Detection
  const GLOBAL_MARKET_STORES: Record<string, { domain: string; defaultTag: string }> = {
    IN: { domain: "amazon.in", defaultTag: "jaiguruji00-21" },
    US: { domain: "amazon.com", defaultTag: "jaiguruji00-20" },
    UK: { domain: "amazon.co.uk", defaultTag: "jaiguruji0002-21" },
    JP: { domain: "amazon.co.jp", defaultTag: "jaiguruji00-22" },
    DE: { domain: "amazon.de", defaultTag: "jaiguruji0004-21" },
    FR: { domain: "amazon.fr", defaultTag: "jaiguruji0005-21" },
    ES: { domain: "amazon.es", defaultTag: "jaiguruji0008-21" },
    IT: { domain: "amazon.it", defaultTag: "jaiguruji0007-21" },
    CA: { domain: "amazon.ca", defaultTag: "jaiguruji000b-20" },
    AU: { domain: "amazon.com.au", defaultTag: "jaiguruji00-20" },
    BR: { domain: "amazon.com.br", defaultTag: "jaiguruji00-20" },
    MX: { domain: "amazon.com.mx", defaultTag: "jaiguruji00-20" },
    NL: { domain: "amazon.nl", defaultTag: "jaiguruji0004-21" },
    SG: { domain: "amazon.sg", defaultTag: "jaiguruji00-20" }
  };

  app.get("/api/geo", (req, res) => {
    const geoHeader = (
      req.headers["x-client-geo-country"] ||
      req.headers["cf-ipcountry"] ||
      req.headers["x-country-code"] ||
      req.headers["x-appengine-country"] ||
      ""
    ).toString().toUpperCase();

    const acceptLang = (req.headers["accept-language"] || "").toString().toLowerCase();
    let detectedMarket = "US";
    if (GLOBAL_MARKET_STORES[geoHeader]) {
      detectedMarket = geoHeader;
    } else if (acceptLang.includes("hi") || acceptLang.includes("en-in")) {
      detectedMarket = "IN";
    } else if (acceptLang.includes("en-gb")) {
      detectedMarket = "UK";
    } else if (acceptLang.includes("de")) {
      detectedMarket = "DE";
    } else if (acceptLang.includes("fr")) {
      detectedMarket = "FR";
    } else if (acceptLang.includes("ja")) {
      detectedMarket = "JP";
    } else if (acceptLang.includes("ca")) {
      detectedMarket = "CA";
    }
    res.json({
      country: detectedMarket,
      domain: GLOBAL_MARKET_STORES[detectedMarket]?.domain || "amazon.com",
      tag: GLOBAL_MARKET_STORES[detectedMarket]?.defaultTag || "jaiguruji00-20"
    });
  });

  // 6. Amazon Affiliate Redirection
  app.get("/api/affiliate/redirect", (req, res) => {
    const market = String(req.query.market || "US").toUpperCase();
    const query = String(req.query.q || req.query.query || "").trim();
    const asin = String(req.query.asin || "").trim();
    const storeConfig = GLOBAL_MARKET_STORES[market] || GLOBAL_MARKET_STORES.US;
    const domain = storeConfig.domain;
    const tag = storeConfig.defaultTag;

    let targetUrl: string;
    if (asin && /^[A-Z0-9]{10}$/i.test(asin)) {
      targetUrl = `https://www.${domain}/dp/${encodeURIComponent(asin)}?tag=${encodeURIComponent(tag)}`;
    } else {
      const searchParam = encodeURIComponent(query || "best products");
      targetUrl = `https://www.${domain}/s?k=${searchParam}&tag=${encodeURIComponent(tag)}`;
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.redirect(302, targetUrl);
  });

  // 7. SSR Server-Side Pilot Renderer for Crawlers
  let viteDevServer: any = null;

  const handleReviewOrCompareRoute = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const distIndex = path.join(process.cwd(), "dist", "index.html");
      const devIndex = path.join(process.cwd(), "index.html");
      const templatePath = fs.existsSync(distIndex) ? distIndex : devIndex;
      let baseHtml = fs.readFileSync(templatePath, "utf-8");

      if (process.env.NODE_ENV !== "production" && viteDevServer) {
        try {
          baseHtml = await viteDevServer.transformIndexHtml(req.originalUrl || req.path, baseHtml);
        } catch {}
      }

      const pilotPage = getPilotPage(req.path);
      if (pilotPage) {
        const rendered = renderPilotHtml(pilotPage, baseHtml);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
        res.setHeader("X-Content-Type-Options", "nosniff");
        return res.status(200).send(rendered);
      }

      const rawSlug = req.params.slug || req.path.split("/").pop() || "";
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug);
      const record = contentRepository.getBySlug(slug);
      if (record && record.status === "PUBLISHED") {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(200).send(baseHtml);
      }

      const notFoundHtml = render404Html(baseHtml, req.path);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(404).send(notFoundHtml);
    } catch (err) {
      console.error("[SSR handler error]:", err);
      next();
    }
  };

  app.get("/review/:slug", handleReviewOrCompareRoute);
  app.get("/compare/:slug", handleReviewOrCompareRoute);

  // 8. Mount Vite in Development or Static in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    viteDevServer = vite;
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "1y", immutable: true, index: false }));
    app.all("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Universal Decision Engine Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
