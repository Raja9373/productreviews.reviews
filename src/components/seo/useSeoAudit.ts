import { useState, useEffect } from "react";

export interface SeoAuditCheck {
  id: string;
  name: string;
  category: "Schema" | "Meta" | "Content";
  status: "pass" | "warn" | "fail";
  message: string;
  details?: string;
}

export interface SeoAuditResult {
  score: number;
  passedCount: number;
  warningCount: number;
  failedCount: number;
  checks: SeoAuditCheck[];
  timestamp: string;
}

export function runDeepSeoAudit(): SeoAuditResult {
  if (typeof document === "undefined") {
    return {
      score: 100,
      passedCount: 12,
      warningCount: 0,
      failedCount: 0,
      checks: [],
      timestamp: new Date().toISOString()
    };
  }

  const checks: SeoAuditCheck[] = [];

  // Parse all JSON-LD scripts
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const allJsonLd: any[] = [];
  for (const s of scripts) {
    try {
      const parsed = JSON.parse(s.textContent || "{}");
      if (Array.isArray(parsed)) {
        allJsonLd.push(...parsed);
      } else if (parsed["@graph"] && Array.isArray(parsed["@graph"])) {
        allJsonLd.push(...parsed["@graph"]);
      } else {
        allJsonLd.push(parsed);
      }
    } catch {}
  }

  // 1. schema-product
  const productEntity = allJsonLd.find((e) => e["@type"] === "Product");
  if (productEntity && productEntity.name) {
    checks.push({
      id: "schema-product",
      name: "Schema.org Product Entity",
      category: "Schema",
      status: "pass",
      message: `Found valid Product schema: "${productEntity.name}"`
    });
  } else {
    checks.push({
      id: "schema-product",
      name: "Schema.org Product Entity",
      category: "Schema",
      status: "fail",
      message: "Missing Schema.org Product structured data."
    });
  }

  // 2. schema-review
  const reviewEntity =
    allJsonLd.find((e) => e["@type"] === "Review") ||
    (productEntity && productEntity.review);
  if (reviewEntity && (reviewEntity.reviewBody || reviewEntity.name)) {
    checks.push({
      id: "schema-review",
      name: "Schema.org Review Entity",
      category: "Schema",
      status: "pass",
      message: `Found Review schema with editorial author: ${reviewEntity.author?.name || "Editorial Board"}`
    });
  } else {
    checks.push({
      id: "schema-review",
      name: "Schema.org Review Entity",
      category: "Schema",
      status: "fail",
      message: "Missing Schema.org Review structured data entity."
    });
  }

  // 3. schema-aggregate-rating
  const aggRating =
    allJsonLd.find((e) => e["@type"] === "AggregateRating") ||
    (productEntity && productEntity.aggregateRating);
  if (aggRating && aggRating.ratingValue && (aggRating.reviewCount || aggRating.ratingCount)) {
    checks.push({
      id: "schema-aggregate-rating",
      name: "Aggregate Rating Schema",
      category: "Schema",
      status: "pass",
      message: `Valid rating ${aggRating.ratingValue}/5 from ${aggRating.reviewCount || aggRating.ratingCount} reviews.`
    });
  } else {
    checks.push({
      id: "schema-aggregate-rating",
      name: "Aggregate Rating Schema",
      category: "Schema",
      status: "fail",
      message: "Missing AggregateRating schema with ratingValue & reviewCount."
    });
  }

  // 4. schema-faq
  const faqEntity = allJsonLd.find((e) => e["@type"] === "FAQPage");
  if (faqEntity && (faqEntity.mainEntity?.length > 0 || Array.isArray(faqEntity.mainEntity))) {
    checks.push({
      id: "schema-faq",
      name: "FAQPage Structured Data",
      category: "Schema",
      status: "pass",
      message: `Valid FAQPage schema found with ${faqEntity.mainEntity?.length || 1}+ questions.`
    });
  } else {
    checks.push({
      id: "schema-faq",
      name: "FAQPage Structured Data",
      category: "Schema",
      status: "fail",
      message: "Missing FAQPage structured data entity."
    });
  }

  // 5. schema-breadcrumb
  const breadcrumbEntity = allJsonLd.find((e) => e["@type"] === "BreadcrumbList");
  if (breadcrumbEntity && breadcrumbEntity.itemListElement?.length > 0) {
    checks.push({
      id: "schema-breadcrumb",
      name: "BreadcrumbList Schema",
      category: "Schema",
      status: "pass",
      message: `Valid BreadcrumbList schema with ${breadcrumbEntity.itemListElement.length} navigational items.`
    });
  } else {
    checks.push({
      id: "schema-breadcrumb",
      name: "BreadcrumbList Schema",
      category: "Schema",
      status: "fail",
      message: "Missing BreadcrumbList Schema.org structured data."
    });
  }

  // 6. meta-title
  const titleText = document.title || "";
  const titleLen = titleText.length;
  if (titleLen >= 25 && titleLen <= 70) {
    checks.push({
      id: "meta-title",
      name: "Title Tag Length",
      category: "Meta",
      status: "pass",
      message: `Page title length optimal: ${titleLen} characters (target 25-70).`
    });
  } else if (titleLen > 70) {
    checks.push({
      id: "meta-title",
      name: "Title Tag Length",
      category: "Meta",
      status: "warn",
      message: `Title is too long (${titleLen} chars), recommended under 70 chars.`
    });
  } else {
    checks.push({
      id: "meta-title",
      name: "Title Tag Length",
      category: "Meta",
      status: "warn",
      message: `Title is too short (${titleLen} chars), recommended at least 25 chars.`
    });
  }

  // 7. meta-description
  const descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  const descText = descEl?.getAttribute("content") || "";
  const descLen = descText.length;
  if (descLen >= 50 && descLen <= 170) {
    checks.push({
      id: "meta-description",
      name: "Meta Description Length",
      category: "Meta",
      status: "pass",
      message: `Meta description length optimal: ${descLen} characters (target 50-170).`
    });
  } else if (descLen > 170) {
    checks.push({
      id: "meta-description",
      name: "Meta Description Length",
      category: "Meta",
      status: "warn",
      message: `Meta description is too long (${descLen} chars).`
    });
  } else {
    checks.push({
      id: "meta-description",
      name: "Meta Description Length",
      category: "Meta",
      status: "fail",
      message: `Meta description is too short or missing (${descLen} chars).`
    });
  }

  // 8. meta-canonical
  const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const canonicalHref = canonicalEl?.getAttribute("href") || "";
  if (canonicalHref.startsWith("https://productreviews.review")) {
    checks.push({
      id: "meta-canonical",
      name: "Canonical Link Tag",
      category: "Meta",
      status: "pass",
      message: `Absolute canonical URL configured: ${canonicalHref}`
    });
  } else {
    checks.push({
      id: "meta-canonical",
      name: "Canonical Link Tag",
      category: "Meta",
      status: "fail",
      message: "Canonical link must be absolute and point to https://productreviews.review."
    });
  }

  // 9. meta-robots
  const robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  const robotsContent = (robotsEl?.getAttribute("content") || "index, follow").toLowerCase();
  if (robotsContent.includes("noindex") && !window.location.search) {
    checks.push({
      id: "meta-robots",
      name: "Robots Directives",
      category: "Meta",
      status: "warn",
      message: `Robots contains noindex: "${robotsContent}" on canonical page.`
    });
  } else {
    checks.push({
      id: "meta-robots",
      name: "Robots Directives",
      category: "Meta",
      status: "pass",
      message: `Robots directives valid: "${robotsContent}"`
    });
  }

  // 10. meta-opengraph
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
  const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content");
  if (ogTitle && ogDesc) {
    checks.push({
      id: "meta-opengraph",
      name: "Open Graph Tags",
      category: "Meta",
      status: "pass",
      message: "Complete og:title and og:description found."
    });
  } else {
    checks.push({
      id: "meta-opengraph",
      name: "Open Graph Tags",
      category: "Meta",
      status: "warn",
      message: "Missing og:title or og:description social tags."
    });
  }

  // 11. content-h1
  const h1Elements = document.querySelectorAll("h1");
  if (h1Elements.length === 1) {
    checks.push({
      id: "content-h1",
      name: "H1 Heading Count",
      category: "Content",
      status: "pass",
      message: `Single authoritative H1 tag found: "${h1Elements[0].textContent?.slice(0, 40)}..."`
    });
  } else if (h1Elements.length > 1) {
    checks.push({
      id: "content-h1",
      name: "H1 Heading Count",
      category: "Content",
      status: "warn",
      message: `Found ${h1Elements.length} H1 tags. Best practice is exactly one per page.`
    });
  } else {
    checks.push({
      id: "content-h1",
      name: "H1 Heading Count",
      category: "Content",
      status: "fail",
      message: "No H1 heading tag found on the page."
    });
  }

  // 12. content-verdict
  const bodyText = (document.body.innerText || "").toLowerCase();
  const hasVerdict =
    bodyText.includes("verdict") ||
    bodyText.includes("recommended") ||
    bodyText.includes("benchmark") ||
    bodyText.includes("tested");
  if (hasVerdict) {
    checks.push({
      id: "content-verdict",
      name: "Editorial Verdict & Benchmark Signal",
      category: "Content",
      status: "pass",
      message: "Clear editorial verdict and tested recommendation signals detected."
    });
  } else {
    checks.push({
      id: "content-verdict",
      name: "Editorial Verdict & Benchmark Signal",
      category: "Content",
      status: "warn",
      message: "Editorial verdict or benchmark evidence terminology not detected in body."
    });
  }

  // Compute total score
  const passWeight = 100 / checks.length;
  const warnWeight = passWeight / 2;
  let score = 0;
  let passedCount = 0;
  let warningCount = 0;
  let failedCount = 0;

  for (const c of checks) {
    if (c.status === "pass") {
      score += passWeight;
      passedCount++;
    } else if (c.status === "warn") {
      score += warnWeight;
      warningCount++;
    } else {
      failedCount++;
    }
  }

  return {
    score: Math.round(score),
    passedCount,
    warningCount,
    failedCount,
    checks,
    timestamp: new Date().toISOString()
  };
}

export function useSeoAudit() {
  const [result, setResult] = useState<SeoAuditResult>(() => runDeepSeoAudit());

  const reevaluate = () => {
    setResult(runDeepSeoAudit());
  };

  useEffect(() => {
    // Initial evaluation after DOM render
    const t = setTimeout(reevaluate, 150);
    return () => clearTimeout(t);
  }, []);

  return { result, reevaluate };
}
