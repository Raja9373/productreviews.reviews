import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  id?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdUnit: React.FC<AdUnitProps> = ({
  id,
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Execute adsbygoogle push only once per mounted AdUnit component instance
    if (isPushed.current) return;

    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isPushed.current = true;
      }
    } catch (err) {
      // Gracefully catch ad-blocker or script loading exceptions
      console.debug('[Google AdSense] AdUnit push notice:', err);
    }
  }, []);

  return (
    <div
      id={id ? `ad-wrapper-${id}` : undefined}
      className={`w-full max-w-5xl mx-auto my-6 flex flex-col items-center justify-center px-4 ${className}`}
    >
      {/* 10px Gray Advertisement Label as required by Google AdSense Policy */}
      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest text-center select-none mb-1.5">
        Advertisement
      </span>

      <div className="w-full bg-zinc-50/50 rounded-xl overflow-hidden min-h-[90px] flex items-center justify-center border border-dashed border-zinc-200/60 p-2">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px' }}
          data-ad-client="ca-pub-9048615701580913"
          data-ad-slot={slot || undefined}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};
