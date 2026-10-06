import type { Request, Response } from 'express';
import {
  generateCleanSitemapXml,
  getCachedSitemapXml,
  generateAndWriteStaticSitemap,
  getCanonicalSitemapEntries,
  invalidateSitemapCache,
} from '../src/seo/sitemapGenerator';
import { contentRepository } from '../src/content/store/contentRepository';
import { seedPhase12BaselinePages, runPhase13OpportunityExpansion } from '../src/content/scaling/phase13Opportunity';

export {
  generateCleanSitemapXml,
  getCachedSitemapXml,
  generateAndWriteStaticSitemap,
  getCanonicalSitemapEntries,
  invalidateSitemapCache,
};

// Backwards compatibility alias
export const generateSitemapXml = generateCleanSitemapXml;

let isSeeded = false;
async function ensureSeeded() {
  if (!isSeeded) {
    try {
      await seedPhase12BaselinePages(contentRepository);
      await runPhase13OpportunityExpansion(contentRepository);
      isSeeded = true;
      invalidateSitemapCache();
    } catch (e) {
      console.warn('[sitemap] Failed to seed content repository:', e);
    }
  }
}

/**
 * Express Handler for GET /sitemap.xml and GET /api/sitemap
 * Serves clean XML with appropriate security and caching headers.
 */
export async function serveSitemapXml(req: Request, res: Response) {
  try {
    await ensureSeeded();
    const xml = getCachedSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('[sitemap] Error delivering sitemap:', err?.message || err);
    await ensureSeeded();
    const fallbackXml = generateCleanSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
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
    await ensureSeeded();
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
