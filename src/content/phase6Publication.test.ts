/**
 * ProductReviews.review — Phase 6 Publication & Sitemap Tests
 * Verifies sitemap integration, indexability gates, canonical preservation,
 * and pilot publication.
 */

import { masterQuestionCatalog } from '../questions/masterQuestionCatalog';
import { executeContentPipeline, PILOT_FIXTURES } from './index';
import { contentRepository } from './store/contentRepository';
import { getCanonicalSitemapEntries } from '../seo/sitemapGenerator';
import { BASE_CANONICAL_URL } from '../seo/metaManager';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('RUNNING PHASE 6 PUBLICATION & SITEMAP TESTS');
console.log('====================================================\n');

contentRepository.clear();

// 1. UNPUBLISHED PAGES ABSENT FROM SITEMAP
console.log('[TEST 1] Testing unpublished pages absent from sitemap...');
const sampleMQ = masterQuestionCatalog.getById('MQ-000001')!;
const sampleFix = PILOT_FIXTURES[0];
const pipe = executeContentPipeline(sampleMQ, sampleFix.query, sampleFix.researchResult);
const record = contentRepository.createRecord(pipe.content);

let sitemap = getCanonicalSitemapEntries();
assert(!sitemap.some(s => s.loc === record.canonicalUrl), 'Draft page must NOT appear in sitemap');
console.log('✅ TEST 1 PASSED: Draft page is absent from sitemap.');

// 2. APPROVAL ALONE DOES NOT ADD TO SITEMAP
console.log('[TEST 2] Testing approval alone does not add to sitemap...');
contentRepository.approveContent(record.id);
sitemap = getCanonicalSitemapEntries();
assert(!sitemap.some(s => s.loc === record.canonicalUrl), 'Approved but unpublished page must NOT appear in sitemap');
console.log('✅ TEST 2 PASSED: Approved unpublished page is absent from sitemap.');

// 3. PUBLISHED INDEXABLE PAGE APPEARS IN SITEMAP
console.log('[TEST 3] Testing publication adds page to sitemap...');
const pubRes = contentRepository.publishContent(record.id);
assert(pubRes.success === true, 'Publication must succeed');
sitemap = getCanonicalSitemapEntries();
const foundInSitemap = sitemap.find(s => s.loc === record.canonicalUrl);
assert(foundInSitemap !== undefined, 'Published page must appear in sitemap');
assert(foundInSitemap!.loc.startsWith('https://productreviews.review/'), 'Must use canonical https protocol');
console.log('✅ TEST 3 PASSED: Published page appears in canonical sitemap.');

// 4. REJECTED / NOINDEX PAGES ABSENT FROM SITEMAP
console.log('[TEST 4] Testing rejected pages absent from sitemap...');
const rejectedMQ = masterQuestionCatalog.getById('MQ-000003')!;
const rejectedFix = PILOT_FIXTURES[3]; // Insufficient evidence fixture
const rejPipe = executeContentPipeline(rejectedMQ, rejectedFix.query, rejectedFix.researchResult);
const rejRecord = contentRepository.createRecord(rejPipe.content);
contentRepository.rejectContent(rejRecord.id, 'Insufficient Evidence');

sitemap = getCanonicalSitemapEntries();
assert(!sitemap.some(s => s.loc === rejRecord.canonicalUrl), 'Rejected page must NOT appear in sitemap');
console.log('✅ TEST 4 PASSED: Rejected/noindex pages absent from sitemap.');

// 5. ARCHIVED PAGE REMOVED FROM SITEMAP
console.log('[TEST 5] Testing archived page removed from sitemap...');
contentRepository.archiveContent(record.id);
sitemap = getCanonicalSitemapEntries();
assert(!sitemap.some(s => s.loc === record.canonicalUrl), 'Archived page must NOT appear in sitemap');
console.log('✅ TEST 5 PASSED: Archived page removed from sitemap.');

// 6. CONTROLLED PILOT PRODUCTION EVALUATION (50-100 real candidates evaluated)
console.log('\n[PILOT] Evaluating controlled production pilot candidates...');
contentRepository.clear();

const allMQs = masterQuestionCatalog.getAllQuestions();
const groups = new Set<string>();
const pilotCandidateMQs: any[] = [];
for (const q of allMQs) {
  if (!groups.has(q.duplicateGroupId)) {
    groups.add(q.duplicateGroupId);
    pilotCandidateMQs.push(q);
    if (pilotCandidateMQs.length >= 80) break;
  }
}

let evaluatedCount = 0;
let approvedCount = 0;
const publishedRecordIds = new Set<string>();
let rejectedCount = 0;

for (const mq of pilotCandidateMQs) {
  evaluatedCount++;
  // Use representative pilot research data where available
  const matchingFix = PILOT_FIXTURES.find(f => f.masterQuestion.intentType === mq.intentType) || PILOT_FIXTURES[0];
  const query = mq.entityRequired ? matchingFix.query : mq.question;
  const pResult = executeContentPipeline(mq, query, matchingFix.researchResult);

  const rec = contentRepository.createRecord(pResult.content);
  if (pResult.isPublicationCandidate && rec.content.indexability === 'ELIGIBLE_CANDIDATE') {
    const appRes = contentRepository.approveContent(rec.id);
    if (appRes.success) {
      approvedCount++;
      // Controlled publication: Only publish if clean comparison or review
      if (rec.pageType === 'PRODUCT_REVIEW' || rec.pageType === 'COMPARISON') {
        const pRes = contentRepository.publishContent(rec.id);
        if (pRes.success) {
          publishedRecordIds.add(rec.id);
        }
      }
    }
  } else {
    contentRepository.rejectContent(rec.id, 'Eligibility gate unmet');
    rejectedCount++;
  }
}

const publishedCount = publishedRecordIds.size;
const approvedUnpublishedCount = approvedCount - publishedCount;
console.log(`Pilot Results: Evaluated: ${evaluatedCount}, Total Approved: ${approvedCount} (Published: ${publishedCount}, Approved Unpublished: ${approvedUnpublishedCount}), Rejected: ${rejectedCount}`);
assert(evaluatedCount === approvedUnpublishedCount + publishedCount + rejectedCount, 'Mutually exclusive counts must equal total evaluated');
assert(publishedCount > 0 && publishedCount <= 80, 'Must have controlled non-mass published count');
assert(evaluatedCount === 80, 'Evaluated exact batch');

const finalSitemap = getCanonicalSitemapEntries();
const sitemapPublishedCount = finalSitemap.filter(s => s.loc.includes('/review/')).length;
assert(sitemapPublishedCount === publishedCount, 'Sitemap count must exactly match published count');
console.log(`✅ TEST 6 PASSED: Controlled pilot verified (${publishedCount} published, ${sitemapPublishedCount} sitemap entries).`);

console.log('\n====================================================');
console.log('ALL PHASE 6 PUBLICATION TESTS PASSED! ✅');
console.log('====================================================\n');
