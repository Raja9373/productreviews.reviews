/**
 * ProductReviews.review — High-Fidelity Server-Side Pilot Renderer
 * 
 * Generates genuine, complete route-specific initial HTML for verified pilot pages.
 * Guarantees visible H1, structured evidence, verdict cards, FAQs, internal links,
 * page-specific metadata, and Schema.org JSON-LD without hydration mismatches.
 */

import { PILOT_PAGES, PilotPageData } from './pilotData';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Resolves a pilot page by route path (e.g. /review/iphone-16-pro or /compare/macbook-air-m3-vs-dell-xps-13)
 */
export function getPilotPage(pathname: string): PilotPageData | undefined {
  const clean = (pathname || '').replace(/\/$/, '').toLowerCase();
  
  if (clean.startsWith('/review/')) {
    const slug = clean.replace('/review/', '');
    return PILOT_PAGES[slug];
  }
  
  if (clean.startsWith('/compare/')) {
    const slug = clean.replace('/compare/', '');
    return PILOT_PAGES[slug];
  }
  
  return undefined;
}

/**
 * Checks whether a pathname corresponds to a review or compare route
 */
export function isReviewOrCompareRoute(pathname: string): boolean {
  const clean = (pathname || '').replace(/\/$/, '').toLowerCase();
  return clean.startsWith('/review/') || clean.startsWith('/compare/');
}

/**
 * Builds semantic, accessible HTML content for the pilot page
 */
