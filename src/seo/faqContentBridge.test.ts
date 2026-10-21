import { bridgeFaqsForQuery, injectBridgedFaqForPage } from './FAQContentBridge';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${msg}`);
    process.exit(1);
  }
}

console.log('🧪 Starting FAQContentBridge Test Suite...');

// Test 1: Smartphone query bridge
const phoneBridge = bridgeFaqsForQuery('Apple iPhone 16 Pro Smartphone Review');
assert(phoneBridge.categorySlug === 'smartphones', 'Should map iPhone query to smartphones category');
assert(phoneBridge.faqs.length >= 8, 'Should inherit both smartphone and Amazon shopping FAQs');
assert(phoneBridge.keywords.length > 0, 'Should include high-volume search keywords');
assert(phoneBridge.schemaMarkup.includes('"@type": "FAQPage"'), 'Schema markup must be valid FAQPage JSON-LD');
console.log('✅ [Test 1 Passed] Smartphone query successfully bridged with keywords and FAQs.');

// Test 2: Laptop query bridge
const laptopBridge = bridgeFaqsForQuery('MacBook Air M3 Laptop');
assert(laptopBridge.categorySlug === 'laptops', 'Should map laptop query to laptops category');
assert(laptopBridge.faqs.some((f) => f.question.toLowerCase().includes('unified memory')), 'Should include RAM/memory FAQ');
console.log('✅ [Test 2 Passed] Laptop query successfully bridged.');

// Test 3: DOM injection simulation
(global as any).document = {
  getElementById: (id: string) => null,
  createElement: (tag: string) => ({ id: '', type: '', textContent: '' }),
  head: {
    appendChild: (el: any) => {
      assert(el.type === 'application/ld+json', 'Injected element must be jsonld script');
      assert(el.textContent.includes('FAQPage'), 'Injected content must contain FAQPage');
    },
  },
};

const injected = injectBridgedFaqForPage('Sony WH-1000XM5 Wireless Headphones');
assert(injected.categorySlug === 'audio', 'Should map headphones to audio category');

console.log('🎉 FAQContentBridge Test Suite Passed Successfully!');
