import React, { useEffect } from 'react';
import { initJaiGurujiGeoAffiliate, isIndianVisitor } from '../utils/geoAffiliate';

export const FooterGeoAffiliateScript: React.FC = () => {
  useEffect(() => {
    // Initialize Jai Guruji Global Geo-Affiliate System Site-Wide
    initJaiGurujiGeoAffiliate();
  }, []);

  const isIndia = typeof window !== 'undefined' ? isIndianVisitor() : false;

  return (
    <div id="jai-guruji-geo-affiliate-indicator" className="w-full pt-4 pb-2 border-t border-zinc-100/60 mt-4 text-[11px] text-zinc-400 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-zinc-600 font-semibold">Jai Guruji Global Geo-Affiliate Engine Active</span>
        <span className="text-zinc-400">•</span>
        <span className="text-zinc-500 font-mono text-[10px]">
          Target: {isIndia ? 'amazon.in (?tag=jaiguruji00-21)' : 'amazon.com (?tag=jaiguruji00-20)'}
        </span>
      </div>
      <div className="text-[10px] text-zinc-400 font-mono">
        Auto-Earning: {isIndia ? '🇮🇳 India Storefront' : '🌍 Global & USA Storefront'}
      </div>
    </div>
  );
};
