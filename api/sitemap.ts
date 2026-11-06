/**
 * Cleanest possible Sitemap handler for Vercel.
 * No external imports. No Express-specific methods.
 * Guaranteed to run in any Node.js serverless context.
 */
export default function (req: any, res: any) {
  const lastmod = "2025-03-01";
  const baseUrl = "https://productreviews.review";

  const paths = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/about", changefreq: "monthly", priority: "0.6" },
    { path: "/contact", changefreq: "monthly", priority: "0.5" },
    { path: "/privacy", changefreq: "yearly", priority: "0.5" },
    { path: "/terms", changefreq: "yearly", priority: "0.4" },
    { path: "/affiliate-disclosure", changefreq: "monthly", priority: "0.5" },
    { path: "/review/apple-iphone-16-pro-max", changefreq: "weekly", priority: "0.9" },
    { path: "/review/samsung-galaxy-s24-ultra", changefreq: "weekly", priority: "0.9" },
    { path: "/review/best-oneplus-nord-ce4-review-2026", changefreq: "weekly", priority: "0.9" },
    { path: "/review/google-pixel-8a", changefreq: "weekly", priority: "0.9" },
    { path: "/review/nothing-phone-2a", changefreq: "weekly", priority: "0.9" },
    { path: "/review/macbook-pro-16-m3-max", changefreq: "weekly", priority: "0.9" },
    { path: "/review/dell-xps-15-oled", changefreq: "weekly", priority: "0.9" },
    { path: "/review/sony-wh-1000xm5", changefreq: "weekly", priority: "0.9" },
    { path: "/review/bose-quietcomfort-ultra", changefreq: "weekly", priority: "0.9" },
    { path: "/review/apple-watch-ultra-2", changefreq: "weekly", priority: "0.9" },
    { path: "/review/dyson-v15-detect", changefreq: "weekly", priority: "0.9" },
    { path: "/compare/iphone-16-pro-max-vs-galaxy-s24-ultra", changefreq: "weekly", priority: "0.8" },
    { path: "/compare/sony-wh-1000xm5-vs-bose-qc-ultra", changefreq: "weekly", priority: "0.8" },
    { path: "/compare/macbook-pro-m3-vs-dell-xps-15", changefreq: "weekly", priority: "0.8" }
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  paths.forEach(item => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${item.path}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.end(xml);
}
