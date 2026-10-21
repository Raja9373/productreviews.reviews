/**
 * ProductReviews.review — Automated FAQContentBridge
 * 
 * Automatically scans product review records, categories, and titles,
 * mapping them to high-performing search keywords and pre-populated
 * FAQ items from the comprehensive FAQ and keyword database.
 */

import { FAQItem, getFaqsForCategory } from '../seo/faqData';
import { COMPREHENSIVE_MASTER_DATA } from '../seo/comprehensiveKeywords';

export interface EnrichedFaqResult {
  categorySlug: string;
  categoryName: string;
  keywords: string[];
  faqs: FAQItem[];
  schemaMarkup: string;
}

/**
   * Scans a given product title, query, or category name and automatically
   * inherits relevant long-tail search keywords and pre-populated FAQ items.
   */
export function bridgeFaqsForQuery(queryOrCategory: string): EnrichedFaqResult {
  const normalized = (queryOrCategory || '').toLowerCase();

  // Find matching master category data
  let matchedCategory = COMPREHENSIVE_MASTER_DATA.find((cat) =>
    normalized.includes(cat.categorySlug) ||
    normalized.includes(cat.categoryName.toLowerCase()) ||
    cat.highVolumeKeywords.some((kw) => normalized.includes(kw.toLowerCase()))
  );

  if (!matchedCategory) {
    if (normalized.includes('audio') || normalized.includes('earbud') || normalized.includes('headphone') || normalized.includes('headset') || normalized.includes('sound') || normalized.includes('sony') || normalized.includes('bose') || normalized.includes('airpods')) {
      matchedCategory = COMPREHENSIVE_MASTER_DATA.find((c) => c.categorySlug === 'audio');
    } else if (normalized.includes('phone') || normalized.includes('mobile') || normalized.includes('iphone') || normalized.includes('oneplus') || normalized.includes('samsung')) {
      matchedCategory = COMPREHENSIVE_MASTER_DATA.find((c) => c.categorySlug === 'smartphones');
    } else if (normalized.includes('laptop') || normalized.includes('macbook') || normalized.includes('computer') || normalized.includes('vivobook') || normalized.includes('ideapad')) {
      matchedCategory = COMPREHENSIVE_MASTER_DATA.find((c) => c.categorySlug === 'laptops');
    } else if (normalized.includes('tv') || normalized.includes('oled') || normalized.includes('display') || normalized.includes('bravia')) {
      matchedCategory = COMPREHENSIVE_MASTER_DATA.find((c) => c.categorySlug === 'tvs');
    } else if (normalized.includes('ac') || normalized.includes('conditioner') || normalized.includes('appliance') || normalized.includes('vacuum') || normalized.includes('daikin')) {
      matchedCategory = COMPREHENSIVE_MASTER_DATA.find((c) => c.categorySlug === 'appliances');
    } else {
      matchedCategory = COMPREHENSIVE_MASTER_DATA.find((c) => c.categorySlug === 'amazon-shopping-guide');
    }
  }

  const categorySlug = matchedCategory?.categorySlug || 'amazon-shopping-guide';
  const categoryName = matchedCategory?.categoryName || 'Amazon Shopping & Buyer Protection';
  const keywords = matchedCategory?.highVolumeKeywords || [];
  
  // Combine category specific FAQs with universal Amazon shopping safety FAQs
  const baseFaqs = getFaqsForCategory(categorySlug);
  const universalFaqs = getFaqsForCategory('amazon');

  // Deduplicate by question text
  const seenQ = new Set<string>();
  const faqs: FAQItem[] = [];

  for (const f of [...baseFaqs, ...universalFaqs]) {
    const cleanQ = f.question.trim().toLowerCase();
    if (!seenQ.has(cleanQ)) {
      seenQ.add(cleanQ);
      faqs.push(f);
    }
  }

  // Generate FAQPage schema markup
  const schemaObj = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return {
    categorySlug,
    categoryName,
    keywords,
    faqs,
    schemaMarkup: JSON.stringify(schemaObj, null, 2),
  };
}

/**
 * Automatically injects the bridged FAQ schema into the document head
 * for any active review or product record.
 */
export function injectBridgedFaqForPage(queryOrCategory: string, scriptId = 'bridged-faq-schema-jsonld'): EnrichedFaqResult {
  const result = bridgeFaqsForQuery(queryOrCategory);

  if (typeof document !== 'undefined') {
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      scriptEl.textContent = result.schemaMarkup;
      document.head.appendChild(scriptEl);
    } else {
      scriptEl.textContent = result.schemaMarkup;
    }
  }

  return result;
}
