/**
 * ProductReviews.review — Content Health Audit
 * Exhaustive production health validation across all published pages.
 * Categorical states only: NO numerical SEO/health scores.
 * Enforces NO automatic deletion; produces structured remediation recommendations.
 */

import { ContentRecord } from '../store/contentStoreTypes';
import {
  ContentHealthState,
  ContentRecordHealth,
  ContentHealthAuditReport,
  RemediationRecommendation
} from './contentHealthTypes';
import { SitemapUrlEntry } from '../../seo/sitemapGenerator';
import { BASE_CANONICAL_URL } from '../../seo/metaManager';
import { needsContentRefresh } from '../store/contentPublicationGates';

/**
 * Audits a single content record for production health and compliance
 */
export function auditContentRecord(
  record: ContentRecord,
  allPublishedRecords: ContentRecord[],
  sitemapEntries: SitemapUrlEntry[]
): ContentRecordHealth {
  const issues: string[] = [];
  const warnings: string[] = [];

  // 1. Entity Validity
  const entityValid = Boolean(
    record.entity &&
    !record.entity.isAmbiguous &&
    (record.entity.name || record.entity.brand || record.entity.category)
  );
  if (!entityValid) {
    issues.push('Missing or ambiguous product entity.');
  }

  // 2. Canonical Intent Validity
  const canonicalIntentValid = Boolean(record.canonicalIntentId && record.canonicalIntentId.length > 2);
  if (!canonicalIntentValid) {
    issues.push('Invalid or empty canonical intent ID.');
  }

  // 3. Page Type Validity
  const validPageTypes = [
    'PRODUCT_REVIEW', 'PRODUCT_RESEARCH', 'COMPARISON', 'BUYING_GUIDE',
    'ALTERNATIVE', 'PROBLEM_SOLUTION', 'USE_CASE', 'SPECIFICATION',
    'COMPATIBILITY', 'UPGRADE_GUIDE', 'GENERATION_COMPARISON', 'BRAND_RESEARCH'
  ];
  const pageTypeValid = validPageTypes.includes(record.pageType);
  if (!pageTypeValid) {
    issues.push(`Unrecognized page type ${record.pageType}.`);
  }

  // 4. Market Validity
  let marketValid = true;
  if (record.market?.countryCode && record.market.countryCode !== 'GLOBAL') {
    if (!record.market.hasLocalEvidence && record.market.localEvidenceCount === 0) {
      const fullText = record.content.sections.flatMap(s => [...s.paragraphs, ...(s.bullets || [])]).join(' ');
      if (record.market.currency && fullText.includes(record.market.currency)) {
        marketValid = false;
        issues.push(`Market leakage: local currency ${record.market.currency} claimed without local evidence.`);
      }
    }
  }

  // 5. Language Validity
  const languageValid = Boolean(record.language && record.language.length >= 2);
  if (!languageValid) {
    issues.push('Missing or invalid ISO language code.');
  }

  // 6. Evidence Snapshot Validity
  const evidenceSnapshotValid = Boolean(
    record.evidenceSnapshot &&
    record.evidenceSnapshot.evidencePointIds &&
    record.evidenceSnapshot.evidencePointIds.length > 0 &&
    record.evidenceSnapshot.capturedAt
  );
  if (!evidenceSnapshotValid) {
    issues.push('Missing or empty evidence snapshot.');
  }

  // 7. Freshness Validity
  const freshResult = needsContentRefresh(record);
  const freshnessValid = freshResult.freshnessState !== 'STALE';
  const staleContentRisk = freshResult.freshnessState === 'STALE';
  if (staleContentRisk) {
    warnings.push('Evidence is stale; refresh recommended.');
  }

  // 8. NICHOD Consistency
  let nichodConsistent = true;
  if (record.nichodSnapshot) {
    if (record.nichodSnapshot.status === 'INSUFFICIENT_EVIDENCE' && record.status === 'PUBLISHED') {
      nichodConsistent = false;
      issues.push('Published record contradicts NICHOD INSUFFICIENT_EVIDENCE status.');
    }
  }

  // 9. Decision Consistency
  let decisionConsistent = true;
  if (record.decisionSnapshot) {
    const fullText = record.content.sections.flatMap(s => [...s.paragraphs, ...(s.bullets || [])]).join(' ');
    if (record.decisionSnapshot.decision === "DON'T_BUY") {
      if (/\b(?:strongly recommend|must-buy|you should buy|great investment)\b/i.test(fullText)) {
        decisionConsistent = false;
        issues.push("Published content promotes purchasing despite DON'T_BUY verdict.");
      }
    }
    if (record.decisionSnapshot.decision === 'INSUFFICIENT_EVIDENCE' && record.status === 'PUBLISHED') {
      decisionConsistent = false;
      issues.push('Published record has INSUFFICIENT_EVIDENCE decision verdict.');
    }
  }

  // 10. Claim Provenance
  const factualClaims = record.content.claims.filter(c => c.statementType === 'FACTUAL');
  const claimProvenanceValid = factualClaims.every(c => c.evidencePointIds && c.evidencePointIds.length > 0 && !c.isUnsupported);
  if (!claimProvenanceValid) {
    issues.push('Detected factual statements lacking verified evidence point IDs.');
  }

  // 11. Source Integrity (Never invent URLs)
  let sourceIntegrityValid = true;
  const fullText = [
    record.title,
    record.content.introduction,
    ...record.content.sections.flatMap(s => [...s.paragraphs, ...(s.bullets || [])])
  ].join(' ');
  const rawUrls = fullText.match(/https?:\/\/[^\s"'<>]+/gi) || [];
  for (const url of rawUrls) {
    if (!url.startsWith(BASE_CANONICAL_URL) && !url.includes('amazon.') && !url.includes('wikipedia.org')) {
      sourceIntegrityValid = false;
      issues.push(`Unverified source URL embedded in content: ${url}`);
    }
  }

  // Check for fake testing claims or unsupported superlatives
  if (/\b(?:we tested in our lab|our hands-on lab test|our dedicated testing facility)\b/i.test(fullText)) {
    sourceIntegrityValid = false;
    issues.push('Fabricated first-person lab testing claims detected.');
  }
  if (/\b(?:world's best|#1 on earth|unbeatable perfection)\b/i.test(fullText)) {
    sourceIntegrityValid = false;
    issues.push('Unsupported superlatives detected in content.');
  }

  // 12. Canonical URL Validity
  const expectedPrefix = `${BASE_CANONICAL_URL}/review/`;
  const canonicalUrlValid = Boolean(
    record.canonicalUrl &&
    record.canonicalUrl.startsWith(expectedPrefix) &&
    record.canonicalUrl.endsWith(record.slug)
  );
  if (!canonicalUrlValid) {
    issues.push(`Canonical URL ${record.canonicalUrl} does not conform to canonical host or slug.`);
  }

  // 13. Slug Uniqueness
  const otherWithSameSlug = allPublishedRecords.filter(r => r.id !== record.id && r.slug === record.slug);
  const slugUnique = otherWithSameSlug.length === 0;
  if (!slugUnique) {
    issues.push(`Slug collision detected for "${record.slug}" across ${otherWithSameSlug.length} other records.`);
  }

  // 14. Metadata Validity
  const metadataValid = Boolean(
    record.metadata &&
    record.metadata.title &&
    record.metadata.metaDescription &&
    record.metadata.title.length >= 10 &&
    record.metadata.metaDescription.length >= 25
  );
  if (!metadataValid) {
    issues.push('Incomplete or missing SEO title and meta description.');
  }

  // 15. Schema Safety (No fabricated ratings or offers)
  let schemaSafe = true;
  if (record.schema) {
    for (const sd of record.schema) {
      if (sd.hasFabricatedRatings || sd.hasFabricatedOffers) {
        schemaSafe = false;
        issues.push('Structured data contains fabricated aggregate ratings or fake pricing offers.');
      }
    }
  }

  // 16. Breadcrumb Validity
  const breadcrumbValid = Boolean(record.title && (record.entity?.category || record.pageType));

  // 17. Internal Links
  const internalLinksValid = record.content.internalLinks.every(l => l.urlPath && l.urlPath.startsWith('/'));
  if (!internalLinksValid) {
    issues.push('Content contains invalid or non-root internal links.');
  }

  // 18. Affiliate Neutrality
  const affiliateNeutral = !record.content.sections.some(s =>
    s.paragraphs.some(p => /\b(?:buy now through our link to get discount|click our sponsor)\b/i.test(p))
  );
  if (!affiliateNeutral) {
    issues.push('Commercial bias: affiliate pressure language detected in review copy.');
  }

  // 19. AdSense Safety (No thin commercial doorway)
  const adsenseSafe = record.content.sections.length >= 2 && record.content.claims.length >= 2;
  if (!adsenseSafe) {
    issues.push('AdSense risk: thin content lacks substantive editorial value.');
  }

  // 20. Indexability & Sitemap Consistency
  const inSitemap = sitemapEntries.some(s => s.loc === record.canonicalUrl);
  let indexabilityConsistent = true;
  if (record.status === 'PUBLISHED' && record.indexability === 'INDEX_CANDIDATE') {
    if (!inSitemap) {
      indexabilityConsistent = false;
      issues.push('Published INDEX_CANDIDATE record is missing from canonical XML sitemap.');
    }
  } else {
    if (inSitemap) {
      indexabilityConsistent = false;
      issues.push(`Record with status ${record.status} and indexability ${record.indexability} is improperly exposed in sitemap.`);
    }
  }

  // 21. Duplicate / Cannibalization Risk
  const otherWithSameIntent = allPublishedRecords.filter(
    r => r.id !== record.id &&
    r.canonicalIntentId === record.canonicalIntentId &&
    r.market?.countryCode === record.market?.countryCode &&
    r.content.entity?.useCase === record.content.entity?.useCase
  );
  const duplicateRisk = otherWithSameIntent.length > 0;
  if (duplicateRisk) {
    issues.push(`Canonical intent collision: duplicate publication for intent "${record.canonicalIntentId}".`);
  }

  // 22. Thin Content Risk
  const thinContentRisk = record.content.sections.length < 2 || record.content.claims.length < 2;
  if (thinContentRisk && !issues.some(i => i.includes('thin content'))) {
    issues.push('Thin content risk: insufficient substantive sections or claims.');
  }

  // Compute Categorical Health State & Remediation
  let healthState: ContentHealthState = 'HEALTHY';
  let remediation: RemediationRecommendation = 'KEEP';

  if (!canonicalUrlValid || !slugUnique) {
    healthState = 'CANONICAL_ISSUE';
    remediation = 'REVIEW_CANONICAL';
  } else if (!indexabilityConsistent) {
    healthState = 'INDEXABILITY_ISSUE';
    remediation = 'REVIEW_INDEXABILITY';
  } else if (!claimProvenanceValid || !sourceIntegrityValid || !evidenceSnapshotValid || !marketValid) {
    healthState = 'EVIDENCE_ISSUE';
    remediation = 'REFRESH_EVIDENCE';
  } else if (duplicateRisk) {
    healthState = 'DUPLICATE_RISK';
    remediation = 'MERGE_WITH_CANONICAL';
  } else if (staleContentRisk) {
    healthState = 'STALE';
    remediation = 'REFRESH_EVIDENCE';
  } else if (!nichodConsistent || !decisionConsistent || !schemaSafe || !metadataValid || thinContentRisk) {
    healthState = 'CONTENT_ISSUE';
    remediation = 'REGENERATE_CONTENT';
  } else if (warnings.length > 0) {
    healthState = 'REVIEW_RECOMMENDED';
    remediation = 'MANUAL_REVIEW';
  }

  return {
    recordId: record.id,
    slug: record.slug,
    canonicalUrl: record.canonicalUrl,
    status: record.status,
    healthState,
    remediation,
    issues,
    warnings,
    checks: {
      entityValid,
      canonicalIntentValid,
      pageTypeValid,
      marketValid,
      languageValid,
      evidenceSnapshotValid,
      freshnessValid,
      nichodConsistent,
      decisionConsistent,
      claimProvenanceValid,
      sourceIntegrityValid,
      canonicalUrlValid,
      slugUnique,
      metadataValid,
      schemaSafe,
      breadcrumbValid,
      internalLinksValid,
      affiliateNeutral,
      adsenseSafe,
      indexabilityConsistent,
      sitemapIncluded: inSitemap,
      duplicateRisk,
      thinContentRisk,
      staleContentRisk
    },
    auditedAt: new Date().toISOString()
  };
}

/**
 * Runs complete production content audit on a collection of published records
 */
export function auditPublishedContent(
  records: ContentRecord[],
  sitemapEntries: SitemapUrlEntry[]
): ContentHealthAuditReport {
  const published = records.filter(r => r.status === 'PUBLISHED');
  const recordAudits = published.map(r => auditContentRecord(r, published, sitemapEntries));

  let healthy = 0;
  let reviewRecommended = 0;
  let stale = 0;
  let evidenceIssue = 0;
  let canonicalIssue = 0;
  let duplicateRisk = 0;
  let indexabilityIssue = 0;
  let contentIssue = 0;
  let criticalIssues = 0;

  for (const a of recordAudits) {
    switch (a.healthState) {
      case 'HEALTHY':
        healthy++;
        break;
      case 'REVIEW_RECOMMENDED':
        reviewRecommended++;
        break;
      case 'STALE':
        stale++;
        break;
      case 'EVIDENCE_ISSUE':
        evidenceIssue++;
        criticalIssues++;
        break;
      case 'CANONICAL_ISSUE':
        canonicalIssue++;
        criticalIssues++;
        break;
      case 'DUPLICATE_RISK':
        duplicateRisk++;
        criticalIssues++;
        break;
      case 'INDEXABILITY_ISSUE':
        indexabilityIssue++;
        criticalIssues++;
        break;
      case 'CONTENT_ISSUE':
        contentIssue++;
        criticalIssues++;
        break;
    }
  }

  // Check overall sitemap consistency: all published records with INDEX_CANDIDATE must be in sitemap,
  // and no unpublished or NOINDEX record can be in sitemap.
  const sitemapReviewUrls = sitemapEntries.map(s => s.loc).filter(loc => loc.includes('/review/'));
  const publishedIndexableUrls = published
    .filter(r => r.indexability === 'INDEX_CANDIDATE')
    .map(r => r.canonicalUrl);

  const uniqueSitemap = new Set(sitemapReviewUrls);
  const sitemapConsistency = (
    sitemapReviewUrls.length === uniqueSitemap.size &&
    sitemapReviewUrls.length === publishedIndexableUrls.length &&
    publishedIndexableUrls.every(url => uniqueSitemap.has(url))
  ) ? 'PASS' : 'FAIL';

  return {
    totalPublished: published.length,
    healthy,
    reviewRecommended,
    stale,
    evidenceIssue,
    canonicalIssue,
    duplicateRisk,
    indexabilityIssue,
    contentIssue,
    criticalIssues,
    sitemapConsistency,
    records: recordAudits,
    generatedAt: new Date().toISOString()
  };
}
