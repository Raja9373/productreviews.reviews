/**
 * ProductReviews.review — Content Synthesizer Engine
 * Deterministically constructs evidence-backed ContentSections, FAQs, and internal links
 * following the authoritative NICHOD and Decision Engine results.
 */

import { MasterQuestion } from '../questions/masterQuestionTypes';
import { ResolvedQuestionContext } from '../questions/context';
import { ResearchResult, DecisionEngineResult, NichodResult, SourceStatus } from '../types';
import { PageEligibilityResult } from '../questions/eligibility/eligibilityTypes';
import {
  SynthesizedContent,
  ContentSection,
  ContentClaim,
  ContentInternalLink,
  ContentEntityMetadata,
  ContentMarketMetadata,
  ContentComparisonMetadata,
  ContentMetadataState
} from './contentTypes';
import { mapEvidenceToClaims, partitionClaimsByMarket } from './contentEvidenceMapper';
import { generateContentTitle, generateMetaDescription, generateStructuredData } from './contentMetadata';
import { BASE_CANONICAL_URL } from '../seo/metaManager';

export interface SynthesizeContentOptions {
  customVersion?: number;
}

/**
 * Deterministically synthesizes evidence-backed content for an eligible or candidate question
 */
export function synthesizeContent(
  masterQuestion: MasterQuestion,
  resolvedContext: ResolvedQuestionContext,
  researchResult: ResearchResult,
  eligibility: PageEligibilityResult,
  options: SynthesizeContentOptions = {}
): SynthesizedContent {
  const generatedAt = new Date().toISOString();
  const version = options.customVersion || 1;

  const claims = mapEvidenceToClaims(researchResult.evidencePoints || []);
  const decision = researchResult.decision;
  const nichod = researchResult.nichod;

  const targetCountry = resolvedContext.market?.countryCode || 'GLOBAL';
  const hasLocalEv = researchResult.localEvidenceAvailable ?? false;
  const { localClaims, globalClaims } = partitionClaimsByMarket(claims, targetCountry);

  // 1. Entity & Comparison metadata
  const entityMeta: ContentEntityMetadata = {
    name: resolvedContext.entity.entityName,
    brand: resolvedContext.entity.brand,
    category: resolvedContext.entity.productCategory || masterQuestion.productCategory,
    model: resolvedContext.entity.model,
    generation: resolvedContext.entity.generation,
    variant: resolvedContext.entity.variant,
    sku: resolvedContext.entity.sku,
    useCase: resolvedContext.useCase || masterQuestion.useCase,
    isAmbiguous: resolvedContext.entity.bindingStatus === 'AMBIGUOUS'
  };

  const comparisonMeta: ContentComparisonMetadata = {
    entityAName: resolvedContext.entity.entityName,
    entityBName: resolvedContext.comparisonEntity?.entityName,
    isComparisonComplete: Boolean(resolvedContext.isComparison && resolvedContext.entity.entityName && resolvedContext.comparisonEntity?.entityName),
    entityAEvidenceIds: claims.filter(c => c.text.toLowerCase().includes(resolvedContext.entity.entityName?.toLowerCase() || '')).map(c => c.evidencePointIds[0]),
    entityBEvidenceIds: claims.filter(c => resolvedContext.comparisonEntity?.entityName && c.text.toLowerCase().includes(resolvedContext.comparisonEntity.entityName.toLowerCase())).map(c => c.evidencePointIds[0])
  };

  const marketMeta: ContentMarketMetadata = {
    countryCode: targetCountry,
    language: resolvedContext.language?.languageCode || 'en',
    currency: resolvedContext.currency?.currencyCode || 'USD',
    hasLocalEvidence: hasLocalEv,
    localEvidenceCount: localClaims.length
  };

  // 2. Sections construction based on PageType and Evidence
  const sections: ContentSection[] = [];

  // Section 1: Executive Verdict & Decision
  if (decision) {
    const decisionParagraphs: string[] = [
      `Authoritative assessment for "${resolvedContext.entity.entityName || masterQuestion.question}": ${decision.headline}.`,
      decision.rationale
    ];
    if (decision.conditions && decision.conditions.length > 0) {
      decisionParagraphs.push(`Purchase conditions: ${decision.conditions.join('; ')}`);
    }

    sections.push({
      id: 'sec_decision',
      heading: 'Executive Verdict & Recommendation',
      paragraphs: decisionParagraphs,
      bullets: decision.conditions.length > 0 ? decision.conditions : undefined,
      evidencePointIds: claims.slice(0, 3).map(c => c.evidencePointIds[0]),
      sourceIds: claims.slice(0, 3).flatMap(c => c.sourceIds),
      claims: claims.slice(0, 3),
      contentType: 'DECISION'
    });
  }

  // Section 2: Verified Strengths (NICHOD / Positive claims)
  let positiveClaims = claims.filter(c => c.statementType === 'FACTUAL' && (nichod?.strengths?.some(s => s.toLowerCase().includes(c.text.toLowerCase())) || c.aspect === 'strength'));
  if (positiveClaims.length === 0 && claims.length > 0) {
    positiveClaims = claims.filter(c => c.statementType === 'FACTUAL').slice(0, 3);
  }
  const strengthBullets = (nichod?.strengths && nichod.strengths.length > 0)
    ? nichod.strengths
    : positiveClaims.map(c => c.text);

  if (strengthBullets.length > 0) {
    sections.push({
      id: 'sec_strengths',
      heading: 'Verified Strengths & Empirical Findings',
      paragraphs: ['Based on structured test benchmarks and verified evidence, the following strengths were established:'],
      bullets: strengthBullets,
      evidencePointIds: positiveClaims.map(c => c.evidencePointIds[0]).filter(Boolean),
      sourceIds: positiveClaims.flatMap(c => c.sourceIds),
      claims: positiveClaims,
      contentType: 'FACT'
    });
  }

  // Section 3: Key Weaknesses & Trade-Offs
  let negativeClaims = claims.filter(c => c.statementType === 'FACTUAL' && (nichod?.weaknesses?.some(w => w.toLowerCase().includes(c.text.toLowerCase())) || c.aspect === 'weakness'));
  if (negativeClaims.length === 0 && claims.length > 3) {
    negativeClaims = claims.filter(c => c.statementType === 'FACTUAL').slice(3, 6);
  } else if (negativeClaims.length === 0 && claims.length > 0) {
    negativeClaims = claims.slice(0, 2);
  }
  const weaknessBullets = (nichod?.weaknesses && nichod.weaknesses.length > 0)
    ? nichod.weaknesses
    : negativeClaims.map(c => c.text);

  if (weaknessBullets.length > 0 || (nichod?.tradeoffs && nichod.tradeoffs.length > 0)) {
    sections.push({
      id: 'sec_weaknesses',
      heading: 'Key Weaknesses, Trade-Offs & Potential Dealbreakers',
      paragraphs: ['Critical examination of empirical limitations and consumer trade-offs reveals the following:'],
      bullets: [...weaknessBullets, ...(nichod?.tradeoffs || [])],
      evidencePointIds: negativeClaims.map(c => c.evidencePointIds[0]).filter(Boolean),
      sourceIds: negativeClaims.flatMap(c => c.sourceIds),
      claims: negativeClaims,
      contentType: 'TRADEOFF'
    });
  }

  // Section 4: Target Suitability (Who Should Buy / Who Should Avoid)
  if (nichod?.suitableFor || nichod?.notSuitableFor) {
    sections.push({
      id: 'sec_suitability',
      heading: 'Audience Suitability & Workload Fit',
      paragraphs: [
        'Consumer purchasing decisions depend heavily on specific workload profiles and usage patterns.'
      ],
      bullets: [
        ...(nichod.suitableFor?.map(s => `Suits: ${s}`) || []),
        ...(nichod.notSuitableFor?.map(s => `Avoid if: ${s}`) || [])
      ],
      evidencePointIds: claims.slice(0, 2).map(c => c.evidencePointIds[0]).filter(Boolean),
      sourceIds: [],
      claims: [],
      contentType: 'SYNTHESIS'
    });
  }

  // Section 5: Contradiction Analysis
  const contradictions = nichod?.contradictions || [];
  if (contradictions.length > 0) {
    sections.push({
      id: 'sec_contradictions',
      heading: 'Contradiction Analysis & Conflicting Evidence',
      paragraphs: ['The research identified divergent findings across testing methodologies:'],
      bullets: contradictions.map(c => `Aspect: ${c.aspect} — View A: "${c.viewA}" (${c.sourceA}) vs View B: "${c.viewB}" (${c.sourceB})`),
      evidencePointIds: [],
      sourceIds: contradictions.flatMap(c => [c.sourceA, c.sourceB]),
      claims: [],
      contentType: 'TRADEOFF'
    });
  }

  // Section 6: Market Context & Local Evidence
  if (targetCountry !== 'GLOBAL') {
    const marketParagraphs: string[] = [];
    if (hasLocalEv && localClaims.length > 0) {
      marketParagraphs.push(`Market assessment for ${targetCountry}: Local pricing, retailer presence, and warranty terms are verified.`);
      marketParagraphs.push(...localClaims.map(c => c.text));
    } else {
      marketParagraphs.push(`Market assessment for ${targetCountry}: Localized pricing, regional warranty, and retailer stock have not been independently verified. Global findings apply for hardware specifications.`);
    }

    sections.push({
      id: 'sec_market_context',
      heading: `Market Context (${targetCountry})`,
      paragraphs: marketParagraphs,
      bullets: hasLocalEv ? localClaims.map(c => c.text) : undefined,
      evidencePointIds: localClaims.map(c => c.evidencePointIds[0]),
      sourceIds: localClaims.flatMap(c => c.sourceIds),
      claims: localClaims,
      contentType: 'FACT'
    });
  }

  // Section 7: Missing Information & Research Limitations
  const missingInfo = (nichod?.missingInformation && nichod.missingInformation.length > 0)
    ? nichod.missingInformation
    : (researchResult.missingMarketEvidence || []);

  if (missingInfo.length > 0) {
    sections.push({
      id: 'sec_limitations',
      heading: 'Research Limitations & Unverified Aspects',
      paragraphs: ['To maintain strict analytical transparency, the following parameters remain unverified:'],
      bullets: missingInfo,
      evidencePointIds: [],
      sourceIds: [],
      claims: [],
      contentType: 'LIMITATION'
    });
  }

  // 3. FAQs Generation (Evidence-backed only, max 3)
  const faqs: Array<{ question: string; answer: string; evidencePointIds: string[] }> = [];
  if (entityMeta.name && positiveClaims.length > 0) {
    faqs.push({
      question: `Is ${entityMeta.name} worth buying?`,
      answer: decision?.rationale || 'Refer to the executive verdict for full empirical trade-offs.',
      evidencePointIds: positiveClaims.slice(0, 2).map(c => c.evidencePointIds[0])
    });
  }
  if (entityMeta.name && negativeClaims.length > 0) {
    faqs.push({
      question: `What are the main drawbacks of ${entityMeta.name}?`,
      answer: negativeClaims.slice(0, 2).map(c => c.text).join(' Additionally, '),
      evidencePointIds: negativeClaims.slice(0, 2).map(c => c.evidencePointIds[0])
    });
  }

  // 4. Internal Link Recommendations (Valid future candidates, non-broken)
  const internalLinks: ContentInternalLink[] = [];
  if (entityMeta.category) {
    internalLinks.push({
      title: `Best ${entityMeta.category} Guide`,
      urlPath: `/#/${entityMeta.category}`,
      linkType: 'CATEGORY',
      targetIntent: 'BUYING_GUIDE',
      isAvailable: true
    });
  }
  if (entityMeta.name) {
    internalLinks.push({
      title: `Reported Issues for ${entityMeta.name}`,
      urlPath: `/#/search?q=${encodeURIComponent(entityMeta.name + ' problems')}`,
      linkType: 'PROBLEM',
      targetIntent: 'PROBLEM_SOLUTION',
      isAvailable: true
    });
  }

  // 5. Title & Metadata
  const rawTitle = generateContentTitle({
    entity: entityMeta,
    comparison: comparisonMeta,
    market: marketMeta,
    pageType: eligibility.pageType,
    title: masterQuestion.question
  });

  const rawMetaDesc = generateMetaDescription({
    entity: entityMeta,
    comparison: comparisonMeta,
    market: marketMeta,
    pageType: eligibility.pageType,
    decision
  });

  const metadata: ContentMetadataState = {
    title: rawTitle,
    metaDescription: rawMetaDesc,
    canonicalUrl: `${BASE_CANONICAL_URL}/`,
    robots: eligibility.indexability === 'ELIGIBLE_CANDIDATE' ? 'index, follow' : 'noindex, follow',
    ogTitle: rawTitle,
    ogDescription: rawMetaDesc,
    ogType: eligibility.pageType === 'PRODUCT_REVIEW' ? 'article' : 'website',
    isSafeForIndex: eligibility.indexability === 'ELIGIBLE_CANDIDATE',
    rejectionReasons: []
  };

  const structuredData = generateStructuredData({
    title: rawTitle,
    metadata,
    market: marketMeta,
    entity: entityMeta,
    faqs,
    generatedAt
  });

  return {
    questionId: masterQuestion.id,
    canonicalIntentId: masterQuestion.duplicateGroupId,
    intentClusterId: eligibility.intentClusterId,
    intentType: eligibility.contentIntent,
    pageType: eligibility.pageType,
    entity: entityMeta,
    comparison: comparisonMeta,
    market: marketMeta,
    title: rawTitle,
    introduction: `Comprehensive empirical evidence synthesis for ${entityMeta.name || masterQuestion.question}. Analyzed across verified laboratory tests, user feedback, and market constraints.`,
    sections,
    claims,
    nichod,
    decision,
    evidenceReferences: claims.flatMap(c => c.evidencePointIds),
    contradictions: contradictions.map(c => `${c.aspect}: ${c.viewA} vs ${c.viewB}`),
    missingInformation: missingInfo,
    limitations: researchResult.researchLimitations || nichod?.limitations || [],
    faqs,
    internalLinks,
    metadata,
    structuredData,
    contentStatus: eligibility.indexability === 'ELIGIBLE_CANDIDATE' ? 'READY_FOR_PUBLICATION' : 'QUALITY_REVIEW',
    indexability: eligibility.indexability,
    evidenceSnapshot: {
      totalPoints: researchResult.evidencePoints?.length || 0,
      factualPoints: claims.filter(c => c.statementType === 'FACTUAL').length,
      localPoints: localClaims.length,
      globalPoints: globalClaims.length,
      hasStructuredSources: researchResult.sourceStatus === SourceStatus.STRUCTURED
    },
    contentVersion: version,
    generatedAt,
    lastValidatedAt: generatedAt,
    refreshReadiness: {
      isRefreshNeeded: false,
      refreshReasons: [],
      priceSensitive: eligibility.contentIntent === 'PRICE_VALUE' || eligibility.pageType === 'PRODUCT_REVIEW',
      availabilitySensitive: eligibility.contentIntent === 'AVAILABILITY'
    }
  };
}
