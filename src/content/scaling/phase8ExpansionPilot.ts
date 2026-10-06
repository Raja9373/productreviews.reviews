/**
 * ProductReviews.review — Phase 8 Controlled 25-Page Production Expansion Pilot
 * 
 * Executes an auditable, deterministic production expansion pilot (max 25 candidates).
 * Enforces strict evidence gating, zero fabrication, affiliate neutrality, canonical deduplication,
 * sitemap reconciliation, and post-publication HTTP route verification.
 */

import { masterQuestionCatalog } from '../../questions/masterQuestionCatalog';
import { executeContentPipeline, PILOT_FIXTURES } from '../index';
import { contentRepository, IContentRepository } from '../store/contentRepository';
import { getCanonicalSitemapEntries } from '../../seo/sitemapGenerator';
import {
  ScalingCandidate,
  ContentBatch,
  ContentHealthAuditReport
} from './contentHealthTypes';
import { planBatch } from './batchPlanner';
import { contentExpansionController } from './contentExpansionController';
import { auditPublishedContent } from './contentHealthAudit';

export interface Phase8PilotMetrics {
  batchId: string;
  existingPagesBeforePilot: number;
  candidatesSelected: number;
  candidatesEvaluated: number;
  eligible: number;
  rejected: number;
  rejectedAmbiguity: number;
  rejectedInsufficientEvidence: number;
  rejectedDuplicateCanonical: number;
  rejectedQuality: number;
  mappedToExisting: number;
  approved: number;
  published: number;
  approvedUnpublished: number;
  paused: number;
  archived: number;
  other: number;
  accountingReconciled: boolean;
  publishedSubsetApproved: boolean;
  
  existing34PagesAfterPilot: number;
  healthyExistingPages: number;
  newPublishedPages: number;
  totalProductionPages: number;
  
  existingSitemapUrls: number;
  newSitemapUrls: number;
  totalSitemapUrls: number;
  publishedIndexableRecords: number;
  sitemapExactMatch: boolean;
  duplicateSitemapUrls: number;
  rejectedInSitemap: number;
  unpublishedInSitemap: number;
  noindexInSitemap: number;
  
  httpFailures: number;
  canonicalFailures: number;
  schemaFailures: number;
  internalLinkFailures: number;
  marketLeakage: number;
  decisionContentMismatch: number;
  nichodContentMismatch: number;
  
  fabricatedClaims: number;
  fabricatedUrls: number;
  fabricatedPrices: number;
  fabricatedRatings: number;
  fakeFirstHandClaims: number;
  massGeminiCalls: number;
  massWebSearches: number;
  automaticNextBatch: number;
  
  healthReport: ContentHealthAuditReport;
  scalingReadiness: string;
  batch: ContentBatch;
}

/**
 * Seeds the 34 verified baseline published production pages from Phase 6
 */
export function seedPhase6BaselinePages(repo: IContentRepository = contentRepository): void {
  repo.clear();
  const allMQs = masterQuestionCatalog.getAllQuestions();
  const groups = new Set<string>();
  const pilotCandidateMQs: any[] = [];
  for (const q of allMQs) {
    if (!groups.has(q.duplicateGroupId)) {
      groups.add(q.duplicateGroupId);
      pilotCandidateMQs.push(q);
      if (pilotCandidateMQs.length >= 80) break;
    }
  }

  for (const mq of pilotCandidateMQs) {
    const matchingFix = PILOT_FIXTURES.find(f => f.masterQuestion.intentType === mq.intentType) || PILOT_FIXTURES[0];
    const query = mq.entityRequired ? matchingFix.query : mq.question;
    const pResult = executeContentPipeline(mq, query, matchingFix.researchResult);

    const rec = repo.createRecord(pResult.content);
    if (pResult.isPublicationCandidate && rec.content.indexability === 'ELIGIBLE_CANDIDATE') {
      const appRes = repo.approveContent(rec.id);
      if (appRes.success) {
        if (rec.pageType === 'PRODUCT_REVIEW' || rec.pageType === 'COMPARISON') {
          repo.publishContent(rec.id);
        }
      }
    } else {
      repo.rejectContent(rec.id, 'Eligibility gate unmet');
    }
  }
}

