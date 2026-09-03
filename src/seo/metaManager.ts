export function updateDocumentMeta(params: {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: string;
  noIndex?: boolean;
}) {
  if (typeof document === 'undefined') return;

  const baseTitle = 'ProductReviews.review — Universal Search & Decision Engine';
  const fullTitle = params.title ? `${params.title} | ProductReviews.review` : baseTitle;
  document.title = fullTitle;

  const defaultDesc =
    'Find the right products, services, brands, software, places and more — based on what actually matters to you. Unbiased evidence synthesis with zero merchant bias.';
  const desc = params.description || defaultDesc;

  // Update meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', desc);

  // Update Open Graph tags
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', fullTitle);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', desc);

  // Update Canonical
  const canonicalUrl = `https://productreviews.review${params.canonicalPath || '/'}`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  // Robots meta tag: Prevent indexing on empty, failed, or thin search result pages
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.setAttribute('content', params.noIndex ? 'noindex, follow' : 'index, follow');
}
