import React, { useState, useMemo } from "react";
import { Calculator, ShieldCheck, AlertTriangle, CheckCircle2, Scale, Zap, DollarSign, HelpCircle } from "lucide-react";
import { SUPPORTED_MARKETS } from "../../localization/markets";

interface FlashDecisionToolsProps {
  currentMarket: string;
}

export const FlashDecisionTools: React.FC<FlashDecisionToolsProps> = ({ currentMarket }) => {
  const [activeTool, setActiveTool] = useState<"deal-auditor" | "tco-calculator">("deal-auditor");

  // Tool 1: Amazon Deal & Seller Authenticity Auditor State
  const [claimedMrp, setClaimedMrp] = useState<string>("999");
  const [salePrice, setSalePrice] = useState<string>("749");
  const [historicalAvg, setHistoricalAvg] = useState<string>("799");
  const [sellerRating, setSellerRating] = useState<string>("96");
  const [isFulfilledByAmazon, setIsFulfilledByAmazon] = useState<boolean>(true);
  const [warrantyMonths, setWarrantyMonths] = useState<string>("12");

  // Tool 2: 3-Year Hardware Value & Battery Longevity Calculator State
  const [devicePrice, setDevicePrice] = useState<string>("899");
  const [batteryMah, setBatteryMah] = useState<string>("5000");
  const [chargingWatts, setChargingWatts] = useState<string>("65");
  const [osUpdateYears, setOsUpdateYears] = useState<string>("5");
  const [dailyScreenHours, setDailyScreenHours] = useState<string>("6");

  const market = SUPPORTED_MARKETS.find((m) => m.code === currentMarket) || SUPPORTED_MARKETS[0];

  const dealAudit = useMemo(() => {
    const mrp = Math.max(1, parseFloat(claimedMrp) || 999);
    const sale = Math.max(1, parseFloat(salePrice) || 749);
    const avg = Math.max(1, parseFloat(historicalAvg) || 799);
    const rating = Math.min(100, Math.max(0, parseFloat(sellerRating) || 96));
    const warranty = Math.max(0, parseFloat(warrantyMonths) || 12);

    const advertisedDiscountPct = Math.round(((mrp - sale) / mrp) * 100);
    const realDiscountVsAvgPct = Math.round(((avg - sale) / avg) * 100);
    const mrpInflationPct = Math.max(0, Math.round(((mrp - avg) / avg) * 100));

    let trustScore = 50;
    if (realDiscountVsAvgPct >= 10) trustScore += 25;
    else if (realDiscountVsAvgPct >= 3) trustScore += 15;
    else if (realDiscountVsAvgPct < 0) trustScore -= 25;

    if (isFulfilledByAmazon) trustScore += 15;
    else trustScore -= 15;

    if (rating >= 95) trustScore += 10;
    else if (rating < 85) trustScore -= 20;

    if (warranty < 12) trustScore -= 15;

    trustScore = Math.min(100, Math.max(5, trustScore));

    let verdict = "Verified Genuine Deal — Safe to Buy";
    let statusColor = "text-emerald-400 border-emerald-800/60 bg-emerald-950/30";
    if (trustScore < 50) {
      verdict = "High Risk / Artificial Price Markup Detected";
      statusColor = "text-rose-400 border-rose-800/60 bg-rose-950/30";
    } else if (trustScore < 75) {
      verdict = "Moderate Value — Wait for Prime / Seasonal Drop";
      statusColor = "text-amber-400 border-amber-800/60 bg-amber-950/30";
    }

    return {
      advertisedDiscountPct,
      realDiscountVsAvgPct,
      mrpInflationPct,
      trustScore,
      verdict,
      statusColor,
      realSavings: Math.max(0, avg - sale)
    };
  }, [claimedMrp, salePrice, historicalAvg, sellerRating, isFulfilledByAmazon, warrantyMonths]);

  const tcoMetrics = useMemo(() => {
    const price = Math.max(50, parseFloat(devicePrice) || 899);
    const mah = Math.max(1500, parseFloat(batteryMah) || 5000);
    const watts = Math.max(5, parseFloat(chargingWatts) || 65);
    const osYears = Math.min(8, Math.max(1, parseFloat(osUpdateYears) || 5));
    const screenHrs = Math.min(16, Math.max(1, parseFloat(dailyScreenHours) || 6));

    // Estimate 3-year cycle count and battery health retention
    const dailyCycles = (screenHrs * 650) / mah;
    const totalCycles3Yr = Math.round(dailyCycles * 365 * 3);
    const heatDegradationPenalty = watts > 90 ? 4 : watts > 50 ? 2 : 0;
    const estimatedBatteryHealth3Yr = Math.max(68, Math.min(96, Math.round(100 - (totalCycles3Yr / 45) - heatDegradationPenalty)));

    // Estimate resale value after 3 years based on OS support
    const resaleMultiplier = osYears >= 6 ? 0.42 : osYears >= 4 ? 0.30 : 0.18;
    const estimatedResaleValue = Math.round(price * resaleMultiplier);
    const net3YearCost = price - estimatedResaleValue;
    const costPerDay = (net3YearCost / (365 * 3)).toFixed(2);

    return {
      totalCycles3Yr,
      estimatedBatteryHealth3Yr,
      estimatedResaleValue,
      net3YearCost,
      costPerDay,
      needsBatterySwap: estimatedBatteryHealth3Yr < 80
    };
  }, [devicePrice, batteryMah, chargingWatts, osUpdateYears, dailyScreenHours]);

  return (
    <section id="decision-tools" className="py-20 bg-[#09090b] border-t border-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Hardware Decision Tools</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Verify Any Amazon Deal & Calculate <span className="text-[#FFE600]">True 3-Year Cost</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Use our engineering calculators to expose inflated pre-sale MRP discounts, audit third-party Amazon seller safety, and compute 3-year battery cycle degradation before you buy.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 self-start">
            <button
              onClick={() => setActiveTool("deal-auditor")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === "deal-auditor"
                  ? "bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.25)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              1. Fake Discount & Seller Auditor
            </button>
            <button
              onClick={() => setActiveTool("tco-calculator")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === "tco-calculator"
                  ? "bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.25)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              2. 3-Year Battery & Cost Calculator
            </button>
          </div>
        </div>

        {activeTool === "deal-auditor" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FFE600]" />
                <span>Enter Amazon Listing Details ({market.symbol})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Crossed-Out MRP ({market.symbol})
                  </label>
                  <input
                    type="number"
                    value={claimedMrp}
                    onChange={(e) => setClaimedMrp(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Current Deal Price ({market.symbol})
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#FFE600] font-bold focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    90-Day Typical Price ({market.symbol})
                  </label>
                  <input
                    type="number"
                    value={historicalAvg}
                    onChange={(e) => setHistoricalAvg(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Seller Positive Rating (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={sellerRating}
                    onChange={(e) => setSellerRating(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Warranty Period (Months)
                  </label>
                  <input
                    type="number"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Fulfillment Type
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsFulfilledByAmazon(!isFulfilledByAmazon)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isFulfilledByAmazon
                        ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                        : "bg-rose-950/60 border-rose-700 text-rose-300"
                    }`}
                  >
                    {isFulfilledByAmazon ? "✓ Fulfilled by Amazon" : "✕ 3rd-Party Unverified"}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase text-zinc-400">Deal Authenticity Score</span>
                  <span className="text-2xl font-black font-mono text-[#FFE600]">{dealAudit.trustScore}/100</span>
                </div>

                <div className={`p-3.5 rounded-xl border text-xs font-bold mb-5 ${dealAudit.statusColor}`}>
                  {dealAudit.verdict}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Advertised Banner Discount:</span>
                    <span className="font-mono font-bold text-zinc-200">{dealAudit.advertisedDiscountPct}% OFF</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">True Savings vs 90-Day Price:</span>
                    <span className={`font-mono font-bold ${dealAudit.realDiscountVsAvgPct > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {dealAudit.realDiscountVsAvgPct}% ({market.symbol}{dealAudit.realSavings})
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400">Artificial MRP Markup:</span>
                    <span className="font-mono font-bold text-amber-400">+{dealAudit.mrpInflationPct}% above normal</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 mt-4 pt-3 border-t border-zinc-800">
                Tip: Always verify that the seller has 95%+ feedback and "Fulfilled by Amazon" badge to guarantee authentic serial numbers.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FFE600]" />
                <span>3-Year Ownership & Battery Cycle Simulator</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Purchase Price ({market.symbol})
                  </label>
                  <input
                    type="number"
                    value={devicePrice}
                    onChange={(e) => setDevicePrice(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Battery Capacity (mAh)
                  </label>
                  <input
                    type="number"
                    value={batteryMah}
                    onChange={(e) => setBatteryMah(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Fast Charge Speed (Watts)
                  </label>
                  <input
                    type="number"
                    value={chargingWatts}
                    onChange={(e) => setChargingWatts(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Guaranteed OS Updates (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={osUpdateYears}
                    onChange={(e) => setOsUpdateYears(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                    Daily Screen-On Time (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={dailyScreenHours}
                    onChange={(e) => setDailyScreenHours(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <span className="text-zinc-400 font-mono uppercase">Real Daily Ownership Cost</span>
                  <span className="text-2xl font-black text-[#FFE600] font-mono">
                    {market.symbol}{tcoMetrics.costPerDay}/day
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">3-Year Charge Cycles:</span>
                  <span className="font-mono font-bold text-white">{tcoMetrics.totalCycles3Yr} cycles</span>
                </div>

                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Projected Year-3 Battery Health:</span>
                  <span className={`font-mono font-bold ${tcoMetrics.estimatedBatteryHealth3Yr >= 82 ? "text-emerald-400" : "text-amber-400"}`}>
                    {tcoMetrics.estimatedBatteryHealth3Yr}% Capacity
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Estimated Year-3 Resale Value:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {market.symbol}{tcoMetrics.estimatedResaleValue}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-zinc-400">Net 3-Year Total Cost (TCO):</span>
                  <span className="font-mono font-bold text-white">
                    {market.symbol}{tcoMetrics.net3YearCost}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 mt-4 pt-3 border-t border-zinc-800">
                Devices with 6–7 years of OS support (Apple, Pixel, Galaxy S24) retain up to 42% resale value after 36 months.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
