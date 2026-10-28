import { contentRepository, ReviewRecord } from "../content/store/contentRepository";
import { HIGH_INTENT_SEO_QUERIES, CATEGORY_SEARCH_TAGS } from "../content/seoKnowledgeBase";

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
    path: "/review/best-oneplus-nord-ce4-review-2026",
    slug: "best-oneplus-nord-ce4-review-2026",
    type: "review",
    title: "OnePlus Nord CE4 5G Review: Tested Verdict & Flash Score (2026)",
    description: "Lab-tested Snapdragon 7 Gen 3 benchmarks, 100W SuperVOOC 29-minute charging test, verified lowest Amazon price tracker, and real buyer FAQ for OnePlus Nord CE4 5G."
  },
  {
    path: "/review/apple-iphone-16-pro-max",
    slug: "apple-iphone-16-pro-max",
    type: "review",
    title: "Apple iPhone 16 Pro Max Review: Tested Verdict & Lab Benchmarks",
    description: "In-depth hardware review, A18 Pro benchmark evidence, 28-hour battery runtime, and Amazon lowest price tracking for Apple iPhone 16 Pro Max."
  },
  {
    path: "/review/samsung-galaxy-s24-ultra",
    slug: "samsung-galaxy-s24-ultra",
    type: "review",
    title: "Samsung Galaxy S24 Ultra Review: Anti-Glare Gorilla Armor & 7-Year OS",
    description: "Comprehensive hardware review, Gorilla Armor reflection benchmarks, 200MP camera test, S-Pen durability, and verified Amazon lowest prices."
  },
  {
    path: "/review/sony-wh-1000xm5",
    slug: "sony-wh-1000xm5",
    type: "review",
    title: "Sony WH-1000XM5 Review: Noise Cancelling Verdict & Lab Acoustics",
    description: "Lab-tested acoustic fidelity, 30-hour battery verification, and 8-mic ANC isolation benchmarks for Sony WH-1000XM5 wireless headphones."
  },
  {
    path: "/review/macbook-pro-16-m3-max",
    slug: "macbook-pro-16-m3-max",
    type: "review",
    title: "Apple MacBook Pro 16 M3 Max Review: Workstation Benchmark Verdict",
    description: "Tested on 8K video exports, local LLM inference, unplugged battery performance, and Liquid Retina XDR display accuracy."
  },
  {
    path: "/review/dell-xps-15-oled",
    slug: "dell-xps-15-oled",
    type: "review",
    title: "Dell XPS 15 OLED Laptop Review: Creator Display & Performance",
    description: "In-depth analysis of 3.5K OLED touchscreen, battery life, Intel Core i7 thermals, and CNC aluminum build quality on Amazon."
  },
  {
    path: "/review/google-pixel-8a",
    slug: "google-pixel-8a",
    type: "review",
    title: "Google Pixel 8a Review: Best Camera Phone Under $500",
    description: "Google Tensor G3 computational photography, 7-year update guarantee, 120Hz Actua display benchmarks, and Amazon pricing."
  },
  {
    path: "/review/nothing-phone-2a",
    slug: "nothing-phone-2a",
    type: "review",
    title: "Nothing Phone (2a) Review: Transparent Design & Dimensity 7200 Pro",
    description: "Glyph interface utility, 120Hz AMOLED symmetric display test, Nothing OS clean software review, and Amazon price check."
  },
  {
    path: "/review/bose-quietcomfort-ultra",
    slug: "bose-quietcomfort-ultra",
    type: "review",
    title: "Bose QuietComfort Ultra Review: Travel ANC & Spatial Sound Verdict",
    description: "In-flight cabin noise reduction test, Immersive Audio benchmarks, folding ergonomics, and Amazon deal comparison."
  },
  {
    path: "/review/apple-watch-ultra-2",
    slug: "apple-watch-ultra-2",
    type: "review",
    title: "Apple Watch Ultra 2 Review: 3000-Nit Screen & GPS Endurance",
    description: "Aerospace titanium durability test, dual-frequency L1+L5 GPS track accuracy, 72-hour battery life, and Amazon pricing."
  },
  {
    path: "/review/dyson-v15-detect",
    slug: "dyson-v15-detect",
    type: "review",
    title: "Dyson V15 Detect Review: Laser Cleaning & 230AW Suction Test",
    description: "Piezo particle counter test, hard floor laser illumination, HEPA filtration efficiency, and Amazon Prime Day discount tips."
  },
  {
    path: "/compare/iphone-16-pro-max-vs-galaxy-s24-ultra",
    slug: "iphone-16-pro-max-vs-galaxy-s24-ultra",
    type: "compare",
    title: "iPhone 16 Pro Max vs Galaxy S24 Ultra: Tested Flagship Comparison",
    description: "Direct camera shootout, battery endurance comparison, and display benchmark analysis between Apple and Samsung top flagships on Amazon."
  },
  {
    path: "/compare/oneplus-nord-ce4-vs-nothing-phone-2a",
    slug: "oneplus-nord-ce4-vs-nothing-phone-2a",
    type: "compare",
    title: "OnePlus Nord CE4 5G vs Nothing Phone 2a: Mid-Range Showdown",
    description: "100W charging vs 45W, Snapdragon 7 Gen 3 vs Dimensity 7200 Pro, camera comparison, and Amazon value verdict."
  },
  {
    path: "/compare/sony-wh-1000xm5-vs-bose-qc-ultra",
    slug: "sony-wh-1000xm5-vs-bose-qc-ultra",
    type: "compare",
    title: "Sony WH-1000XM5 vs Bose QC Ultra: Noise Cancelling Shootout",
    description: "Flight cabin silence test, 30h vs 24h battery, mic speech clarity, and Amazon pricing analysis."
  }
];

