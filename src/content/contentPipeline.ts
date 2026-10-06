/**
 * ProductReviews.review — Content Pipeline Orchestrator
 * Connects Question -> Context -> Research -> Eligibility -> Synthesizer -> Quality Gate.
 * Strict non-automatic publication: outputs candidate objects without sitemap or routing mutation.
 */

import { MasterQuestion } from '../questions/masterQuestionTypes';
import { ResolvedQuestionContext, resolveQuestionContext } from '../questions/context';
import { ResearchResult } from '../types';
import { resolvePageEligibility } from '../questions/eligibility';
import { SynthesizedContent, ContentQualityValidationResult } from './contentTypes';
import { synthesizeContent } from './contentSynthesizer';
import { validateSynthesizedContent } from './contentQualityGate';

export interface ContentPipelineResult {
  content: SynthesizedContent;
  validation: ContentQualityValidationResult;
  isPublicationCandidate: boolean;
}

/**
 * Executes end-to-end evidence-backed content pipeline for a question
 */
export function executeContentPipeline(
  masterQuestion: MasterQuestion,
  query: string,
  researchResult: ResearchResult,
  resolvedContextOverride?: ResolvedQuestionContext
): ContentPipelineResult {
  // 1. Resolve multi-dimensional question context
  const resolvedContext = resolvedContextOverride || resolveQuestionContext(masterQuestion, query);

  // 2. Resolve Page Eligibility
  const eligibility = resolvePageEligibility(masterQuestion, resolvedContext, researchResult);

  // 3. Synthesize Evidence-Backed Content
  const content = synthesizeContent(masterQuestion, resolvedContext, researchResult, eligibility);

  // 4. Execute Content Quality Gate
  const validation = validateSynthesizedContent(content, researchResult, eligibility);

  // Update content status based on validation
  content.contentStatus = validation.status;
  content.lastValidatedAt = new Date().toISOString();

  const isPublicationCandidate = validation.passed && validation.status === 'READY_FOR_PUBLICATION';

  return {
    content,
    validation,
    isPublicationCandidate
  };
}
