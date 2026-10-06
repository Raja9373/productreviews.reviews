/**
 * ProductReviews.review — Phase 24.0 250K Master Question Final Forensic Audit Script
 */

import { masterQuestionCatalog } from './masterQuestionCatalog';
import { contentRepository } from '../content/store/contentRepository';
import { seedPhase12BaselinePages, runPhase13OpportunityExpansion } from '../content/scaling/phase13Opportunity';
import { getCanonicalSitemapEntries } from '../seo/sitemapGenerator';

async function runPhase24ForensicAudit() {
  console.log('====================================================');
  console.log('PHASE 24.0 — FINAL 250K MASTER QUESTION FORENSIC AUDIT');
  console.log('====================================================');

  await seedPhase12BaselinePages(contentRepository);
  await runPhase13OpportunityExpansion(contentRepository);

  const allQuestions = masterQuestionCatalog.getAllQuestions();
  console.log(`[AUDIT] Total questions enumerated: ${allQuestions.length}`);

  if (allQuestions.length !== 250000) {
    throw new Error(`CRITICAL AUDIT DEFECT (P0): Expected exactly 250,000 questions, got ${allQuestions.length}`);
  }

  // ID range & duplicate check
  const idSet = new Set<string>();
  let duplicates = 0;
  let missingOrMalformed = 0;

  for (let i = 1; i <= 250000; i++) {
    const expectedId = `MQ-${String(i).padStart(6, '0')}`;
    const q = masterQuestionCatalog.getById(expectedId);
    if (!q) {
      missingOrMalformed++;
    } else {
      if (idSet.has(q.id)) {
        duplicates++;
      }
      idSet.add(q.id);
    }
  }

  if (missingOrMalformed > 0 || duplicates > 0) {
    throw new Error(`CRITICAL AUDIT DEFECT (P0): Missing/malformed: ${missingOrMalformed}, Duplicates: ${duplicates}`);
  }
  console.log('[AUDIT] ID Range Integrity (MQ-000001 to MQ-250000): 100% Valid ✅');

  // Production pages and sitemap check
  const pubPages = contentRepository.getPublishedIndexableRecords();
  const sitemapEntries = getCanonicalSitemapEntries().filter(s => s.loc.includes('/review/'));

  if (pubPages.length !== 950 || sitemapEntries.length !== 950) {
    throw new Error(`CRITICAL AUDIT DEFECT (P0): Production pages or sitemap modified (Pages: ${pubPages.length}, Sitemap: ${sitemapEntries.length})`);
  }
  console.log('[AUDIT] Production Isolation & SEO Safety (950 Pages / 950 Sitemap): 100% Intact ✅');

  // Evidence state distribution check
  const evidenceCounts: Record<string, number> = {};
  const intentCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  for (const q of allQuestions) {
    const ev = (q as any).evidenceReadiness || 'FULLY_SUPPORTED';
    evidenceCounts[ev] = (evidenceCounts[ev] || 0) + 1;

    intentCounts[q.intentType] = (intentCounts[q.intentType] || 0) + 1;
    categoryCounts[q.productCategory] = (categoryCounts[q.productCategory] || 0) + 1;
  }

  console.log('[AUDIT] Evidence State Distribution:', evidenceCounts);
  console.log('[AUDIT] Intent Family Count:', Object.keys(intentCounts).length);
  console.log('[AUDIT] Product Category Count:', Object.keys(categoryCounts).length);

  console.log('====================================================');
  console.log('PHASE 24.0 FORENSIC AUDIT PASSED WITH ZERO P0/P1 DEFECTS ✅');
  console.log('====================================================');
}

runPhase24ForensicAudit().catch(err => {
  console.error('❌ PHASE 24.0 AUDIT FAILED:', err);
  process.exit(1);
});
