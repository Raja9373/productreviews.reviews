import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { adaptGeminiResponse } from '../src/search/researchAdapter';
import { compareProducts } from '../src/search/comparisonEngine';
import { synthesizeNichod } from '../src/search/nichodEngine';
import { extractClaims } from '../src/search/claimExtractor';

export async function handleComparisonSearch(req: express.Request, res: express.Response) {
  const query = req.body?.query || req.query?.q || '';
  const apiKey = process.env.GEMINI_API_KEY || (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  if (!apiKey) {
    return res.status(200).json({ success: false, errorMessage: 'API key not configured.' });
  }

  const products = query.split(/vs|versus|compare|and/i).map((p: string) => p.trim()).filter((p: string) => p.length > 2);
  if (products.length < 2) {
      return res.status(200).json({ success: false, status: 'INSUFFICIENT_INPUT', message: 'Could not identify two products.' });
  }

  const [prodA, prodB] = [products[0], products[1]];

  try {
      const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 10000 } });
      
      const research = async (product: string) => {
          const prompt = `Research ${product} for query: "${query}". Provide factual evidence points.`;
          // Correct API usage for model
          const response = await ai.models.generateContent({ model: 'gemini-3.8-flash', contents: [{ role: 'user', parts: [{ text: prompt }] }] } as any);
          const text = response.text || '';
          const claims = await extractClaims(text, [product]);
          return {
              evidencePoints: claims,
              nichod: synthesizeNichod(claims, product)
          };
      };

      const [resA, resB] = await Promise.all([research(prodA), research(prodB)]);
      const comparison = compareProducts(query, prodA, prodB, resA.evidencePoints, resB.evidencePoints, query);

      return res.status(200).json({
          success: true,
          comparison,
          productA: { evidencePoints: resA.evidencePoints, nichod: resA.nichod },
          productB: { evidencePoints: resB.evidencePoints, nichod: resB.nichod }
      });

  } catch (err) {
      console.error(err);
      return res.status(200).json({ success: false, errorMessage: 'Comparison failed.' });
  }
}
