import React, { useState } from "react";
import { Zap, Globe, Mail, Search, ExternalLink } from "lucide-react";
import { SUPPORTED_MARKETS } from "../../localization/markets";

interface FlashNavbarProps {
  currentMarket: string;
  onMarketChange: (marketCode: string) => void;
  onOpenEmailModal: () => void;
  onNavigateHome: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const FlashNavbar: React.FC<FlashNavbarProps> = ({
  currentMarket,
  onMarketChange,
  onOpenEmailModal,
  onNavigateHome,
  onNavigateSection
}) => {
  const [showMarketDropdown, setShowMarketDropdown] = useState(false);
  const market = SUPPORTED_MARKETS.find((m) => m.code === currentMarket) || SUPPORTED_MARKETS[0];

  return (
    <nav className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FFE600] text-black font-black flex items-center justify-center text-sm shadow-[0_0_20px_rgba(255,230,0,0.35)] group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-black stroke-black" />
          </div>
          <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
            productreviews<span className="text-[#FFE600]">.review</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
          <button
            onClick={() => onNavigateSection?.("featured-products")}
            className="hover:text-[#FFE600] transition-colors cursor-pointer"
          >
            Top Scores
          </button>
          <button
            onClick={() => onNavigateSection?.("prepend-demo")}
            className="hover:text-[#FFE600] transition-colors cursor-pointer font-mono"
          >
            Prepend Demo
          </button>
          <button
            onClick={() => onNavigateSection?.("research-hub")}
            className="hover:text-[#FFE600] transition-colors cursor-pointer"
          >
            Research & FAQs
          </button>
          <button
            onClick={() => onNavigateSection?.("shopping-email")}
            className="hover:text-[#FFE600] transition-colors cursor-pointer"
          >
            Smart Inbox
          </button>
          <button
            onClick={() => onNavigateSection?.("order-tracker")}
            className="hover:text-[#FFE600] transition-colors cursor-pointer"
          >
            Order Tracker
          </button>
        </div>

        {/* Right Actions: Market Switcher & Free Email Button */}
        <div className="flex items-center gap-3">
          {/* Regional Amazon Store Selector */}
          <div className="relative">
            <button
              onClick={() => setShowMarketDropdown(!showMarketDropdown)}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              title="Change Amazon Regional Store"
            >
              <span>{market.flag}</span>
              <span className="font-mono">{market.code}</span>
            </button>

            {showMarketDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 text-xs max-h-72 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase font-mono">
                  Select Amazon Market
                </div>
                {SUPPORTED_MARKETS.map((m) => (
                  <button
                    key={m.code}
                    onClick={() => {
                      onMarketChange(m.code);
                      setShowMarketDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-900 transition-colors cursor-pointer ${
                      m.code === currentMarket ? "text-[#FFE600] font-bold bg-zinc-900/50" : "text-zinc-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{m.flag}</span>
                      <span>{m.name}</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">{m.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Claim Email Button */}
          <button
            onClick={onOpenEmailModal}
            className="bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,230,0,0.3)] cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get Free Email</span>
            <span className="sm:hidden">Claim</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
