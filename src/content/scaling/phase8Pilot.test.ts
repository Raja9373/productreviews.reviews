/**
 * ProductReviews.review — Phase 8 Production Expansion Pilot Tests
 * 
 * Verifies controlled 25-page production expansion pilot execution,
 * strict evidence gating, zero fabrication, sitemap exact match,
 * post-publication HTTP route integrity, and full accounting reconciliation.
 */

import {
  runPhase8ExpansionPilot,
  getPhase8PilotCandidates,
  seedPhase6BaselinePages
} from './phase8ExpansionPilot';
import { contentRepository } from '../store/contentRepository';
import { getCanonicalSitemapEntries } from '../../seo/sitemapGenerator';
import { auditPublishedContent } from './contentHealthAudit';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('RUNNING PHASE 8 CONTROLLED EXPANSION PILOT TESTS');
console.log('====================================================\n');

async function runAllPhase8Tests() {
  // ---------------------------------------------------------------------------
  // TEST 1: Baseline Verification (34 published, 34 sitemap, 34 healthy)
  // ---------------------------------------------------------------------------
  console.log('[TEST 1] Verifying Phase 6 baseline state before pilot...');
  seedPhase6BaselinePages(contentRepository);
  const baselinePublished = contentRepository.getPublishedIndexableRecords();
  assert(baselinePublished.length === 34, `Must have exactly 34 baseline published pages (got ${baselinePublished.length})`);
  
  const baselineSitemap = getCanonicalSitemapEntries();
  const baselineSitemapReviews = baselineSitemap.filter(s => s.loc.includes('/review/'));
  assert(baselineSitemapReviews.length === 34, `Must have exactly 34 sitemap review entries (got ${baselineSitemapReviews.length})`);

  const baselineAudit = auditPublishedContent(contentRepository.listRecords(), baselineSitemap);
  assert(baselineAudit.healthy === 34, `All 34 baseline pages must be HEALTHY (got ${baselineAudit.healthy})`);
  assert(baselineAudit.criticalIssues === 0, 'Zero critical issues on baseline');
  assert(baselineAudit.sitemapConsistency === 'PASS', 'Baseline sitemap consistency must be PASS');
  console.log('✅ TEST 1 PASSED: Baseline 34 pages verified and 100% healthy.\n');

  // ---------------------------------------------------------------------------
  // TEST 2: Candidate Selection Bounding (Max 25 candidates)
  // ---------------------------------------------------------------------------
  console.log('[TEST 2] Verifying candidate selection capping at max 25...');
  const candidates = getPhase8PilotCandidates();
  assert(candidates.length <= 25, `Pilot candidates must be at most 25 (got ${candidates.length})`);
  assert(candidates.length === 25, `Pilot candidates configured to exact 25 (got ${candidates.length})`);
  console.log('✅ TEST 2 PASSED: Exact 25 candidate pool verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 3: Controlled Expansion Pilot Execution
  // ---------------------------------------------------------------------------
  console.log('[TEST 3] Executing controlled Phase 8 pilot batch (PHASE8-PILOT-001)...');
  const pilotMetrics = await runPhase8ExpansionPilot(contentRepository);
  
  console.log('Pilot Execution Summary:');
  console.log(`- Batch ID: ${pilotMetrics.batchId}`);
  console.log(`- Candidates Evaluated: ${pilotMetrics.candidatesEvaluated}`);
  console.log(`- Eligible: ${pilotMetrics.eligible}`);
  console.log(`- Rejected: ${pilotMetrics.rejected} (Ambiguity: ${pilotMetrics.rejectedAmbiguity}, Insufficient: ${pilotMetrics.rejectedInsufficientEvidence}, Duplicate/Canonical: ${pilotMetrics.rejectedDuplicateCanonical}, Quality: ${pilotMetrics.rejectedQuality})`);
  console.log(`- Mapped to Existing: ${pilotMetrics.mappedToExisting}`);
  console.log(`- Approved: ${pilotMetrics.approved}`);
  console.log(`- Published: ${pilotMetrics.published}`);
  console.log(`- Approved Unpublished: ${pilotMetrics.approvedUnpublished}`);
  console.log(`- New Production Pages: ${pilotMetrics.newPublishedPages}`);
  console.log(`- Total Production Pages: ${pilotMetrics.totalProductionPages}`);
  console.log(`- Total Sitemap URLs: ${pilotMetrics.totalSitemapUrls}`);

  assert(pilotMetrics.batchId === 'PHASE8-PILOT-001', 'Batch ID must be PHASE8-PILOT-001');
  assert(pilotMetrics.candidatesEvaluated === 25, 'Must evaluate exactly 25 candidates');
  assert(pilotMetrics.published > 0, 'Must publish genuinely eligible candidates');
  assert(pilotMetrics.rejected > 0, 'Must reject ineligible candidates');
  assert(pilotMetrics.mappedToExisting === 2, `Must map 2 duplicate candidates cleanly (got ${pilotMetrics.mappedToExisting})`);
  assert(pilotMetrics.published <= pilotMetrics.approved, 'Published must be a subset of approved');
  assert(pilotMetrics.accountingReconciled, 'Accounting must be strictly reconciled');
  console.log('✅ TEST 3 PASSED: Controlled expansion pilot executed and verified.\n');

  // ---------------------------------------------------------------------------
  // TEST 4: Accounting Reconciliation Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 4] Verifying mathematical accounting partition...');
  const calculatedSum =
    pilotMetrics.rejected +
    pilotMetrics.mappedToExisting +
    pilotMetrics.approvedUnpublished +
    pilotMetrics.published +
    pilotMetrics.archived +
    pilotMetrics.other;
  assert(calculatedSum === pilotMetrics.candidatesEvaluated, `Partition sum (${calculatedSum}) must equal Total Evaluated (${pilotMetrics.candidatesEvaluated})`);
  assert(pilotMetrics.publishedSubsetApproved, 'Published subset of Approved verified');
  console.log(`✅ TEST 4 PASSED: Mathematical partition verified: ${pilotMetrics.rejected} Rejected + ${pilotMetrics.mappedToExisting} Mapped + ${pilotMetrics.approvedUnpublished} Approved-Unpublished + ${pilotMetrics.published} Published = ${pilotMetrics.candidatesEvaluated} Evaluated.\n`);

  // ---------------------------------------------------------------------------
  // TEST 5: Sitemap & Indexability Exact Match Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 5] Verifying Sitemap exact match and zero leakage...');
  const currentSitemap = getCanonicalSitemapEntries();
  const currentReviewUrls = currentSitemap.filter(s => s.loc.includes('/review/'));
  const currentPublishedRecords = contentRepository.getPublishedIndexableRecords();

  assert(currentReviewUrls.length === currentPublishedRecords.length, `Sitemap count (${currentReviewUrls.length}) must equal published records (${currentPublishedRecords.length})`);
  assert(pilotMetrics.sitemapExactMatch, 'Sitemap exact match boolean must be true');
  assert(pilotMetrics.duplicateSitemapUrls === 0, 'Zero duplicate sitemap URLs');
  assert(pilotMetrics.rejectedInSitemap === 0, 'Zero rejected records in sitemap');
  assert(pilotMetrics.unpublishedInSitemap === 0, 'Zero unpublished records in sitemap');
  assert(pilotMetrics.noindexInSitemap === 0, 'Zero NOINDEX records in sitemap');
  console.log('✅ TEST 5 PASSED: Sitemap 1:1 match verified with zero leakage.\n');

  // ---------------------------------------------------------------------------
  // TEST 6: Post-Publication Route & Content Health Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 6] Verifying post-publication HTTP routes, canonicals, and metadata...');
  assert(pilotMetrics.httpFailures === 0, 'Zero HTTP route failures');
  assert(pilotMetrics.canonicalFailures === 0, 'Zero canonical URL failures');
  assert(pilotMetrics.schemaFailures === 0, 'Zero schema failures');
  assert(pilotMetrics.internalLinkFailures === 0, 'Zero internal link failures');
  assert(pilotMetrics.marketLeakage === 0, 'Zero market leakage');
  assert(pilotMetrics.decisionContentMismatch === 0, 'Zero decision/content mismatches');
  assert(pilotMetrics.nichodContentMismatch === 0, 'Zero NICHOD/content mismatches');
  console.log('✅ TEST 6 PASSED: All post-publication route and content checks passed.\n');

  // ---------------------------------------------------------------------------
  // TEST 7: Zero Fabrication & Anti-AI Slop Audit
  // ---------------------------------------------------------------------------
  console.log('[TEST 7] Verifying zero fabrication and provenance integrity...');
  assert(pilotMetrics.fabricatedClaims === 0, 'Zero fabricated claims');
  assert(pilotMetrics.fabricatedUrls === 0, 'Zero fabricated URLs');
  assert(pilotMetrics.fabricatedPrices === 0, 'Zero fabricated prices');
  assert(pilotMetrics.fabricatedRatings === 0, 'Zero fabricated ratings');
  assert(pilotMetrics.fakeFirstHandClaims === 0, 'Zero fake first-hand testing claims');
  assert(pilotMetrics.massGeminiCalls === 0, 'Zero mass Gemini calls');
  assert(pilotMetrics.massWebSearches === 0, 'Zero mass web searches');
  assert(pilotMetrics.automaticNextBatch === 0, 'Zero automatic recurring batches');
  console.log('✅ TEST 7 PASSED: Zero fabrication audit passed.\n');

  // ---------------------------------------------------------------------------
  // TEST 8: Re-Audit Baseline 34 Pages (Zero Regression)
  // ---------------------------------------------------------------------------
  console.log('[TEST 8] Re-auditing baseline 34 pages after pilot publication...');
  assert(pilotMetrics.existing34PagesAfterPilot === 34, 'Existing 34 pages intact');
  assert(pilotMetrics.healthyExistingPages === 34, 'Existing 34 pages 100% HEALTHY');
  assert(pilotMetrics.healthReport.healthy === pilotMetrics.totalProductionPages, 'All total production pages healthy');
  assert(pilotMetrics.healthReport.criticalIssues === 0, 'Zero critical issues across entire catalog');
  assert(pilotMetrics.scalingReadiness === 'READY_FOR_NEXT_BATCH', `Scaling readiness must be READY_FOR_NEXT_BATCH (got ${pilotMetrics.scalingReadiness})`);
  console.log('✅ TEST 8 PASSED: Baseline 34 pages remain 100% healthy post-expansion.\n');

  console.log('====================================================');
  console.log('ALL PHASE 8 EXPANSION PILOT TESTS PASSED! ✅');
  console.log('====================================================\n');
}

runAllPhase8Tests().catch(err => {
  console.error('❌ Phase 8 test failure:', err);
  process.exit(1);
});
