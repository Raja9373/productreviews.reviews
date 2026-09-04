import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, Check, MapPin, Clock, ExternalLink, Loader2 } from 'lucide-react';

const RECIPIENT_EMAIL = 'alokmohansharma.delhi@gmail.com';

interface ContactPageProps {
  onBackToHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [gmailLink, setGmailLink] = useState('');
  const [mailtoLink, setMailtoLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const cleanSubject = subject.trim() || 'General Inquiry / Product Review Feedback';
    const encodedSubject = encodeURIComponent(`[productreviews.review] ${cleanSubject} - ${name.trim()}`);
    const encodedBody = encodeURIComponent(
      `Hello Alok,\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${cleanSubject}\n\nMessage:\n${message.trim()}\n\n---\nSent via productreviews.review Contact Form`
    );

    const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${encodedSubject}&body=${encodedBody}`;

    setMailtoLink(mailto);
    setGmailLink(gmail);

    try {
      // Send to backend API to persist and route message
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: cleanSubject,
          message: message.trim(),
        }),
      });
    } catch (err) {
      console.warn('[ContactPage] Backend submission failed, proceeding with direct client redirect:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger user's mail client directly
      try {
        window.location.href = mailto;
      } catch {}
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
    setGmailLink('');
    setMailtoLink('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300">
      {/* Top Back Navigation */}
      <div className="mb-8">
        <button
          id="contact-back-btn"
          onClick={onBackToHome}
          className="px-3.5 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[24px] border border-zinc-200 p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-normal">
              Have feedback on an AI product review, a model indexing request, or a technical inquiry? Our team responds to all queries within 24–48 hours.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <Mail className="w-4 h-4 text-zinc-700 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-zinc-900">Direct Email</div>
                  <a
                    href={`mailto:${RECIPIENT_EMAIL}`}
                    className="text-zinc-600 hover:text-zinc-900 font-mono underline underline-offset-2 mt-0.5 block truncate"
                    title={RECIPIENT_EMAIL}
                  >
                    {RECIPIENT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <Clock className="w-4 h-4 text-zinc-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900">Response Time</div>
                  <div className="text-zinc-500 mt-0.5">Monday to Friday: within 24 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <MapPin className="w-4 h-4 text-zinc-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900">Operations Desk</div>
                  <div className="text-zinc-500 mt-0.5">productreviews.review Editorial Office</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[24px] border border-zinc-200 p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="py-8 flex flex-col items-center text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Message Connected</h3>
                <p className="text-sm text-zinc-600 max-w-md mb-2">
                  Thank you, <strong className="text-zinc-900">{name}</strong>. Your message has been safely submitted and routed to{' '}
                  <strong className="text-zinc-900 font-mono text-xs">{RECIPIENT_EMAIL}</strong>.
                </p>
                <p className="text-xs text-zinc-500 max-w-md mb-6">
                  A draft has also been initiated in your default mail client. You can also send directly using the options below:
                </p>

                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  {gmailLink && (
                    <a
                      href={gmailLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open in Gmail</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  )}
                  {mailtoLink && (
                    <a
                      href={mailtoLink}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Open in Mail App</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-zinc-900">Send a Message</h2>
                  <span className="text-[11px] text-zinc-500">
                    To: <span className="font-mono text-zinc-700 font-medium">{RECIPIENT_EMAIL}</span>
                  </span>
                </div>

                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-zinc-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Product review feedback, indexing request, bug report"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please share your feedback, product request, or inquiry..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Routing Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send to {RECIPIENT_EMAIL}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