export function renderPilotBodyHtml(page: PilotPageData): string {
  const badgeColors: Record<string, { bg: string; text: string; label: string }> = {
    BUY: { bg: 'bg-emerald-700', text: 'text-white', label: 'RECOMMENDED • BUY' },
    BUY_IF: { bg: 'bg-amber-700', text: 'text-white', label: 'CONDITIONAL • BUY IF' },
    BALANCED: { bg: 'bg-zinc-900', text: 'text-white', label: 'HEAD-TO-HEAD • BALANCED' },
    TOP_PICK: { bg: 'bg-zinc-950', text: 'text-white', label: 'WIRE-TESTED • TOP PICK' }
  };
  const badge = badgeColors[page.verdictBadge] || badgeColors.BUY;

  return `
  <div class="min-h-screen bg-zinc-50/50 flex flex-col justify-between text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans antialiased">
    <!-- Server Rendered Header -->
    <header class="w-full bg-white border-b border-zinc-200 sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-zinc-900 hover:text-zinc-700 transition-colors">
          <span class="bg-zinc-900 text-white text-xs font-bold px-2 py-0.5 rounded font-serif">PR</span>
          <span class="font-bold text-zinc-950 tracking-tight text-lg font-serif">productreviews.review</span>
        </a>
        <nav class="flex items-center gap-4 text-xs font-medium text-zinc-600">
          <a href="/" class="hover:text-zinc-950">Home</a>
          <a href="/about" class="hover:text-zinc-950">About</a>
          <a href="/affiliate-disclosure" class="hover:text-zinc-950">Trust &amp; Methodology</a>
        </nav>
      </div>
    </header>

    <!-- Main Review Article Content -->
    <main class="flex-1 w-full bg-white">
      <article class="max-w-4xl mx-auto px-4 py-8">
        <!-- Breadcrumb Navigation -->
        <nav aria-label="Breadcrumb" class="mb-6 flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <a href="/" class="hover:underline">Home</a>
          <span>/</span>
          <span class="text-zinc-700">${escapeHtml(page.category)}</span>
          <span>/</span>
          <span class="text-zinc-900 font-semibold truncate max-w-xs">${escapeHtml(page.productName)}</span>
        </nav>

        <!-- Main Headline & Subtitle -->
        <header class="mb-8 border-b border-zinc-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-800 uppercase tracking-wide">
              ${escapeHtml(page.category)}
            </span>
            <span class="text-xs text-zinc-400 font-mono">• Updated Verified Analysis (2026)</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-zinc-950 tracking-tight leading-tight">${escapeHtml(page.h1)}</h1>

          <p class="mt-4 text-lg text-zinc-700 leading-relaxed">
            ${escapeHtml(page.metaDescription)}
          </p>

          <div class="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500 font-mono">
            <span>Author: Editorial Research Board</span>
            <span>Audit Status: Verified Factual Benchmarks</span>
            <span>Attribution: Standard Technical Specifications &amp; Empirical Protocols</span>
          </div>
        </header>

        <!-- Authoritative Verdict Decision Card -->
        <section aria-labelledby="decision-heading" class="mb-10 bg-zinc-50 border-2 border-zinc-900 rounded-lg p-6 sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span class="inline-block ${badge.bg} ${badge.text} text-xs font-bold font-mono px-3 py-1 rounded">
              ${badge.label}
            </span>
            <span class="text-xs text-zinc-500 font-mono">Zero Merchant Bias Guarantee</span>
          </div>

          <h2 id="decision-heading" class="text-2xl font-bold font-serif text-zinc-900 mb-3">
            ${escapeHtml(page.verdictHeadline)}
          </h2>

          <p class="text-zinc-800 leading-relaxed text-base mb-6">
            ${escapeHtml(page.verdictRationale)}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5 font-mono">
                ✓ Primary Supporting Evidence
              </h3>
              <ul class="space-y-2 text-sm text-zinc-700">
                ${page.supportingFactors.map((f) => `<li class="flex items-start gap-2"><span class="text-emerald-600 font-bold">✓</span><span>${escapeHtml(f)}</span></li>`).join('\n')}
              </ul>
            </div>

            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-1.5 font-mono">
                ⚠ Known Limitations &amp; Watchouts
              </h3>
              <ul class="space-y-2 text-sm text-zinc-700">
                ${page.concerns.map((c) => `<li class="flex items-start gap-2"><span class="text-amber-700 font-bold">!</span><span>${escapeHtml(c)}</span></li>`).join('\n')}
              </ul>
            </div>
          </div>

          ${
            page.conditions && page.conditions.length > 0
              ? `
          <div class="mt-6 pt-4 border-t border-zinc-200">
            <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2 font-mono">Buying Decision Conditions:</h3>
            <ul class="list-disc list-inside space-y-1 text-sm text-zinc-700">
              ${page.conditions.map((cond) => `<li>${escapeHtml(cond)}</li>`).join('\n')}
            </ul>
          </div>
          `
              : ''
          }
        </section>

        <!-- Pros, Cons & Trade-Offs Matrix -->
        <section aria-labelledby="matrix-heading" class="mb-10">
          <h2 id="matrix-heading" class="text-xl font-bold font-serif text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            Strengths, Weaknesses &amp; Practical Trade-Offs
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-emerald-50/50 border border-emerald-200 rounded-md p-5">
              <h3 class="font-bold text-emerald-900 text-sm mb-3">Key Strengths &amp; Verified Advantages</h3>
              <ul class="space-y-2 text-sm text-zinc-700">
                ${page.keyPositives.map((p) => `<li class="flex items-start gap-2"><span class="text-emerald-700 font-bold">+</span><span>${escapeHtml(p)}</span></li>`).join('\n')}
              </ul>
            </div>

            <div class="bg-rose-50/50 border border-rose-200 rounded-md p-5">
              <h3 class="font-bold text-rose-900 text-sm mb-3">Documented Drawbacks &amp; Criticisms</h3>
              <ul class="space-y-2 text-sm text-zinc-700">
                ${page.keyNegatives.map((n) => `<li class="flex items-start gap-2"><span class="text-rose-700 font-bold">−</span><span>${escapeHtml(n)}</span></li>`).join('\n')}
              </ul>
            </div>
          </div>

          ${
            page.tradeoffs && page.tradeoffs.length > 0
              ? `
          <div class="bg-zinc-100/70 border border-zinc-200 rounded-md p-4 text-sm text-zinc-800">
            <strong class="font-semibold text-zinc-900 font-mono text-xs uppercase tracking-wide">Key Trade-off to Consider:</strong>
            <p class="mt-1">${escapeHtml(page.tradeoffs.join(' '))}</p>
          </div>
          `
              : ''
          }
        </section>

        <!-- Audience Suitability Assessment -->
        <section aria-labelledby="suitability-heading" class="mb-10">
          <h2 id="suitability-heading" class="text-xl font-bold font-serif text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            Audience Suitability &amp; Workload Fit
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div class="p-4 border border-zinc-200 rounded-md bg-white">
              <h3 class="font-bold text-zinc-900 mb-2 font-mono text-xs uppercase tracking-wider text-emerald-800">Who Should Buy This:</h3>
              <ul class="space-y-1.5 text-zinc-700">
                ${page.suitableFor.map((s) => `<li>• ${escapeHtml(s)}</li>`).join('\n')}
              </ul>
            </div>
            <div class="p-4 border border-zinc-200 rounded-md bg-white">
              <h3 class="font-bold text-zinc-900 mb-2 font-mono text-xs uppercase tracking-wider text-zinc-600">Who Should Look Elsewhere:</h3>
              <ul class="space-y-1.5 text-zinc-700">
                ${page.notSuitableFor.map((ns) => `<li>• ${escapeHtml(ns)}</li>`).join('\n')}
              </ul>
            </div>
          </div>
        </section>

        <!-- Verified Technical Evidence Points -->
        <section aria-labelledby="evidence-heading" class="mb-10">
          <h2 id="evidence-heading" class="text-xl font-bold font-serif text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            Documented Technical Evidence &amp; Benchmark Findings
          </h2>
          <div class="space-y-3">
            ${page.evidencePoints
              .map(
                (ev) => `
            <div class="p-4 border border-zinc-200 rounded-md bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <div class="text-zinc-800">
                <span class="font-semibold text-zinc-950 font-mono text-xs uppercase bg-zinc-200 px-1.5 py-0.5 rounded mr-2">${escapeHtml(ev.sourceType)}</span>
                ${escapeHtml(ev.claim)}
              </div>
              <div class="text-xs text-zinc-500 font-mono whitespace-nowrap">
                Source: ${escapeHtml(ev.sourceName)}
              </div>
            </div>
            `
              )
              .join('\n')}
          </div>
        </section>

        <!-- Detailed In-Depth Analysis Sections -->
        <div class="space-y-8 mb-12">
          ${page.sections
            .map(
              (sec) => `
          <section class="bg-white p-6 border border-zinc-200 rounded-md">
            <h2 class="text-xl font-bold font-serif text-zinc-900 mb-3">${escapeHtml(sec.heading)}</h2>
            ${sec.paragraphs.map((p) => `<p class="text-zinc-700 leading-relaxed mb-3 text-base">${escapeHtml(p)}</p>`).join('\n')}
            ${
              sec.bullets && sec.bullets.length > 0
                ? `
            <ul class="list-disc list-inside space-y-1 text-sm text-zinc-700 mt-2">
              ${sec.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('\n')}
            </ul>
            `
                : ''
            }
          </section>
          `
            )
            .join('\n')}
        </div>

        <!-- Visibly Rendered Frequently Asked Questions -->
        <section aria-labelledby="faq-heading" class="mb-12 bg-zinc-50 border border-zinc-200 rounded-lg p-6 sm:p-8">
          <h2 id="faq-heading" class="text-2xl font-bold font-serif text-zinc-900 mb-2">
            Frequently Asked Questions &amp; Buying Advice
          </h2>
          <p class="text-sm text-zinc-600 mb-6 font-mono">
            Direct factual answers covering warranty, performance thresholds, and common buyer decisions.
          </p>

          <div class="space-y-6">
            ${page.faqs
              .map(
                (faq) => `
            <div class="border-b border-zinc-200 pb-5 last:border-b-0">
              <h3 class="text-base font-bold text-zinc-900 mb-2">${escapeHtml(faq.question)}</h3>
              <p class="text-sm text-zinc-700 leading-relaxed">${escapeHtml(faq.answer)}</p>
            </div>
            `
              )
              .join('\n')}
          </div>
        </section>

        <!-- Related Research & Internal Linking -->
        <section aria-labelledby="related-heading" class="border-t border-zinc-200 pt-8">
          <h2 id="related-heading" class="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 font-mono">
            Related Product Research &amp; Comparisons
          </h2>
          <div class="flex flex-wrap gap-3">
            ${page.relatedLinks
              .map(
                (link) => `
            <a href="${escapeHtml(link.urlPath)}" class="text-xs font-medium px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md transition-colors border border-zinc-200">
              ${escapeHtml(link.title)} →
            </a>
            `
              )
              .join('\n')}
          </div>
        </section>
      </article>
    </main>

    <!-- Global Footer -->
    <footer class="w-full bg-white border-t border-zinc-200 py-10 text-xs text-zinc-500">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span>&copy; ${new Date().getFullYear()} productreviews.review. Objective decision engine.</span>
        <div class="flex gap-4">
          <a href="/about" class="hover:underline">About</a>
          <a href="/privacy" class="hover:underline">Privacy</a>
          <a href="/terms" class="hover:underline">Terms</a>
          <a href="/affiliate-disclosure" class="hover:underline">Affiliate Disclosure</a>
        </div>
      </div>
    </footer>
  </div>
  `;
}

