import React from 'react';

const DestinationCard = ({ destination }) => {
  return (
    <div className="bg-surface-card rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 w-full">
        <img 
          src={destination.image} 
          alt={destination.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-jakarta">
          {destination.photoCount} foto
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8 flex flex-col flex-grow">
        {/* Location */}
        <div className="flex items-start gap-2 mb-3">
          <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-jakarta text-sm text-content-main leading-snug">
            {destination.location}
          </span>
        </div>

        {/* Title - Poppins */}
        <h3 className="font-poppins font-bold text-xl text-brand mb-3">
          {destination.title}
        </h3>

        {/* Description - Plus Jakarta Sans */}
        <p className="font-jakarta text-content-main text-sm leading-relaxed mb-6 flex-grow">
          {destination.description}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4 mt-auto"></div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-content-main">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-jakarta text-sm">{destination.time}</span>
          </div>
          
          <button className="bg-accent hover:bg-accent/90 text-white font-jakarta text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Detail & Peta &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
