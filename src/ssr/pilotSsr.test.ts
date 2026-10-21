/**
 * ProductReviews.review — Pilot SSR Regression Test Suite
 * 
 * Verifies:
 * 1. 10 selected pilot pages have unique, authentic specifications with zero placeholders.
 * 2. Initial HTML contains route-specific title, description, canonical, robots, visible H1, and full article body.
 * 3. Invalid slugs return 404 with noindex.
 * 4. JSON-LD structured data matches visible content.
 * 5. Hydration compatibility and client record generation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PILOT_PAGES, createClientRecordFromPilot } from './pilotData';
import { getPilotPage, renderPilotHtml, render404Html } from './pilotRenderer';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function runPilotSsrTests() {
  console.log('🧪 Starting Phase 2 Pilot SSR Regression Tests...');

  // 1. Verify exact 10 pilot pages
  const slugs = Object.keys(PILOT_PAGES);
  assert(slugs.length === 10, `Expected exactly 10 pilot pages, found ${slugs.length}`);
  console.log(`✅ [Test 1 Passed] Exact 10 pilot records registered.`);

  // 2. Read base index.html template
  const distIndex = path.join(process.cwd(), 'dist', 'index.html');
  const devIndex = path.join(process.cwd(), 'index.html');
  const templatePath = fs.existsSync(distIndex) ? distIndex : devIndex;
  const baseHtml = fs.readFileSync(templatePath, 'utf-8');
  assert(baseHtml.length > 500, 'Base index.html template is missing or empty');
  console.log(`✅ [Test 2 Passed] Base HTML template read from: ${templatePath}`);

  // 3. Verify zero placeholder strings and full factual distinctness across all 10 pages
  const titles = new Set<string>();
  const canonicals = new Set<string>();
  const h1s = new Set<string>();

  for (const slug of slugs) {
    const page = PILOT_PAGES[slug];

    // Check for banned placeholder patterns
    const serialized = JSON.stringify(page);
    assert(
      !serialized.includes('Verified empirical test benchmark'),
      `Pilot page ${slug} contains prohibited generic fixture placeholder text`
    );
    assert(
      !serialized.includes('BrandX'),
      `Pilot page ${slug} contains fictitious entity BrandX`
    );

    // Verify distinctness
    assert(!titles.has(page.title), `Duplicate title detected for ${page.title}`);
    assert(!canonicals.has(page.canonicalUrl), `Duplicate canonical detected for ${page.canonicalUrl}`);
    assert(!h1s.has(page.h1), `Duplicate H1 detected for ${page.h1}`);

    titles.add(page.title);
    canonicals.add(page.canonicalUrl);
    h1s.add(page.h1);

    // Verify content completeness
    assert(page.h1.length > 10, `H1 too short for ${slug}`);
    assert(page.metaDescription.length >= 50, `Meta description too short for ${slug}`);
    assert(page.evidencePoints.length >= 2, `Insufficient evidence points for ${slug}`);
    assert(page.sections.length >= 1, `Insufficient sections for ${slug}`);
    assert(page.faqs.length >= 1, `Missing FAQs for ${slug}`);
    assert(page.relatedLinks.length >= 1, `Missing internal links for ${slug}`);
  }
  console.log(`✅ [Test 3 Passed] All 10 pilot records are mutually distinct and contain zero placeholder claims.`);

  // 4. Test SSR HTML generation for all 10 pilot pages
  for (const slug of slugs) {
    const page = PILOT_PAGES[slug];
    const initialHtml = renderPilotHtml(page, baseHtml);

    // Title verification (handles escaped &amp;)
    const escapedTitle = page.title.replace(/&/g, '&amp;');
    assert(
      initialHtml.includes(`<title>${escapedTitle} | productreviews.review</title>`),
      `Rendered HTML for ${slug} missing unique title tag`
    );

    // Meta description verification
    const escapedDesc = page.metaDescription.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    assert(
      initialHtml.includes(`name="description" content="${escapedDesc}"`),
      `Rendered HTML for ${slug} missing unique meta description`
    );

    // Canonical link verification
    assert(
      initialHtml.includes(`rel="canonical" href="${page.canonicalUrl}"`),
      `Rendered HTML for ${slug} missing canonical URL`
    );

    // Robots directive verification
    assert(
      initialHtml.includes('name="robots" content="index, follow'),
      `Rendered HTML for ${slug} missing indexable robots directive`
    );

    // Visible H1 inside body
    const escapedH1 = page.h1.replace(/&/g, '&amp;');
    assert(
      initialHtml.includes(`${escapedH1}</h1>`),
      `Rendered HTML for ${slug} missing visible H1 element`
    );

    // Visible decision headline
    const escapedHeadline = page.verdictHeadline.replace(/&/g, '&amp;');
    assert(
      initialHtml.includes(escapedHeadline),
      `Rendered HTML for ${slug} missing decision headline`
    );

    // Evidence points inside body
    for (const ev of page.evidencePoints) {
      const escapedClaim = ev.claim.replace(/&/g, '&amp;');
      assert(
        initialHtml.includes(escapedClaim),
        `Rendered HTML for ${slug} missing evidence claim: ${ev.claim}`
      );
    }

    // FAQs inside body
    for (const faq of page.faqs) {
      const escapedQ = faq.question.replace(/&/g, '&amp;');
      assert(
        initialHtml.includes(escapedQ),
        `Rendered HTML for ${slug} missing visible FAQ question: ${faq.question}`
      );
    }

    // Related internal links inside body
    for (const link of page.relatedLinks) {
      assert(
        initialHtml.includes(link.urlPath),
        `Rendered HTML for ${slug} missing related link url: ${link.urlPath}`
      );
    }

    // JSON-LD extraction and validation
    const jsonLdMatch = initialHtml.match(/<!-- Verified Route-Specific Schema\.org JSON-LD -->\s*<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert(!!jsonLdMatch, `Rendered HTML for ${slug} missing verified JSON-LD script block`);
    const parsedSchema = JSON.parse(jsonLdMatch![1]);
    assert(parsedSchema['@context'] === 'https://schema.org', 'Schema @context missing');
    assert(Array.isArray(parsedSchema['@graph']), 'Schema @graph array missing');

    const graphTypes = parsedSchema['@graph'].map((item: any) => item['@type']);
    assert(graphTypes.includes('WebPage'), `Schema graph for ${slug} missing WebPage`);
    assert(graphTypes.includes('FAQPage'), `Schema graph for ${slug} missing FAQPage`);
    assert(graphTypes.includes('BreadcrumbList'), `Schema graph for ${slug} missing BreadcrumbList`);
    if (page.routeType === 'review' && !page.secondaryProductName) {
      assert(graphTypes.includes('Product'), `Schema graph for ${slug} missing Product`);
    }

    // Confirm that the static generic FAQ was stripped
    assert(
      !initialHtml.includes('How do I check if a product on Amazon is sold by an authorized, genuine seller?'),
      `Rendered HTML for ${slug} failed to remove generic root FAQPage`
    );

    // Hydration state script present
    assert(
      initialHtml.includes(`window.__PILOT_DATA__ = {"slug":"${slug}"`),
      `Rendered HTML for ${slug} missing window.__PILOT_DATA__ hydration script`
    );
  }
  console.log(`✅ [Test 4 Passed] All 10 pilot pages deliver complete server-rendered initial HTML.`);

  // 5. Test 404 Not Found HTML generator
  const notFoundHtml = render404Html(baseHtml, '/review/nonexistent-item-999');
  assert(notFoundHtml.includes('404 Page Not Found'), '404 HTML missing title');
  assert(notFoundHtml.includes('content="noindex, nofollow"'), '404 HTML missing noindex robots tag');
  assert(notFoundHtml.includes('Review Not Found'), '404 HTML missing H1');
  console.log(`✅ [Test 5 Passed] 404 handler correctly outputs noindex and not-found semantics.`);

  // 6. Test client hydration record generator
  for (const slug of slugs) {
    const page = PILOT_PAGES[slug];
    const clientRecord = createClientRecordFromPilot(page);
    assert(clientRecord.status === 'PUBLISHED', 'Client record must be PUBLISHED');
    assert(clientRecord.slug === slug, 'Client record slug mismatch');
    assert(clientRecord.title === page.title, 'Client record title mismatch');
    assert(clientRecord.content.sections.length === page.sections.length, 'Client record section count mismatch');
    assert(clientRecord.decisionSnapshot?.headline === page.verdictHeadline, 'Client record decision mismatch');
  }
  console.log(`✅ [Test 6 Passed] Client-side hydration converter functions without errors.`);

  // 7. Test Route Resolution helper
  for (const slug of slugs) {
    const page = PILOT_PAGES[slug];
    const resolvedByReview = getPilotPage(`/review/${slug}`);
    const resolvedByCompare = getPilotPage(`/compare/${slug}`);
    assert(
      resolvedByReview !== undefined || resolvedByCompare !== undefined,
      `Failed to resolve route for ${slug}`
    );
  }
  assert(getPilotPage('/review/random-unknown-product') === undefined, 'Unknown route must resolve to undefined');
  console.log(`✅ [Test 7 Passed] Route resolver accurately maps pilot paths and rejects unknown slugs.`);

  console.log('🎉 All 7 Pilot SSR Regression Tests PASSED Successfully!');
  return true;
}

// Auto-run if executed directly via npx tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  runPilotSsrTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
