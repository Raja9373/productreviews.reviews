import React, { useState, useEffect } from 'react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('pr_cookie_consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // localStorage may fail in restricted iframes
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('pr_cookie_consent', 'accepted');
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 pointer-events-none">
      <div className="max-w-xl mx-auto bg-zinc-900 text-white rounded-2xl p-4 shadow-xl border border-zinc-800 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-300 leading-relaxed text-center sm:text-left">
          We use minimal cookies and local storage exclusively to remember your selected country,
          language preferences, and enable security features.
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};
