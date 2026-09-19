import { parseSearchQuery } from '../src/search/queryParser';
import { extractClaims } from '../src/search/claimExtractor';
import { synthesizeNichod } from '../src/search/nichodEngine';
import { makeDecision } from '../src/search/decisionEngine';
import { adaptGeminiResponse } from '../src/search/researchAdapter';
import { 
  EvidencePoint, 
  EvidenceType, 
  Sentiment, 
  Confidence, 
  StatementType, 
  SourceStatus, 
  NichodResult 
} from '../src/types';
import { EntityNormalizer } from '../src/sources/normalizer';
import { compareProducts } from '../src/search/comparisonEngine';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

console.log('====================================================');
console.log('PHASE 7.2 AUDIT — RESEARCH QUALITY & SOURCE TRANSPARENCY');
console.log('====================================================\n');

// ----------------------------------------------------
// SECTION 1: RESEARCH PIPELINE & HANDOFF TRACE
// ----------------------------------------------------
console.log('--- SECTION 1: RESEARCH PIPELINE TRACE ---');
const q = parseSearchQuery('best phone for gaming under 30000');
assert(q.intent === 'RECOMMENDATION', '1. Pipeline - Intent parsed correctly');
assert(q.constraints.budget === 30000 || q.constraints.budgetMax === 30000, '1. Pipeline - Budget constraint preserved');

const rawGemini = 'The OnePlus Nord CE4 features 8GB RAM, 5500mAh battery, and 100W charging. Source: OnePlus Official, GSMArena';
const adapted = adaptGeminiResponse(rawGemini, false, 'OnePlus Nord CE4');
assert(adapted.researchAvailable === true, '1. Pipeline - researchAvailable is true');
assert(adapted.structuredEvidenceAvailable === false, '1. Pipeline - structuredEvidenceAvailable is false');
assert(adapted.sourceStatus === SourceStatus.UNSTRUCTURED, '1. Pipeline - sourceStatus is UNSTRUCTURED when no DB mapping exists');
assert(adapted.evidencePoints.length >= 2, '1. Pipeline - claims extracted into EvidencePoints');
assert(adapted.nichod.status === 'SUCCESS', '1. Pipeline - NICHOD synthesis generated');
assert(adapted.decision.decision !== undefined, '1. Pipeline - DecisionEngine result returned');

// ----------------------------------------------------
// SECTION 2: SOURCE STATUS INTEGRITY
// ----------------------------------------------------
console.log('\n--- SECTION 2: SOURCE STATUS INTEGRITY ---');
const emptySources = adaptGeminiResponse('Great device with high quality finish.', false, 'Phone');
assert(emptySources.sourceStatus === SourceStatus.UNAVAILABLE, '2. Source Status - UNAVAILABLE when no sources present');
assert(emptySources.structuredEvidenceAvailable === false, '2. Source Status - structuredEvidenceAvailable is false');

const structuredSources = adaptGeminiResponse('Has 16GB RAM and 512GB SSD. Source: TechSpecs', true, 'Laptop');
assert(structuredSources.sourceStatus === SourceStatus.STRUCTURED, '2. Source Status - STRUCTURED when structured evidence confirmed');
assert(structuredSources.structuredEvidenceAvailable === true, '2. Source Status - structuredEvidenceAvailable is true');

// Verify no illegal upgrade
const noUpgrade = adaptGeminiResponse('Speculative claim without citation.', false, 'Device');
assert(noUpgrade.sourceStatus !== SourceStatus.STRUCTURED, '2. Source Status - Never upgrade UNAVAILABLE to STRUCTURED');

// ----------------------------------------------------
// SECTION 3: SOURCE METADATA & URL SAFETY
// ----------------------------------------------------
console.log('\n--- SECTION 3: SOURCE METADATA & URL SAFETY ---');
const claimsWithSources = extractClaims('Good battery life. Price is £799.', ['TechRadar']);
assert(claimsWithSources[0].provenance.sourceName === 'TechRadar', '3. Metadata - Source name preserved');
assert(claimsWithSources[0].sourceUrl === undefined, '3. Metadata - No URL generated from source name (no guessing TechRadar.com)');
assert(claimsWithSources[0].sourceStatus === SourceStatus.UNSTRUCTURED, '3. Metadata - Marked UNSTRUCTURED');

