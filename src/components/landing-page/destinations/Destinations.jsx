import React, { useState } from 'react';
import destinationsData from '../../../data/destinations.json';
import DestinationCard from './DestinationCard';

const Destinations = () => {
  const [showAll, setShowAll] = useState(false);
  
  // Show only 3 items initially, or all if showAll is true
  const visibleDestinations = showAll ? destinationsData : destinationsData.slice(0, 3);

  return (
    <section className="py-20 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-accent-light text-accent font-jakarta text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Destinasi Unggulan
          </div>
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-brand mb-6">
            Wisata Desa Sibetan
          </h2>
          <p className="font-jakarta text-content-main md:text-lg leading-relaxed">
            Temukan pesona alam dan agrowisata unik Desa Sibetan — dari kebun salak yang rindang hingga panorama perbukitan Karangasem yang memukau.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12 mb-16">
          {visibleDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 border-2 border-accent/20 text-accent hover:bg-accent-light font-jakarta font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Destinasi (${destinationsData.length})`}
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Destinations;
