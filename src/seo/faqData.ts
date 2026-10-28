import { HIGH_INTENT_SEO_QUERIES } from "../content/seoKnowledgeBase";

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const BASE_EDITORIAL_FAQS: FAQItem[] = [
  {
    question: "How does productreviews.review test products?",
    answer: "Our independent editorial research team tests hardware across battery runtimes, real-world thermal loads, acoustic profiles, and long-term durability metrics without influencer bias.",
    category: "Editorial"
  },
  {
    question: "How are international Amazon prices tracked?",
    answer: "We synchronize real-time pricing and stock across Amazon US, UK, DE, FR, JP, CA, and IN with live currency exchange updates and verified ASIN monitoring.",
    category: "Pricing"
  },
  {
    question: "Do affiliate commissions influence editorial ratings or Flash Scores?",
    answer: "No. Our testing lab and editorial Flash Score algorithms operate completely independently of retailer affiliate arrangements. High scores are earned solely through hardware excellence.",
    category: "Disclosure"
  },
  {
    question: "How frequently are hardware reviews and buying guides updated?",
    answer: "Reviews and price tables are refreshed daily via automated price checks and quarterly editorial firmware and long-term durability re-evaluations.",
    category: "Freshness"
  }
];

export const GLOBAL_FAQS: FAQItem[] = [
  ...BASE_EDITORIAL_FAQS,
  ...HIGH_INTENT_SEO_QUERIES.map((q) => ({
    question: q.question,
    answer: `${q.shortAnswer} ${q.detailedAnalysis}`,
    category: q.category
  }))
];

export function exportFaqManifestJson(baseUrl: string = "https://productreviews.review", pretty: boolean = true): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq-manifest`,
    "mainEntity": GLOBAL_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return pretty ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
}
