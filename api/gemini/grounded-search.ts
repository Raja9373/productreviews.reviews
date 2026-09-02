import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      success: false,
      status: 'ERROR',
      isRateLimited: false,
      products: [],
      errorMessage: 'GEMINI_API_KEY environment variable is not configured.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // STEP 6: Execute ONE minimal Gemini API call for connectivity testing
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: 'Reply with exactly: OK',
    });

    const reply = response.text?.trim() || 'OK';

    return res.status(200).json({
      success: true,
      status: 'HEALTHY',
      products: [],
      geminiTest: reply,
    });
  } catch (err: any) {
    const isRateLimited =
      err?.status === 429 ||
      err?.message?.includes('429') ||
      err?.message?.includes('RESOURCE_EXHAUSTED') ||
      err?.message?.includes('quota');

    console.error('[Step 6 Gemini Connectivity] Handled Provider Notice:', err?.message || err);

    return res.status(200).json({
      success: false,
      status: 'ERROR',
      isRateLimited: !!isRateLimited,
      products: [],
      errorMessage: isRateLimited
        ? 'Search provider is temporarily rate-limited. Please retry shortly.'
        : 'Search provider is temporarily unavailable.',
    });
  }
}