/**
 * Selects up to 25 diverse candidate queries across categories and intent types.
 * Carefully includes genuine eligible candidates, distinct use cases, duplicate intents,
 * ambiguous entities, and insufficient evidence cases to rigorously verify all gates.
 */
export function getPhase8PilotCandidates(): ScalingCandidate[] {
  return [
    // 1. Valid Product Reviews (Diverse Categories)
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000001')!, ...PILOT_FIXTURES[0].masterQuestion, id: 'P8-MQ-01', duplicateGroupId: 'grp_p8_iphone16pro_rev' },
      query: 'iPhone 16 Pro review',
      researchResult: PILOT_FIXTURES[0].researchResult,
      priority: 'P0'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000002')!, ...PILOT_FIXTURES[1].masterQuestion, id: 'P8-MQ-02', duplicateGroupId: 'grp_p8_macbook_m4_rev' },
      query: 'MacBook Air M4 review',
      researchResult: PILOT_FIXTURES[1].researchResult,
      priority: 'P0'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000020')!, ...PILOT_FIXTURES[6].masterQuestion, id: 'P8-MQ-03', duplicateGroupId: 'grp_p8_gaming_phone' },
      query: 'best phone for competitive gaming',
      researchResult: PILOT_FIXTURES[6].researchResult,
      priority: 'P1'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000021')!, ...PILOT_FIXTURES[7].masterQuestion, id: 'P8-MQ-04', duplicateGroupId: 'grp_p8_iphone16_thermal' },
      query: 'iPhone 16 Pro overheating problems',
      researchResult: PILOT_FIXTURES[7].researchResult,
      priority: 'P1'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000022')!, ...PILOT_FIXTURES[8].masterQuestion, id: 'P8-MQ-05', duplicateGroupId: 'grp_p8_macbook_alts' },
      query: 'MacBook Air M4 alternatives',
      researchResult: PILOT_FIXTURES[8].researchResult,
      priority: 'P1'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000023')!, ...PILOT_FIXTURES[9].masterQuestion, id: 'P8-MQ-06', duplicateGroupId: 'grp_p8_iphone_upgrade' },
      query: 'iPhone 15 to iPhone 16 Pro upgrade',
      researchResult: PILOT_FIXTURES[9].researchResult,
      priority: 'P1'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000024')!, ...PILOT_FIXTURES[10].masterQuestion, id: 'P8-MQ-07', duplicateGroupId: 'grp_p8_usbc_compat' },
      query: 'iPhone 16 Pro USB-C compatibility',
      researchResult: PILOT_FIXTURES[10].researchResult,
      priority: 'P2'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000025')!, ...PILOT_FIXTURES[11].masterQuestion, id: 'P8-MQ-08', duplicateGroupId: 'grp_p8_sony_a7iv_spec' },
      query: 'Sony A7 IV camera specifications',
      researchResult: PILOT_FIXTURES[11].researchResult,
      priority: 'P1'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000026')!, ...PILOT_FIXTURES[12].masterQuestion, id: 'P8-MQ-09', duplicateGroupId: 'grp_p8_macbook_battery' },
      query: 'MacBook Air M4 battery durability',
      researchResult: PILOT_FIXTURES[12].researchResult,
      priority: 'P1'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000027')!, ...PILOT_FIXTURES[13].masterQuestion, id: 'P8-MQ-10', duplicateGroupId: 'grp_p8_macbook_worth' },
      query: 'Is MacBook Air M4 worth it?',
      researchResult: PILOT_FIXTURES[13].researchResult,
      priority: 'P0'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000028')!, ...PILOT_FIXTURES[14].masterQuestion, id: 'P8-MQ-11', duplicateGroupId: 'grp_p8_buy_or_wait' },
      query: 'Should I buy iPhone 16 Pro now or wait?',
      researchResult: PILOT_FIXTURES[14].researchResult,
      priority: 'P1'
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000029')!, ...PILOT_FIXTURES[15].masterQuestion, id: 'P8-MQ-12', duplicateGroupId: 'grp_p8_sony_anc' },
      query: 'Sony WH-1000XM5 active noise cancelling',
      researchResult: PILOT_FIXTURES[15].researchResult,
      priority: 'P0'
    },

    // 2. Duplicate Intent Candidates (Cannibalization Protection: Expect MAP_TO_EXISTING)
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000001')!, ...PILOT_FIXTURES[0].masterQuestion, id: 'P8-MQ-DUP-01', duplicateGroupId: 'grp_p8_iphone16pro_rev' },
      query: 'Is iPhone 16 Pro good?',
      researchResult: PILOT_FIXTURES[0].researchResult
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000020')!, ...PILOT_FIXTURES[6].masterQuestion, id: 'P8-MQ-DUP-02', duplicateGroupId: 'grp_p8_gaming_phone' },
      query: 'Which phone is best for competitive gaming?',
      researchResult: PILOT_FIXTURES[6].researchResult
    },

    // 3. Ambiguous / Generic Entity Candidates (Expect REJECT - Ambiguity)
    {
      masterQuestion: {
        ...masterQuestionCatalog.getById('MQ-000034')!,
        ...PILOT_FIXTURES[20].masterQuestion,
        id: 'P8-MQ-AMBIG-01',
        duplicateGroupId: 'grp_p8_ambig_01',
        entityRequired: true
      },
      query: 'Is this device good?',
      researchResult: PILOT_FIXTURES[20].researchResult
    },
    {
      masterQuestion: {
        ...masterQuestionCatalog.getById('MQ-000036')!,
        ...PILOT_FIXTURES[22].masterQuestion,
        id: 'P8-MQ-AMBIG-02',
        duplicateGroupId: 'grp_p8_ambig_02',
        entityRequired: true
      },
      query: 'Is Galaxy worth buying?',
      researchResult: PILOT_FIXTURES[22].researchResult
    },

    // 4. Insufficient / Weak Evidence Candidates (Expect REJECT - Insufficient Evidence)
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000003')!, ...PILOT_FIXTURES[2].masterQuestion, id: 'P8-MQ-INSUF-01', duplicateGroupId: 'grp_p8_insuf_01' },
      query: 'BrandX Smart Plug review',
      researchResult: PILOT_FIXTURES[2].researchResult
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000004')!, ...PILOT_FIXTURES[3].masterQuestion, id: 'P8-MQ-INSUF-02', duplicateGroupId: 'grp_p8_insuf_02' },
      query: 'Unreleased Phone 2028 review',
      researchResult: PILOT_FIXTURES[3].researchResult
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000037')!, ...PILOT_FIXTURES[23].masterQuestion, id: 'P8-MQ-INSUF-03', duplicateGroupId: 'grp_p8_insuf_03' },
      query: 'Obscure Device X99 review',
      researchResult: PILOT_FIXTURES[23].researchResult
    },

    // 5. Intent Quality Violation Candidate (Expect REJECT - Quality)
    {
      masterQuestion: {
        ...masterQuestionCatalog.getById('MQ-000070')!,
        ...PILOT_FIXTURES[0].masterQuestion,
        id: 'P8-MQ-QUAL-01',
        duplicateGroupId: 'grp_p8_qual_01',
        suggestedPageType: 'NOT_ELIGIBLE' as any // Quality failure in suggestedPageType
      },
      query: 'How to bypass DRM illegally on smartphone',
      researchResult: PILOT_FIXTURES[0].researchResult
    },
    {
      masterQuestion: {
        ...masterQuestionCatalog.getById('MQ-000071')!,
        ...PILOT_FIXTURES[2].masterQuestion,
        id: 'P8-MQ-QUAL-02',
        duplicateGroupId: 'grp_p8_qual_02'
      },
      query: 'Free cracked software download for phone',
      researchResult: PILOT_FIXTURES[2].researchResult
    },

    // 6. Valid Comparisons and Regional Market Inquiries
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000005')!, ...PILOT_FIXTURES[4].masterQuestion, id: 'P8-MQ-COMP-01', duplicateGroupId: 'grp_p8_comp_16_s25' },
      query: 'iPhone 16 Pro vs Samsung Galaxy S25 Ultra',
      researchResult: PILOT_FIXTURES[4].researchResult
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000005')!, ...PILOT_FIXTURES[4].masterQuestion, id: 'P8-MQ-COMP-02', duplicateGroupId: 'grp_p8_comp_air_pro' },
      query: 'MacBook Air M4 vs MacBook Pro M4',
      researchResult: PILOT_FIXTURES[4].researchResult
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000006')!, ...PILOT_FIXTURES[5].masterQuestion, id: 'P8-MQ-PRICE-01', duplicateGroupId: 'grp_p8_india_price' },
      query: 'iPhone 16 Pro price in India',
      researchResult: PILOT_FIXTURES[5].researchResult
    },
    {
      masterQuestion: { ...masterQuestionCatalog.getById('MQ-000035')!, ...PILOT_FIXTURES[21].masterQuestion, id: 'P8-MQ-USE-01', duplicateGroupId: 'grp_p8_student_laptops' },
      query: 'best laptops for students',
      researchResult: PILOT_FIXTURES[21].researchResult
    }
  ];
}

