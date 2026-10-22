import type { Request, Response } from "express";

export default async function handleContact(req: Request, res: Response) {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required fields." });
    }

    return res.status(200).json({
      success: true,
      message: "Thank you for reaching out to the productreviews.review editorial board. Your inquiry has been received."
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to process contact submission.", details: err?.message || String(err) });
  }
}
