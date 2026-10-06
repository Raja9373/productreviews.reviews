/**
 * ProductReviews.review — Phase 6 Content Store Unit & Integration Tests
 * Exhaustive verification of content persistence, revision control,
 * audit logging, approval & publication gates, and immutability.
 */

import { masterQuestionCatalog } from '../../questions/masterQuestionCatalog';
import { resolveQuestionContext } from '../../questions/context';
import { executeContentPipeline, PILOT_FIXTURES } from '../index';
import {
  contentRepository,
  canApproveContent,
  canPublishContent,
  resolveIndexability,
  needsContentRefresh,
  generateContentSlug
} from './index';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('RUNNING PHASE 6 CONTENT STORE TESTS');
console.log('====================================================\n');

contentRepository.clear();

// 1. CREATE DRAFT
console.log('[TEST 1] Testing draft creation...');
const sampleMQ = masterQuestionCatalog.getById('MQ-000001')!;
const sampleFix = PILOT_FIXTURES[0];
const pipelineResult = executeContentPipeline(sampleMQ, sampleFix.query, sampleFix.researchResult);
const record1 = contentRepository.createRecord(pipelineResult.content);

assert(record1 !== undefined && record1.id.startsWith('rec_'), 'Record must be created with rec_ prefix');
assert(record1.status === 'DRAFT', 'Initial status must be DRAFT');
assert(record1.version === 1, 'Initial version must be 1');
assert(record1.indexability === 'NOINDEX', 'Initial indexability must be NOINDEX');
console.log('✅ TEST 1 PASSED: Draft created successfully.');

// 2. RETRIEVE DRAFT
console.log('[TEST 2] Testing draft retrieval...');
const retrieved = contentRepository.getById(record1.id);
assert(retrieved !== undefined && retrieved.id === record1.id, 'Must retrieve draft by ID');
const retrievedBySlug = contentRepository.getBySlug(record1.slug);
assert(retrievedBySlug !== undefined && retrievedBySlug.id === record1.id, 'Must retrieve draft by slug');
console.log('✅ TEST 2 PASSED: Draft retrieval verified.');

// 3. UPDATE DRAFT
console.log('[TEST 3] Testing draft update...');
const updatedSynthesis = { ...pipelineResult.content, title: 'Updated Title For Testing' };
const updatedRecord = contentRepository.updateDraft(record1.id, updatedSynthesis);
assert(updatedRecord.title === 'Updated Title For Testing', 'Draft title must update');
console.log('✅ TEST 3 PASSED: Draft update verified.');

// 4. BLOCK PUBLISHING DRAFT DIRECTLY
console.log('[TEST 4] Testing publication gate on unapproved draft...');
const pubDraftRes = contentRepository.publishContent(record1.id);
assert(pubDraftRes.success === false, 'Cannot publish DRAFT without approval');
console.log('✅ TEST 4 PASSED: Draft cannot be published without passing approval.');

// 5. APPROVE ELIGIBLE CONTENT
console.log('[TEST 5] Testing content approval...');
const approveRes = contentRepository.approveContent(record1.id);
assert(approveRes.success === true, 'Eligible content must be approved');
assert(approveRes.record?.status === 'APPROVED', 'Status must transition to APPROVED');
console.log('✅ TEST 5 PASSED: Content approved successfully.');

// 6. BLOCK APPROVAL OF UNSAFE CONTENT
console.log('[TEST 6] Testing blocking approval of unsafe content...');
const unsafeContent = {
  ...pipelineResult.content,
  canonicalIntentId: 'MQ-UNSAFE-01',
  entity: { ...pipelineResult.content.entity, isAmbiguous: true }
};
const unsafeRec = contentRepository.createRecord(unsafeContent);
const unsafeApproveRes = contentRepository.approveContent(unsafeRec.id);
assert(unsafeApproveRes.success === false, 'Ambiguous entity must be blocked from approval');
assert(unsafeApproveRes.blockers?.includes('Entity identity is ambiguous'), 'Blocker must be tracked');
console.log('✅ TEST 6 PASSED: Unsafe content blocked from approval.');

