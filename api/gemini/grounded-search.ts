import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // STEP 5: Gemini Client Initialization without API call
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey) {
    try {
      // Test initialization of the GoogleGenAI client
      const ai = new GoogleGenAI({ apiKey });
      if (!ai) {
        throw new Error('Client creation returned null');
      }
    } catch (err: any) {
      console.error('[Step 5 Error] Failed to initialize GoogleGenAI client:', err?.message);
    }
  }

  return res.status(200).json({
    success: true,
    status: 'HEALTHY',
    products: []
  });
}
