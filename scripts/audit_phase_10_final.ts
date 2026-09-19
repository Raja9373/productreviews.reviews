import { execSync } from 'child_process';

console.log('====================================================');
console.log('PHASE 10.0 — FINAL PRODUCTION LAUNCH READINESS AUDIT');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function runSuite(name: string, cmd: string) {
  try {
    console.log(`Running ${name}...`);
    execSync(cmd, { stdio: 'inherit' });
    passCount++;
    console.log(`✅ [PASS] ${name}\n`);
  } catch (err) {
    failCount++;
    console.error(`❌ [FAIL] ${name}\n`);
  }
}

runSuite('Phase 6.4 Comparison Integrity', 'npx tsx scripts/audit_phase_6_4.ts');
runSuite('Phase 7.0 Query Intelligence', 'npx tsx scripts/audit_phase_7_intelligence.ts');
runSuite('Phase 7.2 Research Quality', 'npx tsx scripts/audit_phase_7_2_research.ts');
runSuite('Phase 8.0 SEO Architecture', 'npx tsx scripts/audit_phase_8_seo.ts');
runSuite('Phase 9.0 Amazon Affiliate Integrity', 'npx tsx scripts/audit_phase_9_affiliate.ts');
runSuite('Phase 9.1 AdSense Readiness', 'npx tsx scripts/audit_phase_9_1_adsense.ts');
runSuite('TypeScript Typecheck & Linter', 'npm run lint');
runSuite('Production Build & Esbuild Server Bundle', 'npm run build');

console.log('====================================================');
console.log(`FINAL AUDIT RESULTS: ${passCount} SUITES PASSED, ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
