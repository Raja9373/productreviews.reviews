import React from "react";
import { Zap, ShieldCheck, Mail, Lock, FileText, ShoppingBag, Info, Award } from "lucide-react";
import { PolicyType } from "../common/PolicyModal";
import { contentRepository, ReviewRecord } from "../../content/store/contentRepository";
import { COMPARISON_PAIRS, ComparisonPair } from "./FlashComparisonView";

interface FlashFooterProps {
  onOpenPolicy?: (type: PolicyType) => void;
  onSelectProduct?: (record: ReviewRecord) => void;
  onSelectComparison?: (comp: ComparisonPair) => void;
}

export const FlashFooter: React.FC<FlashFooterProps> = ({
  onOpenPolicy,
  onSelectProduct,
  onSelectComparison
}) => {
  const allPublished = contentRepository.getPublished();

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-12 px-4 sm:px-8 text-xs">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        
        {/* Col 1: Brand & Vision */}
        <div className="space-y-4 lg:col-span-1">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFE600] text-black font-black flex items-center justify-center text-xs shadow-[0_0_15px_rgba(255,230,0,0.3)]">
              <Zap className="w-4 h-4 fill-black stroke-black" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              productreviews<span className="text-[#FFE600]">.review</span>
            </span>
          </a>
          
          <p className="text-zinc-400 text-xs leading-relaxed">
            The independent hardware testing platform & smart shopping assistant built to expose fake marketplace reviews, verify 90-day Amazon price histories, and test real battery & thermal performance.
          </p>
          
          <div className="text-[11px] text-zinc-500 font-mono">
            Independent Editorial Lab · Delhi & San Francisco
          </div>
        </div>

        {/* Col 2: Crawlable Product Reviews Directory */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
            Tested Hardware Reviews
          </h4>
          <ul className="space-y-1.5 text-zinc-400">
            {allPublished.slice(0, 7).map((prod) => (
              <li key={prod.slug}>
                <a
                  href={`/review/${prod.slug}`}
                  onClick={(e) => {
                    if (onSelectProduct) {
                      e.preventDefault();
                      onSelectProduct(prod);
                    }
                  }}
                  className="hover:text-[#FFE600] transition-colors block truncate"
                >
                  {prod.name} Review
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: More Reviews & Head-to-Head Comparisons */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
            More Reviews & Shootouts
          </h4>
          <ul className="space-y-1.5 text-zinc-400">
            {allPublished.slice(7).map((prod) => (
              <li key={prod.slug}>
                <a
                  href={`/review/${prod.slug}`}
                  onClick={(e) => {
                    if (onSelectProduct) {
                      e.preventDefault();
                      onSelectProduct(prod);
                    }
                  }}
                  className="hover:text-[#FFE600] transition-colors block truncate"
                >
                  {prod.name} Review
                </a>
              </li>
            ))}
            {COMPARISON_PAIRS.map((comp) => (
              <li key={comp.slug} className="pt-0.5">
                <a
                  href={`/compare/${comp.slug}`}
                  onClick={(e) => {
                    if (onSelectComparison) {
                      e.preventDefault();
                      onSelectComparison(comp);
                    }
                  }}
                  className="hover:text-[#FFE600] text-zinc-300 font-medium transition-colors block truncate"
                >
                  VS: {comp.slug.replace(/-/g, " ")}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Platform Tools & Guides */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
            Decision Tools & Guides
          </h4>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="/#featured-products" className="hover:text-[#FFE600] transition-colors">Top Flash Scores</a></li>
            <li><a href="/#comparison-shootouts" className="hover:text-[#FFE600] transition-colors">VS Comparison Hub</a></li>
            <li><a href="/#decision-tools" className="hover:text-[#FFE600] transition-colors">Fake Discount Auditor</a></li>
            <li><a href="/#decision-tools" className="hover:text-[#FFE600] transition-colors">3-Year Battery TCO Simulator</a></li>
            <li><a href="/#research-hub" className="hover:text-[#FFE600] transition-colors">Buyer Research & FAQs</a></li>
            <li>
              <a
                href="/editorial-policy"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPolicy?.("editorial");
                }}
                className="hover:text-[#FFE600] transition-colors"
              >
                Lab Testing Methodology
              </a>
            </li>
          </ul>
        </div>

        {/* Col 5: Mandatory Compliance Documentation */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
            Editorial & Legal Policies
          </h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed mb-3">
            Compliant with Google Search Quality Rater Guidelines (E-E-A-T), AdSense Policies, GDPR, and FTC Affiliate Guidelines.
          </p>
          <div className="space-y-1.5">
            <a
              href="/editorial-policy"
              onClick={(e) => {
                e.preventDefault();
                onOpenPolicy?.("editorial");
              }}
              className="text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer text-left font-semibold"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Editorial & Testing Policy</span>
            </a>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                onOpenPolicy?.("privacy");
              }}
              className="text-[#FFE600] hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy Policy & Cookies</span>
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                onOpenPolicy?.("terms");
              }}
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </a>
            <a
              href="/affiliate-disclosure"
              onClick={(e) => {
                e.preventDefault();
                onOpenPolicy?.("affiliate");
              }}
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Amazon Affiliate Disclosure</span>
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onOpenPolicy?.("about");
              }}
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <Info className="w-3.5 h-3.5" />
              <span>About Our Testing Lab</span>
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onOpenPolicy?.("contact");
              }}
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer text-left"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us & Corrections</span>
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-500 gap-4 text-[11px]">
        <p>© 2025–2026 productreviews.review. All rights reserved. Publisher: Alok Mohan Sharma (ca-pub-9048615701580913)</p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="/editorial-policy" onClick={(e) => { e.preventDefault(); onOpenPolicy?.("editorial"); }} className="hover:text-zinc-300 cursor-pointer">Editorial Policy</a>
          <span>·</span>
          <a href="/about" onClick={(e) => { e.preventDefault(); onOpenPolicy?.("about"); }} className="hover:text-zinc-300 cursor-pointer">About Us</a>
          <span>·</span>
          <a href="/privacy" onClick={(e) => { e.preventDefault(); onOpenPolicy?.("privacy"); }} className="hover:text-zinc-300 cursor-pointer">Privacy</a>
          <span>·</span>
          <a href="/terms" onClick={(e) => { e.preventDefault(); onOpenPolicy?.("terms"); }} className="hover:text-zinc-300 cursor-pointer">Terms</a>
          <span>·</span>
          <a href="/affiliate-disclosure" onClick={(e) => { e.preventDefault(); onOpenPolicy?.("affiliate"); }} className="hover:text-zinc-300 cursor-pointer">Affiliate</a>
          <span>·</span>
          <a href="/contact" onClick={(e) => { e.preventDefault(); onOpenPolicy?.("contact"); }} className="hover:text-zinc-300 cursor-pointer">Contact</a>
        </div>
      </div>
    </footer>
  );
};