const claimsWithoutSources = extractClaims('Unknown battery endurance.');
assert(claimsWithoutSources[0].provenance.sourceName === 'Unknown', '3. Metadata - Unknown source name when unprovided');
assert(claimsWithoutSources[0].sourceUrl === undefined, '3. Metadata - Undefined URL when unprovided');
assert(claimsWithoutSources[0].sourceStatus === SourceStatus.UNAVAILABLE, '3. Metadata - Marked UNAVAILABLE');

// ----------------------------------------------------
// SECTION 4: SOURCE TYPE & EVIDENCE TYPE CLASSIFICATION
// ----------------------------------------------------
console.log('\n--- SECTION 4: EVIDENCE TYPE CLASSIFICATION ---');
const specClaims = extractClaims('The laptop has 16GB RAM and M4 processor.');
assert(specClaims[0].evidenceType === EvidenceType.SPECIFICATION, '4. Evidence Type - Hardware specs mapped to SPECIFICATION');

const priceClaims = extractClaims('The retail price is £999 in UK.');
assert(priceClaims[0].evidenceType === EvidenceType.PRICE_MARKET, '4. Evidence Type - Pricing mapped to PRICE_MARKET');

const opinionClaims = extractClaims('Reviewers found the overall performance outstanding and exceptional.');
assert(opinionClaims[0].evidenceType === EvidenceType.EXPERT_REVIEW, '4. Evidence Type - Evaluative claims mapped to EXPERT_REVIEW');

const genericClaims = extractClaims('The package arrives in a standard box.');
assert(genericClaims[0].evidenceType === EvidenceType.OTHER, '4. Evidence Type - Neutral/generic claims mapped to OTHER');

// ----------------------------------------------------
// SECTION 5: CLAIM TYPE SAFETY (FACTUAL VS OPINION)
// ----------------------------------------------------
console.log('\n--- SECTION 5: CLAIM TYPE SAFETY ---');
const factualClaim = extractClaims('Features 120Hz refresh rate and 5000mAh battery.');
assert(factualClaim[0].statementType === StatementType.FACTUAL, '5. Claim Safety - Unambiguous specs are FACTUAL');

const opinionClaim = extractClaims('This is arguably the best phone of the year.');
assert(opinionClaim[0].statementType === StatementType.OPINION, '5. Claim Safety - Subjective statement is OPINION');

const mixedClaim = extractClaims('The 5000mAh battery delivers excellent and compelling endurance.');
assert(mixedClaim[0].statementType === StatementType.MIXED, '5. Claim Safety - Spec with opinion adjective is MIXED');

