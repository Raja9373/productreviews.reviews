/**
 * ProductReviews.review — Content Metadata & SEO Engine
 * Generates natural, intent-matching titles, meta descriptions, canonical URLs,
 * and structured data without numerical score fabrication or keyword stuffing.
 */

import { SynthesizedContent, ContentStructuredData, ContentMetadataState } from './contentTypes';
import { BASE_CANONICAL_URL } from '../seo/metaManager';

/**
 * Builds intent-matching, non-spammy title
 */
export function generateContentTitle(content: Partial<SynthesizedContent>): string {
  const entityName = content.entity?.name || content.entity?.model || '';
  const country = content.market?.countryCode && content.market.countryCode !== 'GLOBAL'
    ? ` in ${content.market.countryCode}`
    : '';

  switch (content.pageType) {
    case 'PRODUCT_REVIEW':
      return entityName
        ? `${entityName} Review & Verified Evidence Analysis${country}`
        : `${content.title || 'Product Research & Evidence Synthesis'}`;

    case 'COMPARISON':
      if (content.comparison?.entityAName && content.comparison?.entityBName) {
        return `${content.comparison.entityAName} vs ${content.comparison.entityBName}: Evidence & Trade-Offs`;
      }
      return `${content.title || 'Product Comparison & Evidence Synthesis'}`;

    case 'USE_CASE':
      return entityName
        ? `${entityName} Real-World Suitability & Workload Analysis`
        : `${content.title || 'Product Use-Case Evaluation'}`;

    case 'PROBLEM_SOLUTION':
      return entityName
        ? `${entityName} Reported Issues, Reliability & Known Flaws`
        : `${content.title || 'Product Issues & Flaw Analysis'}`;

    case 'ALTERNATIVE':
      return entityName
        ? `Best Verified Alternatives to ${entityName}`
        : `${content.title || 'Product Alternatives'}`;

    case 'BUYING_GUIDE':
      return content.entity?.category
        ? `${capitalize(content.entity.category)} Buying Guide: Verified Criteria & Pitfalls`
        : `${content.title || 'Buying Guide'}`;

    case 'UPGRADE_GUIDE':
      return entityName
        ? `Should You Upgrade to ${entityName}? Generation Comparison`
        : `${content.title || 'Upgrade Guide'}`;

    default:
      return content.title || `${entityName || 'Product'} Research & Evidence`;
  }
}

/**
 * Builds descriptive, non-fabricated meta description
 */
export function generateMetaDescription(content: Partial<SynthesizedContent>): string {
  const entityName = content.entity?.name || content.entity?.model || 'this product';
  const decisionText = content.decision?.decision
    ? `Current verdict: ${content.decision.decision.replace('_', ' ')}.`
    : '';

  const country = content.market?.countryCode && content.market.countryCode !== 'GLOBAL'
    ? ` for ${content.market.countryCode}`
    : '';

  switch (content.pageType) {
    case 'PRODUCT_REVIEW':
      return `Independent synthesis of verified laboratory tests, user feedback, and trade-offs for ${entityName}${country}. ${decisionText}`.slice(0, 160);

    case 'COMPARISON':
      return `Head-to-head comparison of ${content.comparison?.entityAName || 'Product A'} versus ${content.comparison?.entityBName || 'Product B'} based on empirical evidence and trade-offs.`.slice(0, 160);

    case 'USE_CASE':
      return `Detailed workload and empirical performance evaluation for ${entityName}. Discover key strengths, thermal limits, and suitability.`.slice(0, 160);

    case 'PROBLEM_SOLUTION':
      return `Comprehensive investigation of reported defects, hardware issues, and longevity reports for ${entityName}. Verified evidence without exaggeration.`.slice(0, 160);

    default:
      return `Evidence-backed product research and synthesis for ${entityName}${country}. ${decisionText}`.slice(0, 160);
  }
}

/**
 * Generates Schema.org JSON-LD structured data.
 * CRITICAL MANDATE: NEVER fabricate aggregateRating, ratingValue, reviewCount, offers, or price.
 */
export function generateStructuredData(content: Partial<SynthesizedContent>): ContentStructuredData[] {
  const schemas: ContentStructuredData[] = [];

  // 1. WebPage Schema
  const webPageSchema: ContentStructuredData = {
    schemaType: 'WebPage',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: content.title || 'Product Research & Evidence Synthesis',
      description: content.metadata?.metaDescription || '',
      url: content.metadata?.canonicalUrl || BASE_CANONICAL_URL,
      inLanguage: content.market?.language || 'en'
    },
    hasFabricatedRatings: false,
    hasFabricatedOffers: false,
    isValid: true
  };
  schemas.push(webPageSchema);

  // 2. Article / Analysis Schema
  const articleSchema: ContentStructuredData = {
    schemaType: 'Article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.title,
      description: content.metadata?.metaDescription,
      datePublished: content.generatedAt || new Date().toISOString(),
      dateModified: content.lastValidatedAt || content.generatedAt || new Date().toISOString(),
      publisher: {
        '@type': 'Organization',
        name: 'ProductReviews.review',
        url: BASE_CANONICAL_URL
      }
    },
    hasFabricatedRatings: false,
    hasFabricatedOffers: false,
    isValid: true
  };
  schemas.push(articleSchema);

  // 3. BreadcrumbList Schema
  schemas.push({
    schemaType: 'BreadcrumbList',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_CANONICAL_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.entity?.category ? capitalize(content.entity.category) : 'Research',
          item: `${BASE_CANONICAL_URL}/${content.entity?.category || 'research'}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.title || 'Overview'
        }
      ]
    },
    hasFabricatedRatings: false,
    hasFabricatedOffers: false,
    isValid: true
  });

  // 4. FAQPage Schema only if genuine FAQs exist
  if (content.faqs && content.faqs.length > 0) {
    schemas.push({
      schemaType: 'FAQPage',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      },
      hasFabricatedRatings: false,
      hasFabricatedOffers: false,
      isValid: true
    });
  }

  // Notice: We strictly DO NOT emit Product schema with fake ratings or offers.
  return schemas;
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
