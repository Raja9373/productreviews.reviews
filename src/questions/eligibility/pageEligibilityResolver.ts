/**
 * ProductReviews.review — SEO Page Eligibility Resolver
 * Evaluates whether a Master Question and research evidence are worthy of becoming an indexable page.
 * Guarantees zero automatic indexation, zero URL fabrication, and strict thin-content defense.
 */

import { MasterQuestion } from '../masterQuestionTypes';
import { ResolvedQuestionContext } from '../context';
import { ResearchResult, DecisionEngineResult } from '../../types';
import {
  PageEligibilityResult,
  SeoEligibilityStatus,
  MetadataReadiness,
  LocalizationReadinessState
} from './eligibilityTypes';
import { classifyContentIntent } from './contentIntentClassifier';
import { mapIntentToPageType } from './pageTypeMapper';
import { detectIntentCluster } from './duplicateClusterDetector';
import { evaluatePageValue } from './pageValueTester';
import { assessContentQuality } from './contentQualityModel';
import { getContentBlueprint } from './contentBlueprints';

export interface ResolvePageEligibilityOptions {
  customResearchResult?: ResearchResult;
  customDecision?: DecisionEngineResult;
}

/**
 * Resolves comprehensive SEO page eligibility for a master question and context
 */
export function resolvePageEligibility(
  masterQuestion: MasterQuestion,
  resolvedContext?: ResolvedQuestionContext,
  researchResult?: ResearchResult,
  decisionResult?: DecisionEngineResult,
  options: ResolvePageEligibilityOptions = {}
): PageEligibilityResult {
  const activeResearch = options.customResearchResult || researchResult;
  const activeDecision = options.customDecision || decisionResult;

  // 1. Content Intent Classification
  const contentIntent = classifyContentIntent(masterQuestion, resolvedContext?.query || resolvedContext?.questionId);

  // 2. Page Type & Entity Requirement Mapping
  const { pageType, entityRequirement, canBeStandalone, rationale: pageTypeRationale } = mapIntentToPageType(
    contentIntent,
    masterQuestion
  );

  // 3. Duplicate & Intent Cluster Detection
  const entityCategory = masterQuestion.productCategory || resolvedContext?.entity.productCategory || 'global';
  const clusterResult = detectIntentCluster(
    masterQuestion.question,
    entityCategory,
    resolvedContext?.useCase || masterQuestion.useCase,
    masterQuestion.id
  );

  // 4. Entity Status Inspection
  const isAmbiguous = resolvedContext?.entity.bindingStatus === 'AMBIGUOUS';
  const isEntityBound = resolvedContext?.entity.bindingStatus === 'BOUND';
  const isEntityClear = entityRequirement === 'NONE' || (isEntityBound && !isAmbiguous);

  // For comparisons, both A and B must be resolved
  const isComparisonClear = !resolvedContext?.isComparison || (
    isEntityBound &&
    resolvedContext?.comparisonEntity?.bindingStatus === 'BOUND' &&
    resolvedContext.entity.entityName !== resolvedContext.comparisonEntity.entityName
  );

  // 5. Page Value Evaluation
  const hasUseCase = Boolean(resolvedContext?.useCase && resolvedContext.useCase !== 'general');
  const { pageValue, valueRationale } = evaluatePageValue(
    contentIntent,
    entityRequirement,
    isEntityBound,
    isAmbiguous,
    hasUseCase
  );

  // 6. Content Quality Assessment
  const targetCountry = resolvedContext?.market.countryCode || 'GLOBAL';
  const qualityAssessment = assessContentQuality(
    isEntityClear && isComparisonClear,
    true,
    targetCountry,
    activeResearch
  );

  // 7. Localization Readiness
  let localizationReadiness: LocalizationReadinessState = 'MASTER_ONLY';
  if (resolvedContext?.localization.localizationStatus === 'READY_FOR_LOCALIZATION') {
    localizationReadiness = qualityAssessment.marketReadiness === 'READY' ? 'READY' : 'INSUFFICIENT';
  }

  // 8. Strict Eligibility Determination (Hard NOINDEX Gates)
  let indexability: SeoEligibilityStatus = 'NOT_ELIGIBLE';
  const reasons: string[] = [];
  const missingRequirements: string[] = [];

  // Hard NOINDEX Condition 1: Ambiguity or Missing Required Entity
  if (isAmbiguous) {
    reasons.push('Hard NOINDEX: Unresolved entity ambiguity prevents standalone page indexing.');
    missingRequirements.push('Unambiguous product model resolution');
  } else if (entityRequirement === 'ONE' && !isEntityBound) {
    reasons.push('Hard NOINDEX: Missing required concrete product entity.');
    missingRequirements.push('Concrete product entity');
  } else if (entityRequirement === 'TWO_OR_MORE' && !isComparisonClear) {
    reasons.push('Hard NOINDEX: Comparison missing one or both distinct product models.');
    missingRequirements.push('Two verified distinct comparison entities');
  }

  // Hard NOINDEX Condition 2: Insufficient Evidence or Unsupported Quality
  if (qualityAssessment.qualityState === 'INSUFFICIENT' || qualityAssessment.qualityState === 'UNSUPPORTED') {
    reasons.push('Hard NOINDEX: Substantive factual evidence is insufficient to justify a dedicated page.');
    missingRequirements.push('Minimum substantive verified research claims');
  }

  // Hard NOINDEX Condition 3: No Standalone Value (Thin Content Defense)
  if (pageValue === 'NO_STANDALONE_VALUE') {
    reasons.push('Hard NOINDEX: Query produces thin content without standalone consumer value.');
  }

  // Hard NOINDEX Condition 4: Missing Critical Local Evidence on Local Query
  if (targetCountry !== 'GLOBAL' && qualityAssessment.marketReadiness === 'INSUFFICIENT') {
    reasons.push(`Hard NOINDEX: Local market evidence for ${targetCountry} is missing.`);
    missingRequirements.push(`Local market evidence for ${targetCountry}`);
  }

  // Determine Final State
  if (reasons.length === 0 && canBeStandalone && (pageValue === 'HIGH_VALUE' || pageValue === 'USEFUL')) {
    if (qualityAssessment.qualityState === 'EXCELLENT' || qualityAssessment.qualityState === 'GOOD') {
      indexability = 'ELIGIBLE_CANDIDATE';
      reasons.push('All content quality, evidence readiness, and entity requirements satisfied.');
    } else {
      indexability = 'CONDITIONAL';
      reasons.push('Conditionally eligible pending additional research grounding.');
    }
  } else if (reasons.length > 0 && qualityAssessment.qualityState !== 'INSUFFICIENT' && !isAmbiguous) {
    indexability = 'CONDITIONAL';
  } else {
    indexability = 'NOT_ELIGIBLE';
  }

  // 9. Metadata Readiness
  const isEligible = indexability === 'ELIGIBLE_CANDIDATE';
  const metadataReadiness: MetadataReadiness = {
    titleReady: isEntityClear,
    descriptionReady: isEntityClear,
    canonicalReady: isEligible && clusterResult.duplicateStatus !== 'DUPLICATE',
    breadcrumbReady: isEntityClear,
    schemaReady: isEligible && isEntityBound && (activeResearch?.evidencePoints?.length || 0) >= 3,
    contentReady: isEligible,
    evidenceReady: qualityAssessment.evidenceReadiness === 'READY',
    localizationReady: localizationReadiness === 'READY' || localizationReadiness === 'MASTER_ONLY'
  };

  // 10. Content Blueprint
  const blueprint = isEligible || indexability === 'CONDITIONAL' ? getContentBlueprint(pageType) : [];

  return {
    questionId: masterQuestion.id,
    canonicalIntentId: clusterResult.canonicalIntentId,
    intentClusterId: clusterResult.intentClusterId,
    duplicateStatus: clusterResult.duplicateStatus,
    contentIntent,
    pageType,
    entityRequirement,
    contentQuality: qualityAssessment.qualityState,
    pageValue,
    evidenceReadiness: qualityAssessment.evidenceReadiness,
    marketReadiness: qualityAssessment.marketReadiness,
    localizationReadiness,
    indexability,
    commercialIntent: masterQuestion.commercialIntent,
    metadataReadiness,
    reasons,
    missingRequirements,
    contentBlueprint: blueprint
  };
}