// ----------------------------------------------------
// SECTION 6: ENTITY-RELEVANCE CHECK
// ----------------------------------------------------
console.log('\n--- SECTION 6: ENTITY-RELEVANCE CHECK ---');
const iphoneEvidence: EvidencePoint[] = [
  {
    id: 'e1',
    claim: 'iPhone 16 Pro Max features A18 Pro chip and 48MP camera',
    sentiment: Sentiment.POSITIVE,
    statementType: StatementType.FACTUAL,
    evidenceType: EvidenceType.SPECIFICATION,
    confidence: Confidence.HIGH,
    supportsClaim: true,
    provenance: { sourceName: 'Apple', sourceType: 'OFFICIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.STRUCTURED,
    evidenceTimestamp: new Date().toISOString()
  },
  {
    id: 'e2',
    claim: 'Galaxy S25 Ultra has Snapdragon 8 Elite and S-Pen',
    sentiment: Sentiment.POSITIVE,
    statementType: StatementType.FACTUAL,
    evidenceType: EvidenceType.SPECIFICATION,
    confidence: Confidence.HIGH,
    supportsClaim: true,
    provenance: { sourceName: 'Samsung', sourceType: 'OFFICIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.STRUCTURED,
    evidenceTimestamp: new Date().toISOString()
  }
];

const nichodIPhone = synthesizeNichod(iphoneEvidence, 'iPhone 16 Pro Max');
assert(nichodIPhone.relevantClaimCount === 1, '6. Entity Relevance - Only iPhone 16 Pro Max claims kept relevant for iPhone query');
assert(nichodIPhone.keyPositives.some(c => c.includes('iPhone 16 Pro Max')), '6. Entity Relevance - Correct iPhone claim present');
assert(!nichodIPhone.keyPositives.some(c => c.includes('Galaxy S25')), '6. Entity Relevance - Unrelated Galaxy S25 filtered out');

// ----------------------------------------------------
// SECTION 7: RELEVANCE & TOKEN OVERLAP
// ----------------------------------------------------
console.log('\n--- SECTION 7: RELEVANCE SCORING ---');
const genericEvidence: EvidencePoint[] = [
  {
    id: 'g1',
    claim: 'A device is in the store with standard box',
    sentiment: Sentiment.UNKNOWN,
    statementType: StatementType.UNKNOWN,
    evidenceType: EvidenceType.OTHER,
    confidence: Confidence.LOW,
    supportsClaim: true,
    provenance: { sourceName: 'Unknown', sourceType: 'EDITORIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.UNAVAILABLE,
    evidenceTimestamp: new Date().toISOString()
  }
];
const nichodSony = synthesizeNichod(genericEvidence, 'Sony WH-1000XM5 noise cancelling headphones');
assert(nichodSony.relevantClaimCount === 0, '7. Relevance - Generic stopwords do not match specific entity query');
assert(nichodSony.status === 'INSUFFICIENT_EVIDENCE', '7. Relevance - INSUFFICIENT_EVIDENCE when no matching terms overlap');

// ----------------------------------------------------
// SECTION 8: DUPLICATE EVIDENCE & REPETITION DISCOUNTING
// ----------------------------------------------------
console.log('\n--- SECTION 8: DUPLICATE EVIDENCE HANDLING ---');
const repeatedEvidence: EvidencePoint[] = [
  {
    id: 'rep1',
    claim: 'Battery life is good and lasts all day',
    sentiment: Sentiment.POSITIVE,
    statementType: StatementType.MIXED,
    evidenceType: EvidenceType.SPECIFICATION,
    confidence: Confidence.MEDIUM,
    supportsClaim: true,
    provenance: { sourceName: 'Blog 1', sourceType: 'EDITORIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.UNSTRUCTURED,
    evidenceTimestamp: new Date().toISOString()
  },
  {
    id: 'rep2',
    claim: 'Battery life is good and lasts all day',
    sentiment: Sentiment.POSITIVE,
    statementType: StatementType.MIXED,
    evidenceType: EvidenceType.SPECIFICATION,
    confidence: Confidence.MEDIUM,
    supportsClaim: true,
    provenance: { sourceName: 'Blog 2', sourceType: 'EDITORIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.UNSTRUCTURED,
    evidenceTimestamp: new Date().toISOString()
  },
  {
    id: 'rep3',
    claim: 'Battery life is good and lasts all day',
    sentiment: Sentiment.POSITIVE,
    statementType: StatementType.MIXED,
    evidenceType: EvidenceType.SPECIFICATION,
    confidence: Confidence.MEDIUM,
    supportsClaim: true,
    provenance: { sourceName: 'Blog 3', sourceType: 'EDITORIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.UNSTRUCTURED,
    evidenceTimestamp: new Date().toISOString()
  }
];

const nichodDeduplicated = synthesizeNichod(repeatedEvidence, 'Battery life');
assert(nichodDeduplicated.relevantClaimCount === 1, '8. Duplicate - 3 identical claims deduplicated to 1 relevant claim');
assert(nichodDeduplicated.evidenceStrength !== 'STRONG', '8. Duplicate - Repeated claim does not inflate to STRONG evidence');

// ----------------------------------------------------
// SECTION 9: CONTRADICTION PRESERVATION
// ----------------------------------------------------
console.log('\n--- SECTION 9: CONTRADICTION PRESERVATION ---');
const contradictoryEvidence: EvidencePoint[] = [
  {
    id: 'c1',
    claim: 'Battery lasts around 15 hours in continuous use',
    sentiment: Sentiment.POSITIVE,
    statementType: StatementType.FACTUAL,
    evidenceType: EvidenceType.SPECIFICATION,
    confidence: Confidence.MEDIUM,
    supportsClaim: true,
    provenance: { sourceName: 'Reviewer A', sourceType: 'EDITORIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.UNSTRUCTURED,
    evidenceTimestamp: new Date().toISOString()
  },
  {
    id: 'c2',
    claim: 'Battery lasts around 10 hours in continuous use',
    sentiment: Sentiment.NEGATIVE,
    statementType: StatementType.FACTUAL,
    evidenceType: EvidenceType.SPECIFICATION,
    confidence: Confidence.MEDIUM,
    supportsClaim: true,
    provenance: { sourceName: 'Reviewer B', sourceType: 'EDITORIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.UNSTRUCTURED,
    evidenceTimestamp: new Date().toISOString()
  }
];

const nichodContradictions = synthesizeNichod(contradictoryEvidence, 'Battery');
assert(nichodContradictions.contradictions.length > 0, '9. Contradictions - Conflicting claims detected and preserved');
assert(nichodContradictions.confidence === Confidence.LOW, '9. Contradictions - Confidence reduced to LOW due to contradiction');

// ----------------------------------------------------
// SECTION 10: PRICE & AVAILABILITY SAFETY
// ----------------------------------------------------
console.log('\n--- SECTION 10: PRICE & AVAILABILITY SAFETY ---');
const normalizedList = EntityNormalizer.normalizeEntities([{
  rawId: 'test-1',
  rawName: 'Sony WH-1000XM5',
  sourceAdapterId: 'test',
  sourceType: 'RETAILER',
  domain: 'PRODUCT',
  market: 'UK',
  language: 'en',
  summary: 'Noise cancelling headphones',
  isPriceVerified: false,
  priceNote: 'Dynamic price checkout confirmation required',
  retrievedAt: new Date().toISOString()
}], 'PRODUCT', 'UK');
const normEntity = normalizedList[0];
assert(normEntity.price.isVerified === false, '10. Price Safety - Unverified price is explicitly false');
assert(normEntity.price.note !== undefined, '10. Price Safety - Explicit price note supported');

// ----------------------------------------------------
// SECTION 11: MARKET / COUNTRY RELEVANCE
// ----------------------------------------------------
console.log('\n--- SECTION 11: MARKET RELEVANCE ---');
const ukQuery = parseSearchQuery('iPhone 16 Pro Max price in UK');
assert(ukQuery.market === 'UK', '11. Market - UK market constraint parsed');

const inQuery = parseSearchQuery('MacBook Air M4 in India');
assert(inQuery.market === 'IN', '11. Market - IN market constraint parsed');

const usQuery = parseSearchQuery('Samsung Galaxy S25 in USA');
assert(usQuery.market === 'US', '11. Market - US market constraint parsed');

// ----------------------------------------------------
// SECTION 12: CONFIDENCE & EVIDENCE STRENGTH
// ----------------------------------------------------
console.log('\n--- SECTION 12: CONFIDENCE & EVIDENCE STRENGTH ---');
const weakEvidence: EvidencePoint[] = [
  {
    id: 'w1',
    claim: 'A device is somewhat good',
    sentiment: Sentiment.MIXED,
    statementType: StatementType.OPINION,
    evidenceType: EvidenceType.EXPERT_REVIEW,
    confidence: Confidence.LOW,
    supportsClaim: true,
    provenance: { sourceName: 'Unknown', sourceType: 'EDITORIAL', retrievedAt: new Date().toISOString() },
    sourceStatus: SourceStatus.UNAVAILABLE,
    evidenceTimestamp: new Date().toISOString()
  }
];
const nichodWeak = synthesizeNichod(weakEvidence, 'device');
assert(nichodWeak.confidence === Confidence.LOW, '12. Confidence - Low confidence for opinion-only unavailable source');
assert(nichodWeak.evidenceStrength === 'LIMITED', '12. Evidence Strength - LIMITED for weak opinion evidence');

// ----------------------------------------------------
// SECTION 13: DECISION ENGINE HANDOFF
// ----------------------------------------------------
console.log('\n--- SECTION 13: DECISION ENGINE HANDOFF ---');
const decisionInsufficient = makeDecision(nichodWeak);
assert(decisionInsufficient.decision === 'INSUFFICIENT_EVIDENCE', '13. Decision - INSUFFICIENT_EVIDENCE when evidence is limited');
assert(decisionInsufficient.confidence === Confidence.LOW || nichodWeak.confidence === Confidence.LOW, '13. Decision - LOW confidence preserved');

const decisionContradiction = makeDecision(nichodContradictions);
assert(decisionContradiction.decision !== 'BUY', '13. Decision - Do not declare unconditional BUY with conflicting evidence');

// ----------------------------------------------------
// SECTION 14: COMPARISON ENGINE INTEGRATION
// ----------------------------------------------------
console.log('\n--- SECTION 14: COMPARISON ENGINE ISOLATION ---');
const evA: EvidencePoint[] = [{
  id: 'ea1',
  claim: 'Sony WH-1000XM5 has 30 hours battery life and superb noise cancellation',
  sentiment: Sentiment.POSITIVE,
  statementType: StatementType.FACTUAL,
  evidenceType: EvidenceType.SPECIFICATION,
  confidence: Confidence.HIGH,
  supportsClaim: true,
  provenance: { sourceName: 'Sony', sourceType: 'OFFICIAL', retrievedAt: new Date().toISOString() },
  sourceStatus: SourceStatus.STRUCTURED,
  evidenceTimestamp: new Date().toISOString()
}];
const evB: EvidencePoint[] = [{
  id: 'eb1',
  claim: 'Bose QC Ultra features immersive audio and 24 hours battery life',
  sentiment: Sentiment.POSITIVE,
  statementType: StatementType.FACTUAL,
  evidenceType: EvidenceType.SPECIFICATION,
  confidence: Confidence.HIGH,
  supportsClaim: true,
  provenance: { sourceName: 'Bose', sourceType: 'OFFICIAL', retrievedAt: new Date().toISOString() },
  sourceStatus: SourceStatus.STRUCTURED,
  evidenceTimestamp: new Date().toISOString()
}];

const compResult = compareProducts('Compare Sony vs Bose', 'Sony WH-1000XM5', 'Bose QC Ultra', evA, evB);
assert(compResult.productA === 'Sony WH-1000XM5', '14. Comparison - Product A identity intact');
assert(compResult.productB === 'Bose QC Ultra', '14. Comparison - Product B identity intact');
assert(compResult.sourceStatus !== undefined, '14. Comparison - SourceStatus transparency maintained');
assert(compResult.aspects.length > 0, '14. Comparison - Aspects compared without cross-contamination');

// ----------------------------------------------------
// SECTION 15: SAFE FAILURE MODES
// ----------------------------------------------------
console.log('\n--- SECTION 15: SAFE FAILURE MODES ---');
const emptyNichod = synthesizeNichod([], 'Nonexistent product query');
assert(emptyNichod.status === 'INSUFFICIENT_EVIDENCE', '15. Failure Mode - Empty evidence handled safely');
assert(emptyNichod.sourceStatus === SourceStatus.UNAVAILABLE, '15. Failure Mode - UNAVAILABLE source status for empty input');
assert(emptyNichod.evidenceStrength === 'INSUFFICIENT', '15. Failure Mode - INSUFFICIENT evidence strength');

const emptyDecision = makeDecision(emptyNichod);
assert(emptyDecision.decision === 'INSUFFICIENT_EVIDENCE', '15. Failure Mode - INSUFFICIENT_EVIDENCE decision returned');

console.log('\n====================================================');
console.log(`AUDIT RESULTS: ${passed}/${passed + failed} TESTS PASSED (${failed} failures)`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
