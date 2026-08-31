import React from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, Globe, Cpu, Database, CheckCircle } from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300">
      {/* Top Back Navigation */}
      <div className="mb-8">
        <button
          id="about-back-btn"
          onClick={onBackToHome}
          className="px-3.5 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[24px] border border-zinc-200 p-8 sm:p-12 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
          <span>Our Story &amp; Mission</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-6">
          About productreviews<span className="text-zinc-400">.review</span>
        </h1>

        <div className="space-y-6 text-zinc-600 text-base leading-relaxed font-normal">
          <p>
            Welcome to <strong>productreviews.review</strong>, the world’s dedicated real-time AI product intelligence engine designed to eliminate commercial bias and review fatigue. Founded on the principle of algorithmic transparency, we believe consumers deserve objective, rapid, and comprehensive shopping guidance before spending their hard-earned money.
          </p>

          <p>
            Modern online shopping is plagued with sponsored influencer praise, unverified five-star ratings, and conflicting editorial listicles. Finding genuine insights on a specific model often requires opening dozens of tabs across retailer reviews, Reddit discussion threads, and YouTube teardowns.
          </p>

          <p>
            <strong>productreviews.review</strong> solves this by aggregating and synthesizing thousands of verified customer reviews, expert hardware tests, long-term durability reports, and community sentiments in 5 to 7 seconds. Our multi-source consensus engine parses sentiment from Amazon verified purchases, Reddit community discussions (such as hardware subreddits and lifestyle communities), and independent YouTube teardown creators.
          </p>

          <h2 className="text-xl font-bold text-zinc-900 pt-4">
            True Global Inclusivity in 40 Languages
          </h2>

          <p>
            Product intelligence should not be constrained by language barriers. We deliver native review synthesis, localized currency pricing, and active coupon codes across 40 global languages. Whether you search in English, Japanese, Hindi, Arabic, Spanish, or German, our engine delivers culturally nuanced, grammatically authentic product breakdowns.
          </p>

          <p>
            Every product assessment concludes with an unambiguous <strong>RECOMMENDED</strong> or <strong>NOT RECOMMENDED</strong> verdict powered by multi-point data weighting. We do not accept sponsored product placements or manufacturer alterations. If a product overheats, suffers firmware defects, or fails prematurely, our consensus scorecard reflects it directly.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-zinc-100">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <ShieldCheck className="w-5 h-5 text-zinc-700 mb-2" />
            <h3 className="text-sm font-bold text-zinc-900 mb-1">Zero Sponsored Bias</h3>
            <p className="text-xs text-zinc-500">
              Uncompromising algorithm with uninfluenced scorecards and return-rate tracking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <Globe className="w-5 h-5 text-zinc-700 mb-2" />
            <h3 className="text-sm font-bold text-zinc-900 mb-1">40 Global Languages</h3>
            <p className="text-xs text-zinc-500">
              Native translation with localized price conversions and coupon verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <Cpu className="w-5 h-5 text-zinc-700 mb-2" />
            <h3 className="text-sm font-bold text-zinc-900 mb-1">Multi-Source Cross-Check</h3>
            <p className="text-xs text-zinc-500">
              Continuous parsing of Amazon, Reddit, YouTube, and teardown benchmark data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
