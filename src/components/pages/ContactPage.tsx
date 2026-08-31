import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Send, Check, MapPin, Clock } from 'lucide-react';

interface ContactPageProps {
  onBackToHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300">
      {/* Top Back Navigation */}
      <div className="mb-8">
        <button
          id="contact-back-btn"
          onClick={onBackToHome}
          className="px-3.5 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-medium"
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
                <div>
                  <div className="font-bold text-zinc-900">Direct Email</div>
                  <a
                    href="mailto:contact@productreviews.review"
                    className="text-zinc-600 hover:text-zinc-900 font-mono underline underline-offset-2 mt-0.5 block"
                  >
                    contact@productreviews.review
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
                  <div className="font-bold text-zinc-900">Global Operations</div>
                  <div className="text-zinc-500 mt-0.5">productreviews.review Engine</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[24px] border border-zinc-200 p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Message Received</h3>
                <p className="text-sm text-zinc-500 max-w-md mb-6">
                  Thank you for contacting us, {name}. A member of our team will review your message and reply to <strong className="text-zinc-800">{email}</strong> shortly.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-zinc-900 mb-2">Send a Message</h2>

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
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
