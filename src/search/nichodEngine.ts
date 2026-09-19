import { 
  EvidencePoint, 
  EvidenceType, 
  Sentiment, 
  Confidence, 
  SourceProvenance,
  NichodResult,
  SourceType,
  SourceStatus,
  StatementType
} from '../types';

/**
 * Transforms grounded search data into EvidencePoint[]
 */
export function transformGroundedSearchToEvidence(
  groundedResults: any
): EvidencePoint[] {
  const evidence: EvidencePoint[] = [];

  if (!groundedResults?.groundingMetadata?.groundingChunks) {
    return evidence;
  }

  // Map grounding chunks to EvidencePoint[]
  groundedResults.groundingMetadata.groundingChunks.forEach((chunk: any, index: number) => {
    if (chunk.web?.uri) {
      evidence.push({
        id: `ev_${index}_${Date.now()}`,
        claim: chunk.web.title || 'Referenced source',
        sentiment: Sentiment.UNKNOWN,
        statementType: StatementType.FACTUAL,
        evidenceType: EvidenceType.OTHER,
        sourceUrl: chunk.web.uri,
        sourceTitle: chunk.web.title,
        sourcePublisher: new URL(chunk.web.uri).hostname,
        evidenceTimestamp: new Date().toISOString(),
        confidence: Confidence.UNKNOWN,
        supportsClaim: true,
        provenance: {
          sourceName: new URL(chunk.web.uri).hostname,
          sourceType: 'EDITORIAL' as SourceType,
          sourceUrl: chunk.web.uri,
          retrievedAt: new Date().toISOString(),
        },
        sourceStatus: SourceStatus.STRUCTURED,
      });
    }
  });
  
  return evidence;
}

/**
 * Normalizes query for relevance matching
 */
function normalizeQuery(query: string): string[] {
  return query.toLowerCase()
    .replace(/£/g, 'pound')
    .replace(/uk/g, 'united kingdom')
    .replace(/laptop/g, 'notebook')
    .replace(/phone/g, 'smartphone')
    .split(/\W+/);
}

/**
 * Synthesize EvidencePoint[] into NichodResult
 */
