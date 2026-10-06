/**
 * ProductReviews.review — Deterministic Sitemap Validation Test Suite
 */

import { seedPhase12BaselinePages, runPhase13OpportunityExpansion } from '../content/scaling/phase13Opportunity';
import { contentRepository } from '../content/store/contentRepository';
import { generateCleanSitemapXml, getCanonicalSitemapEntries } from './sitemapGenerator';

async function validateSitemap() {
  console.log('====================================================');
  console.log('RUNNING DETERMINISTIC SITEMAP VALIDATION SUITE');
  console.log('====================================================');

  await seedPhase12BaselinePages(contentRepository);
  await runPhase13OpportunityExpansion(contentRepository);

  const xml = generateCleanSitemapXml();
  const entries = getCanonicalSitemapEntries();

  console.log(`[VALIDATION] Total sitemap URLs generated: ${entries.length}`);

  // 1. XML format check
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    throw new Error('SITEMAP VALIDATION FAILED: Missing or invalid XML declaration.');
  }
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    throw new Error('SITEMAP VALIDATION FAILED: Missing sitemap namespace.');
  }

  // 2. URL validation checks
  const urlSet = new Set<string>();
  let duplicates = 0;
  let hashUrls = 0;
  let searchUrls = 0;
  let invalidHosts = 0;

  for (const entry of entries) {
    const loc = entry.loc;
    if (urlSet.has(loc)) {
      duplicates++;
    }
    urlSet.add(loc);

    if (loc.includes('#')) {
      hashUrls++;
    }
    if (loc.includes('/search') || loc.includes('?q=') || loc.includes('&q=')) {
      searchUrls++;
    }
    if (!loc.startsWith('https://productreviews.review/')) {
      invalidHosts++;
    }
  }

  if (duplicates > 0) {
    throw new Error(`SITEMAP VALIDATION FAILED: Found ${duplicates} duplicate URLs.`);
  }
  if (hashUrls > 0) {
    throw new Error(`SITEMAP VALIDATION FAILED: Found ${hashUrls} hash URLs (#).`);
  }
  if (searchUrls > 0) {
    throw new Error(`SITEMAP VALIDATION FAILED: Found ${searchUrls} search query URLs.`);
  }
  if (invalidHosts > 0) {
    throw new Error(`SITEMAP VALIDATION FAILED: Found ${invalidHosts} URLs with non-production hosts.`);
  }

  console.log('[VALIDATION] XML Format & Declaration: Valid ✅');
  console.log('[VALIDATION] Duplicate URL Count: 0 ✅');
  console.log('[VALIDATION] Hash URL Count: 0 ✅');
  console.log('[VALIDATION] Search URL Count: 0 ✅');
  console.log('[VALIDATION] Hostname Compliance: 100% (https://productreviews.review/) ✅');
  console.log('====================================================');
  console.log('SITEMAP VALIDATION SUITE PASSED SUCCESSFULLY! ✅');
  console.log('====================================================');
}

validateSitemap().catch((err) => {
  console.error('❌ SITEMAP VALIDATION FAILED:', err);
  process.exit(1);
});
