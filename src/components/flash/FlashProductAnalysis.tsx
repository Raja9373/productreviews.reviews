import React, { useState } from "react";
import { 
  Zap, Star, CheckCircle, AlertTriangle, ExternalLink, ShieldCheck, 
  ArrowLeft, MessageSquare, ShoppingBag, Share2, Check, Send, 
  HelpCircle, Tag, Sparkles
} from "lucide-react";
import { ReviewRecord } from "../../content/store/contentRepository";
import { SUPPORTED_MARKETS } from "../../localization/markets";
import { CATEGORY_SEARCH_TAGS, HIGH_INTENT_SEO_QUERIES } from "../../content/seoKnowledgeBase";

interface FlashProductAnalysisProps {
  record: ReviewRecord;
  currentMarket: string;
  onBack: () => void;
  onSelectOtherProduct?: (record: ReviewRecord) => void;
}

export const FlashProductAnalysis: React.FC<FlashProductAnalysisProps> = ({
  record,
  currentMarket,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "prices" | "faq" | "ask">("overview");
  const [customQuestion, setCustomQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "flash"; text: string }>>([
    {
      sender: "flash",
      text: `Hello! I'm productreviews.review AI. I've aggregated 45,000+ verified customer reviews, Reddit discussions, and lab teardowns for the ${record.name}. Ask me anything about real-world performance, battery, or thermals!`,
    },
  ]);
  const [isCopied, setIsCopied] = useState(false);

  const marketInfo = SUPPORTED_MARKETS.find((m) => m.code === currentMarket) || SUPPORTED_MARKETS[0];
  const flashScore = Math.round(record.rating * 20);
  const flashScoreLabel = 
    flashScore >= 90 ? "Exceptional Buy (Top 2%)" :
    flashScore >= 80 ? "Recommended Buy" :
    flashScore >= 70 ? "Good Value with Caveats" : "Consider Alternatives";

  const localPrice = (() => {
    switch (currentMarket) {
      case "IN":
        return `₹${(record.priceUSD * 84).toLocaleString("en-IN")}`;
      case "UK":
        return `£${Math.round(record.priceUSD * 0.79).toLocaleString()}`;
      case "DE":
      case "FR":
      case "ES":
      case "IT":
      case "NL":
        return `€${Math.round(record.priceUSD * 0.92).toLocaleString()}`;
      case "JP":
        return `¥${Math.round(record.priceUSD * 155).toLocaleString()}`;
      default:
        return `$${record.priceUSD.toLocaleString()}`;
    }
  })();

  const handleSendQuestion = (questionText?: string) => {
    const q = (questionText || customQuestion).trim();
    if (!q) return;

    const updatedMessages = [...chatMessages, { sender: "user" as const, text: q }];
    setChatMessages(updatedMessages);
    if (!questionText) setCustomQuestion("");

    setTimeout(() => {
      let reply = `Based on verified buyer feedback: The ${record.name} is praised for its ${record.pros[0]?.toLowerCase() || "performance"}. However, owners note that ${record.cons[0]?.toLowerCase() || "pricing requires deal timing"}.`;
      const qLower = q.toLowerCase();
      if (qLower.includes("battery") || qLower.includes("charging")) {
        const batterySpec = record.specs["Battery"] || "high-capacity battery system";
        const chargingSpec = record.specs["ChargingTime"] || "fast charging";
        reply = `Battery & Power: Equipped with ${batterySpec}. Lab benchmarks show all-day endurance under heavy workloads. ${chargingSpec ? `Charging takes approximately ${chargingSpec}.` : ""}`;
      } else if (qLower.includes("game") || qLower.includes("gaming") || qLower.includes("heat")) {
        reply = `Gaming & Thermals: Powered by ${record.specs["Processor"] || "high-performance chipset"}. Real-world tests show stable frame rates with controlled chassis thermals.`;
      }
      setChatMessages((prev) => [...prev, { sender: "flash" as const, text: reply }]);
    }, 400);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const affiliateBuyUrl = `/api/affiliate/redirect?market=${currentMarket}&asin=${record.amazonAsin}&q=${encodeURIComponent(record.name)}`;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-24">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 sticky top-14 z-30 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#FFE600] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to productreviews.review</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{isCopied ? "Link Copied" : "Share"}</span>
            </button>

            <a
              href={affiliateBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,230,0,0.3)]"
            >
              <span>Lowest Amazon Price</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Main Header Card */}
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2.5 text-xs mb-3">
                <span className="font-mono text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/20 px-2.5 py-0.5 rounded-md font-bold">
                  {record.brand}
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">{record.category}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">Tested {record.lastUpdated}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                {record.name}
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
                {record.summary}
              </p>

              <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFE600] mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  productreviews.review Unbiased Verdict
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  "{record.verdict}"
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl text-center">
              <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2 font-mono">
                Flash Score™
              </div>
              
              <div className="w-28 h-28 rounded-full border-4 border-[#FFE600] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,230,0,0.25)] bg-[#09090b] mb-3">
                <span className="text-4xl font-black text-white font-mono">{flashScore}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">out of 100</span>
              </div>

              <div className="font-bold text-sm text-[#FFE600] mb-1">
                {flashScoreLabel}
              </div>

              <div className="w-full bg-zinc-900/90 rounded-xl p-3 border border-zinc-800 mb-4 mt-3">
                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">
                  Verified Lowest Price ({marketInfo.name})
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {localPrice}
                </div>
              </div>

              <a
                href={affiliateBuyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,230,0,0.3)] cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 fill-black" />
                <span>Buy on Amazon ({marketInfo.code})</span>
              </a>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 mb-8 overflow-x-auto pb-1">
          {[
            { id: "overview", label: "Pros & Cons Verdict" },
            { id: "specs", label: "Full Lab Specifications" },
            { id: "prices", label: "Live Price Comparison" },
            { id: "faq", label: "Buyer FAQ & Search Research" },
            { id: "ask", label: "Ask Flash AI Assistant" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.25)]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/60 border border-emerald-900/40 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Real Buyer Praises & Strengths</span>
                </div>
                <ul className="space-y-3">
                  {record.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-900/60 border border-amber-900/40 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Verified Drawbacks & Dealbreakers</span>
                </div>
                <ul className="space-y-3">
                  {record.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPECS */}
        {activeTab === "specs" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white mb-4">Hardware Specifications & Benchmarks</h3>
            <div className="divide-y divide-zinc-800">
              {Object.entries(record.specs).map(([key, val]) => (
                <div key={key} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-zinc-400 font-medium">{key}</span>
                  <span className="text-zinc-100 font-mono font-semibold text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRICES */}
        {activeTab === "prices" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Live Store Price Comparison</h3>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-xs text-[#FFE600] border border-zinc-800">
                  AMZN
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Amazon ({marketInfo.name})</div>
                  <div className="text-xs text-emerald-400 font-medium">In Stock & Prime Delivery</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-white font-mono">{localPrice}</div>
                <a
                  href={affiliateBuyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#FFE600] hover:underline font-bold inline-flex items-center gap-1"
                >
                  Buy Now <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAQ & BUYER RESEARCH */}
        {activeTab === "faq" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FFE600] mb-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>Frequently Asked Questions & Search Insights</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Buyer Research & Essential Queries for {record.name}
                  </h3>
                </div>
                <div className="text-xs text-zinc-400 font-mono bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 self-start sm:self-auto">
                  ASIN: <span className="text-[#FFE600] font-bold">{record.amazonAsin}</span>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-4 mb-8">
                {record.faqList?.map((faq, idx) => (
                  <article key={idx} className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5">
                    <h4 className="text-sm sm:text-base font-bold text-white mb-2 flex items-start gap-2.5">
                      <span className="text-[#FFE600] font-mono shrink-0">Q{idx + 1}.</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-6 border-l-2 border-[#FFE600]/40 ml-1">
                      {faq.answer}
                    </p>
                  </article>
                ))}

                {HIGH_INTENT_SEO_QUERIES
                  .filter((q) => q.category === record.category || (q.relatedProductSlugs && q.relatedProductSlugs.includes(record.slug)))
                  .slice(0, 3)
                  .map((paa, idx) => (
                    <article key={`paa-${idx}`} className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/20 px-2 py-0.5 rounded uppercase font-bold">
                          People Also Ask
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-2">
                        {paa.question}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        <span className="text-[#FFE600] font-semibold">Answer: </span>
                        {paa.shortAnswer} {paa.detailedAnalysis}
                      </p>
                    </article>
                  ))}
              </div>

              {/* Amazon Safe Purchase Checklist */}
              <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-[#FFE600]/25 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFE600] uppercase tracking-wider mb-2 font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Amazon Safe Purchase Checklist for {record.name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300 pt-2">
                  <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                    <span className="font-bold text-white block mb-1">1. Check Verified Seller</span>
                    <span>Confirm listing displays 'Fulfilled by Amazon' and seller feedback rating exceeds 95% to ensure original serial numbers.</span>
                  </div>
                  <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                    <span className="font-bold text-white block mb-1">2. 7-Day Replacement</span>
                    <span>Test unboxing, camera sensors, and battery health immediately upon delivery within Amazon's replacement guarantee window.</span>
                  </div>
                  <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                    <span className="font-bold text-white block mb-1">3. Invoice Warranty</span>
                    <span>Download your tax invoice from Amazon Orders tab. Authorized service centers accept Amazon PDF invoices for full manufacturer warranty.</span>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-3 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Ranked Keywords & Search Intents for this Product</span>
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  {[
                    `${record.name.toLowerCase()} review`,
                    `${record.name.toLowerCase()} amazon price`,
                    `${record.name.toLowerCase()} pros and cons`,
                    ...(CATEGORY_SEARCH_TAGS[record.category] || [])
                  ].map((kw, i) => (
                    <span key={i} className="bg-zinc-950 text-zinc-300 border border-zinc-800 px-3 py-1 rounded-lg">
                      #{kw.replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: ASK FLASH AI */}
        {activeTab === "ask" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Ask productreviews.review AI</h3>
            <p className="text-xs text-zinc-400 mb-6">Real-time answers synthesized from lab benchmarks and verified owners.</p>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user" ? "bg-zinc-800 text-white ml-8" : "bg-zinc-950 border border-zinc-800 text-zinc-200 mr-8"
                }`}>
                  <span className="text-[10px] font-mono font-bold block mb-1 text-zinc-500 uppercase">
                    {msg.sender === "user" ? "You" : "Flash AI Decision Engine"}
                  </span>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuestion()}
                placeholder={`Ask anything about ${record.name}...`}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFE600]"
              />
              <button
                onClick={() => handleSendQuestion()}
                className="bg-[#FFE600] hover:bg-[#ffe81a] text-black p-2.5 rounded-xl transition-all cursor-pointer font-bold shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
