import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const RECIPIENT_EMAIL = 'alokmohansharma.delhi@gmail.com';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  recipient: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTACT_FILE_PATH = path.join(DATA_DIR, 'contact-messages.json');

function saveMessage(msg: ContactMessage) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let existing: ContactMessage[] = [];
    if (fs.existsSync(CONTACT_FILE_PATH)) {
      const content = fs.readFileSync(CONTACT_FILE_PATH, 'utf-8');
      if (content.trim()) {
        existing = JSON.parse(content);
      }
    }
    existing.unshift(msg);
    // Keep last 500 messages
    if (existing.length > 500) {
      existing = existing.slice(0, 500);
    }
    fs.writeFileSync(CONTACT_FILE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err: any) {
    console.error('[contact] Failed to save contact message to disk:', err?.message || err);
  }
}

export default async function handleContact(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const cleanSubject = (subject && typeof subject === 'string' && subject.trim())
    ? subject.trim()
    : 'New Inquiry from productreviews.review';

  const contactRecord: ContactMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    email: email.trim(),
    subject: cleanSubject,
    message: message.trim(),
    recipient: RECIPIENT_EMAIL,
    timestamp: new Date().toISOString(),
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
  };

  saveMessage(contactRecord);

  const emailSubjectEncoded = encodeURIComponent(`[productreviews.review] ${cleanSubject} - ${name.trim()}`);
  const emailBodyEncoded = encodeURIComponent(
    `From: ${name.trim()} <${email.trim()}>\n` +
    `Subject: ${cleanSubject}\n\n` +
    `Message:\n${message.trim()}\n\n` +
    `---\nSent via productreviews.review Contact Form\nTimestamp: ${new Date().toISOString()}`
  );

  const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${emailSubjectEncoded}&body=${emailBodyEncoded}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${emailSubjectEncoded}&body=${emailBodyEncoded}`;

  return res.status(200).json({
    success: true,
    recipient: RECIPIENT_EMAIL,
    message: `Thank you! Your message has been received and connected to ${RECIPIENT_EMAIL}.`,
    mailtoUrl,
    gmailUrl,
  });
}
