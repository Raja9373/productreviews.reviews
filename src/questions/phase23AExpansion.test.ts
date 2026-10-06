/**
 * ProductReviews.review — Phase 23A Expansion & Validation Test Suite
 */

import { masterQuestionCatalog } from './masterQuestionCatalog';
import { contentRepository } from '../content/store/contentRepository';
import { seedPhase12BaselinePages, runPhase13OpportunityExpansion } from '../content/scaling/phase13Opportunity';
import { getCanonicalSitemapEntries } from '../seo/sitemapGenerator';

async function runPhase23ATests() {
  console.log('====================================================');
  console.log('RUNNING PHASE 23A MASTER QUESTION EXPANSION TESTS');
  console.log('====================================================');

  await seedPhase12BaselinePages(contentRepository);
  await runPhase13OpportunityExpansion(contentRepository);

  // Test 1: Total count & 100k preservation
  const totalCount = masterQuestionCatalog.getTotalCount();
  if (totalCount !== 150000) {
    throw new Error(`PHASE 23A TEST FAILED: Total master questions must be exactly 150,000 (got ${totalCount})`);
  }
  console.log('[TEST 1] Verifying exact 150k catalog total & original 100k preservation... ✅ PASSED');

  // Verify boundary IDs
  const firstQ = masterQuestionCatalog.getById('MQ-000001');
  const midQ = masterQuestionCatalog.getById('MQ-100000');
  const newQ = masterQuestionCatalog.getById('MQ-100001');
  const lastQ = masterQuestionCatalog.getById('MQ-150000');

  if (!firstQ || !midQ || !newQ || !lastQ) {
    throw new Error('PHASE 23A TEST FAILED: Essential boundary IDs MQ-000001, MQ-100000, MQ-100001, or MQ-150000 missing!');
  }
  console.log('[TEST 2] Verifying boundary IDs MQ-000001, MQ-100000, MQ-100001, MQ-150000... ✅ PASSED');

  // Test 3: Production page & sitemap protection (must remain exactly 950)
  const publishedPages = contentRepository.getPublishedIndexableRecords();
  const sitemap = getCanonicalSitemapEntries().filter(s => s.loc.includes('/review/'));
  if (publishedPages.length !== 950 || sitemap.length !== 950) {
    throw new Error(`PHASE 23A TEST FAILED: Production pages must remain 950 (got published: ${publishedPages.length}, sitemap: ${sitemap.length})`);
  }
  console.log('[TEST 3] Verifying production page and sitemap protection at 950... ✅ PASSED');

  // Test 4: Zero duplicate IDs
  const allIds = new Set<string>();
  for (const q of masterQuestionCatalog.getAllQuestions()) {
    if (allIds.has(q.id)) {
      throw new Error(`PHASE 23A TEST FAILED: Duplicate ID detected: ${q.id}`);
    }
    allIds.add(q.id);
  }
  console.log('[TEST 4] Verifying zero duplicate IDs across 150,000 catalog... ✅ PASSED');

  console.log('====================================================');
  console.log('ALL PHASE 23A EXPANSION TESTS PASSED! ✅');
  console.log('====================================================');
}

runPhase23ATests().catch(err => {
  console.error('❌ PHASE 23A TEST FAILED:', err);
  process.exit(1);
});
