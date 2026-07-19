import React, { useState } from 'react';

const TraditionCard = ({ tradition }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === tradition.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === 0 ? tradition.images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-surface-card rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      {/* Image Carousel */}
      <div className="relative h-72 sm:h-80 w-full group">
        <img 
          loading="lazy"
          src={tradition.images[currentImageIdx]} 
          alt={tradition.title} 
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        
        {/* Navigation Arrows (Visible on hover) */}
        {tradition.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {tradition.images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8 flex flex-col flex-grow">
        {/* Tag Pill */}
        <div className="mb-4">
          <span className="inline-block bg-accent-light text-accent font-jakarta text-xs font-semibold px-3 py-1 rounded-full">
            {tradition.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-poppins font-bold text-2xl text-brand mb-3">
          {tradition.title}
        </h3>

        {/* Description */}
        <p className="font-jakarta text-content-main text-sm leading-relaxed mb-4">
          {tradition.description}
        </p>

        {/* Expanded Description */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="pt-2 border-t border-gray-100 mt-2">
            <p className="font-jakarta text-content-muted text-sm leading-relaxed">
              {tradition.details || "Tradisi ini terus dilestarikan oleh masyarakat Desa Sibetan dari generasi ke generasi. Prosesi pelaksanaannya melibatkan seluruh elemen desa dengan semangat gotong royong yang tinggi, menjadikannya sebuah warisan budaya yang tak ternilai harganya."}
            </p>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-auto pt-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-accent hover:text-accent/80 font-jakarta text-sm font-semibold transition-colors"
          >
            {isExpanded ? 'Tutup Selengkapnya' : 'Baca Selengkapnya'}
            <svg 
              className={`w-4 h-4 mt-0.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraditionCard;
