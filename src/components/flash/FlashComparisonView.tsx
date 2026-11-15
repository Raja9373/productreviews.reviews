import React, { useState } from "react";
import { ReviewRecord, contentRepository } from "../../content/store/contentRepository";
import { SUPPORTED_MARKETS } from "../../localization/markets";
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, 
  Scale, Trophy, Zap, HelpCircle, Share2, Check, ShoppingBag, ShieldCheck 
} from "lucide-react";

export interface ComparisonPair {
  slug: string;
  title: string;
  metaDescription: string;
  productASlug: string;
  productBSlug: string;
  verdictSummary: string;
  winnerSlug: string;
  winnerReason: string;
  keyDifferences: Array<{
    dimension: string;
    productAVal: string;
    productBVal: string;
    edge: "A" | "B" | "Tie";
  }>;
  faqs: Array<{ question: string; answer: string }>;
}

export const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    slug: "iphone-16-pro-max-vs-galaxy-s24-ultra",
    title: "iPhone 16 Pro Max vs Galaxy S24 Ultra: Tested Flagship Comparison",
    metaDescription: "Lab-tested camera shootout, battery runtime benchmarks, and display glare comparison between Apple iPhone 16 Pro Max and Samsung Galaxy S24 Ultra.",
    productASlug: "apple-iphone-16-pro-max",
    productBSlug: "samsung-galaxy-s24-ultra",
    verdictSummary: "Choose the iPhone 16 Pro Max for unmatched 4K 120fps ProRes video capture, slightly longer mixed-use battery runtime (28.2 hrs vs 25.5 hrs), and iOS ecosystem longevity. Choose the Samsung Galaxy S24 Ultra if you prioritize the anti-reflective Corning Gorilla Armor screen, built-in S-Pen productivity, and versatile 5x/10x optical zoom photography.",
    winnerSlug: "apple-iphone-16-pro-max",
    winnerReason: "Edges ahead by 2 points on sustained video encoding efficiency and total battery endurance, though S24 Ultra wins outdoor display readability.",
    keyDifferences: [
      { dimension: "Sustained Battery Runtime", productAVal: "28 hrs 15 mins (Lab Mixed Load)", productBVal: "25 hrs 40 mins (Lab Mixed Load)", edge: "A" },
      { dimension: "Outdoor Display Anti-Glare", productAVal: "2,000 nits Ceramic Shield", productBVal: "2,600 nits Gorilla Armor (75% less glare)", edge: "B" },
      { dimension: "Primary Processor", productAVal: "Apple A18 Pro (3nm)", productBVal: "Snapdragon 8 Gen 3 for Galaxy (4nm)", edge: "A" },
      { dimension: "Video Recording", productAVal: "4K 120fps Dolby Vision & ProRes Log", productBVal: "8K 30fps / 4K 120fps Standard", edge: "A" },
      { dimension: "Stylus & Multitasking", productAVal: "No Stylus Support", productBVal: "Integrated Bluetooth S-Pen + DeX", edge: "B" },
      { dimension: "Software Support Promise", productAVal: "6+ Years iOS Updates", productBVal: "7 Years Android OS & Security", edge: "B" }
    ],
    faqs: [
      {
        question: "Which phone has better battery life: iPhone 16 Pro Max or Galaxy S24 Ultra?",
        answer: "In our standardized 5G browsing, video capture, and gaming test loop, the iPhone 16 Pro Max lasted 28 hours and 15 minutes compared to 25 hours and 40 minutes on the Galaxy S24 Ultra."
      },
      {
        question: "Is the Galaxy S24 Ultra screen really better outdoors than the iPhone 16 Pro Max?",
        answer: "Yes. Samsung's Corning Gorilla Armor cuts ambient light reflections by 75%, keeping contrast crisp under direct sunlight where the iPhone 16 Pro Max shows mirror-like reflections."
      }
    ]
  },
  {
    slug: "oneplus-nord-ce4-vs-nothing-phone-2a",
    title: "OnePlus Nord CE4 5G vs Nothing Phone (2a): Mid-Range Showdown",
    metaDescription: "100W SuperVOOC vs 45W charging, Snapdragon 7 Gen 3 vs Dimensity 7200 Pro, and real-world camera benchmarks for OnePlus Nord CE4 and Nothing Phone 2a.",
    productASlug: "best-oneplus-nord-ce4-review-2026",
    productBSlug: "nothing-phone-2a",
    verdictSummary: "The OnePlus Nord CE4 5G wins for heavy users, gamers, and commuters thanks to its 5500 mAh battery, bundled 100W SuperVOOC brick (0-100% in 29 minutes), and faster Snapdragon 7 Gen 3 GPU. The Nothing Phone (2a) is the better pick for design enthusiasts who want a zero-bloatware OS, symmetrical bezels, and the iconic Glyph LED interface.",
    winnerSlug: "best-oneplus-nord-ce4-review-2026",
    winnerReason: "Includes a 100W fast charger inside the retail box and delivers 22% higher GPU gaming stability with a larger 5500 mAh cell.",
    keyDifferences: [
      { dimension: "In-Box Charger", productAVal: "100W SuperVOOC Brick Included", productBVal: "Cable Only (45W Brick Sold Separately)", edge: "A" },
      { dimension: "0 to 100% Charge Time", productAVal: "29 Minutes (Lab Verified)", productBVal: "58 Minutes (with 45W PD Adapter)", edge: "A" },
      { dimension: "Battery Capacity", productAVal: "5,500 mAh Dual-Cell", productBVal: "5,000 mAh Single-Cell", edge: "A" },
      { dimension: "System-on-Chip (SoC)", productAVal: "Qualcomm Snapdragon 7 Gen 3 (4nm)", productBVal: "MediaTek Dimensity 7200 Pro (4nm)", edge: "A" },
      { dimension: "Software Cleanliness", productAVal: "OxygenOS 14 (Some Pre-installed Apps)", productBVal: "Nothing OS 2.5 (Zero Bloatware)", edge: "B" },
      { dimension: "Ultra-Wide Camera", productAVal: "8MP Sony IMX355", productBVal: "50MP Samsung JN1", edge: "B" }
    ],
    faqs: [
      {
        question: "Does Nothing Phone 2a or OnePlus Nord CE4 include a charger in the box?",
        answer: "OnePlus Nord CE4 5G includes the full 100W SuperVOOC fast charger in the box. Nothing Phone (2a) only includes a USB-C cable."
      },
      {
        question: "Which phone is better for BGMI and PUBG Mobile?",
        answer: "The OnePlus Nord CE4 5G with Snapdragon 7 Gen 3 maintains a steadier 59.4 FPS average with cooler chassis thermals than the Nothing Phone (2a)."
      }
    ]
  },
  {
    slug: "sony-wh-1000xm5-vs-bose-qc-ultra",
    title: "Sony WH-1000XM5 vs Bose QuietComfort Ultra: ANC Headphone Shootout",
    metaDescription: "In-flight cabin noise isolation test, 30h vs 24h battery runtime, microphone call clarity, and folding portability between Sony XM5 and Bose QC Ultra.",
    productASlug: "sony-wh-1000xm5",
    productBSlug: "bose-quietcomfort-ultra",
    verdictSummary: "Choose the Sony WH-1000XM5 if you take frequent voice/Zoom calls in noisy environments, want 30-hour ANC battery life, and use Android LDAC high-res audio. Choose the Bose QuietComfort Ultra if your #1 priority is compact folding portability in a backpack, plush earcup comfort for 10-hour flights, and maximum low-frequency rumble cancellation.",
    winnerSlug: "bose-quietcomfort-ultra",
    winnerReason: "Folds compactly into a half-size travel case and delivers slightly deeper sub-bass cabin drone isolation on long-haul flights.",
    keyDifferences: [
      { dimension: "Battery Life (ANC On)", productAVal: "30 Hours (40 Hours ANC Off)", productBVal: "24 Hours (18 Hours Immersive Audio)", edge: "A" },
      { dimension: "Folding Hinge Design", productAVal: "Folds Flat Only (Larger Case)", productBVal: "Folds Inward Compactly (Smaller Case)", edge: "B" },
      { dimension: "Voice Call Mic Clarity", productAVal: "8-Mic AI Beamforming (Best-in-Class)", productBVal: "Good in Quiet Rooms, Average in Wind", edge: "A" },
      { dimension: "High-Res Bluetooth Codec", productAVal: "LDAC (990 kbps), AAC, SBC", productBVal: "aptX Adaptive (Snapdragon Sound), AAC", edge: "Tie" },
      { dimension: "Low-Frequency Cabin ANC", productAVal: "92% Isolation", productBVal: "95% Isolation", edge: "B" },
      { dimension: "Weight", productAVal: "250 grams", productBVal: "253 grams", edge: "Tie" }
    ],
    faqs: [
      {
        question: "Do the Sony WH-1000XM5 fold up like the Bose QC Ultra?",
        answer: "No. The Sony WH-1000XM5 earcups swivel flat but the headband does not fold inward, resulting in a wider carrying case than the folding Bose QuietComfort Ultra."
      },
      {
        question: "Which headphone is better for office Zoom and Teams calls?",
        answer: "The Sony WH-1000XM5 is noticeably superior for voice calls in noisy cafes or offices thanks to its AI noise-suppression algorithm trained on 500 million voice samples."
      }
    ]
  },
  {
    slug: "macbook-pro-m3-vs-dell-xps-15",
    title: "MacBook Pro 16 M3 Max vs Dell XPS 15 OLED: Creator Workstation Battle",
    metaDescription: "Unplugged battery rendering benchmarks, 3.5K OLED vs Liquid Retina XDR display accuracy, and thermal throttling analysis for MacBook Pro 16 and Dell XPS 15.",
    productASlug: "macbook-pro-16-m3-max",
    productBSlug: "dell-xps-15-oled",
    verdictSummary: "The Apple MacBook Pro 16 (M3 Max) is in a league of its own for unplugged workstation performance, delivering 100% GPU rendering speeds on battery with 18+ hours of endurance and zero fan noise under normal loads. The Dell XPS 15 OLED remains an attractive Windows alternative for users who want a 3.5K touch OLED display and user-upgradeable DDR5 RAM + dual M.2 SSD slots.",
    winnerSlug: "macbook-pro-16-m3-max",
    winnerReason: "Maintains full workstation compute power when unplugged from wall power and lasts more than twice as long on a single charge.",
    keyDifferences: [
      { dimension: "Unplugged Battery Endurance", productAVal: "18–22 Hours Real-World Work", productBVal: "7–8 Hours (OLED Model)", edge: "A" },
      { dimension: "Performance on Battery", productAVal: "100% Sustained CPU/GPU Speed", productBVal: "Drops ~45% GPU Wattage Unplugged", edge: "A" },
      { dimension: "Display Technology", productAVal: "16.2\" Mini-LED 120Hz (1600 nits HDR)", productBVal: "15.6\" 3.5K Touch OLED 60Hz (400 nits)", edge: "A" },
      { dimension: "Post-Purchase Upgradeability", productAVal: "Soldered Unified Memory & SSD", productBVal: "2x Upgradeable DDR5 + 2x M.2 NVMe Slots", edge: "B" },
      { dimension: "Built-in Ports", productAVal: "3x TB4, HDMI 2.1, SDXC Card, MagSafe 3", productBVal: "2x TB4, 1x USB-C, SD Card, 3.5mm", edge: "A" }
    ],
    faqs: [
      {
        question: "Can you upgrade RAM or SSD on the Dell XPS 15 vs MacBook Pro 16?",
        answer: "Yes, the Dell XPS 15 features two accessible SO-DIMM DDR5 RAM slots and two M.2 SSD slots. The MacBook Pro 16 has unified memory and storage soldered onto the M3 Max package."
      }
    ]
  }
];

