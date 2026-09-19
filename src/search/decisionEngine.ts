import { DecisionEngineResult, NichodResult, Confidence } from '../types';

export function makeDecision(nichod: NichodResult): DecisionEngineResult {
  // Conservative safety check: Block decision if evidence is insufficient
  const isInsufficient = 
    nichod.evidenceStrength === 'INSUFFICIENT' || 
    nichod.relevantClaimCount === 0 ||
    nichod.contradictions.length > 2;

  // Decision criteria based on factors, not just counts
  if (isInsufficient) {
    return {
      query: nichod.query,
      decision: 'INSUFFICIENT_EVIDENCE',
      headline: 'Decision cannot be made confidently',
      rationale: 'Available evidence is insufficient, contradictory, or lacks factual basis to support a reliable decision.',
      supportingFactors: nichod.keyPositives,
      concerns: [...nichod.keyNegatives, ...nichod.mixedOrUncertain],
      conditions: [],
      uncertainty: ['Research data is not conclusive for this query'],
      evidenceStrength: nichod.evidenceStrength,
      confidence: Confidence.LOW,
      evidenceCount: nichod.evidenceCount,
      relevantClaimCount: nichod.relevantClaimCount,
      contradictionCount: nichod.contradictions.length,
      sourceStatus: nichod.sourceStatus,
      limitations: nichod.limitations,
    };
  }

  // DON'T_BUY: Requires significant factual negative evidence
  if (nichod.keyNegatives.length > 0) {
    const hasIncompatibility = nichod.keyNegatives.some(neg => 
      neg.toLowerCase().includes('incompatible') || 
      (neg.toLowerCase().includes('price') && neg.toLowerCase().includes('budget')) ||
      neg.toLowerCase().includes('ram') ||
      neg.toLowerCase().includes('us dollar')
    );

    if (hasIncompatibility) {
      return {
        query: nichod.query,
        decision: 'DON\'T_BUY',
        headline: 'Decision: DON\'T BUY',
        rationale: 'Significant documented limitations or negative signals indicate incompatibility with requirements.',
        supportingFactors: nichod.keyPositives,
        concerns: nichod.keyNegatives,
        conditions: [],
        uncertainty: nichod.missingInformation,
        evidenceStrength: nichod.evidenceStrength,
        confidence: Confidence.HIGH,
        evidenceCount: nichod.evidenceCount,
        relevantClaimCount: nichod.relevantClaimCount,
        contradictionCount: nichod.contradictions.length,
        sourceStatus: nichod.sourceStatus,
        limitations: nichod.limitations,
      };
    }
  }

  // BUY_IF: Generally supportive but has conditions
  if (
    (nichod.missingInformation.length > 0 || nichod.mixedOrUncertain.length > 0 || nichod.keyNegatives.length > 0) &&
    nichod.keyPositives.length > 0
  ) {
    return {
      query: nichod.query,
      decision: 'BUY_IF',
      headline: 'Decision: BUY IF specific conditions are met',
      rationale: 'Evidence is generally supportive, but clarification on missing information or conditions is required.',
      supportingFactors: nichod.keyPositives,
      concerns: nichod.keyNegatives,
      conditions: nichod.missingInformation.length > 0 ? nichod.missingInformation : ['Clarify mixed signals'],
      uncertainty: [...nichod.mixedOrUncertain, ...nichod.missingInformation],
      evidenceStrength: nichod.evidenceStrength,
      confidence: Confidence.MEDIUM,
      evidenceCount: nichod.evidenceCount,
      relevantClaimCount: nichod.relevantClaimCount,
      contradictionCount: nichod.contradictions.length,
      sourceStatus: nichod.sourceStatus,
      limitations: nichod.limitations,
    };
  }

  // BUY: Strong supporting evidence
  if (nichod.evidenceStrength === 'STRONG' && nichod.relevantClaimCount >= 2 && nichod.contradictions.length === 0) {
    return {
      query: nichod.query,
      decision: 'BUY',
      headline: 'Decision: BUY',
      rationale: 'Strong evidence supports this product for the stated use case.',
      supportingFactors: nichod.keyPositives,
      concerns: [],
      conditions: [],
      uncertainty: [],
      evidenceStrength: nichod.evidenceStrength,
      confidence: Confidence.HIGH,
      evidenceCount: nichod.evidenceCount,
      relevantClaimCount: nichod.relevantClaimCount,
      contradictionCount: nichod.contradictions.length,
      sourceStatus: nichod.sourceStatus,
      limitations: nichod.limitations,
    };
  }

  // Default Fallback
  return {
    query: nichod.query,
    decision: 'INSUFFICIENT_EVIDENCE',
    headline: 'Decision: INSUFFICIENT EVIDENCE',
    rationale: 'Evidence is not strong enough to confidently support a BUY or DON\'T BUY decision.',
    supportingFactors: nichod.keyPositives,
    concerns: nichod.keyNegatives,
    conditions: [],
    uncertainty: ['Evidence is limited', ...nichod.missingInformation],
    evidenceStrength: nichod.evidenceStrength,
    confidence: Confidence.MEDIUM,
    evidenceCount: nichod.evidenceCount,
    relevantClaimCount: nichod.relevantClaimCount,
    contradictionCount: nichod.contradictions.length,
    sourceStatus: nichod.sourceStatus,
    limitations: nichod.limitations,
  };
}
