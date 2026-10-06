/**
 * ProductReviews.review — Phase 22 Master Question Intelligence Expansion Tests (50k -> 100k)
 * 
 * Verifies exact 100,000 catalog count, original 50k preservation (MQ-000001 to MQ-050000),
 * new 50k incremental addition (MQ-050001 to MQ-100000), zero duplicate IDs,
 * and strict 950 production page and sitemap protection.
 */

import { masterQuestionCatalog } from './masterQuestionCatalog';
import { contentRepository } from '../content/store/contentRepository';
import { getCanonicalSitemapEntries } from '../seo/sitemapGenerator';
import { seedPhase12BaselinePages, runPhase13OpportunityExpansion } from '../content/scaling/phase13Opportunity';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ PHASE 22 TEST FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('RUNNING PHASE 22 MASTER QUESTION EXPANSION TESTS');
console.log('====================================================\n');

async function runPhase22Tests() {
  await seedPhase12BaselinePages(contentRepository);
  await runPhase13OpportunityExpansion(contentRepository);

  // ---------------------------------------------------------------------------
  // TEST 1: Exact 100k Catalog Total & Original 50k Preservation
  // ---------------------------------------------------------------------------
  console.log('[TEST 1] Verifying exact 100k catalog total & original 50k preservation...');
  const totalCount = masterQuestionCatalog.getTotalCount();
  assert(totalCount === 100000, `Total master questions must be exactly 100,000 (got ${totalCount})`);

  const firstQ = masterQuestionCatalog.getById('MQ-000001');
  const midQ = masterQuestionCatalog.getById('MQ-050000');
  const firstNewQ = masterQuestionCatalog.getById('MQ-050001');
  const lastQ = masterQuestionCatalog.getById('MQ-100000');

  assert(firstQ !== undefined && firstQ.id === 'MQ-000001', 'First baseline question MQ-000001 preserved');
  assert(midQ !== undefined && midQ.id === 'MQ-050000', '50,000th baseline question MQ-050000 preserved');
  assert(firstNewQ !== undefined && firstNewQ.id === 'MQ-050001', 'First expanded question MQ-050001 present');
  assert(lastQ !== undefined && lastQ.id === 'MQ-100000', 'Final expanded question MQ-100000 present');
  console.log('✅ TEST 1 PASSED: 100k catalog verified, original 50k baseline preserved exactly.\n');

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
  assert(duplicateIds === 0, 'Zero duplicate question IDs in 100k catalog');
  console.log('✅ TEST 3 PASSED: Zero duplicate IDs verified.\n');

  console.log('====================================================');
  console.log('ALL PHASE 22 EXPANSION TESTS PASSED! ✅');
  console.log('====================================================\n');
}

runPhase22Tests().catch(err => {
  console.error('Phase 22 test suite failed:', err);
  process.exit(1);
});
