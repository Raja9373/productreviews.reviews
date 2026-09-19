import { parseSearchQuery } from '../src/search/queryParser';
import { executeSearch } from '../src/search/discoveryEngine';
import { compareProducts } from '../src/search/comparisonEngine';
import { makeDecision } from '../src/search/decisionEngine';

interface TestResult {
  section: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(section: string, name: string, condition: boolean, details?: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${section} - ${name}: ${details || ''}`);
  } else {
    console.log(`✅ [PASS] ${section} - ${name}`);
  }
  results.push({ section, name, passed: condition, details });
}

console.log('====================================================');
console.log('PHASE 7.0 — SEARCH & QUERY INTELLIGENCE AUDIT SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// SECTION 2: INTENT CLASSIFICATION AUDIT
// ----------------------------------------------------
console.log('--- SECTION 2: INTENT CLASSIFICATION AUDIT ---');

// A. EXACT_ENTITY
const exact1 = parseSearchQuery('iPhone 16 Pro Max');
assert('2. Intent', 'iPhone 16 Pro Max -> EXACT_ENTITY', exact1.intent === 'EXACT_ENTITY', `Got ${exact1.intent}`);

const exact2 = parseSearchQuery('Sony WH-1000XM5');
assert('2. Intent', 'Sony WH-1000XM5 -> EXACT_ENTITY', exact2.intent === 'EXACT_ENTITY', `Got ${exact2.intent}`);

const exact3 = parseSearchQuery('Dell XPS 13');
assert('2. Intent', 'Dell XPS 13 -> EXACT_ENTITY', exact3.intent === 'EXACT_ENTITY', `Got ${exact3.intent}`);

const exact4 = parseSearchQuery('Samsung Galaxy S24 Ultra');
assert('2. Intent', 'Samsung Galaxy S24 Ultra -> EXACT_ENTITY', exact4.intent === 'EXACT_ENTITY', `Got ${exact4.intent}`);

const exact5 = parseSearchQuery('Kindle Paperwhite 16 GB');
assert('2. Intent', 'Kindle Paperwhite 16 GB -> EXACT_ENTITY', exact5.intent === 'EXACT_ENTITY', `Got ${exact5.intent}`);

// B. COMPARISON
const comp1 = parseSearchQuery('iPhone 16 vs Galaxy S25');
assert('2. Intent', 'iPhone 16 vs Galaxy S25 -> COMPARISON', comp1.intent === 'COMPARISON', `Got ${comp1.intent}`);

const comp2 = parseSearchQuery('compare Sony XM5 and Bose QC Ultra');
assert('2. Intent', 'compare Sony XM5 and Bose QC Ultra -> COMPARISON', comp2.intent === 'COMPARISON', `Got ${comp2.intent}`);

const comp3 = parseSearchQuery('MacBook Air M4 versus Dell XPS 13');
assert('2. Intent', 'MacBook Air M4 versus Dell XPS 13 -> COMPARISON', comp3.intent === 'COMPARISON', `Got ${comp3.intent}`);

// C. RECOMMENDATION
const rec1 = parseSearchQuery('best laptop under $800');
assert('2. Intent', 'best laptop under $800 -> RECOMMENDATION', rec1.intent === 'RECOMMENDATION', `Got ${rec1.intent}`);

const rec2 = parseSearchQuery('best headphones for travel');
assert('2. Intent', 'best headphones for travel -> RECOMMENDATION', rec2.intent === 'RECOMMENDATION', `Got ${rec2.intent}`);

const rec3 = parseSearchQuery('best phone for photography');
assert('2. Intent', 'best phone for photography -> RECOMMENDATION', rec3.intent === 'RECOMMENDATION', `Got ${rec3.intent}`);

// D. GENERAL_LOOKUP / ATTRIBUTES
const gen1 = parseSearchQuery('iPhone 16 battery life');
assert('2. Intent', 'iPhone 16 battery life -> GENERAL_LOOKUP', gen1.intent === 'GENERAL_LOOKUP', `Got ${gen1.intent}`);

const gen2 = parseSearchQuery('Sony XM5 weight');
assert('2. Intent', 'Sony XM5 weight -> GENERAL_LOOKUP', gen2.intent === 'GENERAL_LOOKUP', `Got ${gen2.intent}`);

const gen3 = parseSearchQuery('MacBook Air M4 ports');
assert('2. Intent', 'MacBook Air M4 ports -> GENERAL_LOOKUP', gen3.intent === 'GENERAL_LOOKUP', `Got ${gen3.intent}`);

// E. INFORMATIONAL
const info1 = parseSearchQuery('what is OLED');
assert('2. Intent', 'what is OLED -> GENERAL_LOOKUP', info1.intent === 'GENERAL_LOOKUP', `Got ${info1.intent}`);

const info2 = parseSearchQuery('how does active noise cancellation work');
assert('2. Intent', 'how does active noise cancellation work -> GENERAL_LOOKUP', info2.intent === 'GENERAL_LOOKUP', `Got ${info2.intent}`);

// ----------------------------------------------------
// SECTION 3: COMPARISON REGRESSION PROTECTION
// ----------------------------------------------------
console.log('\n--- SECTION 3: COMPARISON REGRESSION PROTECTION ---');

const compXvsY = parseSearchQuery('Sony XM5 vs Bose QC Ultra');
assert('3. Comparison', 'X vs Y', compXvsY.intent === 'COMPARISON' && compXvsY.constraints.comparisonEntities?.[0] === 'Sony XM5' && compXvsY.constraints.comparisonEntities?.[1] === 'Bose QC Ultra');

const compXversusY = parseSearchQuery('Pixel 9 versus Galaxy S24');
assert('3. Comparison', 'X versus Y', compXversusY.intent === 'COMPARISON' && compXversusY.constraints.comparisonEntities?.[0] === 'Pixel 9' && compXversusY.constraints.comparisonEntities?.[1] === 'Galaxy S24');

const compCompareAnd = parseSearchQuery('compare iPhone 16 and Galaxy S25');
assert('3. Comparison', 'compare X and Y', compCompareAnd.intent === 'COMPARISON' && compCompareAnd.constraints.comparisonEntities?.[0] === 'iPhone 16' && compCompareAnd.constraints.comparisonEntities?.[1] === 'Galaxy S25');

const compCompareWith = parseSearchQuery('compare MacBook Air M4 with Dell XPS 13');
assert('3. Comparison', 'compare X with Y', compCompareWith.intent === 'COMPARISON' && compCompareWith.constraints.comparisonEntities?.[0] === 'MacBook Air M4' && compCompareWith.constraints.comparisonEntities?.[1] === 'Dell XPS 13');

const compXorY = parseSearchQuery('Sony WH-1000XM5 or Bose QC45');
assert('3. Comparison', 'X or Y', compXorY.intent === 'COMPARISON' && compXorY.constraints.comparisonEntities?.[0] === 'Sony WH-1000XM5' && compXorY.constraints.comparisonEntities?.[1] === 'Bose QC45');

const compCasing = parseSearchQuery('   IPHONE 16   VS   GALAXY S25   ');
assert('3. Comparison', 'Capitalization & extra whitespace', compCasing.intent === 'COMPARISON' && compCasing.constraints.comparisonEntities?.[0] === 'IPHONE 16' && compCasing.constraints.comparisonEntities?.[1] === 'GALAXY S25');

// Non-comparison ordinary queries containing vs/compare/etc.
const ordinary1 = parseSearchQuery('best phone for gaming');
assert('3. Comparison', 'best phone for gaming is NOT comparison', ordinary1.intent === 'RECOMMENDATION');

const ordinary2 = parseSearchQuery('phone vs water resistance');
assert('3. Comparison', 'phone vs water resistance is NOT comparison', ordinary2.intent === 'GENERAL_LOOKUP', `Got ${ordinary2.intent}`);

const ordinary3 = parseSearchQuery('what is the difference between OLED and LCD');
assert('3. Comparison', 'what is the difference between OLED and LCD is NOT comparison', ordinary3.intent === 'GENERAL_LOOKUP', `Got ${ordinary3.intent}`);

const ordinary4 = parseSearchQuery('compare battery life of phones');
assert('3. Comparison', 'compare battery life of phones is NOT product comparison', ordinary4.intent !== 'COMPARISON', `Got ${ordinary4.intent}`);

// ----------------------------------------------------
// SECTION 4: ENTITY EXTRACTION
// ----------------------------------------------------
console.log('\n--- SECTION 4: ENTITY EXTRACTION ---');

const singleWord1 = parseSearchQuery('Kindle');
assert('4. Entity', 'single-word Kindle -> EXACT_ENTITY', singleWord1.intent === 'EXACT_ENTITY', `Got ${singleWord1.intent}`);

const singleWord2 = parseSearchQuery('iPad');
assert('4. Entity', 'single-word iPad -> EXACT_ENTITY', singleWord2.intent === 'EXACT_ENTITY', `Got ${singleWord2.intent}`);

const singleWord3 = parseSearchQuery('Sonos');
assert('4. Entity', 'single-word Sonos -> EXACT_ENTITY', singleWord3.intent === 'EXACT_ENTITY', `Got ${singleWord3.intent}`);

const singleWord4 = parseSearchQuery('Roomba');
assert('4. Entity', 'single-word Roomba -> EXACT_ENTITY', singleWord4.intent === 'EXACT_ENTITY', `Got ${singleWord4.intent}`);

const multiWord = parseSearchQuery('Apple iPhone 16 Pro Max');
assert('4. Entity', 'multi-word Apple iPhone 16 Pro Max', multiWord.intent === 'EXACT_ENTITY' && multiWord.constraints.brand?.toLowerCase() === 'apple');

const modelNum1 = parseSearchQuery('WH-1000XM5');
assert('4. Entity', 'model number WH-1000XM5', modelNum1.intent === 'EXACT_ENTITY');

const modelNum2 = parseSearchQuery('Dell XPS 13 9350');
assert('4. Entity', 'Dell XPS 13 9350', modelNum2.intent === 'EXACT_ENTITY');

const genModel = parseSearchQuery('iPad Pro 11-inch 4th Generation');
assert('4. Entity', 'iPad Pro 11-inch 4th Generation', genModel.intent === 'EXACT_ENTITY');

const watchModel = parseSearchQuery('Apple Watch Series 10');
assert('4. Entity', 'Apple Watch Series 10', watchModel.intent === 'EXACT_ENTITY');

// ----------------------------------------------------
// SECTION 5: QUERY CONSTRAINT EXTRACTION
// ----------------------------------------------------
console.log('\n--- SECTION 5: QUERY CONSTRAINT EXTRACTION ---');

const budgetUnder = parseSearchQuery('laptop under $500');
assert('5. Constraints', 'under $500', budgetUnder.constraints.budget === 500 && budgetUnder.constraints.currency === '$');

const budgetBelow = parseSearchQuery('phone below £800');
assert('5. Constraints', 'below £800', budgetBelow.constraints.budget === 800 && budgetBelow.constraints.currency === '£');

const budgetRupee = parseSearchQuery('phone ₹50,000');
assert('5. Constraints', '₹50,000', budgetRupee.constraints.budget === 50000 && budgetRupee.constraints.currency === '₹');

const budgetRange = parseSearchQuery('laptop between $500 and $800');
assert('5. Constraints', 'between $500 and $800', budgetRange.constraints.budgetMin === 500 && budgetRange.constraints.budgetMax === 800 && budgetRange.constraints.budget === 800);

const budgetAround = parseSearchQuery('headphones around $1,000');
assert('5. Constraints', 'around $1,000', budgetAround.constraints.budget === 1000 && budgetAround.constraints.currency === '$');

// Specifications
const specRam = parseSearchQuery('laptop with 16GB RAM and 1TB storage');
assert('5. Constraints', '16GB RAM & 1TB storage', 
  specRam.constraints.specifications?.some(s => s.toLowerCase().includes('16gb')) === true &&
  specRam.constraints.specifications?.some(s => s.toLowerCase().includes('1tb')) === true
);

const specDisplay = parseSearchQuery('phone with OLED and 120Hz display');
assert('5. Constraints', 'OLED & 120Hz',
  specDisplay.constraints.specifications?.some(s => s.toLowerCase().includes('oled')) === true &&
  specDisplay.constraints.specifications?.some(s => s.toLowerCase().includes('120hz')) === true
);

const specPort = parseSearchQuery('monitor with USB-C and 4K');
assert('5. Constraints', 'USB-C and 4K',
  specPort.constraints.specifications?.some(s => s.toLowerCase().includes('usb-c')) === true &&
  specPort.constraints.specifications?.some(s => s.toLowerCase().includes('4k')) === true
);

// Other constraints
const featuresQuery = parseSearchQuery('lightweight compact wireless waterproof headphones with long battery life');
assert('5. Constraints', 'Features extracted',
  featuresQuery.constraints.features?.includes('lightweight') === true &&
  featuresQuery.constraints.features?.includes('compact') === true &&
  featuresQuery.constraints.features?.includes('wireless') === true &&
  featuresQuery.constraints.features?.includes('waterproof') === true &&
  featuresQuery.constraints.features?.includes('long battery life') === true
);

// ----------------------------------------------------
// SECTION 6: NEGATION HANDLING
// ----------------------------------------------------
console.log('\n--- SECTION 6: NEGATION HANDLING ---');

const neg1 = parseSearchQuery('laptop under $800 but not gaming');
assert('6. Negation', 'laptop under $800 but not gaming', 
  neg1.constraints.budget === 800 && 
  neg1.constraints.negativeConstraints?.includes('gaming') === true &&
  neg1.constraints.useCase !== 'gaming',
  `Negative: ${JSON.stringify(neg1.constraints.negativeConstraints)}, useCase: ${neg1.constraints.useCase}`
);

const neg2 = parseSearchQuery('phone with good camera but no curved screen');
assert('6. Negation', 'phone with good camera but no curved screen',
  neg2.constraints.negativeConstraints?.some(n => n.includes('curved screen')) === true
);

const neg3 = parseSearchQuery('headphones without ANC');
assert('6. Negation', 'headphones without ANC',
  neg3.constraints.negativeConstraints?.includes('anc') === true &&
  !neg3.constraints.features?.includes('anc')
);

const neg4 = parseSearchQuery('laptop not interested in Apple');
assert('6. Negation', 'not interested in Apple',
  neg4.constraints.negativeConstraints?.includes('apple') === true &&
  neg4.constraints.brand === undefined
);

const neg5 = parseSearchQuery('phone I don\'t need 5G');
assert('6. Negation', 'I don\'t need 5G',
  neg5.constraints.negativeConstraints?.includes('5g') === true
);

// ----------------------------------------------------
// SECTION 7: UNIT / CURRENCY HANDLING
// ----------------------------------------------------
console.log('\n--- SECTION 7: UNIT / CURRENCY HANDLING ---');

assert('7. Currency', 'INR / ₹ preserved', parseSearchQuery('phone under ₹20,000').constraints.currency === '₹');
assert('7. Currency', 'USD / $ preserved', parseSearchQuery('laptop under $600').constraints.currency === '$');
assert('7. Currency', 'GBP / £ preserved', parseSearchQuery('headphones under £200').constraints.currency === '£');
assert('7. Currency', 'EUR / € preserved', parseSearchQuery('monitor under 300€').constraints.currency === '€');
const cadQuery = parseSearchQuery('camera under CAD 1000');
assert('7. Currency', 'CAD preserved', cadQuery.market === 'CA' && cadQuery.constraints.currency === 'C$');
const audQuery = parseSearchQuery('tablet under AUD 500');
assert('7. Currency', 'AUD preserved', audQuery.market === 'AU' && audQuery.constraints.currency === 'A$');

// Units in specifications
const unitQuery = parseSearchQuery('laptop 16GB RAM 512GB SSD 120Hz 65W');
assert('7. Units', 'Units preserved in specs',
  unitQuery.constraints.specifications?.some(s => s.includes('16GB')) === true &&
  unitQuery.constraints.specifications?.some(s => s.includes('120Hz')) === true
);

// ----------------------------------------------------
// SECTION 8: MARKET RECOGNITION
// ----------------------------------------------------
console.log('\n--- SECTION 8: MARKET RECOGNITION ---');

assert('8. Market', 'in the UK -> UK', parseSearchQuery('best laptop in the UK').market === 'UK');
assert('8. Market', 'USA -> US', parseSearchQuery('best phone in USA').market === 'US');
assert('8. Market', 'India -> IN', parseSearchQuery('best tv in India').market === 'IN');
assert('8. Market', 'available in Canada -> CA', parseSearchQuery('headphones available in Canada').market === 'CA');
assert('8. Market', 'Australian market -> AU', parseSearchQuery('tablets Australian market').market === 'AU');

// ----------------------------------------------------
// SECTION 9: USE-CASE PRIORITY
// ----------------------------------------------------
console.log('\n--- SECTION 9: USE-CASE PRIORITY ---');

const ucPriority1 = parseSearchQuery('best phone under $500 for photography');
assert('9. Use-Case', 'best phone under $500 for photography',
  ucPriority1.constraints.budget === 500 &&
  ucPriority1.constraints.currency === '$' &&
  ucPriority1.constraints.useCase?.toLowerCase() === 'photography'
);

const ucPriority2 = parseSearchQuery('best laptop for programming under ₹70,000');
assert('9. Use-Case', 'best laptop for programming under ₹70,000',
  ucPriority2.constraints.budget === 70000 &&
  ucPriority2.constraints.currency === '₹' &&
  ucPriority2.constraints.useCase?.toLowerCase() === 'programming'
);

const ucAdjective = parseSearchQuery('best gaming laptop');
assert('9. Use-Case', 'best gaming laptop', ucAdjective.constraints.useCase?.toLowerCase() === 'gaming');

const ucTravel = parseSearchQuery('best travel headphones');
assert('9. Use-Case', 'best travel headphones', ucTravel.constraints.useCase?.toLowerCase() === 'travel');

const ucStudent = parseSearchQuery('best student laptop');
assert('9. Use-Case', 'best student laptop', ucStudent.constraints.useCase?.toLowerCase() === 'student');

const ucOffice = parseSearchQuery('laptop for office work');
assert('9. Use-Case', 'laptop for office work', ucOffice.constraints.useCase?.toLowerCase() === 'office work');

const ucOutdoor = parseSearchQuery('camera for outdoor use');
assert('9. Use-Case', 'camera for outdoor use', ucOutdoor.constraints.useCase?.toLowerCase() === 'outdoor use');

// ----------------------------------------------------
// SECTION 10: AMBIGUOUS QUERIES
// ----------------------------------------------------
console.log('\n--- SECTION 10: AMBIGUOUS QUERIES ---');

const ambPhone = parseSearchQuery('best phone');
assert('10. Ambiguous', 'best phone -> no fabricated budget or country',
  ambPhone.intent === 'RECOMMENDATION' &&
  ambPhone.constraints.budget === undefined &&
  ambPhone.constraints.explicitCountry === undefined
);

const ambLaptop = parseSearchQuery('good laptop');
assert('10. Ambiguous', 'good laptop -> no fabricated budget',
  ambLaptop.intent === 'RECOMMENDATION' &&
  ambLaptop.constraints.budget === undefined
);

const ambHeadphones = parseSearchQuery('headphones');
assert('10. Ambiguous', 'headphones -> category/lookup, no fabricated price',
  ambHeadphones.constraints.budget === undefined &&
  ambHeadphones.constraints.productType === 'audio'
);

const ambCheap = parseSearchQuery('cheap laptop');
assert('10. Ambiguous', 'cheap laptop -> RECOMMENDATION, no fabricated numeric budget',
  ambCheap.intent === 'RECOMMENDATION' &&
  ambCheap.constraints.budget === undefined
);

// ----------------------------------------------------
// SECTION 11: MALFORMED / ADVERSARIAL INPUTS
// ----------------------------------------------------
console.log('\n--- SECTION 11: MALFORMED / ADVERSARIAL INPUTS ---');

const emptyQ = parseSearchQuery('');
assert('11. Adversarial', 'empty query fails safely', emptyQ.cleanQuery === '' && emptyQ.intent === 'GENERAL_LOOKUP');

const whitespaceQ = parseSearchQuery('     \n\t   ');
assert('11. Adversarial', 'whitespace query fails safely', whitespaceQ.cleanQuery === '');

const hugeQ = parseSearchQuery('phone '.repeat(5000));
assert('11. Adversarial', 'extremely long query handled safely without crash', hugeQ.cleanQuery.length <= 1000);

const repeatedWords = parseSearchQuery('phone phone phone phone');
assert('11. Adversarial', 'repeated words handled safely', repeatedWords.intent === 'CATEGORY_DISCOVERY' || repeatedWords.intent === 'GENERAL_LOOKUP');

const punctuationQ = parseSearchQuery('!@#$%^&*()_+{}[]|:;<>?,./~`');
assert('11. Adversarial', 'unusual punctuation fails safely', punctuationQ !== null && typeof punctuationQ === 'object');

const emojiQ = parseSearchQuery('📱 best phone 🔥 under $500 🚀');
assert('11. Adversarial', 'emojis handled correctly', emojiQ.constraints.budget === 500 && emojiQ.intent === 'RECOMMENDATION');

const unicodeQ = parseSearchQuery('सबसे अच्छा फोन');
assert('11. Adversarial', 'Hindi Unicode handled safely with language detection', unicodeQ.language === 'hi');

const mixedLang = parseSearchQuery('best फोन under 20000');
assert('11. Adversarial', 'mixed languages handled safely', mixedLang.language === 'hi' && mixedLang.constraints.budget === 20000);

const dupProducts = parseSearchQuery('iPhone 16 vs iPhone 16');
assert('11. Adversarial', 'duplicate product names captured for downstream guard',
  dupProducts.intent === 'COMPARISON' &&
  dupProducts.constraints.comparisonEntities?.[0] === 'iPhone 16' &&
  dupProducts.constraints.comparisonEntities?.[1] === 'iPhone 16'
);

const threeProducts = parseSearchQuery('iPhone 16 vs Galaxy S25 vs Pixel 9');
assert('11. Adversarial', 'three products comparison captured cleanly',
  threeProducts.intent === 'COMPARISON' &&
  threeProducts.constraints.comparisonEntities?.[0] === 'iPhone 16' &&
  threeProducts.constraints.comparisonEntities?.[1] === 'Galaxy S25' &&
  threeProducts.constraints.multiComparisonEntities?.length === 3
);

const contradictoryQ = parseSearchQuery('cheap luxury phone under $200 and above $1000');
assert('11. Adversarial', 'contradictory constraints fail safely without throwing', contradictoryQ !== null);

// ----------------------------------------------------
// SECTION 12: RECOMMENDATION QUERY SAFETY
// ----------------------------------------------------
console.log('\n--- SECTION 12: RECOMMENDATION QUERY SAFETY ---');

const recSafety1 = parseSearchQuery('best laptop under $800');
assert('12. Safety', 'Parser does NOT assign a winner in parsed query',
  (recSafety1 as any).winner === undefined &&
  (recSafety1 as any).ranking === undefined &&
  (recSafety1 as any).selectedPick === undefined
);

const recSafety2 = parseSearchQuery('best phone for photography');
assert('12. Safety', 'Parser only extracts intent, constraints, useCase',
  recSafety2.intent === 'RECOMMENDATION' &&
  recSafety2.constraints.useCase === 'photography' &&
  recSafety2.constraints.productType === 'smartphone'
);

// ----------------------------------------------------
// SECTION 13: QUERY NORMALIZATION
// ----------------------------------------------------
console.log('\n--- SECTION 13: QUERY NORMALIZATION ---');

const norm1 = parseSearchQuery('   Sony   WH-1000XM5   ');
assert('13. Normalization', 'Whitespace normalized but model number preserved',
  norm1.cleanQuery === 'Sony WH-1000XM5' &&
  norm1.intent === 'EXACT_ENTITY'
);

const norm2 = parseSearchQuery('laptop under $800 but not gaming');
assert('13. Normalization', 'Negation not destroyed during normalization',
  norm2.constraints.negativeConstraints?.includes('gaming') === true
);

// ----------------------------------------------------
// SECTION 14: SINGLE-PRODUCT REGRESSION
// ----------------------------------------------------
console.log('\n--- SECTION 14: SINGLE-PRODUCT REGRESSION ---');

const spReg1 = parseSearchQuery('iPhone 16 Pro Max');
assert('14. SP Regression', 'iPhone 16 Pro Max -> EXACT_ENTITY', spReg1.intent === 'EXACT_ENTITY');

const spReg2 = parseSearchQuery('Sony WH-1000XM5 review');
assert('14. SP Regression', 'Sony WH-1000XM5 review -> EXACT_ENTITY', spReg2.intent === 'EXACT_ENTITY');

const spReg3 = parseSearchQuery('best laptop under 50000', 'IN');
assert('14. SP Regression', 'best laptop under 50000 -> RECOMMENDATION, budget: 50000, INR',
  spReg3.intent === 'RECOMMENDATION' &&
  spReg3.constraints.budget === 50000 &&
  spReg3.constraints.currency === '₹'
);

const spReg4 = parseSearchQuery('Samsung Galaxy S24 Ultra battery life');
assert('14. SP Regression', 'Samsung Galaxy S24 Ultra battery life -> GENERAL_LOOKUP', spReg4.intent === 'GENERAL_LOOKUP');

// ----------------------------------------------------
// SECTION 15: COMPARISON REGRESSION
// ----------------------------------------------------
console.log('\n--- SECTION 15: COMPARISON REGRESSION ---');

const compReg1 = parseSearchQuery('iPhone 16 vs Galaxy S25');
assert('15. Comp Regression', 'iPhone 16 vs Galaxy S25 entities preserved',
  compReg1.intent === 'COMPARISON' &&
  compReg1.constraints.comparisonEntities?.[0] === 'iPhone 16' &&
  compReg1.constraints.comparisonEntities?.[1] === 'Galaxy S25'
);

const compReg2 = parseSearchQuery('Sony XM5 vs Bose QC Ultra');
assert('15. Comp Regression', 'Sony XM5 vs Bose QC Ultra entities preserved',
  compReg2.intent === 'COMPARISON' &&
  compReg2.constraints.comparisonEntities?.[0] === 'Sony XM5' &&
  compReg2.constraints.comparisonEntities?.[1] === 'Bose QC Ultra'
);

const compReg3 = parseSearchQuery('compare MacBook Air M4 and Dell XPS 13');
assert('15. Comp Regression', 'compare MacBook Air M4 and Dell XPS 13 entities preserved',
  compReg3.intent === 'COMPARISON' &&
  compReg3.constraints.comparisonEntities?.[0] === 'MacBook Air M4' &&
  compReg3.constraints.comparisonEntities?.[1] === 'Dell XPS 13'
);

const compReg4 = parseSearchQuery('Sony A7 IV versus Canon R6 II');
assert('15. Comp Regression', 'Sony A7 IV versus Canon R6 II entities preserved',
  compReg4.intent === 'COMPARISON' &&
  compReg4.constraints.comparisonEntities?.[0] === 'Sony A7 IV' &&
  compReg4.constraints.comparisonEntities?.[1] === 'Canon R6 II'
);

// ----------------------------------------------------
// SECTION 16: DOWNSTREAM RESEARCH HANDOFF
// ----------------------------------------------------
console.log('\n--- SECTION 16: DOWNSTREAM RESEARCH HANDOFF ---');

// Verify executeSearch handles the parsed query cleanly
const resComparison = await executeSearch('iPhone 16 vs Galaxy S25');
assert('16. Downstream Handoff', 'executeSearch comparison returns parsed query',
  resComparison.parsedQuery.intent === 'COMPARISON' &&
  resComparison.parsedQuery.constraints.comparisonEntities?.[0] === 'iPhone 16'
);

const resExact = await executeSearch('iPhone 16 Pro Max');
assert('16. Downstream Handoff', 'executeSearch exact entity returns parsed query',
  resExact.parsedQuery.intent === 'EXACT_ENTITY'
);

const resRec = await executeSearch('best laptop under $800');
assert('16. Downstream Handoff', 'executeSearch recommendation returns parsed query',
  resRec.parsedQuery.intent === 'RECOMMENDATION' &&
  resRec.parsedQuery.constraints.budget === 800
);

// ----------------------------------------------------
// SECTION 17: SAFETY & TRUST RULES
// ----------------------------------------------------
console.log('\n--- SECTION 17: SAFETY & TRUST RULES ---');

const safetyParsed = parseSearchQuery('best phone');
assert('17. Safety & Trust', 'No numerical scores or ranks in parsed query',
  (safetyParsed as any).score === undefined &&
  (safetyParsed as any).rank === undefined
);

assert('17. Safety & Trust', 'Constraints only contain explicit user data',
  safetyParsed.constraints.budget === undefined &&
  safetyParsed.constraints.useCase === undefined
);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
const total = results.length;
const passed = results.filter(r => r.passed).length;
const failed = total - passed;

console.log('\n====================================================');
console.log(`AUDIT RESULTS: ${passed}/${total} TESTS PASSED (${failed} failures)`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