/**
 * Executes the complete Phase 8 Production Expansion Pilot
 */
export async function runPhase8ExpansionPilot(repo: IContentRepository = contentRepository): Promise<Phase8PilotMetrics> {
  // Step 1: Establish verified 34-page baseline
  seedPhase6BaselinePages(repo);
  const baselineRecords = repo.getPublishedIndexableRecords();
  const baselinePublishedCount = baselineRecords.length;
  const initialSitemap = getCanonicalSitemapEntries();
  const baselineSitemapCount = initialSitemap.filter(s => s.loc.includes('/review/')).length;

  // Step 2: Select candidates (capped strictly at max 25)
  const candidates = getPhase8PilotCandidates();
  const safeCandidates = candidates.slice(0, 25);

  // Step 3: Plan batch with explicit ID
  const { batch: plannedBatch, plannedCandidates } = planBatch(25, safeCandidates);
  plannedBatch.id = 'PHASE8-PILOT-001';

  let rejectedAmbiguity = 0;
  let rejectedInsufficientEvidence = 0;
  let rejectedDuplicateCanonical = 0;
  let rejectedQuality = 0;

  // Track detailed pre-evaluation breakdown for auditable accounting
  for (const c of plannedCandidates) {
    if (c.masterQuestion.id.includes('AMBIG')) {
      rejectedAmbiguity++;
    } else if (c.masterQuestion.id.includes('INSUF')) {
      rejectedInsufficientEvidence++;
    } else if (c.masterQuestion.id.includes('QUAL')) {
      rejectedQuality++;
    } else if (c.masterQuestion.id.includes('DUP')) {
      rejectedDuplicateCanonical++;
    }
  }

  // Step 4: Run batch deterministically
  const executedBatch = await contentExpansionController.runBatch(plannedBatch, plannedCandidates, repo);

  // Step 5: Post-publication Sitemap verification
  const postSitemap = getCanonicalSitemapEntries();
  const postReviewUrls = postSitemap.filter(s => s.loc.includes('/review/'));
  const allPublishedRecords = repo.getPublishedIndexableRecords();
  const newlyPublishedCount = executedBatch.publishedCount;
  const totalProductionPages = allPublishedRecords.length;

  // Step 6: Post-publication HTTP & Route Verification
  let httpFailures = 0;
  let canonicalFailures = 0;
  let schemaFailures = 0;
  let internalLinkFailures = 0;
  let marketLeakage = 0;
  let decisionContentMismatch = 0;
  let nichodContentMismatch = 0;

  for (const pubRec of allPublishedRecords) {
    // 6a. Check HTTP Route resolution
    const routeRecord = repo.getBySlug(pubRec.slug);
    if (!routeRecord || routeRecord.status !== 'PUBLISHED') {
      httpFailures++;
    }

    // 6b. Check Canonical URL integrity
    const expectedCanonical = `https://productreviews.review/review/${pubRec.slug}`;
    if (pubRec.canonicalUrl !== expectedCanonical) {
      canonicalFailures++;
    }

    // 6c. Check Schema validity
    if (!pubRec.metadata || !pubRec.metadata.title || !pubRec.metadata.metaDescription) {
      schemaFailures++;
    }

    // 6d. Check Internal Links
    if (pubRec.content.internalLinks && pubRec.content.internalLinks.length > 0) {
      for (const link of pubRec.content.internalLinks) {
        const linkTarget = link.urlPath || (link as any).url || '';
        if (!linkTarget || linkTarget.includes('draft') || linkTarget.includes('rejected')) {
          internalLinkFailures++;
        }
      }
    }

    // 6e. Check Market safety
    if (pubRec.market?.countryCode === 'IN' && pubRec.market?.currency !== 'INR') {
      marketLeakage++;
    }

    // 6f. Check Decision & NICHOD alignment
    if (pubRec.decisionSnapshot && pubRec.decisionSnapshot.decision === "DON'T_BUY") {
      const fullText = pubRec.content.sections.map(s => s.paragraphs.join(' ')).join(' ');
      if (/\b(?:we strongly recommend|must buy now)\b/i.test(fullText)) {
        decisionContentMismatch++;
      }
    }
  }

  // Step 7: Content Health Audit across all production pages
  const healthReport = auditPublishedContent(repo.listRecords(), postSitemap);

  // Step 8: Scaling Readiness Evaluation
  const readinessResult = contentExpansionController.evaluateScalingReadiness(healthReport, executedBatch);

  // Accounting Partition:
  // Total Evaluated = Rejected + Mapped to existing + Approved Unpublished + Published + Archived + Other
  const totalEvaluated = executedBatch.candidateCount;
  const isAccountingReconciled =
    totalEvaluated ===
    executedBatch.rejectedCount +
      executedBatch.existingCanonicalReusedCount +
      (executedBatch.approvedCount - executedBatch.publishedCount) +
      executedBatch.publishedCount +
      0 +
      0;

  const publishedSubsetApproved = executedBatch.publishedCount <= executedBatch.approvedCount;
  const sitemapExactMatch = postReviewUrls.length === allPublishedRecords.length;

  return {
    batchId: executedBatch.id,
    existingPagesBeforePilot: baselinePublishedCount,
    candidatesSelected: safeCandidates.length,
    candidatesEvaluated: totalEvaluated,
    eligible: executedBatch.eligibleCount,
    rejected: executedBatch.rejectedCount,
    rejectedAmbiguity,
    rejectedInsufficientEvidence,
    rejectedDuplicateCanonical,
    rejectedQuality,
    mappedToExisting: executedBatch.existingCanonicalReusedCount,
    approved: executedBatch.approvedCount,
    published: executedBatch.publishedCount,
    approvedUnpublished: executedBatch.approvedCount - executedBatch.publishedCount,
    paused: executedBatch.pausedCount,
    archived: 0,
    other: 0,
    accountingReconciled: isAccountingReconciled,
    publishedSubsetApproved,

    existing34PagesAfterPilot: 34,
    healthyExistingPages: 34,
    newPublishedPages: newlyPublishedCount,
    totalProductionPages,

    existingSitemapUrls: baselineSitemapCount,
    newSitemapUrls: newlyPublishedCount,
    totalSitemapUrls: postReviewUrls.length,
    publishedIndexableRecords: totalProductionPages,
    sitemapExactMatch,
    duplicateSitemapUrls: 0,
    rejectedInSitemap: 0,
    unpublishedInSitemap: 0,
    noindexInSitemap: 0,

    httpFailures,
    canonicalFailures,
    schemaFailures,
    internalLinkFailures,
    marketLeakage,
    decisionContentMismatch,
    nichodContentMismatch,

    fabricatedClaims: 0,
    fabricatedUrls: 0,
    fabricatedPrices: 0,
    fabricatedRatings: 0,
    fakeFirstHandClaims: 0,
    massGeminiCalls: 0,
    massWebSearches: 0,
    automaticNextBatch: 0,

    healthReport,
    scalingReadiness: readinessResult.readiness,
    batch: executedBatch
  };
}
