/**
 * ProductReviews.review — Phase 10 Production Expansion & Coverage Intelligence Tests
 * 
 * Verifies controlled 250-candidate production expansion execution,
 * Coverage Intelligence before/after comparison, internal checkpoints safety,
 * sitemap exact match, zero fabrication, and full accounting reconciliation.
 */

import {
  runPhase10Expansion,
  getPhase10ExpansionCandidates,
  seedPhase9BaselinePages
} from './phase10Expansion';
import { analyzeCatalogCoverage } from './phase10Coverage';
import { contentRepository } from '../store/contentRepository';
import { getCanonicalSitemapEntries } from '../../seo/sitemapGenerator';
import { auditPublishedContent, auditContentRecord } from './contentHealthAudit';
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
console.log('RUNNING PHASE 10 EXPANSION & COVERAGE TEST SUITE');
console.log('====================================================\n');

async function runAllPhase10Tests() {
  // ---------------------------------------------------------------------------
  // TEST 1: Baseline 80-Page Verification
  // ---------------------------------------------------------------------------
  console.log('[TEST 1] Verifying Phase 9 baseline state (80 pages)...');
  await seedPhase9BaselinePages(contentRepository);
  const baselinePublished = contentRepository.getPublishedIndexableRecords();
  assert(baselinePublished.length === 80, `Must have exactly 80 baseline published pages (got ${baselinePublished.length})`);

  const baselineSitemap = getCanonicalSitemapEntries();
  const baselineSitemapReviews = baselineSitemap.filter(s => s.loc.includes('/review/'));
  assert(baselineSitemapReviews.length === 80, `Must have exactly 80 baseline sitemap review entries (got ${baselineSitemapReviews.length})`);

  const baselineAudit = auditPublishedContent(contentRepository.listRecords(), baselineSitemap);
  assert(baselineAudit.healthy === 80, `All 80 baseline pages must be HEALTHY (got ${baselineAudit.healthy})`);
  assert(baselineAudit.criticalIssues === 0, 'Zero critical issues on baseline');
  assert(baselineAudit.sitemapConsistency === 'PASS', 'Baseline sitemap consistency must be PASS');
  console.log('✅ TEST 1 PASSED: Baseline 80 pages verified and 100% healthy.\n');

  // ---------------------------------------------------------------------------
  // TEST 2: Pre-Expansion Coverage Intelligence
  // ---------------------------------------------------------------------------
  console.log('[TEST 2] Analyzing pre-expansion Coverage Intelligence...');
  const initialCoverage = analyzeCatalogCoverage(contentRepository);
  assert(initialCoverage.breakdown.totalCatalogMasterQuestions === 10000, 'Catalog contains 10,000 Master Questions');
  assert(initialCoverage.breakdown.totalPublishedPages === 80, 'Coverage reflects 80 published pages');
  assert(initialCoverage.wellCoveredAreas.length > 0, 'Well covered areas identified');
  assert(initialCoverage.underCoveredAreas.length > 0, 'Under-covered areas identified');
  assert(initialCoverage.highValueGaps.length > 0, 'High value gaps identified');
  assert(initialCoverage.evidenceInsufficientGaps.length > 0, 'Insufficient evidence zones mapped');
  assert(initialCoverage.ambiguousBlockedZones.length > 0, 'Ambiguous blocked zones mapped');
  assert(initialCoverage.localizationUnsafeZones.length > 0, 'Localization unsafe zones mapped');
  console.log('✅ TEST 2 PASSED: Pre-expansion coverage intelligence generated.\n');

  // ---------------------------------------------------------------------------
  // TEST 3: Candidate Selection Bounding (Max 250)
  // ---------------------------------------------------------------------------
  console.log('[TEST 3] Verifying candidate selection capping at max 250...');
  const candidates = getPhase10ExpansionCandidates();
  assert(candidates.length <= 250, `Candidates pool must be <= 250 (got ${candidates.length})`);
  assert(candidates.length === 250, `Candidates pool exactly 250 (got ${candidates.length})`);
  console.log('✅ TEST 3 PASSED: Exact 250 candidate pool verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 4 & 5: Duplicate Prevention and MAP_TO_EXISTING
  // ---------------------------------------------------------------------------
  console.log('[TEST 4 & 5] Testing duplicate prevention and MAP_TO_EXISTING...');
  const baselineRec = baselinePublished[0];
  const dupCandidate = {
    ...candidates[0],
    masterQuestion: {
      ...candidates[0].masterQuestion,
      duplicateGroupId: baselineRec.canonicalIntentId
    }
  };
  const evalDup = isEligibleForScaling(dupCandidate, contentRepository);
  assert(evalDup.action === 'MAP_TO_EXISTING', 'Duplicate candidate must return MAP_TO_EXISTING');
  console.log('✅ TEST 4 & 5 PASSED: Duplicate prevention and MAP_TO_EXISTING verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 6: Entity Safety Gating
  // ---------------------------------------------------------------------------
  console.log('[TEST 6] Testing entity safety gating...');
  const ambigCandidate = candidates.find(c => c.masterQuestion.id.includes('AMBIG-1'))!;
  const evalAmbig = isEligibleForScaling(ambigCandidate, contentRepository);
  assert(evalAmbig.isEligible === false, 'Ambiguous entity candidate blocked');
  console.log('✅ TEST 6 PASSED: Entity safety gating verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 7: Market Safety Gating
  // ---------------------------------------------------------------------------
  console.log('[TEST 7] Testing market safety gating...');
  const mktCandidate = candidates.find(c => c.masterQuestion.id.includes('MKT-1'))!;
  const evalMkt = isEligibleForScaling(mktCandidate, contentRepository);
  assert(evalMkt.isEligible === false, 'Market evidence missing candidate blocked');
  console.log('✅ TEST 7 PASSED: Market safety gating verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 8: Evidence Sufficiency Gating
  // ---------------------------------------------------------------------------
  console.log('[TEST 8] Testing evidence sufficiency gating...');
  const insufCandidate = candidates.find(c => c.masterQuestion.id.includes('INSUF-1'))!;
  const evalInsuf = isEligibleForScaling(insufCandidate, contentRepository);
  assert(evalInsuf.isEligible === false, 'Insufficient evidence candidate rejected');
  console.log('✅ TEST 8 PASSED: Evidence sufficiency gating verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 9: Content Quality Gating
  // ---------------------------------------------------------------------------
  console.log('[TEST 9] Testing content quality gating...');
  const qualCandidate = candidates.find(c => c.masterQuestion.id.includes('QUAL-1'))!;
  const evalQual = isEligibleForScaling(qualCandidate, contentRepository);
  assert(evalQual.isEligible === false, 'Quality failure candidate rejected');
  console.log('✅ TEST 9 PASSED: Quality gate verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 10: Affiliate Neutrality
  // ---------------------------------------------------------------------------
  console.log('[TEST 10] Testing affiliate neutrality...');
  const nonAffCandidate = {
    ...candidates[0],
    masterQuestion: {
      ...candidates[0].masterQuestion,
      id: 'P10-TEST-NONAFF',
      duplicateGroupId: 'grp_p10_test_nonaff'
    },
    hasAffiliateProduct: false
  };
  const evalNonAff = isEligibleForScaling(nonAffCandidate, contentRepository);
  assert(evalNonAff.isEligible === true, 'Candidate without affiliate link qualifies on evidence');
  console.log('✅ TEST 10 PASSED: Affiliate neutrality verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 11: Controlled Checkpoints Execution & Phase 10 Run
  // ---------------------------------------------------------------------------
  console.log('[TEST 11] Executing full Phase 10 Expansion across 5 checkpoints...');
  const metrics = await runPhase10Expansion(contentRepository);

  console.log('Phase 10 Execution Summary:');
  console.log(`- Batch ID: ${metrics.batchId}`);
  console.log(`- Checkpoints Executed: ${metrics.checkpointsExecuted}`);
  console.log(`- Baseline Pages: ${metrics.baselinePagesBeforePhase10}`);
  console.log(`- Candidates Evaluated: ${metrics.candidatesEvaluated}`);
  console.log(`- Eligible: ${metrics.eligible}`);
  console.log(`- Rejected: ${metrics.rejected} (Ambiguity: ${metrics.rejectedAmbiguity}, Insufficient: ${metrics.rejectedInsufficientEvidence}, Duplicate/Canonical: ${metrics.rejectedDuplicateCanonical}, Market: ${metrics.rejectedMarketEvidence}, Quality: ${metrics.rejectedQuality})`);
  console.log(`- Mapped to Existing: ${metrics.mappedToExisting}`);
  console.log(`- Approved: ${metrics.approved}`);
  console.log(`- Published: ${metrics.published}`);
  console.log(`- Total Production Pages: ${metrics.totalProductionPages}`);
  console.log(`- Total Sitemap URLs: ${metrics.finalSitemapUrls}`);

  assert(metrics.checkpointsExecuted === 5, `Must execute 5 checkpoints (got ${metrics.checkpointsExecuted})`);
  assert(metrics.candidatesEvaluated === 250, 'Must evaluate exactly 250 candidates');
  assert(metrics.published > 0, 'Must publish eligible candidates');
  assert(metrics.rejected > 0, 'Must reject ineligible candidates');
  assert(metrics.mappedToExisting === 20, `Must map 20 duplicates (got ${metrics.mappedToExisting})`);
  assert(metrics.maxCandidatesRespected === true, 'Max 250 respected');
  assert(metrics.accountingReconciled === true, 'Accounting reconciled');
  assert(metrics.publishedSubsetApproved === true, 'Published subset of Approved');
  console.log('✅ TEST 11 PASSED: Controlled 5-checkpoint execution verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 12: Checkpoint-by-Checkpoint Health Verification
  // ---------------------------------------------------------------------------
  console.log('[TEST 12] Verifying checkpoint-by-checkpoint health status...');
  for (const chk of metrics.checkpointResults) {
    assert(chk.healthy === true, `Checkpoint ${chk.checkpointName} must be healthy`);
    console.log(`  ✓ ${chk.checkpointName}: Processed ${chk.candidatesProcessed}, Published ${chk.published}, Healthy: YES`);
  }
  console.log('✅ TEST 12 PASSED: All 5 internal checkpoints healthy.\n');

  // ---------------------------------------------------------------------------
  // TEST 13: Mathematical Accounting Partition
  // ---------------------------------------------------------------------------
  console.log('[TEST 13] Verifying mathematical accounting partition...');
  const partitionSum =
    metrics.rejected +
    metrics.mappedToExisting +
    metrics.approvedUnpublished +
    metrics.published +
    metrics.archived +
    metrics.other;
  assert(partitionSum === metrics.candidatesEvaluated, `Partition sum (${partitionSum}) must equal Total Evaluated (${metrics.candidatesEvaluated})`);
  console.log(`✅ TEST 13 PASSED: Partition verified: ${metrics.rejected} Rejected + ${metrics.mappedToExisting} Mapped + ${metrics.approvedUnpublished} Approved-Unpublished + ${metrics.published} Published = ${metrics.candidatesEvaluated} Evaluated.\n`);

  // ---------------------------------------------------------------------------
  // TEST 14: Sitemap Exact Match Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 14] Verifying Sitemap exact match and zero leakage...');
  assert(metrics.sitemapExactMatch === true, 'Sitemap exact match verified');
  assert(metrics.finalSitemapUrls === metrics.totalProductionPages, `Sitemap count (${metrics.finalSitemapUrls}) equals production pages (${metrics.totalProductionPages})`);
  assert(metrics.duplicateSitemapUrls === 0, 'Zero duplicate sitemap URLs');
  assert(metrics.rejectedInSitemap === 0, 'Zero rejected in sitemap');
  assert(metrics.unpublishedInSitemap === 0, 'Zero unpublished in sitemap');
  assert(metrics.noindexInSitemap === 0, 'Zero NOINDEX in sitemap');
  console.log('✅ TEST 14 PASSED: Sitemap 1:1 match verified with zero leakage.\n');

  // ---------------------------------------------------------------------------
  // TEST 15: Post-Publication HTTP & Route Verification
  // ---------------------------------------------------------------------------
  console.log('[TEST 15] Verifying post-publication HTTP routes, canonicals, metadata...');
  assert(metrics.httpFailures === 0, 'Zero HTTP route failures');
  assert(metrics.canonicalFailures === 0, 'Zero canonical failures');
  assert(metrics.metadataFailures === 0, 'Zero metadata failures');
  assert(metrics.schemaFailures === 0, 'Zero schema failures');
  assert(metrics.internalLinkFailures === 0, 'Zero internal link failures');
  assert(metrics.decisionContentMismatch === 0, 'Zero decision/content mismatches');
  assert(metrics.nichodContentMismatch === 0, 'Zero NICHOD/content mismatches');
  assert(metrics.marketLeakage === 0, 'Zero market leakage');
  console.log('✅ TEST 15 PASSED: Post-publication route and content integrity verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 16: Zero Fabrication & Anti-AI Slop Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 16] Verifying zero fabrication and provenance integrity...');
  assert(metrics.fabricatedClaims === 0, 'Zero fabricated claims');
  assert(metrics.fabricatedUrls === 0, 'Zero fabricated URLs');
  assert(metrics.fabricatedPrices === 0, 'Zero fabricated prices');
  assert(metrics.fabricatedRatings === 0, 'Zero fabricated ratings');
  assert(metrics.fakeFirstHandClaims === 0, 'Zero fake first-hand claims');
  assert(metrics.massGeminiCalls === 0, 'Zero mass Gemini calls');
  assert(metrics.massWebSearches === 0, 'Zero mass web searches');
  assert(metrics.massTranslation === 0, 'Zero mass translation');
  assert(metrics.massCrawling === 0, 'Zero mass crawling');
  assert(metrics.automaticNextBatch === 0, 'Zero automatic next batch');
  console.log('✅ TEST 16 PASSED: Zero fabrication verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 17: Baseline 80 Pages Health Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 17] Re-auditing baseline 80 pages post-expansion...');
  assert(metrics.existing80PagesAfterPhase10 === 80, 'Baseline 80 pages preserved');
  assert(metrics.existingPagesStillHealthy === 80, 'Baseline 80 pages 100% HEALTHY');
  assert(metrics.healthReport.healthy === metrics.totalProductionPages, 'All production pages healthy');
  assert(metrics.scalingReadiness === 'READY_FOR_NEXT_BATCH', `Scaling readiness must be READY_FOR_NEXT_BATCH (got ${metrics.scalingReadiness})`);
  console.log('✅ TEST 17 PASSED: Baseline 80 pages remain 100% healthy.\n');

  // ---------------------------------------------------------------------------
  // TEST 18: Coverage Intelligence Before vs After Comparison
  // ---------------------------------------------------------------------------
  console.log('[TEST 18] Verifying Before vs After Coverage Intelligence comparison...');
  const comp = metrics.coverageComparison;
  assert(comp.beforeCoverage.breakdown.totalPublishedPages === 80, 'Before coverage has 80 pages');
  assert(comp.afterCoverage.breakdown.totalPublishedPages === metrics.totalProductionPages, 'After coverage matches total pages');
  assert(comp.deltaPublishedPages === metrics.newPublishedPages, 'Delta matches new published pages');
  console.log(`  ✓ Coverage Delta: +${comp.deltaPublishedPages} new pages across diverse categories`);
  console.log('✅ TEST 18 PASSED: Before vs After coverage comparison verified.\n');

  console.log('====================================================');
  console.log('ALL PHASE 10 EXPANSION & COVERAGE TESTS PASSED! ✅');
  console.log('====================================================\n');
}

runAllPhase10Tests().catch(err => {
  console.error('❌ Phase 10 test failure:', err);
  process.exit(1);
});
