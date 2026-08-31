import React from 'react';
import { ArrowLeft, AlertCircle, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';

interface DisclaimerPageProps {
  onBackToHome: () => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onBackToHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300">
      {/* Top Back Navigation */}
      <div className="mb-8">
        <button
          id="disclaimer-back-btn"
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
            <AlertCircle className="w-3.5 h-3.5 text-zinc-600" />
            <span>Transparency &amp; Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Affiliate &amp; AI Disclaimer
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-2">
            FTC Compliance Disclosure • Algorithmic Neutrality Guarantee
          </p>
        </div>

        <div className="space-y-6 text-zinc-600 text-sm leading-relaxed font-normal">
          {/* Highlight Box */}
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            <h2 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-zinc-700" />
              Affiliate Commission Disclosure
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <strong>productreviews.review</strong> is a participant in affiliate advertising programs designed to provide a means for sites to earn advertising fees by linking to retail partners including Amazon, Best Buy, B&amp;H, Walmart, and other authorized e-commerce merchants. If you click on an outbound retailer link and complete a qualifying purchase, we may receive a small affiliate commission at <strong>no additional cost to you</strong>.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">1. Complete Editorial &amp; Algorithmic Independence</h2>
            <p>
              Our affiliate relationships <strong>never influence</strong> our AI evaluations, numerical scorecards, or final <strong>BUY</strong> vs. <strong>DON’T BUY</strong> verdicts. If a product fails benchmark standards, has documented reliability flaws on Reddit, or suffers high warranty return rates, our consensus algorithm reports those defects transparently.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">2. Nature of AI-Generated Content</h2>
            <p>
              Product reviews, pros/cons lists, specification breakdowns, and sentiment distributions on this website are generated using automated artificial intelligence models and sentiment analysis pipelines. While our systems parse thousands of verified customer reviews and teardown tests, AI summaries may occasionally contain minor discrepancies or outdated pricing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">3. Verify Before Buying</h2>
            <p>
              Prices, product availability, coupon validity, rebate terms, and technical specifications are subject to merchant modification at any moment. Always confirm final checkout totals, regional compatibility, and warranty policies directly on the merchant's checkout page before completing any financial transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">4. Coupon Code Verification</h2>
            <p>
              Coupon codes and discount percentages displayed on our platform are aggregated from public merchant feeds and community submissions. While tested for efficacy, coupon availability and expiration dates are controlled solely by the respective retailers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
