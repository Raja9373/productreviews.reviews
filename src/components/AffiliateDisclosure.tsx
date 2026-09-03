import React from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../localization/languages';

interface AffiliateDisclosureProps {
  currentLang: LanguageCode;
  onOpenDisclosurePage?: () => void;
}

export const AffiliateDisclosure: React.FC<AffiliateDisclosureProps> = ({
  currentLang,
  onOpenDisclosurePage,
}) => {
  const t = getTranslation(currentLang);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-6">
      <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3.5 sm:p-4 text-xs text-zinc-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 leading-normal">
        <div className="flex items-start gap-2">
          <span className="text-zinc-400 font-bold shrink-0">ⓘ</span>
          <span>{t.affiliateNotice}</span>
        </div>
        {onOpenDisclosurePage && (
          <button
            onClick={onOpenDisclosurePage}
            className="text-zinc-700 hover:text-zinc-900 font-semibold underline underline-offset-2 shrink-0 self-end sm:self-auto"
          >
            Read Full Disclosure
          </button>
        )}
      </div>
    </div>
  );
};
