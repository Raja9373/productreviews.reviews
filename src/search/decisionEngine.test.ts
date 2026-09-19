import { makeDecision } from './decisionEngine';
import { NichodResult, Confidence, SourceStatus, StatementType, EvidenceType, Sentiment } from '../types';

function runTest(name: string, nichod: NichodResult, expectedDecision: string) {
  const result = makeDecision(nichod);
  const passed = result.decision === expectedDecision;
  console.log(`${passed ? 'PASS' : 'FAIL'} - ${name}: Expected ${expectedDecision}, Got ${result.decision}`);
}

const baseNichod: NichodResult = {
  query: 'test query',
  headline: 'test headline',
  summary: 'test summary',
  keyPositives: [],
  keyNegatives: [],
  mixedOrUncertain: [],
  strengths: [],
  weaknesses: [],
  risks: [],
  tradeoffs: [],
  suitableFor: [],
  notSuitableFor: [],
  contradictions: [],
  missingInformation: [],
  evidenceCount: 0,
  relevantClaimCount: 0,
  confidence: Confidence.LOW,
  evidenceStrength: 'LIMITED',
  limitations: [],
  structuredEvidenceAvailable: false,
  sourceStatus: SourceStatus.UNAVAILABLE,
  claimCount: 0,
};

// TEST 1 — POSITIVE CLAIM FLOOD (Should be INSUFFICIENT)
runTest('TEST 1 (Positive Flood)', { ...baseNichod, evidenceStrength: 'LIMITED', keyPositives: new Array(20).fill('pos'), evidenceCount: 20, relevantClaimCount: 20 }, 'INSUFFICIENT_EVIDENCE');
// TEST 2 — NEGATIVE CLAIM FLOOD (Should be INSUFFICIENT)
runTest('TEST 2 (Negative Flood)', { ...baseNichod, evidenceStrength: 'LIMITED', keyNegatives: new Array(20).fill('neg'), evidenceCount: 20, relevantClaimCount: 20 }, 'INSUFFICIENT_EVIDENCE');
// TEST 3 — ONE STRONG NEGATIVE
runTest('TEST 3 (Strong Negative)', { ...baseNichod, confidence: Confidence.HIGH, relevantClaimCount: 1, keyNegatives: ['Incompatible requirement'] }, 'DON\'T_BUY');
// TEST 4 — CRITICAL MISSING INFORMATION
runTest('TEST 4 (Missing Info)', { ...baseNichod, relevantClaimCount: 5, keyPositives: ['has feature'], missingInformation: ['Carrier compatibility'] }, 'BUY_IF');
// TEST 5 — BUDGET FAILURE
runTest('TEST 5 (Budget Failure)', { ...baseNichod, confidence: Confidence.HIGH, relevantClaimCount: 2, keyPositives: ['pos'], keyNegatives: ['Verified price £1099, budget £800'] }, 'DON\'T_BUY');
// TEST 6 — UNKNOWN CURRENT PRICE
runTest('TEST 6 (Unknown Price)', { ...baseNichod, relevantClaimCount: 2, keyPositives: ['pos'], missingInformation: ['Current UK price'] }, 'BUY_IF');
// TEST 7 — WRONG COUNTRY PRICE
runTest('TEST 7 (Wrong Country)', { ...baseNichod, relevantClaimCount: 2, keyPositives: ['pos'], keyNegatives: ['Price listed in US Dollars'], missingInformation: ['UK Price'] }, 'DON\'T_BUY');
// TEST 10 — OPINION-ONLY EVIDENCE
runTest('TEST 10 (Opinion Only)', { ...baseNichod, relevantClaimCount: 5, mixedOrUncertain: ['amazing', 'best ever', 'fantastic'] }, 'INSUFFICIENT_EVIDENCE');
// TEST 11 — MIXED USE CASE
runTest('TEST 11 (Mixed Use Case)', { ...baseNichod, relevantClaimCount: 2, keyPositives: ['programming perf'], keyNegatives: ['weak gaming GPU'] }, 'BUY_IF');
// TEST 15 — CLEAR BUY_IF CASE
runTest('TEST 15 (Clear Buy_IF)', { ...baseNichod, relevantClaimCount: 2, keyPositives: ['factual pos'], missingInformation: ['UK warranty details'] }, 'BUY_IF');
// TEST 16 — CLEAR DON'T_BUY CASE
runTest('TEST 16 (Clear Don\'t Buy)', { ...baseNichod, confidence: Confidence.HIGH, evidenceStrength: 'STRONG', relevantClaimCount: 2, keyNegatives: ['Incompatible RAM requirement', 'Clear incompatibility'] }, 'DON\'T_BUY');
// TEST 20 — UNKNOWN CLAIM SAFETY
runTest('TEST 20 (Unknown Safety)', { ...baseNichod, evidenceStrength: 'LIMITED', relevantClaimCount: 5, mixedOrUncertain: ['unknown1', 'unknown2', 'unknown3', 'unknown4', 'unknown5'] }, 'INSUFFICIENT_EVIDENCE');