export function synthesizeNichod(
  evidence: EvidencePoint[],
  query: string
): NichodResult {
  const normalizedQuery = normalizeQuery(query);
  
  // Deduplicate identical/near-identical claims to prevent repetition inflation
  const seenClaims = new Set<string>();
  const uniqueEvidence: EvidencePoint[] = [];
  for (const e of evidence) {
    const key = e.claim.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seenClaims.has(key)) {
      seenClaims.add(key);
      uniqueEvidence.push(e);
    }
  }

  // Relevance filtering: Term overlap check
  const relevantEvidence = uniqueEvidence.map(e => {
    const claimLower = e.claim.toLowerCase();
    const score = normalizedQuery.reduce((acc, term) => acc + (term.length > 2 && claimLower.includes(term) ? 1 : 0), 0);
    return { ...e, relevanceScore: score };
  }).filter(e => e.relevanceScore > 0 || normalizedQuery.length === 0);

  const keyPositives = relevantEvidence
    .filter(e => e.sentiment === Sentiment.POSITIVE)
    .map(e => e.claim);
  const keyNegatives = relevantEvidence
    .filter(e => e.sentiment === Sentiment.NEGATIVE)
    .map(e => e.claim);
  const mixedOrUncertain = relevantEvidence
    .filter(e => e.sentiment === Sentiment.MIXED || e.sentiment === Sentiment.UNKNOWN || e.confidence === Confidence.LOW)
    .map(e => e.claim);

  // Contradiction detection: opposing sentiments on same evidence type or explicit conflicting numerical measurements
  const contradictions: NichodResult['contradictions'] = [];
  for (let i = 0; i < relevantEvidence.length; i++) {
    for (let j = i + 1; j < relevantEvidence.length; j++) {
      const a = relevantEvidence[i];
      const b = relevantEvidence[j];
      const sameAspect = a.evidenceType === b.evidenceType && a.evidenceType !== EvidenceType.OTHER;
      const opposingSentiment = (a.sentiment === Sentiment.POSITIVE && b.sentiment === Sentiment.NEGATIVE) ||
                                (a.sentiment === Sentiment.NEGATIVE && b.sentiment === Sentiment.POSITIVE);
      
      const numbersInA = a.claim.match(/\d+(\.\d+)?/g);
      const numbersInB = b.claim.match(/\d+(\.\d+)?/g);
      const hasConflictingNumbers = sameAspect && numbersInA && numbersInB && 
        numbersInA.some(num => !numbersInB.includes(num)) &&
        (a.claim.toLowerCase().includes('battery') && b.claim.toLowerCase().includes('battery') ||
         a.claim.toLowerCase().includes('ram') && b.claim.toLowerCase().includes('ram') ||
         a.claim.toLowerCase().includes('storage') && b.claim.toLowerCase().includes('storage') ||
         a.claim.toLowerCase().includes('price') && b.claim.toLowerCase().includes('price'));

      if (sameAspect && (opposingSentiment || hasConflictingNumbers)) {
        contradictions.push({
          aspect: a.evidenceType,
          viewA: a.claim,
          viewB: b.claim,
          sourceA: a.sourceTitle || a.provenance.sourceName || 'Unknown',
          sourceB: b.sourceTitle || b.provenance.sourceName || 'Unknown',
        });
      }
    }
  }

  // Multi-factor Evidence Strength (Conservative)
  const isStructured = relevantEvidence.some(e => e.sourceStatus === SourceStatus.STRUCTURED);
  const isUnstructured = relevantEvidence.some(e => e.sourceStatus === SourceStatus.UNSTRUCTURED);
  const factualCount = relevantEvidence.filter(e => e.statementType === StatementType.FACTUAL).length;

  const score = relevantEvidence.reduce((acc, e) => {
    let s = 1; // Base point per unique relevant claim
    s += (e as any).relevanceScore * 0.3;
    s += e.confidence === Confidence.HIGH ? 2 : e.confidence === Confidence.MEDIUM ? 1 : 0;
    s += e.sourceStatus === SourceStatus.STRUCTURED ? 2 : e.sourceStatus === SourceStatus.UNSTRUCTURED ? 0.5 : 0;
    s += e.statementType === StatementType.FACTUAL ? 1 : 0;
    return acc + s;
  }, 0) - (contradictions.length * 3);

  const evidenceStrength = relevantEvidence.length === 0 ? 'INSUFFICIENT' :
                          (score > 16 && isStructured && factualCount >= 3 && contradictions.length === 0) ? 'STRONG' : 
                          (score > 6 && (isStructured || factualCount >= 2)) ? 'MODERATE' : 
                          'LIMITED';

  // Conservative Confidence Calculation
  let confidence = Confidence.LOW;
  if (relevantEvidence.length === 0 || contradictions.length > 0) {
    confidence = Confidence.LOW;
  } else if (isStructured && factualCount >= 2 && evidenceStrength !== 'LIMITED') {
    confidence = Confidence.HIGH;
  } else if (relevantEvidence.length >= 2 && (isUnstructured || isStructured)) {
    confidence = Confidence.MEDIUM;
  } else {
    confidence = Confidence.LOW;
  }

  return {
    query,
    headline: `Research synthesis for: ${query}`,
    summary: `Synthesized ${relevantEvidence.length} relevant evidence points from ${evidence.length} total claims.`,
    status: relevantEvidence.length > 0 ? 'SUCCESS' : 'INSUFFICIENT_EVIDENCE',
    keyPositives,
    keyNegatives,
    mixedOrUncertain,
    strengths: [],
    weaknesses: [],
    risks: [],
    tradeoffs: [],
    suitableFor: [],
    notSuitableFor: [],
    contradictions,
    missingInformation: ['Current merchant stock availability', 'Live local currency checkout price'],
    evidenceCount: evidence.length,
    relevantClaimCount: relevantEvidence.length,
    confidence,
    evidenceStrength: evidenceStrength as any,
    limitations: ['Extracted claims not independently verified.'],
    structuredEvidenceAvailable: isStructured,
    sourceStatus: isStructured ? SourceStatus.STRUCTURED : 
                  isUnstructured ? SourceStatus.UNSTRUCTURED : SourceStatus.UNAVAILABLE,
    claimCount: evidence.length,
  };
}
