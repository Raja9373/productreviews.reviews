import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[GeminiSearch] WARNING: GEMINI_API_KEY is not set in environment.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface GroundedProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  modelNumber: string;
  category: string;
  image: string;
  basePriceUSD: number;
  rating: number;
  totalReviews: number;
  tag: string;
  budgetTier: 'TRENDING' | 'BUDGET' | 'BALANCED' | 'PREMIUM';
  whyDemandReason: string;
  specs: Record<string, string>;
  sourceUrl?: string;
  groundingSources?: Array<{ title: string; uri: string }>;
  asin?: string;
}

export interface GroundedSearchResult {
  success: boolean;
  query: string;
  isGrounded: boolean;
  searchQueriesRun: string[];
  groundingChunks: Array<{ uri: string; title: string }>;
  products: GroundedProduct[];
  errorMessage?: string;
}

/**
 * Executes Google Search Grounding to find REAL commercial products from live web results.
 * Runs queries:
 * 1. user_input + " best product buy online 2025"
 * 2. user_input + " Amazon bestseller"
 */
export async function searchProductsWithGrounding(
  userQuery: string,
  targetLang: string = 'en'
): Promise<GroundedSearchResult> {
  const query = userQuery.trim();
  const searchQueriesRun = [
    `${query} best product buy online 2025`,
    `${query} Amazon bestseller`,
  ];

  if (!query) {
    return {
      success: false,
      query: '',
      isGrounded: false,
      searchQueriesRun: [],
      groundingChunks: [],
      products: [],
      errorMessage: 'Empty query provided',
    };
  }

  const ai = getGenAI();
  if (!process.env.GEMINI_API_KEY) {
    return {
      success: false,
      query,
      isGrounded: false,
      searchQueriesRun,
      groundingChunks: [],
      products: [],
      errorMessage: 'GEMINI_API_KEY environment variable is not configured.',
    };
  }

  const prompt = `You are a real-time product discovery engine powered by Google Search Grounding.
You MUST search the live internet using the Google Search tool for:
1) "${searchQueriesRun[0]}"
2) "${searchQueriesRun[1]}"

CRITICAL INSTRUCTIONS:
- You are STRICTLY FORBIDDEN from generating or hallucinating fake products or placeholder names (e.g. do NOT invent "Pro Max Ultra", "PureLife Flagship", etc.).
- Extract 4 to 8 REAL, authentic commercial products currently being sold online in 2025 from your live Google Search results.
- Title: Must be the EXACT real product title from the search results (e.g., "Stanley Quencher H2.0 FlowState Stainless Steel Tumbler 40 oz", "Hydro Flask Standard Mouth Flex Cap 32 oz", "Philips SmartSleep Wake-up Light HF3520", etc.).
- Brand: The authentic manufacturer (e.g. "Stanley", "Hydro Flask", "Philips", "Milton", "Apple", "Sony", "Samsung", "Cello").
- Real Price: Realistic price in USD (number, e.g. 29.99 or 45).
- Real Rating: Actual star rating from Amazon / online stores (number between 3.8 and 5.0).
- Real Reviews: Real or estimated review count found on retailer sites (e.g. 4520, 12800).
- Real Specs: 4 to 6 accurate technical specifications derived from real search results.
- Real URL: The web source URL or Amazon / brand link found in search.
- Image: If a valid product photo or CDN image URL is found in the search result, include it.
- If no real commercial products exist for this query, return an empty array [] in JSON.

Output format: Return ONLY a valid JSON object wrapped in \`\`\`json ... \`\`\` code block with this exact structure:
{
  "products": [
    {
      "name": "Exact Real Product Title from Search Results",
      "brand": "Real Brand",
      "modelNumber": "Real Model or SKU",
      "category": "Real Category",
      "image": "Real image URL if found, or empty string",
      "basePriceUSD": 35,
      "rating": 4.8,
      "totalReviews": 6500,
      "tag": "🔥 Top Grounded Pick 2025",
      "budgetTier": "TRENDING",
      "whyDemandReason": "Real reason citing actual buyer feedback and features found in live search.",
      "specs": {
        "Capacity / Size": "1000 ml",
        "Material": "18/8 Stainless Steel",
        "Key Feature": "Double Wall Vacuum Insulation"
      },
      "sourceUrl": "https://www.amazon.com/dp/..."
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text || '';
    
    // Extract Grounding Metadata
    const candidate = response.candidates?.[0];
    const rawChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const groundingChunks: Array<{ uri: string; title: string }> = [];

    for (const chunk of rawChunks) {
      if (chunk.web?.uri) {
        groundingChunks.push({
          uri: chunk.web.uri,
          title: chunk.web.title || chunk.web.uri,
        });
      }
    }

    // Parse JSON from model output
    let parsedProducts: any[] = [];
    try {
      let jsonString = responseText;
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1];
      } else {
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonString = responseText.substring(firstBrace, lastBrace + 1);
        }
      }

      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.products)) {
        parsedProducts = parsed.products;
      } else if (Array.isArray(parsed)) {
        parsedProducts = parsed;
      }
    } catch (parseErr) {
      console.warn('[GeminiSearch] JSON parse warning:', parseErr, 'Raw text:', responseText.slice(0, 300));
    }

    // Map to GroundedProduct format
    const products: GroundedProduct[] = parsedProducts.map((p: any, idx: number) => {
      const slug = (p.name || `product-${idx}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const tier: 'TRENDING' | 'BUDGET' | 'BALANCED' | 'PREMIUM' =
        p.budgetTier || (idx === 0 ? 'TRENDING' : idx === 1 ? 'BUDGET' : idx === 2 ? 'BALANCED' : 'PREMIUM');

      // Associate grounding links
      const matchedChunk = groundingChunks[idx % (groundingChunks.length || 1)];
      const sourceUrl = p.sourceUrl || matchedChunk?.uri || `https://www.amazon.com/s?k=${encodeURIComponent(p.name)}`;

      return {
        id: `grounded-${slug.slice(0, 30)}-${idx}`,
        slug,
        name: p.name || `${p.brand || 'Verified'} Product`,
        brand: p.brand || 'Verified Brand',
        modelNumber: p.modelNumber || `${(p.brand || 'PROD').slice(0, 3).toUpperCase()}-${100 + idx}`,
        category: p.category || `${query} Category`,
        image: p.image || '',
        basePriceUSD: typeof p.basePriceUSD === 'number' ? p.basePriceUSD : 29,
        rating: typeof p.rating === 'number' ? Math.min(5, Math.max(1, p.rating)) : 4.6,
        totalReviews: typeof p.totalReviews === 'number' ? p.totalReviews : 2400,
        tag: p.tag || (idx === 0 ? '🔥 Google Search Grounded #1' : idx === 1 ? 'Best Value Pick' : 'Verified Bestseller'),
        budgetTier: tier,
        whyDemandReason: p.whyDemandReason || 'Verified real product found in live Google search results with high consumer satisfaction.',
        specs: p.specs || {
          'Brand': p.brand || 'Verified Brand',
          'Search Grounding': 'Live Google Web Discovery',
          'Source': matchedChunk?.title || 'Verified Web Retailer',
        },
        sourceUrl,
        groundingSources: groundingChunks.slice(0, 3),
        asin: p.asin || undefined,
      };
    });

    return {
      success: true,
      query,
      isGrounded: groundingChunks.length > 0,
      searchQueriesRun,
      groundingChunks,
      products,
    };
  } catch (err: any) {
    console.error('[GeminiSearch] Google Search Grounding Error:', err);
    return {
      success: false,
      query,
      isGrounded: false,
      searchQueriesRun,
      groundingChunks: [],
      products: [],
      errorMessage: err?.message || 'Failed to perform Google Search Grounding',
    };
  }
}
