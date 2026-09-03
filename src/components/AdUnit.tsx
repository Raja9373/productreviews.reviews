import React, { useEffect } from 'react';

interface AdUnitProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({
  slotId = '6620583416',
  format = 'auto',
  className = '',
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // AdSense script may be blocked by user ad-blocker or iframe
    }
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <div className="w-full max-w-4xl min-h-[90px] bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col items-center justify-center p-2 text-center">
        <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider mb-1">
          Advertisement
        </span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-9048615701580913"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
