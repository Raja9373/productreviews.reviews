/**
 * ProductReviews.review — Build-Time Static Prerender & Sitemap Generator
 *
 * 1. Seeds canonical content records and writes clean, deduplicated static XML sitemaps:
 *    - public/sitemap.xml & dist/sitemap.xml
 *    - public/sitemap-main.xml & dist/sitemap-main.xml
 *    - public/sitemap_index.xml & dist/sitemap_index.xml
 * 2. Pre-renders all 10 verified SSR/SSG pilot pages into dist/review/<slug>/index.html
 *    and dist/compare/<slug>/index.html so Vercel Edge CDN serves route-specific initial HTML.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PILOT_PAGES } from '../src/ssr/pilotData';
import { renderPilotHtml } from '../src/ssr/pilotRenderer';
import { generateAndWriteStaticSitemap } from '../src/seo/sitemapGenerator';
import { contentRepository } from '../src/content/store/contentRepository';
import { seedPhase12BaselinePages } from '../src/content/scaling/phase13Opportunity';

async function runBuildPrerender() {
  console.log('🚀 [Prerender] Starting build-time static sitemap & pilot SSG generation...');

  // 1. Seed baseline records for canonical discovery
  try {
    await seedPhase12BaselinePages(contentRepository);
  } catch (err: any) {
    console.warn('[Prerender] Warning seeding repository:', err?.message || err);
  }

  // 2. Generate and write static sitemaps to public/ and dist/
  const sitemapResult = await generateAndWriteStaticSitemap();
  console.log(
    `✅ [Prerender] Generated clean XML sitemaps (${sitemapResult.urlCount} canonical URLs) -> ${sitemapResult.writtenFiles.length} files written.`
  );

  // 3. Pre-render verified pilot pages into dist/ if dist/index.html exists
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const distIndex = path.join(distDir, 'index.html');

  if (fs.existsSync(distIndex)) {
    const baseHtml = fs.readFileSync(distIndex, 'utf-8');
    let prerenderCount = 0;

    for (const [slug, page] of Object.entries(PILOT_PAGES)) {
      const renderedHtml = renderPilotHtml(page, baseHtml);

      // Write both dist/<routeType>/<slug>/index.html and dist/<routeType>/<slug>.html for Vercel static routing
      const routeDir = path.join(distDir, page.routeType, slug);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, 'index.html'), renderedHtml, 'utf-8');
      fs.writeFileSync(path.join(distDir, page.routeType, `${slug}.html`), renderedHtml, 'utf-8');
      prerenderCount++;
    }

    console.log(`✅ [Prerender] Pre-rendered ${prerenderCount} verified pilot pages into dist/review/* and dist/compare/*.`);
  } else {
    console.log('ℹ️ [Prerender] dist/index.html not found yet; skipping HTML file output.');
  }
}

runBuildPrerender().catch((err) => {
  console.error('❌ [Prerender] Fatal error:', err);
  process.exit(1);
});
