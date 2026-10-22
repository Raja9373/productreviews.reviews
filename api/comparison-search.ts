import type { Request, Response } from "express";
import { contentRepository } from "../src/content/store/contentRepository";

export async function handleComparisonSearch(req: Request, res: Response) {
  try {
    const q1 = (req.query.productA || req.body?.productA || "").toString().trim();
    const q2 = (req.query.productB || req.body?.productB || "").toString().trim();

    const all = contentRepository.getAll();
    const matchA = all.find((p) => p.name.toLowerCase().includes(q1.toLowerCase()) || p.slug.includes(q1.toLowerCase())) || all[0];
    const matchB = all.find((p) => p.name.toLowerCase().includes(q2.toLowerCase()) || p.slug.includes(q2.toLowerCase())) || all[1] || all[0];

    res.json({
      success: true,
      productA: matchA,
      productB: matchB,
      verdict: `${matchA.name} scores ${matchA.rating}/5.0 vs ${matchB.name} at ${matchB.rating}/5.0.`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || String(err) });
  }
}

export default handleComparisonSearch;
