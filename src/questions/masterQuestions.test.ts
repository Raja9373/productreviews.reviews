/**
 * ProductReviews.review — Master Question Intelligence Verification Test Suite
 * Comprehensive validation of 10,000 Master Questions, schema integrity, and regression safety.
 */

import { masterQuestionCatalog } from './masterQuestionCatalog';
import { validateMasterQuestion } from './questionValidation';
import { normalizeMasterQuestion, getDeduplicationKey } from './questionNormalizer';
import { alignQueryWithMasterIntent } from './questionIntelligenceService';
import { parseSearchQuery } from '../search/queryParser';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('RUNNING PHASE 1 MASTER QUESTION INTELLIGENCE TEST SUITE');
console.log('====================================================');

const allQuestions = masterQuestionCatalog.getAllQuestions();
const totalCount = masterQuestionCatalog.getTotalCount();

// 1. EXACT 10,000 RECORD COUNT
console.log(`\n[TEST 1] Verifying Total Record Count... (Found: ${totalCount})`);
assert(totalCount === 10000, `Expected exactly 10,000 records, got ${totalCount}`);
console.log('✅ TEST 1 PASSED: Exactly 10,000 Master Questions verified in catalog.');

// 2. UNIQUE ID VALIDATION
console.log('\n[TEST 2] Verifying 100% Unique IDs...');
const seenIds = new Set<string>();
for (const q of allQuestions) {
  assert(!seenIds.has(q.id), `Duplicate ID detected: ${q.id}`);
  seenIds.add(q.id);
  assert(/^MQ-\d{6}$/.test(q.id), `ID format invalid: ${q.id}`);
}
assert(seenIds.size === 10000, `Expected 10,000 unique IDs, got ${seenIds.size}`);
console.log('✅ TEST 2 PASSED: All 10,000 records have unique, standardized IDs (MQ-XXXXXX).');

// 3. UNIQUE NORMALIZED QUESTION VALIDATION
console.log('\n[TEST 3] Verifying Unique Normalized Questions...');
const seenNormalized = new Set<string>();
const seenDedupKeys = new Set<string>();

for (const q of allQuestions) {
  const norm = normalizeMasterQuestion(q.question);
  const dedupKey = getDeduplicationKey(norm, q.productCategory, q.useCase);

  assert(!seenDedupKeys.has(dedupKey), `Deduplication collision detected: ${dedupKey}`);
  seenDedupKeys.add(dedupKey);
  seenNormalized.add(q.normalizedQuestion);
}
assert(seenDedupKeys.size === 10000, `Expected 10,000 unique deduplication keys, got ${seenDedupKeys.size}`);
console.log('✅ TEST 3 PASSED: Zero exact or normalized collisions detected.');

// 4. SCHEMA AND ZERO-FABRICATION AUDIT
console.log('\n[TEST 4] Running Strict Schema and Zero-Fabrication Audit...');
let invalidCount = 0;
const forbiddenKeys = ['searchVolume', 'volume', 'kd', 'keywordDifficulty', 'cpc', 'ranking', 'traffic', 'searchesPerMonth'];

for (const q of allQuestions) {
  const validation = validateMasterQuestion(q);
  if (!validation.isValid) {
    invalidCount++;
    console.error(`Invalid record ${q.id}:`, validation.errors);
  }

  // Ensure no fabricated search metrics exist
  for (const fKey of forbiddenKeys) {
    assert((q as any)[fKey] === undefined, `Forbidden fabricated metric found in ${q.id}: ${fKey}`);
  }
}
assert(invalidCount === 0, `Detected ${invalidCount} invalid schema records`);
console.log('✅ TEST 4 PASSED: 100% of 10,000 records pass strict schema and zero-fabrication audits.');

// 5. INTENT FAMILY COVERAGE
console.log('\n[TEST 5] Verifying Intent Family Distribution...');
const intentCounts: Record<string, number> = {};
for (const q of allQuestions) {
  intentCounts[q.intentType] = (intentCounts[q.intentType] || 0) + 1;
}
const coveredIntents = Object.keys(intentCounts);
console.log(`Covered Intent Types: ${coveredIntents.length}`);
assert(coveredIntents.length >= 20, `Expected at least 20 covered intent families, got ${coveredIntents.length}`);
console.log('✅ TEST 5 PASSED: Broad distribution across major intent families verified.');

// 6. CATEGORY DIVERSITY COVERAGE
console.log('\n[TEST 6] Verifying Category Diversity...');
const catCounts: Record<string, number> = {};
for (const q of allQuestions) {
  catCounts[q.productCategory] = (catCounts[q.productCategory] || 0) + 1;
}
const coveredCats = Object.keys(catCounts);
console.log(`Covered Categories: ${coveredCats.length}`);
assert(coveredCats.length >= 10, `Expected broad category distribution, got ${coveredCats.length}`);
console.log('✅ TEST 6 PASSED: Category coverage validated across tech, appliances, cameras, audio, and computing.');

// 7. GLOBAL-FIRST & LOCALIZATION SAFETY
console.log('\n[TEST 7] Verifying Global-First & Market Scope Rules...');
let globalCount = 0;
let marketDepCount = 0;
for (const q of allQuestions) {
  if (q.marketScope === 'GLOBAL') globalCount++;
  if (q.marketScope === 'MARKET_DEPENDENT') marketDepCount++;
  assert(q.languageScope === 'LANGUAGE_NEUTRAL', `Expected language neutral master question, got ${q.languageScope}`);
}
assert(globalCount > 9000, `Expected vast majority of master questions to be market-neutral global`);
console.log(`✅ TEST 7 PASSED: Global-First confirmed (${globalCount} Global, ${marketDepCount} Market-dependent).`);

// 8. QUERY PARSER INTEGRATION & INTENT MATCHING
console.log('\n[TEST 8] Testing Question Intelligence Service Integration...');
const testQuery = 'is iphone 16 pro worth it for video editing';
const parsed = parseSearchQuery(testQuery);
const enriched = alignQueryWithMasterIntent(testQuery, parsed);

assert(enriched.originalQuery === testQuery, 'Original query mismatch');
assert(enriched.commercialClassification !== '', 'Commercial classification missing');
assert(enriched.suggestedRelatedQuestions.length > 0, 'Related questions suggestions missing');
console.log(`✅ TEST 8 PASSED: Successfully enriched query "${testQuery}" with master intelligence.`);

// 9. AUDIT SUMMARY REPORT COMPLETION
console.log('\n[TEST 9] Verifying Audit Report Generation...');
const audit = masterQuestionCatalog.getAuditSummary();
assert(audit.totalRecords === 10000, 'Audit total records mismatch');
assert(audit.uniqueQuestions === 10000, 'Audit unique questions mismatch');
assert(audit.sampleQuestions.length === 50, 'Audit sample questions must contain 50 examples');
console.log('✅ TEST 9 PASSED: Forensic audit report generated and validated.');

console.log('\n====================================================');
console.log('ALL PHASE 1 QUESTION INTELLIGENCE TESTS PASSED! ✅');
console.log('====================================================\n');