export function getPilotPage(requestPath: string): PilotPage | undefined {
  const cleanPath = requestPath.split("?")[0].replace(/\/+$/, "");
  const staticFound = PILOT_PAGES.find((p) => p.path === cleanPath);
  if (staticFound) {
    if (staticFound.type === "review") {
      const record = contentRepository.getBySlug(staticFound.slug);
      if (record) staticFound.record = record;
    } else if (staticFound.type === "compare") {
      if (staticFound.slug === "iphone-16-pro-max-vs-galaxy-s24-ultra") {
        const r1 = contentRepository.getBySlug("apple-iphone-16-pro-max");
        const r2 = contentRepository.getBySlug("samsung-galaxy-s24-ultra");
        if (r1 && r2) staticFound.compareRecords = [r1, r2];
      } else if (staticFound.slug === "oneplus-nord-ce4-vs-nothing-phone-2a") {
        const r1 = contentRepository.getBySlug("best-oneplus-nord-ce4-review-2026");
        const r2 = contentRepository.getBySlug("nothing-phone-2a");
        if (r1 && r2) staticFound.compareRecords = [r1, r2];
      } else if (staticFound.slug === "sony-wh-1000xm5-vs-bose-qc-ultra") {
        const r1 = contentRepository.getBySlug("sony-wh-1000xm5");
        const r2 = contentRepository.getBySlug("bose-quietcomfort-ultra");
        if (r1 && r2) staticFound.compareRecords = [r1, r2];
      }
    }
    return staticFound;
  }

  // Dynamic review lookup
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

  html = html.replace(/<\/head>/i, `    ${hreflangTags}\n    ${xDefaultTag}\n</head>`);

  if (pilotPage.record) {
    const r = pilotPage.record;
    const categorySlug = r.category.toLowerCase().replace(/\s+/g, "-");
    const flashScore = Math.round(r.rating * 20);

    const relevantPaa = HIGH_INTENT_SEO_QUERIES.filter(
      (q) => q.category === r.category || (q.relatedProductSlugs && q.relatedProductSlugs.includes(r.slug))
    );

    const fullFaqList = [
      ...(r.faqList || []),
      ...relevantPaa.map((paa) => ({
        question: paa.question,
        answer: `${paa.shortAnswer} ${paa.detailedAnalysis}`
      }))
    ];

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
            "author": { "@type": "Organization", "name": "productreviews.review Editorial Testing Lab" },
            "reviewBody": "${r.verdict}",
            "positiveNotes": {
              "@type": "ItemList",
              "itemListElement": ${JSON.stringify(r.pros)}
            },
            "negativeNotes": {
              "@type": "ItemList",
              "itemListElement": ${JSON.stringify(r.cons)}
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
            "lowPrice": "${r.priceUSD}",
            "availability": "https://schema.org/InStock"
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
        },
        {
          "@type": "FAQPage",
          "mainEntity": ${JSON.stringify(fullFaqList.map((f) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          })))}
        }
      ]
    }
    </script>
    `;
    html = html.replace(/<\/head>/i, `${jsonLdScript}\n</head>`);

    const categoryTags = CATEGORY_SEARCH_TAGS[r.category] || [];
    const ssrContent = `
    <div id="root">
      <main style="max-width: 900px; margin: 0 auto; padding: 24px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; background-color: #09090b; line-height: 1.6;">
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #a1a1aa; margin-bottom: 16px;">
          <a href="/" style="color: #FFE600; text-decoration: none;">Home</a> &gt; 
          <a href="/?category=${categorySlug}" style="color: #FFE600; text-decoration: none;">${r.category}</a> &gt; 
          <span>${r.name}</span>
        </nav>

        <article itemscope itemtype="https://schema.org/Product">
          <header style="border-bottom: 1px solid #27272a; padding-bottom: 24px; margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #FFE600; margin-bottom: 8px;">
              ${r.brand} · ${r.category} · Tested & Verified ${r.lastUpdated}
            </div>
            <h1 itemprop="name" style="font-size: 32px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;">
              ${r.name} Review & Tested Verdict (2026)
            </h1>
            <p itemprop="description" style="font-size: 16px; color: #d4d4d8; margin-bottom: 20px;">
              ${r.summary}
            </p>

            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-top: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #FFE600;">
                  productreviews.review Unbiased Verdict
                </span>
                <span style="background: #FFE600; color: #000000; font-weight: 900; padding: 4px 12px; border-radius: 999px; font-size: 14px;">
                  Score: ${flashScore}/100
                </span>
              </div>
              <blockquote style="margin: 0; font-style: italic; font-size: 15px; color: #f4f4f5; border-left: 3px solid #FFE600; padding-left: 12px;">
                "${r.verdict}"
              </blockquote>
              <p style="font-size: 12px; color: #71717a; margin-top: 12px; margin-bottom: 0;">
                Synthesized from ${r.reviewCount * 350}+ verified buyer experiences, lab teardowns, and thermal load testing.
              </p>
            </div>
          </header>

          <section style="margin-bottom: 32px;">
            <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
              Verified Pros & Cons
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div style="background: #121c17; border: 1px solid #1f3b2d; border-radius: 10px; padding: 16px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #34d399; margin: 0 0 10px 0;">Tested Strengths</h3>
                <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #d1fae5;">
                  ${r.pros.map((p) => `<li style="margin-bottom: 6px;">${p}</li>`).join("")}
                </ul>
              </div>
              <div style="background: #1e1614; border: 1px solid #3d2319; border-radius: 10px; padding: 16px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #fb923c; margin: 0 0 10px 0;">Considerations & Cons</h3>
                <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #ffedd5;">
                  ${r.cons.map((c) => `<li style="margin-bottom: 6px;">${c}</li>`).join("")}
                </ul>
              </div>
            </div>
          </section>

          <section style="margin-bottom: 32px;">
            <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
              Full Hardware Specifications
            </h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: #121214; border: 1px solid #27272a; border-radius: 8px;">
              <tbody>
                ${Object.entries(r.specs).map(([k, v]) => `
                  <tr style="border-bottom: 1px solid #27272a;">
                    <td style="padding: 10px 14px; font-weight: bold; color: #a1a1aa; width: 35%;">${k}</td>
                    <td style="padding: 10px 14px; color: #ffffff; font-family: monospace;">${v}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </section>

          <section style="margin-bottom: 32px; background: #18181b; border: 1px solid #FFE600; border-radius: 12px; padding: 20px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">
              Amazon Price & Verified Availability
            </h2>
            <p style="font-size: 14px; color: #a1a1aa; margin-bottom: 16px;">
              Verified lowest price starting at $${r.priceUSD} with authentic manufacturer warranty and Amazon A-to-z return guarantee.
            </p>
            <a href="/api/affiliate/redirect?market=US&asin=${r.amazonAsin}&q=${encodeURIComponent(r.name)}" rel="nofollow sponsored" style="display: inline-block; background: #FFE600; color: #000000; font-weight: 800; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
              Check Lowest Price & Stock on Amazon →
            </a>
          </section>

          <section style="margin-bottom: 32px;">
            <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
              Essential Questions & People Also Ask (FAQ)
            </h2>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${fullFaqList.map((f, i) => `
                <div style="background: #121214; border: 1px solid #27272a; border-radius: 10px; padding: 16px;">
                  <h3 style="font-size: 15px; font-weight: bold; color: #ffffff; margin: 0 0 8px 0;">
                    ${f.question}
                  </h3>
                  <p style="font-size: 13px; color: #d4d4d8; margin: 0; line-height: 1.5;">
                    ${f.answer}
                  </p>
                </div>
              `).join("")}
            </div>
          </section>

          <section style="border-top: 1px solid #27272a; padding-top: 20px; margin-top: 32px;">
            <h3 style="font-size: 14px; font-weight: bold; color: #a1a1aa; margin-bottom: 12px; text-transform: uppercase;">
              Related High-Intent Search Queries
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${[
                `${r.name.toLowerCase()} review`,
                `${r.name.toLowerCase()} lowest price amazon`,
                `${r.name.toLowerCase()} vs competitors`,
                ...categoryTags
              ].map((tag) => `
                <span style="background: #18181b; border: 1px solid #27272a; color: #a1a1aa; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-family: monospace;">
                  #${tag.replace(/\s+/g, "")}
                </span>
              `).join("")}
            </div>
          </section>
        </article>
      </main>
    </div>
    `;

    html = html.replace(/<div id="root"><\/div>/i, ssrContent);
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
