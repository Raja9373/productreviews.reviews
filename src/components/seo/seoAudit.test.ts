import { performSeoAudit } from './useSeoAudit';
import { SEOAuditItem } from './seoAuditTypes';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${msg}`);
    process.exit(1);
  }
}

console.log('🧪 Starting SEOStatusIndicator & SEOStatusReport Test Suite...');

// Test 1: Node environment safety (when document is undefined/mocked)
const initialAudit = performSeoAudit();
assert(typeof initialAudit.score === 'number', 'Score must be a number');
assert(Array.isArray(initialAudit.items), 'Items must be an array');
console.log('✅ [Test 1 Passed] Initial audit executes safely in any JS environment.');

// Test 2: Mock DOM with missing Product & Review schemas
const mockScripts: string[] = [];
const mockMetas: Record<string, string> = {
  'description': 'Short description',
  'robots': 'noindex, follow',
};

// Create a simulated DOM environment
(global as any).document = {
  title: 'Apple iPhone 16 Pro Review: In-Depth Benchmarks & Hardware Analysis',
  head: {
    querySelector: (sel: string) => null,
  },
  body: {
    innerText: 'RECOMMENDED • BUY. Clear Buy for Flagship Smartphone Users.',
  },
  querySelectorAll: (sel: string) => {
    if (sel === 'script[type="application/ld+json"]') {
      return mockScripts.map((content) => ({ textContent: content }));
    }
    if (sel === 'h1') {
      return [{ textContent: 'Apple iPhone 16 Pro Review & Technical Analysis' }];
    }
    return [];
  },
  querySelector: (sel: string) => {
    if (sel === 'meta[name="description"]') {
      return { getAttribute: () => mockMetas['description'] };
    }
    if (sel === 'meta[name="robots"]') {
      return { getAttribute: () => mockMetas['robots'] };
    }
    if (sel === 'link[rel="canonical"]') {
      return { getAttribute: () => 'https://productreviews.review/review/iphone-16-pro' };
    }
    if (sel === 'meta[property="og:title"]') {
      return { getAttribute: () => 'Apple iPhone 16 Pro Review' };
    }
    if (sel === 'meta[property="og:description"]') {
      return { getAttribute: () => 'Verified hardware benchmarks and camera analysis.' };
    }
    return null;
  },
};

// Test 2.1: Audit with NO structured data
const emptySchemaAudit = performSeoAudit();
const productItem = emptySchemaAudit.items.find((i) => i.id === 'schema-product');
const reviewItem = emptySchemaAudit.items.find((i) => i.id === 'schema-review');
const ratingItem = emptySchemaAudit.items.find((i) => i.id === 'schema-aggregate-rating');
const robotsItem = emptySchemaAudit.items.find((i) => i.id === 'meta-robots');

assert(productItem?.status === 'failed', 'Product schema must fail when not present');
assert(Boolean(productItem?.fix?.codeSnippet), 'Product fix must include actionable code snippet');
assert(reviewItem?.status === 'failed', 'Review schema must fail when not present');
assert(ratingItem?.status === 'warning', 'AggregateRating schema must show warning/optional');
assert(robotsItem?.status === 'warning', 'noindex robots tag must show warning');
console.log('✅ [Test 2 Passed] Missing Product, Review, and noindex directives flagged accurately with actionable fixes.');

// Test 2.2: Audit with valid Product, Review, and AggregateRating JSON-LD
mockScripts.push(
  JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': 'https://productreviews.review/review/iphone-16-pro#product',
        name: 'Apple iPhone 16 Pro',
        category: 'Smartphones',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '154',
          bestRating: '5',
        },
        review: {
          '@type': 'Review',
          name: 'Apple iPhone 16 Pro Review',
          reviewBody: 'The iPhone 16 Pro delivers sustained A18 Pro silicon performance...',
          author: {
            '@type': 'Organization',
            name: 'productreviews.review Editorial Board',
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Does it support 4K 120fps video?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, 4K 120fps ProRes is supported.' },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://productreviews.review/' },
        ],
      },
    ],
  })
);

mockMetas['robots'] = 'index, follow, max-image-preview:large';
mockMetas['description'] = 'Objective review of the Apple iPhone 16 Pro: A18 Pro silicon benchmarks, 4K 120fps ProRes video, Grade 5 titanium build, and real-world battery endurance.';

const richAudit = performSeoAudit();
const passedProduct = richAudit.items.find((i) => i.id === 'schema-product');
const passedReview = richAudit.items.find((i) => i.id === 'schema-review');
const passedRating = richAudit.items.find((i) => i.id === 'schema-aggregate-rating');
const passedFaq = richAudit.items.find((i) => i.id === 'schema-faq');
const passedBreadcrumb = richAudit.items.find((i) => i.id === 'schema-breadcrumb');

assert(passedProduct?.status === 'passed', 'Product schema must pass when valid');
assert(passedReview?.status === 'passed', 'Review schema must pass when valid');
assert(passedRating?.status === 'passed', 'AggregateRating must pass when valid ratingValue is found');
assert(passedFaq?.status === 'passed', 'FAQPage schema must pass');
assert(passedBreadcrumb?.status === 'passed', 'BreadcrumbList schema must pass');
assert(richAudit.score >= 95, `Expected score >= 95 for full schema, got ${richAudit.score}`);

console.log(`✅ [Test 3 Passed] Full structured data graph verified with score ${richAudit.score}/100!`);
console.log('🎉 All SEOStatusIndicator and SEOStatusReport tests passed 100%!');
