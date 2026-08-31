import React, { useEffect } from 'react';

interface AdSlotProps {
  id: string;
  type: 'leaderboard' | 'inArticle' | 'sidebar' | 'footerBanner';
  className?: string;
  adSlotId?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ id, type, className = '', adSlotId }) => {
  let sizeClasses = 'w-full h-[90px] max-w-[728px]';
  let slotDimensionText = '728 × 90 Leaderboard';
  let adFormat = 'auto';

  if (type === 'inArticle') {
    sizeClasses = 'w-full max-w-[336px] h-[280px] sm:w-[336px]';
    slotDimensionText = '336 × 280 In-Article Ad';
    adFormat = 'rectangle';
  } else if (type === 'sidebar') {
    sizeClasses = 'w-full max-w-[300px] h-[250px] sm:w-[300px]';
    slotDimensionText = '300 × 250 Sidebar Rectangle';
    adFormat = 'vertical';
  } else if (type === 'footerBanner') {
    sizeClasses = 'w-full max-w-4xl h-[90px]';
    slotDimensionText = 'Responsive Anchor Ad Banner';
    adFormat = 'horizontal';
  }

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle && adSlotId) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      // ignore
    }
  }, [adSlotId]);

  return (
    <div
      id={`ad-container-${id}`}
      className={`my-6 flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 select-none">
        Advertisement
      </div>
      <div
        id={id}
        className={`${sizeClasses} border border-dashed border-zinc-200 bg-zinc-50/80 rounded-xl flex flex-col items-center justify-center p-4 text-center select-none transition-colors hover:bg-zinc-100/60 overflow-hidden relative`}
      >
        {adSlotId ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-0000000000000000"
            data-ad-slot={adSlotId}
            data-ad-format={adFormat}
            data-full-width-responsive="true"
          />
        ) : (
          <>
            <div className="text-xs font-mono font-medium text-zinc-400">
              Google AdSense Ad Slot
            </div>
            <div className="text-[11px] font-mono text-zinc-300 mt-0.5">
              {slotDimensionText}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

