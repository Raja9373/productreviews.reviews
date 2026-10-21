import { useState, useEffect, useCallback } from 'react';
import { SEOAuditItem, SEOAuditSummary, SEOStatusLevel } from './seoAuditTypes';

function extractAllJsonLdEntities(doc: Document): { types: string[]; rawEntities: any[] } {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const types: string[] = [];
  const rawEntities: any[] = [];

  const visit = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    if (obj['@type']) {
      const t = String(obj['@type']);
      types.push(t);
      rawEntities.push(obj);
    }
    if (Array.isArray(obj['@graph'])) {
      for (const item of obj['@graph']) visit(item);
    }
    for (const key of Object.keys(obj)) {
      if (key !== '@graph' && typeof obj[key] === 'object') {
        visit(obj[key]);
      }
    }
  };

  scripts.forEach((script) => {
    try {
      const content = script.textContent?.trim();
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          parsed.forEach(visit);
        } else {
          visit(parsed);
        }
      }
    } catch {}
  });

  return { types: Array.from(new Set(types)), rawEntities };
}

export function performSeoAudit(): SEOAuditSummary {
  if (typeof document === 'undefined') {
    return {
      score: 100,
      totalChecks: 0,
      passedCount: 0,
      warningCount: 0,
      failedCount: 0,
      timestamp: new Date().toISOString(),
      pageUrl: '',
      items: [],
      detectedSchemas: [],
    };
  }

  const items: SEOAuditItem[] = [];
  const { types: detectedTypes, rawEntities } = extractAllJsonLdEntities(document);

  // Helper to find specific entity in parsed JSON-LD
  const findEntity = (type: string) => rawEntities.find((e) => e['@type'] === type);

  const productEntity = findEntity('Product');
  const reviewEntity = findEntity('Review') || (productEntity?.review && (Array.isArray(productEntity.review) ? productEntity.review[0] : productEntity.review));
  const aggregateRatingEntity = findEntity('AggregateRating') || productEntity?.aggregateRating;

  // 1. Structured Data: Product Schema
  if (productEntity) {
    const hasName = Boolean(productEntity.name);
    items.push({
      id: 'schema-product',
      name: 'Product Schema (Schema.org)',
      category: 'STRUCTURED_DATA',
      status: hasName ? 'passed' : 'warning',
      isRequired: true,
      value: productEntity.name || 'Found (Missing name)',
      message: hasName
        ? `Valid Product entity detected for "${productEntity.name}".`
        : 'Product entity exists but missing required "name" attribute.',
      details: `Entity ID: ${productEntity['@id'] || 'None'} | Category: ${productEntity.category || 'N/A'}`,
      fix: hasName
        ? undefined
        : {
            title: 'Add Product Name & Category',
            description: 'Ensure the Product JSON-LD block has a descriptive name matching the product under review.',
            codeType: 'json',
            location: '<script type="application/ld+json"> inside <head>',
            codeSnippet: `"@type": "Product",\n"name": "Apple iPhone 16 Pro",\n"category": "Smartphones"`,
          },
    });
  } else {
    items.push({
      id: 'schema-product',
      name: 'Product Schema (Schema.org)',
      category: 'STRUCTURED_DATA',
      status: 'failed',
      isRequired: true,
      value: null,
      message: 'Missing Schema.org Product entity. Google requires this for rich snippet eligibility.',
      details: 'Product review pages must declare a Product entity with either Review or AggregateRating.',
      fix: {
        title: 'Inject Product Structured Data',
        description: 'Add a Product JSON-LD graph block in the HTML head.',
        codeType: 'json',
        location: '<head> block as <script type="application/ld+json">',
        codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Product Name",\n  "category": "Consumer Electronics"\n}\n</script>`,
      },
    });
  }

  // 2. Structured Data: Review Schema
  if (reviewEntity) {
    const hasReviewBody = Boolean(reviewEntity.reviewBody || reviewEntity.description);
    const hasAuthor = Boolean(reviewEntity.author);
    const isFull = hasReviewBody && hasAuthor;
    items.push({
      id: 'schema-review',
      name: 'Review Schema (Schema.org)',
      category: 'STRUCTURED_DATA',
      status: isFull ? 'passed' : 'warning',
      isRequired: true,
      value: reviewEntity.name || 'Review Detected',
      message: isFull
        ? 'Valid Review entity with author and review body detected.'
        : 'Review entity found but author or reviewBody is missing.',
      details: `Author: ${typeof reviewEntity.author === 'object' ? reviewEntity.author.name : reviewEntity.author || 'Unspecified'}`,
      fix: isFull
        ? undefined
        : {
            title: 'Complete Review Body & Author',
            description: 'Provide an author organization and verdict body for full editorial credibility.',
            codeType: 'json',
            location: 'Inside Product.review or top-level Review entity',
            codeSnippet: `"review": {\n  "@type": "Review",\n  "name": "Apple iPhone 16 Pro Review",\n  "reviewBody": "Comprehensive verdict rationale...",\n  "author": {\n    "@type": "Organization",\n    "name": "productreviews.review Editorial Board"\n  }\n}`,
          },
    });
  } else {
    items.push({
      id: 'schema-review',
      name: 'Review Schema (Schema.org)',
      category: 'STRUCTURED_DATA',
      status: 'failed',
      isRequired: true,
      value: null,
      message: 'No Review entity detected. Google requires a Review node to show reviewer attribution.',
      details: 'Without Review schema, Google cannot display editorial review snippets.',
      fix: {
        title: 'Add Review Schema to Product',
        description: 'Embed a Review object inside your Product structured data.',
        codeType: 'json',
        location: '<script type="application/ld+json">',
        codeSnippet: `"review": {\n  "@type": "Review",\n  "name": "Hardware Review",\n  "reviewBody": "Key verdict and findings...",\n  "author": {\n    "@type": "Organization",\n    "name": "Editorial Research Board"\n  }\n}`,
      },
    });
  }

  // 3. Structured Data: AggregateRating Schema
  if (aggregateRatingEntity) {
    const val = aggregateRatingEntity.ratingValue;
    items.push({
      id: 'schema-aggregate-rating',
      name: 'AggregateRating Schema',
      category: 'STRUCTURED_DATA',
      status: val ? 'passed' : 'warning',
      isRequired: false,
      value: val ? `${val} / ${aggregateRatingEntity.bestRating || '5'}` : 'Detected (Missing ratingValue)',
      message: val
        ? `AggregateRating verified (${val}/${aggregateRatingEntity.bestRating || '5'} across ${aggregateRatingEntity.reviewCount || aggregateRatingEntity.ratingCount || 'aggregated'} reviews).`
        : 'AggregateRating present but ratingValue attribute is undefined.',
      details: `Rating Count: ${aggregateRatingEntity.ratingCount || aggregateRatingEntity.reviewCount || 'N/A'}`,
      fix: undefined,
    });
  } else {
    // Note: ProductReviews.review maintains zero fabricated rating numbers for editorial integrity,
    // so this is a recommendation/warning for products with real aggregated merchant metrics.
    items.push({
      id: 'schema-aggregate-rating',
      name: 'AggregateRating Schema',
      category: 'STRUCTURED_DATA',
      status: 'warning',
      isRequired: false,
      value: 'Not Configured (Optional)',
      message: 'No AggregateRating schema detected. Star ratings in Google SERPs require verified aggregate metrics.',
      details: 'Editorial policy strictly prohibits fabricated star ratings. Only include if backed by multi-source metrics.',
      fix: {
        title: 'Add Verified AggregateRating (When Supported)',
        description: 'If verified aggregated customer or benchmark scores exist, inject AggregateRating under Product.',
        codeType: 'json',
        location: 'Inside Product entity',
        codeSnippet: `"aggregateRating": {\n  "@type": "AggregateRating",\n  "ratingValue": "4.8",\n  "reviewCount": "128",\n  "bestRating": "5",\n  "worstRating": "1"\n}`,
      },
    });
  }

  // 4. Structured Data: FAQPage Schema
  const hasFaq = detectedTypes.includes('FAQPage');
  items.push({
    id: 'schema-faq',
    name: 'FAQPage Schema (Google PAA Rich Snippets)',
    category: 'STRUCTURED_DATA',
    status: hasFaq ? 'passed' : 'warning',
    isRequired: false,
    value: hasFaq ? 'FAQPage Schema Active' : 'Missing',
    message: hasFaq
      ? 'FAQPage schema detected. Enables interactive accordion answers in search results.'
      : 'No FAQPage schema found. High-intent buyer questions enhance visibility in Google PAA.',
    details: 'Covers warranties, compatibility, return policies, and purchase advice.',
    fix: hasFaq
      ? undefined
      : {
          title: 'Implement FAQPage JSON-LD',
          description: 'Embed high-intent buyer FAQs matching the visible FAQ section on the page.',
          codeType: 'json',
          location: '<script type="application/ld+json">',
          codeSnippet: `{\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "Is this product covered by manufacturer warranty?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Yes, covered by standard 1-year brand warranty."\n      }\n    }\n  ]\n}`,
        },
  });

  // 5. Structured Data: BreadcrumbList Schema
  const hasBreadcrumbs = detectedTypes.includes('BreadcrumbList');
  items.push({
    id: 'schema-breadcrumb',
    name: 'BreadcrumbList Schema',
    category: 'STRUCTURED_DATA',
    status: hasBreadcrumbs ? 'passed' : 'warning',
    isRequired: false,
    value: hasBreadcrumbs ? 'BreadcrumbList Active' : 'Missing',
    message: hasBreadcrumbs
      ? 'BreadcrumbList schema detected. Displays clean navigation paths in Google SERPs.'
      : 'No BreadcrumbList schema detected.',
    details: 'Helps search engines understand category hierarchy (Home > Category > Product).',
    fix: hasBreadcrumbs
      ? undefined
      : {
          title: 'Add BreadcrumbList Structured Data',
          description: 'Add hierarchical breadcrumb trail.',
          codeType: 'json',
          location: '<script type="application/ld+json">',
          codeSnippet: `{\n  "@type": "BreadcrumbList",\n  "itemListElement": [\n    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://productreviews.review/" },\n    { "@type": "ListItem", "position": 2, "name": "Category", "item": "https://productreviews.review/?category=smartphones" }\n  ]\n}`,
        },
  });

  // 6. Meta Tag: Page Title
  const title = document.title || '';
  const titleLength = title.length;
  let titleStatus: SEOStatusLevel = 'passed';
  let titleMsg = `Title is optimal (${titleLength} characters).`;
  if (!title) {
    titleStatus = 'failed';
    titleMsg = 'Page title is empty or missing.';
  } else if (titleLength < 25) {
    titleStatus = 'warning';
    titleMsg = `Title is too short (${titleLength} chars). Aim for 30–60 characters.`;
  } else if (titleLength > 70) {
    titleStatus = 'warning';
    titleMsg = `Title may truncate on Google SERP (${titleLength} chars). Max 65 chars recommended.`;
  }
  items.push({
    id: 'meta-title',
    name: '<title> Tag',
    category: 'META_TAGS',
    status: titleStatus,
    isRequired: true,
    value: title || 'Missing',
    message: titleMsg,
    details: `Current length: ${titleLength} chars`,
    fix: titleStatus === 'passed' ? undefined : {
      title: 'Update <title> Tag',
      description: 'Set a distinctive, keyword-rich title under 65 characters.',
      codeType: 'html',
      location: '<head> element',
      codeSnippet: `<title>Product Name Review: Benchmark & Hardware Evidence | productreviews.review</title>`,
    },
  });

  // 7. Meta Tag: Description
  const descEl = document.querySelector('meta[name="description"]');
  const desc = descEl?.getAttribute('content') || '';
  const descLength = desc.length;
  let descStatus: SEOStatusLevel = 'passed';
  let descMsg = `Meta description is well-formed (${descLength} characters).`;
  if (!desc) {
    descStatus = 'failed';
    descMsg = 'Meta description is missing entirely.';
  } else if (descLength < 50) {
    descStatus = 'warning';
    descMsg = `Description is very short (${descLength} chars). Recommended: 120–160 chars.`;
  } else if (descLength > 170) {
    descStatus = 'warning';
    descMsg = `Description is long (${descLength} chars) and may truncate in mobile snippets.`;
  }
  items.push({
    id: 'meta-description',
    name: 'Meta Description',
    category: 'META_TAGS',
    status: descStatus,
    isRequired: true,
    value: desc || 'Missing',
    message: descMsg,
    details: `Length: ${descLength} chars`,
    fix: descStatus === 'passed' ? undefined : {
      title: 'Set Concise Meta Description',
      description: 'Write an actionable 120–160 character summary.',
      codeType: 'html',
      location: '<head> element',
      codeSnippet: `<meta name="description" content="In-depth objective review of [Product]: lab benchmarks, battery runtime, real-world camera performance, and verified buying verdict." />`,
    },
  });

  // 8. Meta Tag: Canonical Link
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  const canonicalHref = canonicalEl?.getAttribute('href') || '';
  let canonicalStatus: SEOStatusLevel = 'passed';
  let canonicalMsg = `Canonical URL properly configured: ${canonicalHref}`;
  if (!canonicalHref) {
    canonicalStatus = 'failed';
    canonicalMsg = 'Missing <link rel="canonical"> tag. Risk of duplicate content issues.';
  } else if (!canonicalHref.startsWith('https://productreviews.review')) {
    canonicalStatus = 'warning';
    canonicalMsg = `Canonical points to unexpected host: ${canonicalHref}`;
  }
  items.push({
    id: 'meta-canonical',
    name: 'Canonical URL (<link rel="canonical">)',
    category: 'META_TAGS',
    status: canonicalStatus,
    isRequired: true,
    value: canonicalHref || 'Missing',
    message: canonicalMsg,
    details: canonicalHref.startsWith('https://') ? 'Protocol: HTTPS (Secure)' : 'Warning: Non-HTTPS',
    fix: canonicalStatus === 'passed' ? undefined : {
      title: 'Add Canonical Tag',
      description: 'Define the self-referential canonical URL to prevent duplication penalties.',
      codeType: 'html',
      location: '<head> element',
      codeSnippet: `<link rel="canonical" href="https://productreviews.review/review/product-slug" />`,
    },
  });

  // 9. Meta Tag: Robots Directives
  const robotsEl = document.querySelector('meta[name="robots"]');
  const robotsContent = robotsEl?.getAttribute('content') || '';
  const isNoIndex = robotsContent.includes('noindex');
  const hasSnippets = robotsContent.includes('max-snippet') || robotsContent.includes('max-image-preview');
  items.push({
    id: 'meta-robots',
    name: 'Robots Directives (<meta name="robots">)',
    category: 'META_TAGS',
    status: isNoIndex ? 'warning' : 'passed',
    isRequired: true,
    value: robotsContent || 'None (Default index, follow)',
    message: isNoIndex
      ? 'Warning: "noindex" directive active on this page. Search engines will NOT index it.'
      : 'Robots directive allows search indexing and rich preview snippets.',
    details: hasSnippets ? 'Large image and video snippet directives active.' : 'Standard directive.',
    fix: isNoIndex ? {
      title: 'Enable Search Indexing',
      description: 'Remove noindex directive when ready to publish to search engines.',
      codeType: 'html',
      location: '<head> element',
      codeSnippet: `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    } : undefined,
  });

  // 10. Meta Tag: OpenGraph & Social Sharing
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
  const hasOg = Boolean(ogTitle && ogDesc);
  items.push({
    id: 'meta-opengraph',
    name: 'OpenGraph & Social Tags (og:title, og:description)',
    category: 'META_TAGS',
    status: hasOg ? 'passed' : 'warning',
    isRequired: false,
    value: hasOg ? `og:title: "${ogTitle}"` : 'Missing or Incomplete',
    message: hasOg
      ? 'Social preview metadata is properly configured.'
      : 'Missing OpenGraph tags. Links shared on WhatsApp, Twitter, or Slack may look broken.',
    details: `og:title: ${ogTitle || 'N/A'}`,
    fix: hasOg ? undefined : {
      title: 'Add OpenGraph Tags',
      description: 'Add social preview tags for rich link sharing.',
      codeType: 'html',
      location: '<head> element',
      codeSnippet: `<meta property="og:title" content="Product Review | productreviews.review" />\n<meta property="og:description" content="Verified technical analysis and buying advice." />\n<meta property="og:type" content="article" />`,
    },
  });

  // 11. Content Signal: Visible H1 Tag
  const h1Elements = document.querySelectorAll('h1');
  const h1Count = h1Elements.length;
  const firstH1Text = h1Elements[0]?.textContent?.trim() || '';
  let h1Status: SEOStatusLevel = 'passed';
  let h1Msg = `Single primary H1 found: "${firstH1Text.slice(0, 50)}..."`;
  if (h1Count === 0) {
    h1Status = 'failed';
    h1Msg = 'No <h1> heading detected on the page. Search engines require a clear primary H1.';
  } else if (h1Count > 1) {
    h1Status = 'warning';
    h1Msg = `Multiple H1 headings detected (${h1Count}). Best SEO practice is exactly one H1 per page.`;
  }
  items.push({
    id: 'content-h1',
    name: 'Primary <h1> Heading',
    category: 'CONTENT_SIGNALS',
    status: h1Status,
    isRequired: true,
    value: firstH1Text || 'None',
    message: h1Msg,
    details: `Total H1 count on page: ${h1Count}`,
    fix: h1Status === 'passed' ? undefined : {
      title: 'Ensure Exactly One Visible <h1>',
      description: 'Wrap the primary article headline in an <h1> tag.',
      codeType: 'html',
      location: '<article> header',
      codeSnippet: `<h1 class="text-3xl font-bold font-serif text-zinc-950">Product Name Review & Evidence Analysis</h1>`,
    },
  });

  // 12. Content Signal: Authoritative Verdict & Decision Signal
  const bodyText = document.body?.innerText || '';
  const hasDecision =
    bodyText.includes('RECOMMENDED') ||
    bodyText.includes('BUY IF') ||
    bodyText.includes('DONT BUY') ||
    bodyText.includes('TOP PICK') ||
    bodyText.includes('Decision Card') ||
    bodyText.includes('Buying Verdict');
  items.push({
    id: 'content-verdict',
    name: 'Authoritative Verdict & Decision Signal',
    category: 'CONTENT_SIGNALS',
    status: hasDecision ? 'passed' : 'warning',
    isRequired: true,
    value: hasDecision ? 'Decision Verdict Present' : 'No explicit verdict found',
    message: hasDecision
      ? 'Page contains an unambiguous purchase recommendation and verdict.'
      : 'No clear verdict badge found. Google helpful content systems reward definitive buying advice.',
    details: 'Editorial criteria: Clear BUY, BUY IF, or AVOID recommendation.',
    fix: hasDecision ? undefined : {
      title: 'Add Clear Verdict Card',
      description: 'Display an upfront verdict box with clear rationale.',
      codeType: 'html',
      location: 'Above the fold in the review article',
      codeSnippet: `<div class="bg-zinc-50 border-2 border-zinc-900 p-6 rounded-lg">\n  <span class="bg-emerald-700 text-white px-3 py-1 font-bold">RECOMMENDED • BUY</span>\n  <h2 class="text-xl font-bold mt-3">Clear Buy for Creators and Professionals</h2>\n</div>`,
    },
  });

  // Compute overall score
  const passedCount = items.filter((i) => i.status === 'passed').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;
  const failedCount = items.filter((i) => i.status === 'failed').length;

  // Passed = 100%, Warning = 70%, Failed = 0% weighted
  const rawScore = items.length > 0 ? (passedCount * 100 + warningCount * 65) / items.length : 100;
  const score = Math.round(rawScore);

  return {
    score,
    totalChecks: items.length,
    passedCount,
    warningCount,
    failedCount,
    timestamp: new Date().toISOString(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    items,
    detectedSchemas: detectedTypes,
  };
}

export function useSeoAudit(refreshIntervalMs = 2500) {
  const [summary, setSummary] = useState<SEOAuditSummary>(performSeoAudit);

  const rescan = useCallback(() => {
    setSummary(performSeoAudit());
  }, []);

  useEffect(() => {
    // Initial scan after DOM paint
    const t1 = setTimeout(rescan, 200);
    const t2 = setTimeout(rescan, 1200);

    // Watch for DOM / head changes
    const observer = new MutationObserver(() => {
      rescan();
    });

    if (document.head) {
      observer.observe(document.head, { childList: true, subtree: true, attributes: true });
    }
    const root = document.getElementById('root');
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
    }

    const interval = setInterval(rescan, refreshIntervalMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
      observer.disconnect();
    };
  }, [rescan, refreshIntervalMs]);

  return { summary, rescan };
}
