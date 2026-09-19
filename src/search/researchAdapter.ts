import { ResearchResult, SourceStatus, Sentiment, Confidence, DecisionEngineResult } from '../types';
import { extractClaims } from './claimExtractor';
import { synthesizeNichod } from './nichodEngine';
import { makeDecision } from './decisionEngine';

export function adaptGeminiResponse(rawText: string, hasStructuredEvidence: boolean, query: string): ResearchResult {
  const sourceMatch = rawText.match(/Source:\s*(.+)/);
  const sourceNames = sourceMatch ? sourceMatch[1].split(',').map(s => s.trim()) : [];
  
  const evidencePoints = extractClaims(rawText, sourceNames);
  const nichod = synthesizeNichod(evidencePoints, query);
  const decision = makeDecision(nichod);

  return {
    researchAvailable: rawText.length > 0,
    structuredEvidenceAvailable: hasStructuredEvidence,
    sourceStatus: hasStructuredEvidence 
        ? SourceStatus.STRUCTURED 
        : (sourceNames.length > 0 ? SourceStatus.UNSTRUCTURED : SourceStatus.UNAVAILABLE),
    evidencePoints,
    generatedVerdict: rawText,
    nichod,
    decision,
  };
}