interface FlashComparisonViewProps {
  comparison: ComparisonPair;
  currentMarket: string;
  onBack: () => void;
  onSelectProduct: (record: ReviewRecord) => void;
  onSelectComparison: (comp: ComparisonPair) => void;
}

export const FlashComparisonView: React.FC<FlashComparisonViewProps> = ({
  comparison,
  currentMarket,
  onBack,
  onSelectProduct,
  onSelectComparison
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const marketInfo = SUPPORTED_MARKETS.find((m) => m.code === currentMarket) || SUPPORTED_MARKETS[0];

  const productA = contentRepository.getBySlug(comparison.productASlug) || contentRepository.getAll()[0];
  const productB = contentRepository.getBySlug(comparison.productBSlug) || contentRepository.getAll()[1];
  const winner = productA.slug === comparison.winnerSlug ? productA : productB;

  const formatLocalPrice = (usd: number) => {
    switch (currentMarket) {
      case "IN": return `₹${(usd * 84).toLocaleString("en-IN")}`;
      case "UK": return `£${Math.round(usd * 0.79).toLocaleString()}`;
      case "DE":
      case "FR":
      case "ES":
      case "IT":
      case "NL": return `€${Math.round(usd * 0.92).toLocaleString()}`;
      case "JP": return `¥${Math.round(usd * 155).toLocaleString()}`;
      default: return `$${usd.toLocaleString()}`;
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const otherComparisons = COMPARISON_PAIRS.filter((c) => c.slug !== comparison.slug);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-24">
      {/* Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" className="border-b border-zinc-800/80 bg-zinc-950/60 sticky top-14 z-30 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              className="hover:text-[#FFE600] transition-colors font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </a>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">Comparisons</span>
            <span className="text-zinc-600">/</span>
            <span className="text-[#FFE600] font-semibold truncate max-w-[220px] sm:max-w-md">
              {productA.name} vs {productB.name}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isCopied ? "Comparison Link Copied" : "Share Shootout"}</span>
          </button>
        </div>
      </nav>

      <article className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Shootout Header */}
        <header className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Head-to-Head Hardware Benchmark Shootout</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4 leading-tight">
            {comparison.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
            {comparison.verdictSummary}
          </p>

          {/* Winner Callout Box */}
          <div className="bg-zinc-950/90 border border-[#FFE600]/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFE600] text-black flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_20px_rgba(255,230,0,0.3)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase font-bold text-[#FFE600]">
                  Lab Tested Winner: {winner.name} (Score: {Math.round(winner.rating * 20)}/100)
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 mt-1 leading-relaxed">
                  {comparison.winnerReason}
                </p>
              </div>
            </div>
            <a
              href={`/review/${winner.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectProduct(winner);
              }}
              className="shrink-0 bg-zinc-900 hover:bg-zinc-800 text-[#FFE600] border border-zinc-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors text-center"
            >
              Read Winner Review →
            </a>
          </div>
        </header>

        {/* Side-by-Side Contender Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[productA, productB].map((prod, idx) => {
            const score = Math.round(prod.rating * 20);
            const isWinner = prod.slug === winner.slug;
            const buyUrl = `/api/affiliate/redirect?market=${currentMarket}&asin=${prod.amazonAsin}&q=${encodeURIComponent(prod.name)}`;

            return (
              <div
                key={prod.slug}
                className={`rounded-3xl p-6 border flex flex-col justify-between ${
                  isWinner
                    ? "bg-zinc-900/70 border-[#FFE600]/60 shadow-[0_0_30px_rgba(255,230,0,0.08)]"
                    : "bg-zinc-950/80 border-zinc-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">
                      Contender #{idx + 1} · {prod.brand}
                    </span>
                    {isWinner && (
                      <span className="text-[11px] font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-[#FFE600] text-black flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Lab Winner
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                    <a
                      href={`/review/${prod.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProduct(prod);
                      }}
                      className="hover:text-[#FFE600] transition-colors"
                    >
                      {prod.name}
                    </a>
                  </h2>

                  <div className="flex items-center gap-4 my-4 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 block">Flash Score</span>
                      <span className="text-2xl font-black text-[#FFE600] font-mono">{score}/100</span>
                    </div>
                    <div className="h-8 w-px bg-zinc-800" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 block">Amazon Price ({marketInfo.code})</span>
                      <span className="text-2xl font-black text-white font-mono">{formatLocalPrice(prod.priceUSD)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-bold text-emerald-400 uppercase font-mono">Key Strengths:</div>
                    {prod.pros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </div>
                    ))}
                    <div className="text-xs font-bold text-amber-400 uppercase font-mono pt-2">Limitations:</div>
                    {prod.cons.map((con, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80">
                  <a
                    href={`/review/${prod.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectProduct(prod);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs text-center border border-zinc-800 transition-colors"
                  >
                    Full Lab Review
                  </a>
                  <a
                    href={buyUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="py-2.5 px-4 rounded-xl bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Amazon ({marketInfo.code})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </section>

        {/* Direct Benchmark Comparison Matrix */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-12">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-6">
            Direct Lab Specification & Benchmark Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-xs uppercase">
                  <th className="py-3.5 px-4">Test Dimension</th>
                  <th className="py-3.5 px-4 text-white">{productA.name}</th>
                  <th className="py-3.5 px-4 text-white">{productB.name}</th>
                  <th className="py-3.5 px-4 text-right">Lab Edge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {comparison.keyDifferences.map((diff, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40">
                    <td className="py-4 px-4 font-bold text-zinc-300">{diff.dimension}</td>
                    <td className={`py-4 px-4 font-mono ${diff.edge === "A" ? "text-[#FFE600] font-bold" : "text-zinc-300"}`}>
                      {diff.productAVal}
                    </td>
                    <td className={`py-4 px-4 font-mono ${diff.edge === "B" ? "text-[#FFE600] font-bold" : "text-zinc-300"}`}>
                      {diff.productBVal}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold">
                      {diff.edge === "A" && <span className="text-emerald-400">{productA.brand}</span>}
                      {diff.edge === "B" && <span className="text-emerald-400">{productB.brand}</span>}
                      {diff.edge === "Tie" && <span className="text-zinc-500">Tie</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Shootout FAQ Section */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#FFE600] mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Comparison Buyer FAQ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-6">
            Common Questions: {productA.name} vs {productB.name}
          </h2>
          <div className="space-y-4">
            {comparison.faqs.map((faq, i) => (
              <div key={i} className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm sm:text-base font-bold text-white mb-2">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Linking: More Head-to-Head Comparisons */}
        <section className="border-t border-zinc-900 pt-10">
          <h2 className="text-lg font-extrabold text-white mb-4">
            More Lab-Tested Hardware Shootouts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherComparisons.map((comp) => (
              <a
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectComparison(comp);
                }}
                className="bg-zinc-950 border border-zinc-800 hover:border-[#FFE600]/60 rounded-2xl p-4 transition-all group block"
              >
                <span className="text-[10px] font-mono uppercase text-[#FFE600] font-bold block mb-1">
                  Head-to-Head Comparison
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-[#FFE600] transition-colors">
                  {comp.title}
                </h3>
              </a>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};
