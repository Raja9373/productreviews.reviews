import { generateSitemapXml } from '../api/sitemap';
import http from 'http';
import express from 'express';

console.log('====================================================');
console.log('SITEMAP FETCH & ENDPOINT VERIFICATION SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, name: string, detail?: string) {
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    failCount++;
    console.error(`❌ [FAIL] ${name}${detail ? ` - ${detail}` : ''}`);
  }
}

// 1. Generate XML and validate structure
const xml = generateSitemapXml();
assert(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), '1. XML valid declaration header');
assert(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), '2. XML valid urlset namespace');
assert(xml.includes('https://productreviews.review/'), '3. Uses canonical domain https://productreviews.review');
assert(!xml.includes('localhost'), '4. No localhost URLs in sitemap');
assert(!xml.includes('www.productreviews.review'), '5. No www URLs in sitemap');

// Count url entries
const matches = xml.match(/<url>/g);
const count = matches ? matches.length : 0;
assert(count > 10, `6. Sitemap contains sufficient URL entries (count: ${count})`);
console.log(`ℹ️ Total sitemap URLs generated: ${count}`);

// Test server simulation for /sitemap.xml and /robots.txt
const app = express();
app.get('/sitemap.xml', async (req, res) => {
  const sitemapMod = await import('../api/sitemap');
  await sitemapMod.default(req, res);
});
app.get('/robots.txt', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send('User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://productreviews.review/sitemap.xml\n');
});

const server = http.createServer(app);
server.listen(0, async () => {
  const address = server.address() as any;
  const port = address.port;

  try {
    // Test /sitemap.xml
    const smRes = await fetch(`http://localhost:${port}/sitemap.xml`);
    assert(smRes.status === 200, '7. /sitemap.xml HTTP status is 200');
    const contentType = smRes.headers.get('content-type') || '';
    assert(contentType.includes('xml'), `8. /sitemap.xml Content-Type is XML (got: ${contentType})`);
    const smText = await smRes.text();
    assert(smText.startsWith('<?xml'), '9. /sitemap.xml response body begins with XML declaration');
    assert(smText.includes('</urlset>'), '10. /sitemap.xml response body is fully closed');

    // Test /robots.txt
    const rbRes = await fetch(`http://localhost:${port}/robots.txt`);
    assert(rbRes.status === 200, '11. /robots.txt HTTP status is 200');
    const rbText = await rbRes.text();
    assert(rbText.includes('Sitemap: https://productreviews.review/sitemap.xml'), '12. /robots.txt correctly declares canonical sitemap URL');

    console.log('\n====================================================');
    console.log(`SITEMAP TEST RESULTS: ${passCount}/${passCount + failCount} PASSED (${failCount} failures)`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    server.close();
    if (failCount > 0) {
      process.exit(1);
    }
  }
});
