import React, { useState } from "react";
import { Mail, Zap, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const FlashEmailSection: React.FC = () => {
  const [handle, setHandle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="shopping-email" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE600]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Smart Shopping Inbox</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Get your free <span className="text-[#FFE600]">@productreviews.review</span> shopping email
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 mb-8 leading-relaxed">
            Protect your personal inbox from retail spam. Use your @productreviews.review address for Amazon, Flipkart, Nike, and Zara. We automatically track packages, extract coupons, and filter promo clutter.
          </p>

          {submitted ? (
            <div className="bg-emerald-950/40 border border-emerald-800 rounded-2xl p-4 flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold text-sm block">Identity Reserved!</span>
                <span className="text-xs text-zinc-300">
                  Your address <span className="font-mono text-[#FFE600]">{handle}@productreviews.review</span> has been registered.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))}
                  placeholder="yourname"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFE600]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                  @productreviews.review
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,230,0,0.3)] cursor-pointer active:scale-95 whitespace-nowrap"
              >
                Claim Address
              </button>
            </form>
          )}

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-zinc-800/80 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Spam Free</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#FFE600]" /> Instant Setup</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Forever</span>
          </div>
        </div>
      </div>
    </section>
  );
};
