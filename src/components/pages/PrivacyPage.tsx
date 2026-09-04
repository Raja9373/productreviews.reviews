import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Cookie, FileText } from 'lucide-react';

interface PrivacyPageProps {
  onBackToHome: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBackToHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300">
      {/* Top Back Navigation */}
      <div className="mb-8">
        <button
          id="privacy-back-btn"
          onClick={onBackToHome}
          className="px-3.5 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-zinc-200 p-8 sm:p-12 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold tracking-wide mb-4">
            <Shield className="w-3.5 h-3.5 text-zinc-600" />
            <span>Compliance &amp; Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-2">
            Last Updated: March 2026 • Compliant with GDPR &amp; CCPA Regulations
          </p>
        </div>

        <div className="space-y-6 text-zinc-600 text-sm leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">1. Introduction</h2>
            <p>
              At <strong>productreviews.review</strong> ("we", "our", or "the Service"), we are deeply committed to safeguarding user privacy. This Privacy Policy clarifies how information is gathered, utilized, and protected when you access our global multi-source AI product review platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">2. Information We Collect</h2>
            <p>
              We prioritize data minimization. We do not require users to create an account or provide personal credentials to browse our AI reviews, run model queries, or view scorecards.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
              <li>
                <strong>Client Preferences &amp; 40-Language State:</strong> We store your preferred language code and currency choices locally in your browser’s <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">localStorage</code> to deliver consistent localization across page loads.
              </li>
              <li>
                <strong>Log &amp; Technical Diagnostics:</strong> Standard non-identifying server telemetry including anonymized IP addresses, browser user agent strings, and request timestamps to prevent abuse and ensure edge cache performance.
              </li>
              <li>
                <strong>Communications:</strong> If you submit a query via our contact form, we collect your name, email address, and message contents strictly to fulfill your customer inquiry.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">3. Cookies &amp; Google AdSense Advertising</h2>
            <p>
              Third-party vendors, including Google, use cookies to serve advertisements based on a user's prior visits to this website or other websites.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
              <li>
                <strong>Google AdSense &amp; DoubleClick DART Cookies:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
              </li>
              <li>
                <strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-zinc-900 underline font-medium">Google Ads Settings</a> or through <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-zinc-900 underline font-medium">aboutads.info</a>.
              </li>
              <li>
                <strong>Cookie Management:</strong> You can configure your browser settings to reject cookies or notify you when cookies are placed. Note that disabling cookies will not impede your ability to browse reviews.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">4. Affiliate Links &amp; Merchant Tracking</h2>
            <p>
              When you click outbound store links (e.g. Amazon, Walmart, B&amp;H Photo), the merchant may place a transient tracking cookie to record qualifying purchases and attribute commissions. These cookies do not transmit personally identifiable information back to productreviews.review.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">5. GDPR &amp; CCPA User Rights</h2>
            <p>
              Depending on your jurisdiction, you have statutory rights regarding your data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
              <li>The right to request access to the personal data we maintain about you.</li>
              <li>The right to request rectification or deletion of your contact records.</li>
              <li>The right to restrict or object to automated processing.</li>
              <li>The right to non-discrimination for exercising your privacy privileges.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">6. Privacy Inquiries</h2>
            <p>
              If you have any questions or concerns regarding our privacy practices or wish to exercise your rights, please reach out directly:
            </p>
            <p className="font-mono text-zinc-900 bg-zinc-50 p-3 rounded-xl border border-zinc-100 inline-block text-xs">
              Email:{' '}
              <a href="mailto:alokmohansharma.delhi@gmail.com" className="underline hover:text-black">
                alokmohansharma.delhi@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
