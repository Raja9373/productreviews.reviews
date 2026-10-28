import React, { useEffect } from "react";

export interface ProductReviewSchemaProps {
  productName: string;
  category: string;
  brand?: string;
  ratingValue?: number | string;
  reviewCount?: number | string;
  reviewTitle?: string;
  reviewBody?: string;
  authorName?: string;
  canonicalUrl?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}

export const ProductReviewSchemaInjector: React.FC<ProductReviewSchemaProps> = ({
  productName,
  category,
  brand = "Editorial Benchmark Labs",
  ratingValue = "4.8",
  reviewCount = "128",
  reviewTitle = "Hardware Review",
  reviewBody = "Key verdict and findings: Thoroughly lab-tested against strict hardware benchmarks, thermal stress, and long-term battery performance standards.",
  authorName = "Editorial Research Board",
  canonicalUrl = "https://productreviews.review/",
  breadcrumbs,
  faqs
}) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const scriptId = "dynamic-product-review-schema";
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!existingScript) {
      existingScript = document.createElement("script");
      existingScript.id = scriptId;
      existingScript.type = "application/ld+json";
      document.head.appendChild(existingScript);
    }

    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const defaultBreadcrumbs = breadcrumbs || [
      { name: "Home", url: "https://productreviews.review/" },
      { name: category, url: `https://productreviews.review/?category=${encodeURIComponent(categorySlug)}` },
      { name: productName, url: canonicalUrl }
    ];

    const breadcrumbListSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": defaultBreadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };

    const productSchema: any = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": productName,
      "category": category,
      "brand": {
        "@type": "Brand",
        "name": brand
      },
      "review": {
        "@type": "Review",
        "name": reviewTitle,
        "reviewBody": reviewBody,
        "author": {
          "@type": "Organization",
          "name": authorName
        },
        "positiveNotes": {
          "@type": "ItemList",
          "itemListElement": ["Lab-tested benchmarks", "Hardware evidence-based verdict"]
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(ratingValue),
        "reviewCount": String(reviewCount),
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    const speakableSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": productName,
      "speakable": {
        "@type": "SpeakableSpecification",
        "xpath": [
          "/html/head/title",
          "/html/head/meta[@name='description']/@content"
        ]
      },
      "url": canonicalUrl
    };

    const schemaGraph: any[] = [breadcrumbListSchema, productSchema, speakableSchema];

    if (faqs && faqs.length > 0) {
      schemaGraph.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      });
    }

    existingScript.textContent = JSON.stringify(
      schemaGraph.length === 1 ? schemaGraph[0] : { "@context": "https://schema.org", "@graph": schemaGraph },
      null,
      2
    );
  }, [
    productName,
    category,
    brand,
    ratingValue,
    reviewCount,
    reviewTitle,
    reviewBody,
    authorName,
    canonicalUrl,
    breadcrumbs,
    faqs
  ]);

  return null;
};
