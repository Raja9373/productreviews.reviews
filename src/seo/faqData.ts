/**
 * Predefined Canonical FAQ Data & Schema.org FAQPage Builder
 * 
 * Targets high-intent Google "People Also Ask" queries regarding:
 * - Product testing & scoring methodology
 * - Merchant independence & zero commission bias
 * - Multi-currency & regional market pricing
 * - Head-to-head comparison algorithms
 * - Continuous data & price verification
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export const PREDEFINED_FAQS: FAQItem[] = [
  {
    question: 'How does productreviews.review evaluate and score products?',
    answer:
      'productreviews.review evaluates products using an objective decision framework that analyzes verified technical specifications, independent benchmark data, aggregated consumer feedback, and documented real-world performance metrics rather than subjective opinion.',
  },
  {
    question: 'Are product recommendations influenced by merchant commissions or sponsorships?',
    answer:
      'No. productreviews.review operates with zero merchant bias. Products are ranked strictly by objective utility, specifications, build quality, and verified value-for-money. We never accept paid placement or merchant sponsorships.',
  },
  {
    question: 'How does productreviews.review determine regional pricing and availability?',
    answer:
      'Our multi-market resolution engine automatically identifies market context from user settings, regional store endpoints (such as Amazon US, UK, Germany, India, Japan, Canada), and explicit currency queries to display localized pricing notes and in-stock variants.',
  },
  {
    question: 'How are head-to-head product comparisons and trade-offs generated?',
    answer:
      'Our comparison engine performs side-by-side spec alignment, calculating distinct trade-offs, strengths, and drawbacks across hardware performance, battery endurance, software support, ergonomics, and cost efficiency.',
  },
  {
    question: 'Can I compare products across different brands and categories?',
    answer:
      'Yes. You can enter any comparison query (for example, "Sony A7 IV vs Canon R6 Mark II" or "M3 MacBook Air vs Dell XPS 13") to receive instant, structured side-by-side trade-off matrices and verdict summaries.',
  },
  {
    question: 'How often are product reviews and pricing recommendations updated?',
    answer:
      'Product specifications and market pricing are continuously verified and refreshed against global merchant inventories and new product release cycles to maintain high editorial and decision accuracy.',
  },
  {
    question: 'What makes productreviews.review different from traditional review blogs?',
    answer:
      'Unlike conventional blogs filled with affiliate fluff and narrative padding, productreviews.review delivers concise, data-backed decision syntheses, clear winner callouts, explicit trade-offs, and interactive criteria filters in a fast, ad-light interface.',
  },
  {
    question: 'How does the search and decision engine analyze pros and cons?',
    answer:
      'Pros and cons are extracted and categorized across real customer long-term reliability reports, thermal performance, build materials, firmware stability, and customer support history.',
  },
];

/**
 * Builds standard Schema.org FAQPage JSON-LD entity
 */
export function buildFaqPageSchema(faqs: FAQItem[] = PREDEFINED_FAQS) {
  return {
    '@type': 'FAQPage',
    '@id': 'https://productreviews.review/#faq',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };
}

export default PREDEFINED_FAQS;
