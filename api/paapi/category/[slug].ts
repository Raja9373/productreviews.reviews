import { getOrFetchCategoryProducts } from '../../../server/amazonPaapi';
import { CATEGORIES } from '../../../src/data/categories';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const slug = (req.query?.slug as string) || '';
    if (!slug) {
      return res.status(400).json({ error: 'Category slug is required' });
    }

    const category = CATEGORIES.find((c) => c.slug === slug || c.id === slug);
    const categoryName = category ? category.name : slug.replace(/-/g, ' ');

    const result = await getOrFetchCategoryProducts(slug, categoryName);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[Vercel API /api/paapi/category/[slug]] Error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to fetch category products',
    });
  }
}
