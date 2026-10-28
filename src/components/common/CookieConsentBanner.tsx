import React, { useState, useEffect } from "react";
import { Shield, Check, X, Lock } from "lucide-react";

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("productreviews_cookie_consent");
      if (!consent) {
        // Show after a subtle delay
        const t = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("productreviews_cookie_consent", "accepted");
    } catch {}
    setIsVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem("productreviews_cookie_consent", "dismissed");
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 bg-zinc-950/95 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md text-xs text-zinc-300 font-sans animate-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-center text-[#FFE600] shrink-0 mt-0.5">
          <Shield className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs">
              Cookie & Privacy Notice
            </h4>
            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            We use cookies to analyze traffic, deliver verified Amazon price trackers, and serve personalized ads via Google AdSense.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept & Continue</span>
            </button>

            <button
              onClick={onOpenPrivacyPolicy}
              className="text-zinc-400 hover:text-white underline text-[11px] px-2 py-1 cursor-pointer transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
