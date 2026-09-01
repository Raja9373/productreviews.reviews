import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  id: string;
  type: 'leaderboard' | 'inArticle' | 'sidebar' | 'footerBanner';
  className?: string;
  adSlotId?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ id, type, className = '', adSlotId }) => {
  const isPushed = useRef(false);
  let sizeClasses = 'w-full h-[90px] max-w-[728px]';
  let adFormat: 'auto' | 'rectangle' | 'vertical' | 'horizontal' = 'auto';

  if (type === 'inArticle') {
    sizeClasses = 'w-full max-w-[336px] h-[280px] sm:w-[336px]';
    adFormat = 'rectangle';
  } else if (type === 'sidebar') {
    sizeClasses = 'w-full max-w-[300px] h-[250px] sm:w-[300px]';
    adFormat = 'vertical';
  } else if (type === 'footerBanner') {
    sizeClasses = 'w-full max-w-4xl h-[90px]';
    adFormat = 'horizontal';
  }

  useEffect(() => {
    if (isPushed.current) return;
    try {
      if (typeof window !== 'undefined') {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        isPushed.current = true;
      }
    } catch (e) {
      console.debug('[Google AdSense] AdSlot notice:', e);
    }
  }, []);

  return (
    <div
      id={`ad-container-${id}`}
      className={`my-6 flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 select-none text-center">
        Advertisement
      </div>
      <div
        id={id}
        className={`${sizeClasses} border border-dashed border-zinc-200/60 bg-zinc-50/80 rounded-xl flex flex-col items-center justify-center p-2 text-center select-none overflow-hidden relative`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client="ca-pub-9048615701580913"
          data-ad-slot={adSlotId || undefined}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};


