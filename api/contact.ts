import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export const RECIPIENT_EMAIL = 'alokmohansharma.delhi@gmail.com';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  recipient: string;
  timestamp: string;
  forwarded: boolean;
  forwardMethod?: string;
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
        try {
          existing = JSON.parse(content);
        } catch {}
      }
    }
    // Update or insert
    const idx = existing.findIndex((m) => m.id === msg.id);
    if (idx >= 0) {
      existing[idx] = msg;
    } else {
      existing.unshift(msg);
    }
    // Keep last 500 messages
    if (existing.length > 500) {
      existing = existing.slice(0, 500);
    }
    fs.writeFileSync(CONTACT_FILE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err: any) {
    console.error('[contact] Failed to save contact message to disk:', err?.message || err);
  }
}

/**
 * Attempt to forward via SMTP if configured
 */
async function trySmtpForward(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const from = process.env.SMTP_FROM || user || 'no-reply@productreviews.review';

  if (!host || !user || !pass) {
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"ProductReviews.review Contact Form" <${from}>`,
      to: RECIPIENT_EMAIL,
      replyTo: `"${msg.name}" <${msg.email}>`,
      subject: `[productreviews.review Contact] ${msg.subject} - from ${msg.name}`,
      text: `You have received a new message from the contact form at productreviews.review:\n\n` +
            `Name: ${msg.name}\n` +
            `Email: ${msg.email}\n` +
            `Subject: ${msg.subject}\n` +
            `Date: ${msg.timestamp}\n\n` +
            `Message:\n${msg.message}\n\n` +
            `---\nYou can reply directly to this email to contact ${msg.name} at ${msg.email}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #18181b; color: #ffffff; padding: 20px 24px;">
            <h2 style="margin: 0; font-size: 18px; font-weight: bold;">New Contact Form Message</h2>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a1a1aa;">productreviews.review Decision Engine</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #71717a; font-size: 13px; width: 100px;">From:</td>
                <td style="padding: 8px 0; color: #18181b; font-size: 14px; font-weight: 600;">${msg.name} &lt;${msg.email}&gt;</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #71717a; font-size: 13px;">Subject:</td>
                <td style="padding: 8px 0; color: #18181b; font-size: 14px;">${msg.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #71717a; font-size: 13px;">Date:</td>
                <td style="padding: 8px 0; color: #71717a; font-size: 13px;">${msg.timestamp}</td>
              </tr>
            </table>
            <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; border-left: 4px solid #18181b; margin-bottom: 20px;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #27272a;">${msg.message}</p>
            </div>
            <a href="mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
              Reply to ${msg.name}
            </a>
          </div>
        </div>
      `,
    });

    return true;
  } catch (err: any) {
    console.warn('[contact] SMTP forward failed:', err?.message || err);
    return false;
  }
}

/**
 * Forward via FormSubmit automated service directly to alokmohansharma.delhi@gmail.com
 */
async function tryFormSubmitForward(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; needsActivation?: boolean; message?: string }> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://productreviews.review/contact',
        'Origin': 'https://productreviews.review',
        'User-Agent': 'ProductReviews-Review/2.0',
      },
      body: JSON.stringify({
        name: msg.name,
        email: msg.email,
        _subject: `[productreviews.review Contact] ${msg.subject} - ${msg.name}`,
        _replyto: msg.email,
        message: msg.message,
        _captcha: 'false',
        _template: 'table',
      }),
    });

    const data: any = await res.json().catch(() => ({}));
    const isSuccess = data?.success === 'true' || data?.success === true;
    const isActivation = typeof data?.message === 'string' && data.message.toLowerCase().includes('activation');

    return {
      success: isSuccess,
      needsActivation: isActivation,
      message: data?.message,
    };
  } catch (err: any) {
    console.warn('[contact] FormSubmit forward failed:', err?.message || err);
    return { success: false, message: err?.message };
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

  const timestamp = new Date().toISOString();
  const contactRecord: ContactMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    email: email.trim(),
    subject: cleanSubject,
    message: message.trim(),
    recipient: RECIPIENT_EMAIL,
    timestamp,
    forwarded: false,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
  };

  // 1. First, try custom SMTP if configured in environment
  let forwarded = await trySmtpForward({
    name: contactRecord.name,
    email: contactRecord.email,
    subject: cleanSubject,
    message: contactRecord.message,
    timestamp,
  });

  let forwardMethod = forwarded ? 'smtp' : undefined;
  let needsActivation = false;

  // 2. If SMTP is not configured or failed, forward via FormSubmit directly to Alok's personal email
  if (!forwarded) {
    const fsResult = await tryFormSubmitForward({
      name: contactRecord.name,
      email: contactRecord.email,
      subject: cleanSubject,
      message: contactRecord.message,
    });

    if (fsResult.success) {
      forwarded = true;
      forwardMethod = 'formsubmit';
    } else if (fsResult.needsActivation) {
      needsActivation = true;
      forwardMethod = 'formsubmit_pending_activation';
    }
  }

  // Record delivery status
  contactRecord.forwarded = forwarded;
  contactRecord.forwardMethod = forwardMethod;
  saveMessage(contactRecord);

  // Prepare client-side backup links
  const emailSubjectEncoded = encodeURIComponent(`[productreviews.review] ${cleanSubject} - ${contactRecord.name}`);
  const emailBodyEncoded = encodeURIComponent(
    `From: ${contactRecord.name} <${contactRecord.email}>\n` +
    `Subject: ${cleanSubject}\n\n` +
    `Message:\n${contactRecord.message}\n\n` +
    `---\nSent via productreviews.review Contact Form\nTimestamp: ${timestamp}`
  );

  const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${emailSubjectEncoded}&body=${emailBodyEncoded}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${emailSubjectEncoded}&body=${emailBodyEncoded}`;

  return res.status(200).json({
    success: true,
    forwarded,
    forwardMethod,
    needsActivation,
    recipient: RECIPIENT_EMAIL,
    message: forwarded
      ? `Your message has been directly forwarded to ${RECIPIENT_EMAIL}.`
      : `Your message has been recorded and queued for delivery to ${RECIPIENT_EMAIL}.`,
    mailtoUrl,
    gmailUrl,
  });
}
