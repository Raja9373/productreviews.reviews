import type { Request, Response } from 'express';
import {
  generateCleanSitemapXml,
  getCachedSitemapXml,
  generateAndWriteStaticSitemap,
  getCanonicalSitemapEntries,
  invalidateSitemapCache,
} from '../src/seo/sitemapGenerator';

export {
  generateCleanSitemapXml,
  getCachedSitemapXml,
  generateAndWriteStaticSitemap,
  getCanonicalSitemapEntries,
  invalidateSitemapCache,
};

// Backwards compatibility alias
export const generateSitemapXml = generateCleanSitemapXml;

/**
 * Express Handler for GET /sitemap.xml and GET /api/sitemap
 * Serves clean XML with appropriate security and caching headers.
 */
export async function serveSitemapXml(req: Request, res: Response) {
  try {
    const xml = getCachedSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'");
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('[sitemap] Error delivering sitemap:', err?.message || err);
    const fallbackXml = generateCleanSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'");
    return res.status(200).send(fallbackXml);
  }
}

/**
 * Express Handler for POST /api/sitemap/generate or POST /api/sitemap/rebuild
 * Re-generates the static sitemap.xml, overwrites disk files, invalidates/refreshes cache,
 * and returns detailed audit report.
 */
export async function handleGenerateSitemapApi(req: Request, res: Response) {
  try {
    const result = await generateAndWriteStaticSitemap();
    return res.status(200).json({
      success: true,
      message: 'Static sitemap.xml generated and updated successfully.',
      data: {
        generatedAt: result.generatedAt,
        urlCount: result.urlCount,
        urls: result.urls,
        writtenFiles: result.writtenFiles,
        validation: result.validation,
      },
    });
  } catch (err: any) {
    console.error('[sitemap] Error in generate API:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate static sitemap file.',
      message: err?.message || String(err),
    });
  }
}

export default serveSitemapXml;
