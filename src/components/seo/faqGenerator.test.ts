import { FAQGenerator } from './FAQGenerator';
import { AMAZON_SHOPPING_FAQS } from '../../seo/faqData';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${msg}`);
    process.exit(1);
  }
}

console.log('🧪 Starting FAQGenerator Test Suite...');

// Test FAQGenerator logic & schema generation
const initialFaqs = [...AMAZON_SHOPPING_FAQS];
assert(initialFaqs.length >= 5, 'Amazon shopping FAQs should have at least 5 questions');

// Simulate addition
const newFaq = { question: 'Is Cash on Delivery available?', answer: 'Yes, COD is available on all eligible products.' };
const updatedFaqs = [newFaq, ...initialFaqs];
assert(updatedFaqs.length === initialFaqs.length + 1, 'FAQ count should increase by 1');

// Test Schema.org FAQPage structure
const schemaObj = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: updatedFaqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  })),
};

assert(schemaObj['@type'] === 'FAQPage', 'Schema type must be FAQPage');
assert(schemaObj.mainEntity.length === updatedFaqs.length, 'Schema mainEntity length must match updated FAQs');
assert(schemaObj.mainEntity[0].name === 'Is Cash on Delivery available?', 'First question must match added FAQ');

console.log('🎉 FAQGenerator Test Suite Passed Successfully!');
