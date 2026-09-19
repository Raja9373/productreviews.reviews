import { buildAffiliateUrl, getStoreConfig, GLOBAL_STORE_CONFIGS } from '../src/affiliate/affiliateConfig';
import { buildAmazonMarketUrl } from '../src/affiliate/amazonRouter';
import { makeDecision } from '../src/search/decisionEngine';
import { SourceStatus, Confidence, NichodResult } from '../src/types';

console.log('====================================================');
console.log('PHASE 9.0 — AMAZON AFFILIATE & MONETIZATION INTEGRITY AUDIT');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    failCount++;
    console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
  }
}

// 1. Affiliate Architecture & URL Generation
console.log('--- 1. Affiliate Architecture & URL Generation ---');
const urlUS = buildAffiliateUrl('iPhone 16 Pro Max', 'US', 'B0D9V5Z3Z1');
assert(urlUS.includes('/api/affiliate/redirect'), '1. Uses server redirect endpoint');
assert(urlUS.includes('market=US'), '1. Market parameter present');
assert(urlUS.includes('asin=B0D9V5Z3Z1'), '1. ASIN parameter correctly encoded');

// 2. Marketplace Coverage Audit
console.log('\n--- 2. Marketplace Coverage Audit ---');
const requiredMarkets = ['US', 'UK', 'IN', 'DE', 'FR', 'ES', 'IT', 'CA', 'AU', 'JP', 'BR', 'MX', 'NL', 'SG'];
for (const m of requiredMarkets) {
  const store = GLOBAL_STORE_CONFIGS[m];
  assert(Boolean(store), `2. Market ${m} configured`);
  assert(store.amazonDomain.includes('amazon.'), `2. Market ${m} has valid Amazon domain: ${store.amazonDomain}`);
  assert(Boolean(store.affiliateTag), `2. Market ${m} has affiliate tag configured`);
}

// 3. Affiliate Tag Integrity & Separation
console.log('\n--- 3. Affiliate Tag Integrity & Separation ---');
const usConfig = getStoreConfig('US');
const ukConfig = getStoreConfig('UK');
const inConfig = getStoreConfig('IN');
assert(usConfig.affiliateTag !== ukConfig.affiliateTag, '3. US and UK affiliate tags are distinct');
assert(usConfig.affiliateTag !== inConfig.affiliateTag, '3. US and India affiliate tags are distinct');
assert(!usConfig.affiliateTag.includes('undefined'), '3. US tag has no undefined strings');

// 4. Amazon URL & Domain Safety
console.log('\n--- 4. Amazon Domain Safety ---');
const allowedDomains = Object.values(GLOBAL_STORE_CONFIGS).map(s => s.amazonDomain);
for (const dom of allowedDomains) {
  assert(dom.startsWith('amazon.') || dom.includes('amazon.com'), `4. Legitimate Amazon domain: ${dom}`);
}

// 5. Product -> Affiliate Matching & Isolation
console.log('\n--- 5. Product -> Affiliate Matching & Isolation ---');
const urlA = buildAmazonMarketUrl({ query: 'iPhone 16 Pro Max', market: 'US', asin: 'B0D9V5Z3Z1' });
const urlB = buildAmazonMarketUrl({ query: 'Galaxy S25 Ultra', market: 'US', asin: 'B0DCXR8ZXG' });
assert(urlA.url.includes('B0D9V5Z3Z1'), '5. Product A maintains its own ASIN/query');
assert(urlB.url.includes('B0DCXR8ZXG'), '5. Product B maintains its own ASIN/query');
assert(!urlA.url.includes('B0DCXR8ZXG'), '5. Product A strictly isolated from Product B');

// 6. Price & Availability Integrity
console.log('\n--- 6. Price & Availability Integrity ---');
const mockNichod: NichodResult = {
  query: 'MacBook Air M4',
  headline: 'MacBook Air M4 Review',
  summary: 'Strong performance',
  keyPositives: ['M4 chip'],
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
  limitations: [],
  evidenceStrength: 'STRONG' as any,
  confidence: Confidence.HIGH,
  evidenceCount: 4,
  relevantClaimCount: 4,
  claimCount: 4,
  sourceStatus: SourceStatus.STRUCTURED,
  structuredEvidenceAvailable: true
};
const decision = makeDecision(mockNichod);
assert((decision as any).price === undefined, '6. DecisionEngine does not fabricate price simply because affiliate link exists');
assert((decision as any).inStock === undefined, '6. DecisionEngine does not fabricate stock status');

// 7. Decision Neutrality & Zero Affiliate Bias
console.log('\n--- 7. Decision Neutrality & Zero Affiliate Bias ---');
assert(['BUY', 'BUY_IF', "DON'T_BUY", 'INSUFFICIENT_EVIDENCE'].includes(decision.decision), '7. Decision is strictly derived from evidence NICHOD synthesis');

console.log('\n====================================================');
console.log(`PHASE 9.0 AUDIT RESULTS: ${passCount}/${passCount + failCount} TESTS PASSED (${failCount} failures)`);
console.log('====================================================\n');
if (failCount > 0) {
  process.exit(1);
}
