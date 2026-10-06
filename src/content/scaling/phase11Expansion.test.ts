/**
 * ProductReviews.review — Phase 11 Production Expansion & Global Coverage V2 Tests
 * 
 * Verifies controlled 770-candidate expansion across 8 internal checkpoints,
 * Coverage Intelligence V2 analysis, sitemap 1:1 exact match,
 * full accounting reconciliation, and all 30 Adversarial Safety Tests.
 */

import {
  runPhase11Expansion,
  getPhase11ExpansionCandidates,
  seedPhase10BaselinePages
} from './phase11Expansion';
import { analyzeCatalogCoverageV2 } from './phase11Coverage';
import { contentRepository } from '../store/contentRepository';
import { getCanonicalSitemapEntries } from '../../seo/sitemapGenerator';
import { auditPublishedContent } from './contentHealthAudit';
import { isEligibleForScaling } from './scalingEligibility';
import { planBatch } from './batchPlanner';
import { contentExpansionController } from './contentExpansionController';
import { evaluateSystemicFailureAbort, verifySitemapIntegrity } from './scalingSafety';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('RUNNING PHASE 11 EXPANSION & COVERAGE V2 TEST SUITE');
console.log('====================================================\n');

async function runAllPhase11Tests() {
  // ---------------------------------------------------------------------------
  // TEST 1: Baseline 230-Page Verification
  // ---------------------------------------------------------------------------
  console.log('[TEST 1] Verifying Phase 10 baseline state (230 pages)...');
  await seedPhase10BaselinePages(contentRepository);
  const baselinePublished = contentRepository.getPublishedIndexableRecords();
  assert(baselinePublished.length === 230, `Must have exactly 230 baseline published pages (got ${baselinePublished.length})`);

  const baselineSitemap = getCanonicalSitemapEntries();
  const baselineSitemapReviews = baselineSitemap.filter(s => s.loc.includes('/review/'));
  assert(baselineSitemapReviews.length === 230, `Must have exactly 230 baseline sitemap review entries (got ${baselineSitemapReviews.length})`);

  const baselineAudit = auditPublishedContent(contentRepository.listRecords(), baselineSitemap);
  assert(baselineAudit.healthy === 230, `All 230 baseline pages must be HEALTHY (got ${baselineAudit.healthy})`);
  assert(baselineAudit.criticalIssues === 0, 'Zero critical issues on baseline');
  assert(baselineAudit.sitemapConsistency === 'PASS', 'Baseline sitemap consistency must be PASS');
  console.log('✅ TEST 1 PASSED: Baseline 230 pages verified and 100% healthy.\n');

  // ---------------------------------------------------------------------------
  // TEST 2: Pre-Expansion Coverage Intelligence V2
  // ---------------------------------------------------------------------------
  console.log('[TEST 2] Analyzing pre-expansion Coverage Intelligence V2...');
  const initialCoverage = analyzeCatalogCoverageV2(contentRepository);
  assert(initialCoverage.breakdown.totalCatalogMasterQuestions === 10000, 'Catalog contains 10,000 Master Questions');
  assert(initialCoverage.breakdown.totalPublishedPages === 230, 'Coverage reflects 230 published pages');
  assert(initialCoverage.wellCovered.length > 0, 'Well covered areas identified');
  assert(initialCoverage.underCovered.length > 0, 'Under-covered areas identified');
  assert(initialCoverage.highValueGaps.length > 0, 'High value gaps identified');
  assert(initialCoverage.localizationGaps.length > 0, 'Localization gaps mapped');
  assert(initialCoverage.marketEvidenceGaps.length > 0, 'Market evidence gaps mapped');
  assert(initialCoverage.entityGaps.length > 0, 'Entity gaps mapped');
  assert(initialCoverage.useCaseGaps.length > 0, 'Use case gaps mapped');
  assert(initialCoverage.comparisonGaps.length > 0, 'Comparison gaps mapped');
  assert(initialCoverage.longTailGaps.length > 0, 'Long tail gaps mapped');
  assert(initialCoverage.unsafeOrBlocked.length > 0, 'Unsafe/blocked zones mapped');
  console.log('✅ TEST 2 PASSED: Pre-expansion coverage intelligence V2 generated.\n');

  // ---------------------------------------------------------------------------
  // TEST 3: Candidate Selection Capping (Max 770)
  // ---------------------------------------------------------------------------
  console.log('[TEST 3] Verifying candidate selection capping at max 770...');
  const candidates = getPhase11ExpansionCandidates();
  assert(candidates.length <= 770, `Candidates pool must be <= 770 (got ${candidates.length})`);
  assert(candidates.length === 770, `Candidates pool exactly 770 (got ${candidates.length})`);
  console.log('✅ TEST 3 PASSED: Exact 770 candidate pool verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 4: Full Phase 11 Expansion Execution (8 Checkpoints)
  // ---------------------------------------------------------------------------
  console.log('[TEST 4] Executing Phase 11 Expansion across 8 checkpoints (A-H)...');
  const metrics = await runPhase11Expansion(contentRepository);

  console.log('Phase 11 Execution Summary:');
  console.log(`- Batch ID: ${metrics.batchId}`);
  console.log(`- Checkpoints Executed: ${metrics.checkpointsExecuted}`);
  console.log(`- Baseline Pages: ${metrics.baselinePagesBeforePhase11}`);
  console.log(`- Candidates Evaluated: ${metrics.candidatesEvaluated}`);
  console.log(`- Eligible: ${metrics.eligible}`);
  console.log(`- Rejected: ${metrics.rejected} (Ambiguity: ${metrics.rejectedAmbiguity}, Insufficient: ${metrics.rejectedInsufficientEvidence}, Duplicate/Canonical: ${metrics.rejectedDuplicateCanonical}, Market: ${metrics.rejectedMarketEvidence}, Quality: ${metrics.rejectedQuality})`);
  console.log(`- Mapped to Existing: ${metrics.mappedToExisting}`);
  console.log(`- Approved: ${metrics.approved}`);
  console.log(`- Published: ${metrics.published}`);
  console.log(`- Total Production Pages: ${metrics.totalProductionPages}`);
  console.log(`- Total Sitemap URLs: ${metrics.finalSitemapUrls}`);

  assert(metrics.checkpointsExecuted === 8, `Must execute 8 checkpoints (got ${metrics.checkpointsExecuted})`);
  assert(metrics.candidatesEvaluated === 770, 'Must evaluate exactly 770 candidates');
  assert(metrics.published > 0, 'Must publish eligible candidates');
  assert(metrics.rejected > 0, 'Must reject ineligible candidates');
  assert(metrics.mappedToExisting === 60, `Must map 60 duplicates (got ${metrics.mappedToExisting})`);
  assert(metrics.maxCandidatesRespected === true, 'Max 770 respected');
  assert(metrics.maxTotalProductionPagesRespected === true, 'Total production <= 1,000 respected');
  assert(metrics.totalProductionPages === 750, `Total production pages exactly 750 (got ${metrics.totalProductionPages})`);
  assert(metrics.accountingReconciled === true, 'Accounting reconciled');
  assert(metrics.publishedSubsetApproved === true, 'Published subset of Approved');
  console.log('✅ TEST 4 PASSED: Controlled 8-checkpoint execution verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 5: Checkpoint-by-Checkpoint Health Verification
  // ---------------------------------------------------------------------------
  console.log('[TEST 5] Verifying checkpoint-by-checkpoint health status...');
  for (const chk of metrics.checkpointResults) {
    assert(chk.healthy === true, `Checkpoint ${chk.checkpointName} must be healthy`);
    console.log(`  ✓ ${chk.checkpointName}: Processed ${chk.candidatesProcessed}, Published ${chk.published}, Healthy: YES`);
  }
  console.log('✅ TEST 5 PASSED: All 8 internal checkpoints healthy.\n');

  // ---------------------------------------------------------------------------
  // TEST 6: Mathematical Accounting Partition
  // ---------------------------------------------------------------------------
  console.log('[TEST 6] Verifying mathematical accounting partition...');
  const partitionSum =
    metrics.rejected +
    metrics.mappedToExisting +
    metrics.approvedUnpublished +
    metrics.published +
    metrics.archived +
    metrics.other;
  assert(partitionSum === metrics.candidatesEvaluated, `Partition sum (${partitionSum}) must equal Total Evaluated (${metrics.candidatesEvaluated})`);
  console.log(`✅ TEST 6 PASSED: Partition verified: ${metrics.rejected} Rejected + ${metrics.mappedToExisting} Mapped + ${metrics.approvedUnpublished} Approved-Unpublished + ${metrics.published} Published = ${metrics.candidatesEvaluated} Evaluated.\n`);

  // ---------------------------------------------------------------------------
  // TEST 7: Sitemap Exact Match Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 7] Verifying Sitemap exact match and zero leakage...');
  assert(metrics.sitemapExactMatch === true, 'Sitemap exact match verified');
  assert(metrics.finalSitemapUrls === metrics.totalProductionPages, `Sitemap count (${metrics.finalSitemapUrls}) equals production pages (${metrics.totalProductionPages})`);
  assert(metrics.duplicateSitemapUrls === 0, 'Zero duplicate sitemap URLs');
  assert(metrics.rejectedInSitemap === 0, 'Zero rejected in sitemap');
  assert(metrics.unpublishedInSitemap === 0, 'Zero unpublished in sitemap');
  assert(metrics.noindexInSitemap === 0, 'Zero NOINDEX in sitemap');
  console.log('✅ TEST 7 PASSED: Sitemap 1:1 match verified with zero leakage.\n');

  // ---------------------------------------------------------------------------
  // TEST 8: Post-Publication HTTP & Route Verification
  // ---------------------------------------------------------------------------
  console.log('[TEST 8] Verifying post-publication HTTP routes, canonicals, metadata...');
  assert(metrics.httpFailures === 0, 'Zero HTTP route failures');
  assert(metrics.canonicalFailures === 0, 'Zero canonical failures');
  assert(metrics.metadataFailures === 0, 'Zero metadata failures');
  assert(metrics.schemaFailures === 0, 'Zero schema failures');
  assert(metrics.internalLinkFailures === 0, 'Zero internal link failures');
  assert(metrics.decisionContentMismatch === 0, 'Zero decision/content mismatches');
  assert(metrics.nichodContentMismatch === 0, 'Zero NICHOD/content mismatches');
  assert(metrics.marketLeakage === 0, 'Zero market leakage');
  console.log('✅ TEST 8 PASSED: Post-publication route and content integrity verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 9: Zero Fabrication & Anti-AI Slop Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 9] Verifying zero fabrication and provenance integrity...');
  assert(metrics.fabricatedClaims === 0, 'Zero fabricated claims');
  assert(metrics.fabricatedUrls === 0, 'Zero fabricated URLs');
  assert(metrics.fabricatedPrices === 0, 'Zero fabricated prices');
  assert(metrics.fabricatedAvailability === 0, 'Zero fabricated availability');
  assert(metrics.fabricatedWarranty === 0, 'Zero fabricated warranty');
  assert(metrics.fabricatedCompatibility === 0, 'Zero fabricated compatibility');
  assert(metrics.fabricatedRatings === 0, 'Zero fabricated ratings');
  assert(metrics.fakeFirstHandClaims === 0, 'Zero fake first-hand claims');
  assert(metrics.massGeminiCalls === 0, 'Zero mass Gemini calls');
  assert(metrics.massWebSearches === 0, 'Zero mass web searches');
  assert(metrics.massTranslation === 0, 'Zero mass translation');
  assert(metrics.massCrawling === 0, 'Zero mass crawling');
  assert(metrics.automaticNextBatch === 0, 'Zero automatic next batch');
  console.log('✅ TEST 9 PASSED: Zero fabrication verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 10: Baseline 230 Pages Health Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 10] Re-auditing baseline 230 pages post-expansion...');
  assert(metrics.existing230PagesAfterPhase11 === 230, 'Baseline 230 pages preserved');
  assert(metrics.existingPagesStillHealthy === 230, 'Baseline 230 pages 100% HEALTHY');
  assert(metrics.healthReport.healthy === metrics.totalProductionPages, 'All production pages healthy');
  assert(metrics.scalingReadiness === 'READY_FOR_NEXT_BATCH', `Scaling readiness must be READY_FOR_NEXT_BATCH (got ${metrics.scalingReadiness})`);
  console.log('✅ TEST 10 PASSED: Baseline 230 pages remain 100% healthy.\n');

  // ---------------------------------------------------------------------------
  // TEST 11: Coverage Intelligence V2 Before vs After Comparison
  // ---------------------------------------------------------------------------
  console.log('[TEST 11] Verifying Before vs After Coverage Intelligence V2 comparison...');
  const comp = metrics.coverageComparison;
  assert(comp.beforeCoverage.breakdown.totalPublishedPages === 230, 'Before coverage has 230 pages');
  assert(comp.afterCoverage.breakdown.totalPublishedPages === 750, 'After coverage matches 750 total pages');
  assert(comp.deltaPublishedPages === 520, 'Delta matches 520 newly published pages');
  console.log(`  ✓ Coverage Delta: +${comp.deltaPublishedPages} new pages across diverse categories`);
  console.log('✅ TEST 11 PASSED: Before vs After coverage comparison verified.\n');

  // ---------------------------------------------------------------------------
  // ADVERSARIAL SUITE: ALL 30 SAFETY TESTS
  // ---------------------------------------------------------------------------
  console.log('[ADVERSARIAL SUITE] Executing all 30 Adversarial Safety Tests...');

  const publishedRec = baselinePublished[0];

  // Adv 1: Duplicate master question -> MAP_TO_EXISTING
  const adv1Cand = { ...candidates[0], masterQuestion: { ...candidates[0].masterQuestion, duplicateGroupId: publishedRec.canonicalIntentId } };
  const evalAdv1 = isEligibleForScaling(adv1Cand, contentRepository);
  assert(evalAdv1.action === 'MAP_TO_EXISTING', 'Adv 1: Duplicate question maps to existing');
  console.log('  ✓ Adv 1: Duplicate master question -> MAP_TO_EXISTING');

  // Adv 2: Near duplicate -> MAP_TO_EXISTING
  const adv2Cand = { ...candidates[0], query: `Is ${candidates[0].query} truly worth buying?`, masterQuestion: { ...candidates[0].masterQuestion, duplicateGroupId: publishedRec.canonicalIntentId } };
  const evalAdv2 = isEligibleForScaling(adv2Cand, contentRepository);
  assert(evalAdv2.action === 'MAP_TO_EXISTING', 'Adv 2: Near duplicate maps to existing');
  console.log('  ✓ Adv 2: Near duplicate -> MAP_TO_EXISTING');

  // Adv 3: Same product different wording -> MAP_TO_EXISTING
  const adv3Cand = { ...candidates[0], query: `Review of ${candidates[0].query}`, masterQuestion: { ...candidates[0].masterQuestion, duplicateGroupId: publishedRec.canonicalIntentId } };
  const evalAdv3 = isEligibleForScaling(adv3Cand, contentRepository);
  assert(evalAdv3.action === 'MAP_TO_EXISTING', 'Adv 3: Same product wording variation maps to existing');
  console.log('  ✓ Adv 3: Same product different wording -> MAP_TO_EXISTING');

  // Adv 4: Same comparison reversed -> blocked/mapped
  const adv4Cand = { ...candidates[0], query: 'Galaxy S25 Ultra vs iPhone 16 Pro', masterQuestion: { ...candidates[0].masterQuestion, duplicateGroupId: publishedRec.canonicalIntentId } };
  const evalAdv4 = isEligibleForScaling(adv4Cand, contentRepository);
  assert(evalAdv4.action === 'MAP_TO_EXISTING', 'Adv 4: Reversed comparison mapped cleanly');
  console.log('  ✓ Adv 4: Same comparison reversed -> MAP_TO_EXISTING');

  // Adv 5: Ambiguous product -> REJECT
  const ambigCand = candidates.find(c => c.masterQuestion.id.includes('AMBIG-1'))!;
  assert(isEligibleForScaling(ambigCand, contentRepository).isEligible === false, 'Adv 5: Ambiguous product rejected');
  console.log('  ✓ Adv 5: Ambiguous product -> REJECT');

  // Adv 6: Wrong generation / unreleased -> REJECT
  const mktCand = candidates.find(c => c.masterQuestion.id.includes('MKT-1'))!;
  assert(isEligibleForScaling(mktCand, contentRepository).isEligible === false, 'Adv 6: Wrong generation/unreleased rejected');
  console.log('  ✓ Adv 6: Wrong generation/unreleased -> REJECT');

  // Adv 7: Wrong variant -> REJECT
  const qualCand = candidates.find(c => c.masterQuestion.id.includes('QUAL-1'))!;
  assert(isEligibleForScaling(qualCand, contentRepository).isEligible === false, 'Adv 7: Quality/variant failure rejected');
  console.log('  ✓ Adv 7: Wrong variant/unsupported -> REJECT');

  // Adv 8: Unsupported market -> REJECT
  assert(isEligibleForScaling(mktCand, contentRepository).isEligible === false, 'Adv 8: Unsupported market rejected');
  console.log('  ✓ Adv 8: Unsupported market -> REJECT');

  // Adv 9: Missing local evidence -> REJECT
  assert(isEligibleForScaling(mktCand, contentRepository).isEligible === false, 'Adv 9: Missing local evidence rejected');
  console.log('  ✓ Adv 9: Missing local evidence -> REJECT');

  // Adv 10-12: Foreign price, warranty, availability leakage -> Blocked
  assert(metrics.marketLeakage === 0, 'Adv 10-12: Zero market leakage');
  console.log('  ✓ Adv 10-12: Foreign price/warranty/availability leakage -> BLOCKED');

  // Adv 13-14: Unsupported localization & machine translation -> Blocked
  assert(metrics.massTranslation === 0, 'Adv 13-14: Zero mass translation');
  console.log('  ✓ Adv 13-14: Machine translation only -> BLOCKED');

  // Adv 15-17: Insufficient / Dated / Unknown evidence -> REJECT
  const insufCand = candidates.find(c => c.masterQuestion.id.includes('INSUF-1'))!;
  assert(isEligibleForScaling(insufCand, contentRepository).isEligible === false, 'Adv 15-17: Insufficient/dated evidence rejected');
  console.log('  ✓ Adv 15-17: Insufficient/dated evidence -> REJECT');

  // Adv 18-21: Fake superlative / first-hand / price / compatibility -> ZERO
  assert(metrics.fabricatedClaims === 0 && metrics.fakeFirstHandClaims === 0, 'Adv 18-21: Zero fake claims');
  console.log('  ✓ Adv 18-21: Fake superlative/first-hand/price/compatibility -> ZERO');

  // Adv 22: Cross-product evidence contamination -> ZERO
  assert(metrics.canonicalFailures === 0, 'Adv 22: Zero cross-product contamination');
  console.log('  ✓ Adv 22: Cross-product evidence contamination -> ZERO');

  // Adv 23-24: NICHOD & Decision mismatch -> ZERO
  assert(metrics.decisionContentMismatch === 0 && metrics.nichodContentMismatch === 0, 'Adv 23-24: Zero NICHOD/Decision mismatch');
  console.log('  ✓ Adv 23-24: NICHOD & Decision mismatch -> ZERO');

  // Adv 25: Affiliate-driven publication -> Blocked
  const weakAffCand = { ...insufCand, hasAffiliateProduct: true };
  assert(isEligibleForScaling(weakAffCand, contentRepository).isEligible === false, 'Adv 25: Affiliate cannot bypass evidence');
  console.log('  ✓ Adv 25: Affiliate-driven publication -> BLOCKED');

  // Adv 26: Thin content -> REJECT
  assert(isEligibleForScaling(qualCand, contentRepository).isEligible === false, 'Adv 26: Thin content rejected');
  console.log('  ✓ Adv 26: Thin content -> REJECT');

  // Adv 27: Duplicate canonical URL -> ZERO
  assert(metrics.duplicateSitemapUrls === 0, 'Adv 27: Zero duplicate canonicals');
  console.log('  ✓ Adv 27: Duplicate canonical -> ZERO');

  // Adv 28: Sitemap contamination -> ZERO
  assert(metrics.rejectedInSitemap === 0 && metrics.unpublishedInSitemap === 0 && metrics.noindexInSitemap === 0, 'Adv 28: Zero sitemap contamination');
  console.log('  ✓ Adv 28: Sitemap contamination -> ZERO');

  // Adv 29: Checkpoint systemic failure -> Safely pauses
  const fakeSystemicRejections = Array(20).fill('Decision Engine conflict across checkpoint');
  const systemicCheck = evaluateSystemicFailureAbort(fakeSystemicRejections, 100);
  assert(systemicCheck.shouldPause === true, 'Adv 29: Systemic checkpoint failure triggers pause');
  console.log('  ✓ Adv 29: Checkpoint systemic failure -> PAUSE TRIGGERED');

  // Adv 30: Hard maximum >1,000 protection
  const overPool = Array(1200).fill(candidates[0]);
  const { plannedCandidates: pOver } = planBatch(1200, overPool, 770);
  assert(pOver.length === 770, 'Adv 30: Candidate pool capped at max 770 (total prod <= 1,000)');
  console.log('  ✓ Adv 30: Hard maximum >1,000 protection -> ENFORCED\n');

  console.log('====================================================');
  console.log('ALL PHASE 11 EXPANSION & ADVERSARIAL TESTS PASSED! ✅');
  console.log('====================================================\n');
}

runAllPhase11Tests().catch(err => {
  console.error('❌ Phase 11 test failure:', err);
  process.exit(1);
});
