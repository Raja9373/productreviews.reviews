import {
  EvidencePoint,
  EvidenceType,
  Sentiment,
  StatementType,
  Confidence,
  SourceStatus,
  SourceProvenance
} from '../types';

export function extractClaims(verdict: string, sourceNames: string[] = []): EvidencePoint[] {
  const sentences = verdict.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
  const evidencePoints: EvidencePoint[] = [];

  const sourceStatus = sourceNames.length > 0 ? SourceStatus.UNSTRUCTURED : SourceStatus.UNAVAILABLE;

  sentences.forEach((sentence, index) => {
    let evidenceType = EvidenceType.OTHER;
    let statementType = StatementType.UNKNOWN;

    const lowerSentence = sentence.toLowerCase();
    
    // Explicit opinion/evaluative terms
    const opinionKeywords = [
      'excellent', 'best', 'good', 'compelling', 'strong', 'appears to', 
      'may vary', 'generally consider', 'could be', 'poor', 'mediocre', 
      'flawed', 'subpar', 'great', 'outstanding', 'impressive', 'disappointing',
      'favourite', 'favorite', 'ideal', 'recommended', 'superior', 'inferior'
    ];
    const isOpinion = opinionKeywords.some(keyword => lowerSentence.includes(keyword));

    const hasSpecKeywords = 
      lowerSentence.includes('ram') || 
      lowerSentence.includes('display') || 
      lowerSentence.includes('processor') || 
      lowerSentence.includes('battery') ||
      lowerSentence.includes('mah') ||
      lowerSentence.includes('ghz') ||
      lowerSentence.includes('gb') ||
      lowerSentence.includes('tb') ||
      lowerSentence.includes('mp') ||
      lowerSentence.includes('hz') ||
      lowerSentence.includes('oled') ||
      lowerSentence.includes('amoled') ||
      lowerSentence.includes('snapdragon') ||
      lowerSentence.includes('bionic');

    const isPrice = lowerSentence.includes('£') || lowerSentence.includes('$') || lowerSentence.includes('€') || lowerSentence.includes('₹') || lowerSentence.includes('price') || lowerSentence.includes('cost');

    if (isOpinion && (hasSpecKeywords || isPrice)) {
      evidenceType = hasSpecKeywords ? EvidenceType.SPECIFICATION : EvidenceType.PRICE_MARKET;
      statementType = StatementType.MIXED;
    } else if (isOpinion) {
      evidenceType = EvidenceType.EXPERT_REVIEW;
      statementType = StatementType.OPINION;
    } else if (isPrice) {
      evidenceType = EvidenceType.PRICE_MARKET;
      statementType = StatementType.FACTUAL;
    } else if (hasSpecKeywords) {
      evidenceType = EvidenceType.SPECIFICATION;
      statementType = StatementType.FACTUAL;
    } else {
      evidenceType = EvidenceType.OTHER;
      statementType = StatementType.UNKNOWN;
    }

    const provenance: SourceProvenance = {
      sourceName: sourceNames.length > 0 ? sourceNames[0] : 'Unknown',
      sourceType: 'EDITORIAL',
      retrievedAt: new Date().toISOString(),
    };

    evidencePoints.push({
      id: `cl_${index}_${Math.random().toString(36).substring(2, 9)}`,
      claim: sentence,
      sentiment: Sentiment.UNKNOWN,
      statementType,
      evidenceType,
      sourceStatus,
      sourceTitle: sourceNames.length > 0 ? sourceNames[0] : undefined,
      evidenceTimestamp: new Date().toISOString(),
      confidence: statementType === StatementType.FACTUAL ? Confidence.MEDIUM : Confidence.LOW,
      supportsClaim: true,
      provenance,
    });
  });

  return evidencePoints;
}