// 7. PUBLISH APPROVED CONTENT
console.log('[TEST 7] Testing publication of approved content...');
const publishRes = contentRepository.publishContent(record1.id);
assert(publishRes.success === true, 'Approved content must publish');
assert(publishRes.record?.status === 'PUBLISHED', 'Status must transition to PUBLISHED');
assert(publishRes.record?.indexability === 'INDEX_CANDIDATE', 'Indexability must become INDEX_CANDIDATE');
assert(publishRes.record?.publishedAt !== undefined, 'publishedAt must be stamped');
console.log('✅ TEST 7 PASSED: Content successfully published.');

// 8. BLOCK PUBLISHING REJECTED
console.log('[TEST 8] Testing blocking publication of rejected content...');
const rejectedRec = contentRepository.rejectContent(unsafeRec.id, 'Ambiguous product');
const pubRejectedRes = contentRepository.publishContent(rejectedRec.id);
assert(pubRejectedRes.success === false, 'Rejected content cannot be published');
console.log('✅ TEST 8 PASSED: Rejected content blocked from publishing.');

// 9. PRESERVE EVIDENCE SNAPSHOT & NICHOD & DECISION
console.log('[TEST 9] Verifying evidence snapshot, NICHOD, and Decision preservation...');
const publishedRec = contentRepository.getById(record1.id)!;
assert(publishedRec.evidenceSnapshot.evidencePointIds.length > 0, 'Evidence IDs preserved');
assert(publishedRec.nichodSnapshot !== undefined, 'NICHOD snapshot preserved');
assert(publishedRec.decisionSnapshot !== undefined, 'Decision snapshot preserved');
console.log('✅ TEST 9 PASSED: Evidence snapshot, NICHOD, and Decision preserved intact.');

// 10. PREVENT DUPLICATE CANONICAL INTENT
console.log('[TEST 10] Testing canonical intent deduplication...');
const dupCandidate = { ...pipelineResult.content, questionId: 'MQ-000001-ALT' };
const dedupRec = contentRepository.createRecord(dupCandidate);
assert(dedupRec.id === record1.id, 'Duplicate canonical intent must return existing record');
console.log('✅ TEST 10 PASSED: Duplicate canonical intent deduplicated safely.');

// 11. IMMUTABILITY OF PUBLISHED VERSIONS & CREATING REVISIONS
console.log('[TEST 11] Testing immutability and revisions on published records...');
let errorThrownOnMutate = false;
try {
  contentRepository.updateDraft(record1.id, pipelineResult.content);
} catch {
  errorThrownOnMutate = true;
}
assert(errorThrownOnMutate, 'Direct updateDraft on PUBLISHED record must throw error');

const revisedSynthesis = { ...pipelineResult.content, title: 'iPhone 16 Pro Review 2026 Edition' };
const revisionRec = contentRepository.createRevision(record1.id, revisedSynthesis);
assert(revisionRec.version === 2, 'Revision version must be 2');
assert(revisionRec.status === 'QUALITY_REVIEW', 'Revision must start in QUALITY_REVIEW');
assert(revisionRec.indexability === 'NOINDEX', 'Revision must be NOINDEX until approved');
console.log('✅ TEST 11 PASSED: Published immutability and version revision verified.');

// 12. ARCHIVING CONTENT SAFELY
console.log('[TEST 12] Testing content archiving...');
const archivedRec = contentRepository.archiveContent(record1.id);
assert(archivedRec.status === 'ARCHIVED', 'Status must be ARCHIVED');
assert(archivedRec.indexability === 'NOINDEX', 'Archived content must be NOINDEX');
console.log('✅ TEST 12 PASSED: Archived record safely set to NOINDEX.');

// 13. FRESHNESS & STALE CONTENT DETECTION
console.log('[TEST 13] Testing freshness & stale detection...');
const freshCheck = needsContentRefresh(publishedRec);
assert(freshCheck.freshnessState === 'CURRENT', 'Recently created record must be CURRENT');
console.log('✅ TEST 13 PASSED: Freshness detection verified.');

// 14. AUDIT LOGGING
console.log('[TEST 14] Testing publication audit trail...');
const auditTrail = contentRepository.getAuditTrail(record1.id);
assert(auditTrail.length >= 4, 'Audit trail must record CREATE, APPROVE, PUBLISH, ARCHIVE operations');
console.log('✅ TEST 14 PASSED: Publication audit trail verified.');

console.log('\n====================================================');
console.log('ALL PHASE 6 CONTENT STORE TESTS PASSED! ✅');
console.log('====================================================\n');
