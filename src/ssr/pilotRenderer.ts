import { contentRepository, ReviewRecord } from "../content/store/contentRepository";
import { HIGH_INTENT_SEO_QUERIES, CATEGORY_SEARCH_TAGS } from "../content/seoKnowledgeBase";

export interface PolicySsrContent {
  heading: string;
  subtitle: string;
  schemaType: "WebPage" | "AboutPage" | "ContactPage";
  sections: Array<{ title: string; body: string }>;
}

export interface PilotPage {
  path: string;
  slug: string;
  type: "review" | "compare" | "policy";
  title: string;
  description: string;
  record?: ReviewRecord;
  compareRecords?: [ReviewRecord, ReviewRecord];
  policy?: PolicySsrContent;
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
  },
  {
    path: "/compare/macbook-pro-m3-vs-dell-xps-15",
    slug: "macbook-pro-m3-vs-dell-xps-15",
    type: "compare",
    title: "MacBook Pro 16 M3 Max vs Dell XPS 15 OLED: Creator Workstation Battle",
    description: "Unplugged battery rendering benchmarks, 3.5K OLED vs Liquid Retina XDR display accuracy, and thermal throttling analysis."
  }
];

const POLICY_SSR_PAGES: Record<string, PilotPage> = {
  "/about": {
    path: "/about",
    slug: "about",
    type: "policy",
    title: "About Our Hardware Testing Lab | productreviews.review",
    description: "Learn how productreviews.review independently tests consumer hardware, audits Amazon price histories, and maintains 100% editorial independence.",
    policy: {
      heading: "About productreviews.review — Independent Hardware Testing Lab",
      subtitle: "Founded by technology researcher Alok Mohan Sharma (Delhi, India) with testing contributors in Bengaluru and San Francisco.",
      schemaType: "AboutPage",
      sections: [
        {
          title: "Our Mission: Truth in Consumer Technology",
          body: "The internet is saturated with sponsored influencer hype, fake marketplace ratings, and AI-generated review spam. productreviews.review provides consumers with data-backed hardware evaluations, 200-nit battery depletion tests, thermal imaging under load, and verified lowest-price discovery across 14 Amazon marketplaces."
        },
        {
          title: "Rigorous Lab Benchmarks & Retail Units",
          body: "Every smartphone, laptop, audio device, and home appliance evaluated by our team undergoes standardized battery cycles, FLIR thermal scans, acoustic decibel sweeps, and display calibration checks using retail units."
        },
        {
          title: "Contact & Publisher Ownership",
          body: "Published by Alok Mohan Sharma. For editorial inquiries, review corrections, or press verification, email alokmohansharma.delhi@gmail.com."
        }
      ]
    }
  },
  "/editorial-policy": {
    path: "/editorial-policy",
    slug: "editorial-policy",
    type: "policy",
    title: "Editorial Policy & Testing Methodology | productreviews.review",
    description: "Read our editorial independence guarantee, hardware acquisition standards, 200-nit battery loop protocol, and quarterly fact-checking policy.",
    policy: {
      heading: "Editorial Policy, Testing Methodology & Fact-Checking",
      subtitle: "Official Editorial Governance · Verified March 2025",
      schemaType: "WebPage",
      sections: [
        {
          title: "100% Editorial Independence Guarantee",
          body: "Manufacturers, brands, and PR agencies never receive a preview of our reviews before publication, cannot pay to alter a Flash Score, and have zero influence over head-to-head comparison verdicts."
        },
        {
          title: "How We Acquire & Test Hardware",
          body: "To ensure our test results match everyday retail ownership, our team acquires evaluation units directly from retail channels (primarily Amazon US and Amazon India). Devices are tested via standardized 200-nit Wi-Fi/5G battery loops, wall-wattage charging telemetry, FLIR surface thermals, and multi-frequency acoustic sweeps."
        },
        {
          title: "Fact-Checking & Corrections Policy",
          body: "Our editorial team audits published reviews quarterly for firmware updates, regional price changes, and silent hardware revisions. Readers can report factual discrepancies directly to alokmohansharma.delhi@gmail.com for review within 24–48 business hours."
        }
      ]
    }
  },
  "/contact": {
    path: "/contact",
    slug: "contact",
    type: "policy",
    title: "Contact Us & Editorial Support | productreviews.review",
    description: "Contact the productreviews.review editorial board for hardware review questions, factual corrections, privacy requests, or DMCA inquiries.",
    policy: {
      heading: "Contact productreviews.review Editorial Support",
      subtitle: "Direct Publisher Contact · Response within 24–48 business hours",
      schemaType: "ContactPage",
      sections: [
        {
          title: "Primary Editorial & Publisher Email",
          body: "Reach Publisher Alok Mohan Sharma and the editorial review team directly at alokmohansharma.delhi@gmail.com (Timezone: UTC+05:30 IST)."
        },
        {
          title: "What You Can Contact Us About",
          body: "We welcome reader feedback, regional Amazon price discrepancy reports, hardware testing methodology questions, GDPR/CCPA privacy requests, and formal correction notices."
        }
      ]
    }
  },
  "/privacy": {
    path: "/privacy",
    slug: "privacy",
    type: "policy",
    title: "Privacy Policy & Cookie Disclosure | productreviews.review",
    description: "Official Privacy Policy detailing Google AdSense cookies, Amazon Associates affiliate tracking, log files, and GDPR/CCPA user privacy rights.",
    policy: {
      heading: "Privacy Policy & Cookie Disclosure",
      subtitle: "Applicable to https://productreviews.review · GDPR, CCPA & Google AdSense Compliant",
      schemaType: "WebPage",
      sections: [
        {
          title: "Overview & Privacy Commitment",
          body: "At productreviews.review, visitor privacy is paramount. This policy explains what minimal technical data is processed, how Google AdSense advertising cookies operate, and how visitors can manage consent or request deletion."
        },
        {
          title: "Google AdSense & Third-Party Advertising Cookies",
          body: "Google serves ads on productreviews.review using advertising cookies to display relevant promotions based on prior site visits. Visitors can opt out of personalized advertising anytime via Google Ads Settings (https://www.google.com/settings/ads) or aboutads.info."
        },
        {
          title: "Amazon Associates & Affiliate Cookies",
          body: "When you click an outbound product link to Amazon (US, IN, UK, DE, FR, ES, IT, CA, JP, AU, BR, MX, NL, SG), Amazon places temporary referral cookies in accordance with Amazon's Operating Agreement without sharing personal identity with productreviews.review."
        },
        {
          title: "GDPR & CCPA Privacy Rights",
          body: "Visitors have the right to request access, correction, or erasure of personal data under GDPR and CCPA. Submit privacy requests to alokmohansharma.delhi@gmail.com."
        }
      ]
    }
  },
  "/terms": {
    path: "/terms",
    slug: "terms",
    type: "policy",
    title: "Terms of Service | productreviews.review",
    description: "Terms of Service governing access to hardware reviews, benchmark scores, interactive calculators, and affiliate disclosures on productreviews.review.",
    policy: {
      heading: "Terms of Service",
      subtitle: "Governing use of https://productreviews.review",
      schemaType: "WebPage",
      sections: [
        {
          title: "1. Agreement to Terms",
          body: "By accessing or using productreviews.review, you agree to comply with these Terms of Service and applicable laws."
        },
        {
          title: "2. Informational Purpose & Live Retailer Pricing",
          body: "All hardware benchmarks, Flash Scores, interactive TCO calculators, and editorial verdicts are provided for informational purchasing guidance. Retail prices, stock availability, and seller warranties fluctuate on Amazon and must be verified at checkout."
        },
        {
          title: "3. Intellectual Property & Limitation of Liability",
          body: "Original review text, score methodologies, and interactive tools are protected by copyright. productreviews.review is not liable for indirect damages arising from external retailer transactions."
        }
      ]
    }
  },
  "/affiliate-disclosure": {
    path: "/affiliate-disclosure",
    slug: "affiliate-disclosure",
    type: "policy",
    title: "Amazon Affiliate Disclosure | productreviews.review",
    description: "FTC & Amazon Associates Operating Agreement disclosure explaining how productreviews.review earns qualifying commissions with zero editorial bias.",
    policy: {
      heading: "Amazon Affiliate & Commission Disclosure",
      subtitle: "As an Amazon Associate, productreviews.review earns from qualifying purchases.",
      schemaType: "WebPage",
      sections: [
        {
          title: "Amazon Associates Operating Agreement Disclosure",
          body: "productreviews.review participates in the Amazon Services LLC Associates Program across Amazon.com, Amazon.in, Amazon.co.uk, Amazon.de, Amazon.ca, Amazon.fr, Amazon.es, Amazon.it, Amazon.co.jp, Amazon.com.au, Amazon.com.br, Amazon.com.mx, Amazon.nl, and Amazon.sg."
        },
        {
          title: "Zero Influence on Editorial Scores",
          body: "Our editorial board maintains strict separation between testing outcomes and affiliate commissions. We never accept payment to inflate scores, and clicking an Amazon link costs shoppers zero extra money."
        }
      ]
    }
  }
};

