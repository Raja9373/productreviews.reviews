import { ResearchResult, SourceStatus, Sentiment, Confidence, DecisionEngineResult } from '../types';
import { extractClaims } from './claimExtractor';
import { synthesizeNichod } from './nichodEngine';
import { makeDecision } from './decisionEngine';
import { MarketContext, resolveMarketContext } from '../questions/context';
import {
  buildResearchContext,
  classifyEvidenceForMarket,
  resolveMarketResearchCoverage,
  validateEvidenceSafety
} from './research';

export function adaptGeminiResponse(
  rawText: string,
  hasStructuredEvidence: boolean,
  query: string,
  marketContext?: MarketContext
): ResearchResult {
  const sourceMatch = rawText.match(/Source:\s*(.+)/);
  const sourceNames = sourceMatch ? sourceMatch[1].split(',').map(s => s.trim()) : [];
  
  const rawEvidencePoints = extractClaims(rawText, sourceNames);

  // Phase 3 Market-Aware Research & Evidence Classification
  const targetMarket = marketContext || resolveMarketContext(query);
  const researchContext = buildResearchContext(query);
  const classifiedEvidence = classifyEvidenceForMarket(rawEvidencePoints, targetMarket);
  const coverageResolution = resolveMarketResearchCoverage(classifiedEvidence, researchContext);

  // Safety Assertion Check: Zero foreign leakage, zero URL fabrication
  validateEvidenceSafety(classifiedEvidence, targetMarket.countryCode);

  const nichod = synthesizeNichod(classifiedEvidence, query, {
    marketName: targetMarket.marketName,
    missingMarketEvidence: coverageResolution.missingMarketEvidence,
    marketLimitations: coverageResolution.marketLimitations,
  });
  const decision = makeDecision(nichod);

  return {
    researchAvailable: rawText.length > 0,
    structuredEvidenceAvailable: hasStructuredEvidence,
    sourceStatus: hasStructuredEvidence 
        ? SourceStatus.STRUCTURED 
        : (sourceNames.length > 0 ? SourceStatus.UNSTRUCTURED : SourceStatus.UNAVAILABLE),
    evidencePoints: classifiedEvidence,
    generatedVerdict: rawText,
    nichod,
    decision,
    researchContext,
    researchScope: researchContext.researchScope,
    marketCoverage: coverageResolution.coverageStatus,
    localEvidenceAvailable: coverageResolution.localEvidencePoints.length > 0,
    globalEvidenceAvailable: coverageResolution.globalEvidencePoints.length > 0,
    missingMarketEvidence: coverageResolution.missingMarketEvidence,
    researchLimitations: coverageResolution.marketLimitations,
  };
}