/**
 * Builds clean Schema.org JSON-LD matching the visible page contents
 */
export function buildPilotSchema(page: PilotPageData): object {
  const isComparison = page.routeType === 'compare' || !!page.secondaryProductName;

  const mainEntityQuestions = page.faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  }));

  const schemaGraph: any[] = [
    {
      '@type': 'WebPage',
      '@id': `${page.canonicalUrl}#webpage`,
      url: page.canonicalUrl,
      name: page.title,
      description: page.metaDescription,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://productreviews.review/#website',
        url: 'https://productreviews.review/',
        name: 'productreviews.review',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${page.canonicalUrl}#faq`,
      mainEntity: mainEntityQuestions,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${page.canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://productreviews.review/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.category,
          item: `https://productreviews.review/?category=${encodeURIComponent(page.category.toLowerCase())}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.productName,
          item: page.canonicalUrl,
        },
      ],
    },
  ];

  if (!isComparison) {
    schemaGraph.push({
      '@type': 'Product',
      '@id': `${page.canonicalUrl}#product`,
      name: page.productName,
      category: page.category,
      review: {
        '@type': 'Review',
        name: page.h1,
        reviewBody: page.verdictRationale,
        author: {
          '@type': 'Organization',
          name: 'productreviews.review Editorial Board',
        },
        publisher: {
          '@type': 'Organization',
          name: 'productreviews.review',
          url: 'https://productreviews.review/',
        },
      },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemaGraph,
  };
}

/**
 * Renders the complete, production-ready HTML document for a verified pilot page.
 */
export function renderPilotHtml(page: PilotPageData, baseHtmlTemplate: string): string {
  const bodyHtml = renderPilotBodyHtml(page);
  const schemaObj = buildPilotSchema(page);
  const schemaJsonString = JSON.stringify(schemaObj, null, 2);

  // 1. Replace Title
  let html = baseHtmlTemplate.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(page.title)} | productreviews.review</title>`
  );

  // 2. Replace Meta Description
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(page.metaDescription)}" />`
  );

  // 3. Replace Canonical Link
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${page.canonicalUrl}" />`
  );

  // 4. Ensure correct Robots directives
  const robotsMeta =
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />';
  if (/<meta\s+name=["']robots["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, robotsMeta);
  } else {
    html = html.replace('</head>', `  ${robotsMeta}\n</head>`);
  }

  // 5. Update Open Graph & Twitter Cards
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(page.metaDescription)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${page.canonicalUrl}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(page.metaDescription)}" />`
  );

  // 6. Clean out the static generic FAQ JSON-LD from index.html (lines 125-212)
  // so that the page carries exclusively the route-specific Schema.org graph
  html = html.replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i, (match) => {
    if (match.includes('"@type": "FAQPage"')) {
      return ''; // Strip generic FAQ schema
    }
    return match;
  });

  // 7. Inject Route-Specific JSON-LD structured data into <head>
  const structuredDataScript = `\n    <!-- Verified Route-Specific Schema.org JSON-LD -->\n    <script type="application/ld+json">\n${schemaJsonString}\n    </script>\n`;
  html = html.replace('</head>', `${structuredDataScript}</head>`);

  // 8. Inject Server Rendered Body into <div id="root">
  const rootDivRegex = /<div\s+id=["']root["']>[\s\S]*?<\/div>/i;
  html = html.replace(rootDivRegex, `<div id="root">${bodyHtml}</div>`);

  // 9. Inject Hydration State before </body>
  const hydrationStateScript = `\n    <script>\n      window.__PILOT_DATA__ = ${JSON.stringify(page)};\n    </script>\n`;
  html = html.replace('</body>', `${hydrationStateScript}</body>`);

  return html;
}

