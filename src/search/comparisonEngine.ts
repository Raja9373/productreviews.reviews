import { ComparisonQuery, ComparisonResult, EvidencePoint, SourceStatus, Confidence } from '../types';
import { synthesizeNichod } from './nichodEngine';

export function compareProducts(
  query: string,
  productA: string,
  productB: string,
  evidenceA: EvidencePoint[],
  evidenceB: EvidencePoint[],
  useCase?: string
): ComparisonResult {
  // 0. Handle empty products/evidence
  if (!productA || !productB) {
    return createEmptyResult(query, productA, productB, 'INSUFFICIENT_EVIDENCE', 'Product identification uncertain.');
  }

  const nichodA = synthesizeNichod(evidenceA, `${productA} ${useCase || ''}`);
  const nichodB = synthesizeNichod(evidenceB, `${productB} ${useCase || ''}`);

  // 1. Isolation check
  // 2. Normalized aspects
  const aspects = ['Price', 'Performance', 'Camera', 'Battery', 'Display'];
  
  const comparisonAspects = aspects.map(aspect => {
    // Qualitative assessment
    const hasStrongA = nichodA.strengths.some(s => s.toLowerCase().includes(aspect.toLowerCase()));
    const hasStrongB = nichodB.strengths.some(s => s.toLowerCase().includes(aspect.toLowerCase()));
    
    let status: 'A_STRONGER' | 'B_STRONGER' | 'SIMILAR' | 'INCONCLUSIVE' = 'INCONCLUSIVE';
    if (hasStrongA && !hasStrongB) status = 'A_STRONGER';
    else if (hasStrongB && !hasStrongA) status = 'B_STRONGER';
    else if (hasStrongA && hasStrongB) status = 'SIMILAR';

    return {
      aspect,
      evidenceA: evidenceA.filter(e => e.claim.toLowerCase().includes(aspect.toLowerCase())),
      evidenceB: evidenceB.filter(e => e.claim.toLowerCase().includes(aspect.toLowerCase())),
      status
    };
  });

  // 3. Determine decision based on qualitative assessments and contradictions
  let decision: 'A' | 'B' | 'NEITHER' | 'CONDITIONAL' | 'INSUFFICIENT_EVIDENCE' = 'INSUFFICIENT_EVIDENCE';
  
  const hasContradictions = nichodA.contradictions.length > 0 || nichodB.contradictions.length > 0;
  if (hasContradictions) {
      decision = 'CONDITIONAL'; // Conservative
  } else if (nichodA.evidenceCount === 0 || nichodB.evidenceCount === 0) {
      decision = 'INSUFFICIENT_EVIDENCE';
  } else {
      decision = 'CONDITIONAL'; // Default
  }

  return {
    query,
    productA,
    productB,
    aspects: comparisonAspects,
    productAStrengths: nichodA.keyPositives,
    productBStrengths: nichodB.keyPositives,
    productAWeaknesses: nichodA.keyNegatives,
    productBWeaknesses: nichodB.keyNegatives,
    tradeoffs: [...nichodA.tradeoffs, ...nichodB.tradeoffs],
    contradictions: [...nichodA.contradictions.map(c => c.aspect), ...nichodB.contradictions.map(c => c.aspect)],
    missingInformation: [...nichodA.missingInformation, ...nichodB.missingInformation],
    overallAssessment: `Research-based comparison of ${productA} and ${productB}.`,
    confidence: 'MEDIUM',
    evidenceStrength: 'MODERATE',
    sourceStatus: SourceStatus.STRUCTURED,
    decision
  };
}

function createEmptyResult(query: string, productA: string, productB: string, decision: ComparisonResult['decision'], assessment: string): ComparisonResult {
    return {
        query,
        productA,
        productB,
        aspects: [],
        productAStrengths: [],
        productBStrengths: [],
        productAWeaknesses: [],
        productBWeaknesses: [],
        tradeoffs: [],
        contradictions: [],
        missingInformation: [],
        overallAssessment: assessment,
        confidence: 'UNKNOWN',
        evidenceStrength: 'INSUFFICIENT',
        sourceStatus: SourceStatus.UNAVAILABLE,
        decision
    };
}
