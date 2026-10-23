import { contentRepository, ReviewRecord } from "../content/store/contentRepository";

export interface PilotPage {
  path: string;
  slug: string;
  type: "review" | "compare";
  title: string;
  description: string;
  record?: ReviewRecord;
  compareRecords?: [ReviewRecord, ReviewRecord];
}

export const PILOT_PAGES: PilotPage[] = [
  {
    path: "/review/apple-iphone-16-pro-max",
    slug: "apple-iphone-16-pro-max",
    type: "review",
    title: "Apple iPhone 16 Pro Max Review: Tested Verdict",
    description: "In-depth hardware review, benchmark evidence, battery runtime, and Amazon price tracking for the Apple iPhone 16 Pro Max."
  },
  {
    path: "/review/sony-wh-1000xm5",
    slug: "sony-wh-1000xm5",
    type: "review",
    title: "Sony WH-1000XM5 Review: Noise Cancelling Verdict",
    description: "Lab-tested acoustic fidelity, 30-hour battery verification, and ANC isolation benchmarks for Sony WH-1000XM5 headphones."
  },
  {
    path: "/compare/iphone-16-pro-max-vs-galaxy-s24-ultra",
    slug: "iphone-16-pro-max-vs-galaxy-s24-ultra",
    type: "compare",
    title: "iPhone 16 Pro Max vs Galaxy S24 Ultra: Tested Comparison",
    description: "Direct camera shootout, battery endurance comparison, and display benchmark analysis between Apple and Samsung flagships."
  }
];

export function getPilotPage(requestPath: string): PilotPage | undefined {
  const cleanPath = requestPath.split("?")[0].replace(/\/+$/, "");
  const staticFound = PILOT_PAGES.find((p) => p.path === cleanPath);
  if (staticFound) {
    const slug = staticFound.slug;
    const record = contentRepository.getBySlug(slug);
    if (record) staticFound.record = record;
    return staticFound;
  }

  // Dynamic review lookup from contentRepository for any published review slug
  if (cleanPath.startsWith("/review/")) {
    const slug = cleanPath.replace("/review/", "");
    const record = contentRepository.getBySlug(slug);
    if (record && record.status === "PUBLISHED") {
      return {
        path: cleanPath,
        slug: record.slug,
        type: "review",
        title: `${record.name} Review & Tested Verdict (2026)`,
        description: `${record.summary} Read our lab-tested verdict, specs, pros/cons, and regional Amazon price tracker.`,
        record
      };
    }
  }

  return undefined;
}

const MARKET_HREFLANG_MAP: Record<string, string> = {
  US: "en-us",
  IN: "en-in",
  UK: "en-gb",
  DE: "de-de",
  FR: "fr-fr",
  ES: "es-es",
  IT: "it-it",
  CA: "en-ca",
  AU: "en-au",
  JP: "ja-jp",
  BR: "pt-br",
  MX: "es-mx",
  NL: "nl-nl",
  SG: "en-sg"
};

export function renderPilotHtml(pilotPage: PilotPage, baseHtml: string): string {
  const canonicalUrl = `https://productreviews.review${pilotPage.path}`;
  
  // Construct Hreflang Tags
  const hreflangTags = Object.entries(MARKET_HREFLANG_MAP).map(([market, lang]) => {
    const href = pilotPage.path === "/" 
      ? `https://productreviews.review/?market=${market}` 
      : `https://productreviews.review${pilotPage.path}?market=${market}`;
    return `<link rel="alternate" hreflang="${lang}" href="${href}" />`;
  }).join("\n    ");
  
  const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="https://productreviews.review${pilotPage.path}" />`;

  let html = baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${pilotPage.title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${pilotPage.description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${pilotPage.title}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${pilotPage.description}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  // Inject Hreflang
  html = html.replace(/<\/head>/i, `    ${hreflangTags}\n    ${xDefaultTag}\n</head>`);

  if (pilotPage.record) {
    const r = pilotPage.record;
    const categorySlug = r.category.toLowerCase().replace(/\s+/g, "-");
    const jsonLdScript = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://productreviews.review/" },
            { "@type": "ListItem", "position": 2, "name": "${r.category}", "item": "https://productreviews.review/?category=${categorySlug}" },
            { "@type": "ListItem", "position": 3, "name": "${r.name}", "item": "${canonicalUrl}" }
          ]
        },
        {
          "@type": "Product",
          "name": "${r.name}",
          "category": "${r.category}",
          "brand": { "@type": "Brand", "name": "${r.brand}" },
          "review": {
            "@type": "Review",
            "reviewRating": { "@type": "Rating", "ratingValue": "${r.rating}", "bestRating": "5" },
            "author": { "@type": "Organization", "name": "Editorial Research Board" },
            "reviewBody": "${r.verdict}",
            "positiveNotes": {
              "@type": "ItemList",
              "itemListElement": ["Lab-tested benchmarks", "Hardware evidence-based verdict", "Authentic user sentiment analysis"]
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "${r.rating}",
            "reviewCount": "${r.reviewCount}"
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": "${r.priceUSD}"
          }
        },
        {
          "@type": "WebPage",
          "name": "${pilotPage.title}",
          "speakable": {
            "@type": "SpeakableSpecification",
            "xpath": [
              "/html/head/title",
              "/html/head/meta[@name='description']/@content"
            ]
          },
          "url": "${canonicalUrl}"
        }
        ${r.faqList ? `, {
          "@type": "FAQPage",
          "mainEntity": ${JSON.stringify(r.faqList.map(f => ({ 
            "@type": "Question", 
            "name": f.question, 
            "acceptedAnswer": { "@type": "Answer", "text": f.answer } 
          })))}
        }` : ""}
      ]
    }
    </script>
    `;
    html = html.replace(/<\/head>/i, `${jsonLdScript}\n</head>`);
  }

  return html;
}

export function render404Html(baseHtml: string, requestPath: string): string {
  const notFoundTitle = "Page Not Found | productreviews.review";
  const notFoundDesc = "The requested product review or gear guide could not be located in our verified hardware repository.";
  return baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${notFoundTitle}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${notFoundDesc}" />`)
    .replace(/<meta name="robots" content=".*?"\s*\/?>/i, `<meta name="robots" content="noindex, follow" />`);
}
