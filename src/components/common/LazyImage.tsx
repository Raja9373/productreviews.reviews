import React, { useState, useEffect, useRef } from "react";

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // Set true for LCP / above-the-fold images
  placeholderColor?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  priority = false,
  placeholderColor = "bg-stone-200",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const currentRef = imgRef.current;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            obs.disconnect();
          }
        });
      },
      {
        rootMargin: "200px 0px", // Pre-load 200px before entering viewport
        threshold: 0.01
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [priority]);

  return (
    <div ref={imgRef as any} className={`overflow-hidden relative ${placeholderColor} ${className}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          {...props}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-stone-300/60 flex items-center justify-center">
          <span className="text-[10px] text-stone-500 font-medium tracking-wider uppercase">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
