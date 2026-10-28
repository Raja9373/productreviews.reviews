import React, { useState, useMemo } from "react";
import { 
  Search, HelpCircle, ChevronDown, ChevronUp, Sparkles, 
  Tag, BookOpen, ArrowRight, CheckCircle2, AlertOctagon, Lightbulb
} from "lucide-react";
import { 
  HIGH_INTENT_SEO_QUERIES, 
  CATEGORY_BUYING_GUIDES, 
  CATEGORY_SEARCH_TAGS 
} from "../../content/seoKnowledgeBase";

interface FlashBuyerResearchHubProps {
  onSelectProductBySlug?: (slug: string) => void;
  currentMarket: string;
}

export const FlashBuyerResearchHub: React.FC<FlashBuyerResearchHubProps> = ({
  onSelectProductBySlug,
  currentMarket
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set([HIGH_INTENT_SEO_QUERIES[0].id]));
  const [activeGuideTab, setActiveGuideTab] = useState<string>("Smartphones");

  const categories = ["All", "Amazon Buying Guide", "Smartphones", "Audio", "Laptops", "Wearables", "Smart Home"];

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredQueries = useMemo(() => {
    return HIGH_INTENT_SEO_QUERIES.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.shortAnswer.toLowerCase().includes(q) ||
        item.detailedAnalysis.toLowerCase().includes(q) ||
        item.searchKeywords.some((kw) => kw.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const currentGuide = useMemo(() => {
    return CATEGORY_BUYING_GUIDES.find((g) => g.category === activeGuideTab) || CATEGORY_BUYING_GUIDES[0];
  }, [activeGuideTab]);

  return (
    <section id="research-hub" className="py-20 bg-zinc-950 border-t border-zinc-900 text-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search & Buyer Intelligence Engine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            People Also Ask: <span className="text-[#FFE600]">Amazon & Tech Research Hub</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Instant lab-verified answers to the internet's most asked product questions, Amazon price-drop timing, authentic seller verification, and category buying checklists.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buyer queries (e.g. 'OnePlus 100W charger', 'Amazon return policy')..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFE600] focus:ring-1 focus:ring-[#FFE600] transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.3)]"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#FFE600]" />
              <span>High-Intent Buyer Queries & Verified Answers ({filteredQueries.length})</span>
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Ranked by Search Volume</span>
          </div>

          <div className="space-y-3">
            {filteredQueries.map((item) => {
              const isOpen = openFaqIds.has(item.id);
              return (
                <article
                  key={item.id}
                  className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/20 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">
                          Intent: {item.intent}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {item.question}
                      </h4>
                    </div>
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#FFE600]" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-zinc-800/60 text-xs sm:text-sm text-zinc-300 space-y-3 animate-in fade-in duration-150">
                      <div className="bg-[#FFE600]/5 border-l-2 border-[#FFE600] p-3 rounded-r-lg">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFE600] block mb-0.5">
                          Lab Verdict / Quick Answer:
                        </span>
                        <p className="text-zinc-200 font-medium leading-relaxed">
                          {item.shortAnswer}
                        </p>
                      </div>

                      <p className="leading-relaxed text-zinc-300">
                        {item.detailedAnalysis}
                      </p>

                      {item.relatedProductSlugs && item.relatedProductSlugs.length > 0 && onSelectProductBySlug && (
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-zinc-400">Related Full Review:</span>
                          {item.relatedProductSlugs.map((slug) => (
                            <button
                              key={slug}
                              onClick={() => onSelectProductBySlug(slug)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#FFE600] hover:underline cursor-pointer bg-zinc-800 px-2.5 py-1 rounded-md"
                            >
                              <span>View Lab Review</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                        <Tag className="w-3 h-3 text-zinc-500" />
                        <span>Ranked Keywords:</span>
                        {item.searchKeywords.map((kw, i) => (
                          <span key={i} className="bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded text-[10px]">
                            #{kw.replace(/\s+/g, "")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Category Buying Guide Box */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFE600] uppercase tracking-wider mb-1 font-mono">
                <BookOpen className="w-4 h-4" />
                <span>Editorial Buying Guides & Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                How to Evaluate Tech Like a Hardware Engineer
              </h3>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {CATEGORY_BUYING_GUIDES.map((g) => (
                <button
                  key={g.category}
                  onClick={() => setActiveGuideTab(g.category)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeGuideTab === g.category
                      ? "bg-[#FFE600] text-black"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {g.category}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-extrabold text-white mb-2">
                {currentGuide.title}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-4xl">
                {currentGuide.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hardware Checklist</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
                  {currentGuide.buyingChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Costly Traps to Avoid</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
                  {currentGuide.commonMistakes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFE600] uppercase tracking-wider mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span>Amazon Deal Hacks</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
                  {currentGuide.amazonDealHacks.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
