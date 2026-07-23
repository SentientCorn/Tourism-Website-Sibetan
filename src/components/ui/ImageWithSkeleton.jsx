import React, { useState } from 'react';

const ImageWithSkeleton = ({ src, alt, className = '', containerClassName = '', children, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-200 ${containerClassName}`}>
      {/* Animated Skeleton Shimmer Placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse flex flex-col items-center justify-center p-4">
          <svg className="w-8 h-8 text-slate-300 animate-bounce mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-jakarta text-[11px] font-medium text-slate-400">Memuat gambar...</span>
        </div>
      )}

      {/* Actual Image */}
      <img
        loading="lazy"
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${className}`}
        {...props}
      />

      {/* Any overlay badge/text children (e.g. photo count, type tag, etc.) */}
      {children}
    </div>
  );
};

export default ImageWithSkeleton;
