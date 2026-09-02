import React, { useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle2, AlertTriangle, Sparkles, ChevronRight, X } from 'lucide-react';

export const TrustpilotComparisonBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sleek inline USP comparison strip */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-8">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#005128]/10 via-[#00B67A]/10 to-emerald-50 border border-[#00B67A]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#00B67A] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-zinc-900">
                  Independent Multi-Source Review Consensus
                </h4>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#00B67A] text-white px-2 py-0.5 rounded-full">
                  Anti-Paywall
                </span>
              </div>
              <p className="text-xs text-zinc-600">
                Unlike closed-loop review sites, merchants <strong>cannot pay to suppress negative reviews</strong> or artificially inflate ratings.
              </p>
            </div>
          </div>

          <button
            id="open-trustpilot-comparison-btn"
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-white hover:bg-zinc-50 border border-[#00B67A]/40 text-[#005128] font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>See How We Compare vs Trustpilot</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#00B67A]" />
                <div>
                  <h3 className="text-base font-bold text-zinc-900">
                    Why productreviews.review is Better Than Trustpilot
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Mathematical review independence vs pay-for-deletion platforms
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Matrix Table */}
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Feature / Standard</th>
                    <th className="pb-3 font-bold text-zinc-500">Trustpilot</th>
                    <th className="pb-3 font-bold text-[#005128] bg-emerald-50/60 px-3 rounded-t-lg">
                      productreviews.review (V2)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  <tr>
                    <td className="py-3.5 font-semibold text-zinc-900">
                      Can Companies Pay To Remove Negative Reviews?
                    </td>
                    <td className="py-3.5 text-red-600 flex items-center gap-1.5 font-medium">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Yes (Paid business dispute tiers)</span>
                    </td>
                    <td className="py-3.5 font-bold text-emerald-800 bg-emerald-50/60 px-3">
                      <span className="flex items-center gap-1.5 text-[#00B67A]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>No Paid Removals Permitted</span>
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 font-semibold text-zinc-900">
                      Review Source Depth
                    </td>
                    <td className="py-3.5 text-zinc-600 font-medium">
                      Single platform captive feedback
                    </td>
                    <td className="py-3.5 font-bold text-emerald-800 bg-emerald-50/60 px-3">
                      <span className="flex items-center gap-1.5 text-[#00B67A]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Multi-Source AI (Amazon + Reddit + YouTube + Labs)</span>
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 font-semibold text-zinc-900">
                      Fake Review Filtering
                    </td>
                    <td className="py-3.5 text-zinc-600 font-medium">
                      Basic manual reporting flags
                    </td>
                    <td className="py-3.5 font-bold text-emerald-800 bg-emerald-50/60 px-3">
                      <span className="flex items-center gap-1.5 text-[#00B67A]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Automated AI Linguistic &amp; Velocity Pattern Audit</span>
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 font-semibold text-zinc-900">
                      Live Multi-Country Pricing (US, ES, IN)
                    </td>
                    <td className="py-3.5 text-zinc-600 font-medium">
                      None (Review directory only)
                    </td>
                    <td className="py-3.5 font-bold text-emerald-800 bg-emerald-50/60 px-3">
                      <span className="flex items-center gap-1.5 text-[#00B67A]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Direct Live Geo Deals &amp; 30-Day Lowest Tracker</span>
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 font-semibold text-zinc-900">
                      Video Reviews &amp; Teardowns
                    </td>
                    <td className="py-3.5 text-zinc-600 font-medium">
                      No video integration
                    </td>
                    <td className="py-3.5 font-bold text-emerald-800 bg-emerald-50/60 px-3 rounded-b-lg">
                      <span className="flex items-center gap-1.5 text-[#00B67A]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Top 3 YouTube Reviews with Timestamps &amp; Verdicts</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
              <span>All rankings are mathematically generated by AI and grounded via live Google Search.</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold text-xs transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
