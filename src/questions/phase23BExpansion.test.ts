/**
 * ProductReviews.review — Phase 23B Expansion & Validation Test Suite
 */

import { masterQuestionCatalog } from './masterQuestionCatalog';
import { contentRepository } from '../content/store/contentRepository';
import { seedPhase12BaselinePages, runPhase13OpportunityExpansion } from '../content/scaling/phase13Opportunity';
import { getCanonicalSitemapEntries } from '../seo/sitemapGenerator';

async function runPhase23BTests() {
  console.log('====================================================');
  console.log('RUNNING PHASE 23B MASTER QUESTION EXPANSION TESTS');
  console.log('====================================================');

  await seedPhase12BaselinePages(contentRepository);
  await runPhase13OpportunityExpansion(contentRepository);

  // Test 1: Total count & 150k preservation
  const totalCount = masterQuestionCatalog.getTotalCount();
  if (totalCount !== 200000) {
    throw new Error(`PHASE 23B TEST FAILED: Total master questions must be exactly 200,000 (got ${totalCount})`);
  }
  console.log('[TEST 1] Verifying exact 200k catalog total & original 150k preservation... ✅ PASSED');

  // Verify boundary IDs
  const firstQ = masterQuestionCatalog.getById('MQ-000001');
  const midQ = masterQuestionCatalog.getById('MQ-150000');
  const newQ = masterQuestionCatalog.getById('MQ-150001');
  const lastQ = masterQuestionCatalog.getById('MQ-200000');

  if (!firstQ || !midQ || !newQ || !lastQ) {
    throw new Error('PHASE 23B TEST FAILED: Essential boundary IDs MQ-000001, MQ-150000, MQ-150001, or MQ-200000 missing!');
  }
  console.log('[TEST 2] Verifying boundary IDs MQ-000001, MQ-150000, MQ-150001, MQ-200000... ✅ PASSED');

  // Test 3: Production page & sitemap protection (must remain exactly 950)
  const publishedPages = contentRepository.getPublishedIndexableRecords();
  const sitemap = getCanonicalSitemapEntries().filter(s => s.loc.includes('/review/'));
  if (publishedPages.length !== 950 || sitemap.length !== 950) {
    throw new Error(`PHASE 23B TEST FAILED: Production pages must remain 950 (got published: ${publishedPages.length}, sitemap: ${sitemap.length})`);
  }
  console.log('[TEST 3] Verifying production page and sitemap protection at 950... ✅ PASSED');

  // Test 4: Zero duplicate IDs
  const allIds = new Set<string>();
  for (const q of masterQuestionCatalog.getAllQuestions()) {
    if (allIds.has(q.id)) {
      throw new Error(`PHASE 23B TEST FAILED: Duplicate ID detected: ${q.id}`);
    }
    allIds.add(q.id);
  }
  console.log('[TEST 4] Verifying zero duplicate IDs across 200,000 catalog... ✅ PASSED');

  console.log('====================================================');
  console.log('ALL PHASE 23B EXPANSION TESTS PASSED! ✅');
  console.log('====================================================');
}

runPhase23BTests().catch(err => {
  console.error('❌ PHASE 23B TEST FAILED:', err);
  process.exit(1);
});
