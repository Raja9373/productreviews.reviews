import React, { useEffect } from 'react';

export interface ProductReviewSchemaInjectorProps {
  productName: string;
  category?: string;
  description?: string;
  canonicalUrl?: string;
  ratingValue?: string;
  reviewBody?: string;
  scriptId?: string;
}

export const ProductReviewSchemaInjector: React.FC<ProductReviewSchemaInjectorProps> = ({
  productName,
  category = 'Consumer Electronics',
  description = '',
  canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://productreviews.review/',
  ratingValue = '4.8',
  reviewBody = '',
  scriptId = 'product-review-schema-jsonld',
}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://productreviews.review/' },
            { '@type': 'ListItem', 'position': 2, 'name': category, 'item': 'https://productreviews.review/?category=smartphones' },
            { '@type': 'ListItem', 'position': 3, 'name': productName, 'item': canonicalUrl }
          ]
        },
        {
          '@type': 'Product',
          '@id': `${canonicalUrl}#product`,
          name: productName,
          category: category,
          description: description || `Objective editorial review and benchmark analysis for ${productName}.`,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: ratingValue,
            bestRating: '5',
            worstRating: '1',
            reviewCount: '128',
          },
          review: {
            '@type': 'Review',
            name: 'Hardware Review',
            reviewBody: reviewBody || 'Key verdict and findings...',
            author: {
              '@type': 'Organization',
              name: 'Editorial Research Board',
            },
            publisher: {
              '@type': 'Organization',
              name: 'productreviews.review',
              url: 'https://productreviews.review/',
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: ratingValue,
              bestRating: '5',
            },
          },
        },
      ],
    };

    script.textContent = JSON.stringify(schema, null, 2)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

    return () => {
      const el = document.getElementById(scriptId);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [productName, category, description, canonicalUrl, ratingValue, reviewBody, scriptId]);

  return null;
};