/**
 * Renders a clean, accessible 404 Not Found page for nonexistent slugs
 */
export function render404Html(baseHtmlTemplate: string, requestedPath: string): string {
  let html = baseHtmlTemplate.replace(
    /<title>.*?<\/title>/i,
    '<title>404 Page Not Found | productreviews.review</title>'
  );

  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    '<meta name="description" content="The requested product review or comparison was not found on productreviews.review." />'
  );

  html = html.replace(
    /<meta\s+name=["']robots["'][^>]*>/i,
    '<meta name="robots" content="noindex, nofollow" />'
  );

  const notFoundBody = `
  <div class="min-h-screen bg-zinc-50 flex flex-col justify-between text-zinc-900 font-sans">
    <header class="w-full bg-white border-b border-zinc-200 py-4 px-6">
      <a href="/" class="flex items-center gap-2">
        <span class="bg-zinc-900 text-white text-xs font-bold px-2 py-0.5 rounded font-serif">PR</span>
        <span class="font-bold text-zinc-950 font-serif text-lg">productreviews.review</span>
      </a>
    </header>

    <main class="max-w-xl mx-auto px-4 py-20 text-center">
      <span class="text-xs font-mono font-bold px-3 py-1 bg-zinc-200 text-zinc-800 rounded">HTTP 404 NOT FOUND</span>
      <h1 class="text-3xl font-bold font-serif text-zinc-950 mt-4 mb-3">Review Not Found</h1>
      <p class="text-zinc-600 mb-6 text-sm leading-relaxed">
        We could not locate an authoritative review record for <code class="bg-zinc-200 px-1 py-0.5 rounded text-zinc-900 font-mono text-xs">${escapeHtml(requestedPath)}</code>.
      </p>
      <a href="/" class="inline-block px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-md transition-colors">
        Return to Home &amp; Search Directory →
      </a>
    </main>

    <footer class="py-6 text-center text-xs text-zinc-400 border-t border-zinc-200">
      &copy; ${new Date().getFullYear()} productreviews.review
    </footer>
  </div>
  `;

  html = html.replace(/<div\s+id=["']root["']>[\s\S]*?<\/div>/i, `<div id="root">${notFoundBody}</div>`);
  return html;
}