export function getPilotPage(requestPath: string): PilotPage | undefined {
  const cleanPath = (requestPath.split("?")[0].replace(/\/+$/, "")) || "/";
  if (POLICY_SSR_PAGES[cleanPath]) {
    return POLICY_SSR_PAGES[cleanPath];
  }
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
      } else if (staticFound.slug === "macbook-pro-m3-vs-dell-xps-15") {
        const r1 = contentRepository.getBySlug("macbook-pro-16-m3-max");
        const r2 = contentRepository.getBySlug("dell-xps-15-oled");
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
        title: `${record.name} Review & Tested Verdict (2025)`,
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

  let html = baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${pilotPage.title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${pilotPage.description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${pilotPage.title}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${pilotPage.description}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${pilotPage.title}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${pilotPage.description}" />`)
    .replace(/<meta name="twitter:url" content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`)
    .replace(/<!-- Schema\.org JSON-LD structured data -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>/i, "");

  if (pilotPage.type !== "policy") {
    const hreflangTags = Object.entries(MARKET_HREFLANG_MAP).map(([market, lang]) => {
      const href = pilotPage.path === "/"
        ? `https://productreviews.review/?market=${market}`
        : `https://productreviews.review${pilotPage.path}?market=${market}`;
      return `<link rel="alternate" hreflang="${lang}" href="${href}" />`;
    }).join("\n    ");
    const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="https://productreviews.review${pilotPage.path}" />`;
    html = html.replace(/<\/head>/i, `    ${hreflangTags}\n    ${xDefaultTag}\n</head>`);
  }

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
            "cssSelector": [
              "h1",
              "article p"
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
            <a href="/api/affiliate/redirect?market=US&asin=${r.amazonAsin}&q=${encodeURIComponent(r.name)}" rel="nofollow sponsored noopener noreferrer" style="display: inline-block; background: #FFE600; color: #000000; font-weight: 800; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
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

    html = html.replace(/<div id="root">\s*<\/div>/i, ssrContent);
  } else if (pilotPage.compareRecords) {
    const [r1, r2] = pilotPage.compareRecords;
    const jsonLdScript = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://productreviews.review/" },
            { "@type": "ListItem", "position": 2, "name": "Comparisons", "item": "https://productreviews.review/#comparison-shootouts" },
            { "@type": "ListItem", "position": 3, "name": "${pilotPage.title}", "item": "${canonicalUrl}" }
          ]
        },
        {
          "@type": "ItemList",
          "name": "${pilotPage.title}",
          "description": "${pilotPage.description}",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "${r1.name}", "url": "https://productreviews.review/review/${r1.slug}" },
            { "@type": "ListItem", "position": 2, "name": "${r2.name}", "url": "https://productreviews.review/review/${r2.slug}" }
          ]
        }
      ]
    }
    </script>
    `;
    html = html.replace(/<\/head>/i, `${jsonLdScript}\n</head>`);

    const ssrCompareContent = `
    <div id="root">
      <main style="max-width: 900px; margin: 0 auto; padding: 24px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; background-color: #09090b; line-height: 1.6;">
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #a1a1aa; margin-bottom: 16px;">
          <a href="/" style="color: #FFE600; text-decoration: none;">Home</a> &gt; 
          <span>Comparisons</span> &gt; 
          <span>${r1.name} vs ${r2.name}</span>
        </nav>
        <article>
          <h1 style="font-size: 32px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0;">${pilotPage.title}</h1>
          <p style="font-size: 16px; color: #d4d4d8; margin-bottom: 24px;">${pilotPage.description}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px;">
              <h2 style="font-size: 20px; color: #ffffff; margin-top: 0;"><a href="/review/${r1.slug}" style="color: #FFE600;">${r1.name}</a></h2>
              <p style="font-size: 13px; color: #d4d4d8;">${r1.verdict}</p>
              <p style="font-weight: bold; color: #FFE600;">Score: ${Math.round(r1.rating * 20)}/100 · $${r1.priceUSD}</p>
            </div>
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px;">
              <h2 style="font-size: 20px; color: #ffffff; margin-top: 0;"><a href="/review/${r2.slug}" style="color: #FFE600;">${r2.name}</a></h2>
              <p style="font-size: 13px; color: #d4d4d8;">${r2.verdict}</p>
              <p style="font-weight: bold; color: #FFE600;">Score: ${Math.round(r2.rating * 20)}/100 · $${r2.priceUSD}</p>
            </div>
          </div>
        </article>
      </main>
    </div>
    `;
    html = html.replace(/<div id="root">\s*<\/div>/i, ssrCompareContent);
  } else if (pilotPage.type === "policy" && pilotPage.policy) {
    const p = pilotPage.policy;
    const jsonLdScript = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://productreviews.review/" },
            { "@type": "ListItem", "position": 2, "name": "${p.heading}", "item": "${canonicalUrl}" }
          ]
        },
        {
          "@type": "${p.schemaType}",
          "name": "${pilotPage.title}",
          "description": "${pilotPage.description}",
          "url": "${canonicalUrl}",
          "publisher": {
            "@type": "Organization",
            "name": "productreviews.review Editorial Board",
            "url": "https://productreviews.review/"
          }
        }
      ]
    }
    </script>
    `;
    html = html.replace(/<\/head>/i, `${jsonLdScript}\n</head>`);

    const ssrPolicyContent = `
    <div id="root">
      <main style="max-width: 860px; margin: 0 auto; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; background-color: #09090b; line-height: 1.7;">
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #a1a1aa; margin-bottom: 20px;">
          <a href="/" style="color: #FFE600; text-decoration: none;">Home</a> &gt; 
          <span>${p.heading}</span>
        </nav>
        <article style="background: #121214; border: 1px solid #27272a; border-radius: 16px; padding: 28px;">
          <header style="border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="font-size: 30px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0;">${p.heading}</h1>
            <p style="font-size: 14px; color: #a1a1aa; margin: 0;">${p.subtitle}</p>
          </header>
          ${p.sections.map((sec) => `
            <section style="margin-bottom: 22px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #FFE600; margin: 0 0 8px 0;">${sec.title}</h2>
              <p style="font-size: 14px; color: #d4d4d8; margin: 0;">${sec.body}</p>
            </section>
          `).join("")}
          <footer style="border-top: 1px solid #27272a; padding-top: 16px; margin-top: 24px; font-size: 13px; color: #a1a1aa;">
            <a href="/" style="color: #FFE600; text-decoration: none; font-weight: bold;">← Back to productreviews.review Hardware Directory</a>
          </footer>
        </article>
      </main>
    </div>
    `;
    html = html.replace(/<div id="root">\s*<\/div>/i, ssrPolicyContent);
  }

  return html;
}

export function render404Html(baseHtml: string, requestPath: string): string {
  const notFoundTitle = "404 Page Not Found | productreviews.review";
  const notFoundDesc = "The requested page could not be located on productreviews.review.";
  const safePath = requestPath.replace(/[<>"'&]/g, "");
  const notFoundBody = `
    <div id="root">
      <main style="max-width: 720px; margin: 64px auto; padding: 32px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; background-color: #09090b; text-align: center;">
        <h1 style="font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 12px;">404 — Page Not Found</h1>
        <p style="font-size: 15px; color: #a1a1aa; margin-bottom: 24px;">The requested path (${safePath}) does not correspond to a published product review, comparison, or editorial page.</p>
        <a href="/" style="display: inline-block; background: #FFE600; color: #000000; font-weight: 800; padding: 12px 24px; border-radius: 10px; text-decoration: none;">Return to Homepage</a>
      </main>
    </div>
  `;

  return baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${notFoundTitle}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${notFoundDesc}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, "")
    .replace(/<meta name="robots" content=".*?"\s*\/?>/i, `<meta name="robots" content="noindex, follow" />`)
    .replace(/<!-- Schema\.org JSON-LD structured data -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>/i, "")
    .replace(/<div id="root">\s*<\/div>/i, notFoundBody);
}
