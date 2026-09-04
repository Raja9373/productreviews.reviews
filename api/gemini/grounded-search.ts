import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);
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
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
        timeout: 10000,
      },
    });

    let reply = 'OK';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Reply with exactly: OK',
      });
      reply = response.text?.trim() || 'OK';
    } catch (primaryErr: any) {
      const isTransient =
        primaryErr?.status === 503 ||
        primaryErr?.status === 504 ||
        primaryErr?.status === 429 ||
        primaryErr?.message?.includes('503') ||
        primaryErr?.message?.includes('504') ||
        primaryErr?.message?.includes('429') ||
        primaryErr?.message?.includes('high demand') ||
        primaryErr?.message?.includes('DEADLINE_EXCEEDED') ||
        primaryErr?.message?.includes('UNAVAILABLE') ||
        primaryErr?.message?.includes('RESOURCE_EXHAUSTED');

      if (isTransient) {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: 'Reply with exactly: OK',
        });
        reply = fallbackResponse.text?.trim() || 'OK';
      } else {
        throw primaryErr;
      }
    }

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

    if (isRateLimited) {
      console.log('[Step 6 Gemini Connectivity] Quota in cooldown or rate-limited, fallback engaged.');
    } else {
      console.log('[Step 6 Gemini Connectivity] Handled provider status:', err?.status || 'notice');
    }

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
