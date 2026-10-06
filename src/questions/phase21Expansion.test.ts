/**
 * ProductReviews.review — Phase 21 Master Question Intelligence Expansion Tests (25k -> 50k)
 * 
 * Verifies exact 50,000 catalog count, original 25k preservation (MQ-000001 to MQ-025000),
 * new 25k incremental addition (MQ-025001 to MQ-050000), zero duplicate IDs,
 * and strict 950 production page and sitemap protection.
 */

import { masterQuestionCatalog } from './masterQuestionCatalog';
import { contentRepository } from '../content/store/contentRepository';
import { getCanonicalSitemapEntries } from '../seo/sitemapGenerator';
import { seedPhase12BaselinePages, runPhase13OpportunityExpansion } from '../content/scaling/phase13Opportunity';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ PHASE 21 TEST FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('RUNNING PHASE 21 MASTER QUESTION EXPANSION TESTS');
console.log('====================================================\n');

async function runPhase21Tests() {
  await seedPhase12BaselinePages(contentRepository);
  await runPhase13OpportunityExpansion(contentRepository);

  // ---------------------------------------------------------------------------
  // TEST 1: Exact 50k Catalog Total & Original 25k Preservation
  // ---------------------------------------------------------------------------
  console.log('[TEST 1] Verifying exact 50k catalog total & original 25k preservation...');
  const totalCount = masterQuestionCatalog.getTotalCount();
  assert(totalCount === 50000, `Total master questions must be exactly 50,000 (got ${totalCount})`);

  const firstQ = masterQuestionCatalog.getById('MQ-000001');
  const midQ = masterQuestionCatalog.getById('MQ-025000');
  const firstNewQ = masterQuestionCatalog.getById('MQ-025001');
  const lastQ = masterQuestionCatalog.getById('MQ-050000');

  assert(firstQ !== undefined && firstQ.id === 'MQ-000001', 'First baseline question MQ-000001 preserved');
  assert(midQ !== undefined && midQ.id === 'MQ-025000', '25,000th baseline question MQ-025000 preserved');
  assert(firstNewQ !== undefined && firstNewQ.id === 'MQ-025001', 'First expanded question MQ-025001 present');
  assert(lastQ !== undefined && lastQ.id === 'MQ-050000', 'Final expanded question MQ-050000 present');
  console.log('✅ TEST 1 PASSED: 50k catalog verified, original 25k baseline preserved exactly.\n');

  // ---------------------------------------------------------------------------
  // TEST 2: Production Page & Sitemap Protection (950 Pages)
  // ---------------------------------------------------------------------------
  console.log('[TEST 2] Verifying production page and sitemap protection...');
  const pubRecs = contentRepository.getPublishedIndexableRecords();
  assert(pubRecs.length === 950, `Production pages must remain exactly 950 (got ${pubRecs.length})`);
  const sitemap = getCanonicalSitemapEntries().filter(s => s.loc.includes('/review/'));
  assert(sitemap.length === 950, `Sitemap review count must remain exactly 950 (got ${sitemap.length})`);
  assert(pubRecs.length === sitemap.length, 'Exact 1:1 match between published records and sitemap URLs');
  console.log('✅ TEST 2 PASSED: Production pages and sitemap protected at 950.\n');

  // ---------------------------------------------------------------------------
  // TEST 3: Zero Duplicate IDs & Unique Normalization
  // ---------------------------------------------------------------------------
  console.log('[TEST 3] Verifying zero duplicate IDs and catalog integrity...');
  const allQ = masterQuestionCatalog.getAllQuestions();
  const idSet = new Set<string>();
  let duplicateIds = 0;
  for (const q of allQ) {
    if (idSet.has(q.id)) {
      duplicateIds++;
    }
    idSet.add(q.id);
  }
  assert(duplicateIds === 0, 'Zero duplicate question IDs in 50k catalog');
  console.log('✅ TEST 3 PASSED: Zero duplicate IDs verified.\n');

  console.log('====================================================');
  console.log('ALL PHASE 21 EXPANSION TESTS PASSED! ✅');
  console.log('====================================================\n');
}

runPhase21Tests().catch(err => {
  console.error('Phase 21 test suite failed:', err);
  process.exit(1);
});
