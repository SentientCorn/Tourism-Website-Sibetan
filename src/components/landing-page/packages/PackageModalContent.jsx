import React, { useState } from 'react';

const PackageModalContent = ({ pkg }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const images = pkg.images || [pkg.image];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col">
      {/* Header Image Carousel */}
      <div className="relative h-64 sm:h-80 w-full group">
        <img 
          src={images[currentImageIdx]} 
          alt={pkg.title} 
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <h2 className="font-poppins font-bold text-3xl text-brand mb-4 leading-tight">
          {pkg.title}
        </h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <span className="font-jakarta text-accent font-bold text-xl">
            {pkg.price}
          </span>
          <div className="flex gap-2">
            <span className="bg-surface text-content-main text-xs font-jakarta px-3 py-1.5 rounded-full border border-gray-100">
              {pkg.durationOrType}
            </span>
            {pkg.maxPax && (
              <span className="bg-surface text-content-main text-xs font-jakarta px-3 py-1.5 rounded-full border border-gray-100">
                {pkg.maxPax}
              </span>
            )}
          </div>
        </div>

        <p className="font-jakarta text-content-main leading-relaxed mb-8">
          {pkg.fullDescription || pkg.description}
        </p>

        {/* Facilities */}
        {pkg.facilities && pkg.facilities.length > 0 && (
          <div className="mb-8">
            <h4 className="font-jakarta font-bold text-brand text-sm mb-4 uppercase tracking-wide">
              Sudah Termasuk / Fasilitas
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {pkg.facilities.map((facility, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-accent-light px-4 py-2 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  <span className="font-jakarta text-accent text-sm font-medium">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-surface rounded-xl p-5 border border-gray-100">
          <h4 className="font-jakarta font-bold text-accent text-sm mb-4 uppercase tracking-wide">
            Informasi Kontak
          </h4>
          
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-lg shrink-0">
              {pkg.contactPerson.charAt(0)}
            </div>
            <div>
              <h5 className="font-poppins font-bold text-brand">{pkg.contactPerson}</h5>
              <p className="font-jakarta text-content-muted text-sm mb-2">{pkg.whatsapp}</p>
              {pkg.contactNote && (
                <p className="font-jakarta text-content-main text-sm">
                  {pkg.contactNote}
                </p>
              )}
            </div>
          </div>
          
          <a 
            href={`https://wa.me/${pkg.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-jakarta font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.94 5.86L3 22l4.28-.94A9.953 9.953 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.48 13.56c-.24.68-1.4 1.3-1.95 1.36-.5.05-1.12.16-3.21-.7-2.52-1.03-4.14-3.6-4.26-3.76-.12-.16-1.02-1.36-1.02-2.59 0-1.23.64-1.83.87-2.07.23-.24.5-.3.67-.3h.48c.17 0 .4.06.63.63.24.58.7 1.7.76 1.83.06.13.1.28.02.43-.08.15-.12.24-.24.38-.12.14-.25.32-.35.43-.12.13-.26.27-.1.54.16.27.7 1.15 1.5 1.87.97.87 1.8 1.14 2.07 1.27.27.13.43.1.59-.08.16-.18.7-1.18.88-1.58.18-.4.36-.33.61-.24.25.1 1.58.75 1.85.88.27.14.45.2.52.33.07.13.07.76-.17 1.44z" clipRule="evenodd"/>
            </svg>
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PackageModalContent;
