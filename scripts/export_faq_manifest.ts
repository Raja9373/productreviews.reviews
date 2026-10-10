/**
 * ProductReviews.review — Static FAQ Manifest Export Script
 * 
 * Exports all category-specific FAQ datasets and their Schema.org representations
 * into /public/faq-manifest.json and /dist/faq-manifest.json to ensure search engines
 * can discover and index all FAQ content even with JavaScript disabled.
 */

import { generateFaqManifest, writeFaqManifestToDisk } from '../src/seo/faqData';

async function run() {
  console.log('====================================================');
  console.log('EXPORTING CATEGORY FAQ KNOWLEDGE GRAPH MANIFEST');
  console.log('====================================================');

  const manifest = generateFaqManifest();
  console.log(`[MANIFEST] Total Categories: ${manifest.totalCategories}`);
  console.log(`[MANIFEST] Total Questions:  ${manifest.totalQuestions}`);

  manifest.categories.forEach((cat) => {
    console.log(`  - [${cat.id.toUpperCase()}] ${cat.name}: ${cat.questionCount} questions`);
  });

  const writtenPaths = await writeFaqManifestToDisk();
  console.log('[MANIFEST] Successfully written to:');
  writtenPaths.forEach((p) => console.log(`  ✅ ${p}`));

  console.log('====================================================');
  console.log('FAQ MANIFEST EXPORT COMPLETE');
  console.log('====================================================');
}

run().catch((err) => {
  console.error('[export_faq_manifest error]:', err);
  process.exit(1);
});
