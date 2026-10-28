import React from "react";
import { Zap, ShieldCheck, ExternalLink, Mail, Lock, FileText, ShoppingBag, Info } from "lucide-react";
import { PolicyType } from "../common/PolicyModal";

interface FlashFooterProps {
  onOpenPolicy?: (type: PolicyType) => void;
}

export const FlashFooter: React.FC<FlashFooterProps> = ({ onOpenPolicy }) => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-12 px-4 sm:px-8 text-xs">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Col 1: Brand & Vision */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFE600] text-black font-black flex items-center justify-center text-xs shadow-[0_0_15px_rgba(255,230,0,0.3)]">
              <Zap className="w-4 h-4 fill-black stroke-black" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              productreviews<span className="text-[#FFE600]">.review</span>
            </span>
          </div>
          
          <p className="text-zinc-400 text-xs leading-relaxed">
            The AI-powered smart shopping assistant and independent hardware testing platform built to cut through fake reviews, find true lowest prices, and consolidate orders.
          </p>
          
          <div className="text-[11px] text-zinc-500 font-mono">
            Unbiased algorithmic benchmarking · Bengaluru & San Francisco
          </div>
        </div>

        {/* Col 2: Platform Ecosystem */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
            Platform Ecosystem
          </h4>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="#featured-products" className="hover:text-[#FFE600] transition-colors">Top Flash Scores</a></li>
            <li><a href="#prepend-demo" className="hover:text-[#FFE600] transition-colors font-mono">Prepend productreviews.review/</a></li>
            <li><a href="#research-hub" className="hover:text-[#FFE600] transition-colors">Buyer Research & FAQs</a></li>
            <li><a href="#shopping-email" className="hover:text-[#FFE600] transition-colors">Free @productreviews.review Email</a></li>
            <li><a href="#order-tracker" className="hover:text-[#FFE600] transition-colors">Universal Order Tracker</a></li>
          </ul>
        </div>

        {/* Col 3: Search Engine & AdSense Verification */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
            Crawlers & Verification
          </h4>
          <ul className="space-y-2 text-zinc-400 font-mono text-[11px]">
            <li><a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1"><span>XML Sitemap</span><ExternalLink className="w-3 h-3" /></a></li>
            <li><a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1"><span>Robots Directives</span><ExternalLink className="w-3 h-3" /></a></li>
            <li><a href="/ads.txt" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1"><span>AdSense ads.txt</span><ExternalLink className="w-3 h-3" /></a></li>
            <li><a href="/api/seo/faq-manifest" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1"><span>FAQ JSON-LD</span><ExternalLink className="w-3 h-3" /></a></li>
          </ul>
        </div>

        {/* Col 4: Mandatory Compliance Documentation */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
            Policy & Compliance
          </h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed mb-3">
            productreviews.review adheres to strict Google AdSense policies, GDPR cookie consent, and FTC affiliate disclosures.
          </p>
          <div className="space-y-1.5">
            <button
              onClick={() => onOpenPolicy?.("privacy")}
              className="text-[#FFE600] hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy Policy & Cookies</span>
            </button>
            <button
              onClick={() => onOpenPolicy?.("terms")}
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={() => onOpenPolicy?.("affiliate")}
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Amazon Affiliate Disclosure</span>
            </button>
            <button
              onClick={() => onOpenPolicy?.("contact")}
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us & Support</span>
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-500 gap-4 text-[11px]">
        <p>© 2026 productreviews.review. All rights reserved. Google AdSense Publisher: ca-pub-9048615701580913</p>
        <div className="flex items-center gap-4">
          <button onClick={() => onOpenPolicy?.("about")} className="hover:text-zinc-300 cursor-pointer">About Us</button>
          <span>·</span>
          <button onClick={() => onOpenPolicy?.("privacy")} className="hover:text-zinc-300 cursor-pointer">Privacy</button>
          <span>·</span>
          <button onClick={() => onOpenPolicy?.("terms")} className="hover:text-zinc-300 cursor-pointer">Terms</button>
          <span>·</span>
          <button onClick={() => onOpenPolicy?.("affiliate")} className="hover:text-zinc-300 cursor-pointer">Affiliate</button>
          <span>·</span>
          <button onClick={() => onOpenPolicy?.("contact")} className="hover:text-zinc-300 cursor-pointer">Contact</button>
        </div>
      </div>
    </footer>
  );
};
