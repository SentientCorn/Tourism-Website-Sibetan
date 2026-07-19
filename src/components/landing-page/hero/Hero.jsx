import React from 'react';
import heroBgFallback from '../../../assets/hero-coba.png';
import { useHeroes } from '../../../hooks/useHeroes';

const Hero = () => {
  const { heroes, loading, error } = useHeroes();
  
  // Get the first hero from backend, or fallback to static if none
  const activeHero = heroes && heroes.length > 0 ? heroes[0] : null;
  const heroBg = activeHero && activeHero.images && activeHero.images.length > 0 ? activeHero.images[0] : heroBgFallback;
  const title = activeHero?.title || "Desa Sibetan";
  const subtitle = activeHero?.subtitle || "Karangasem, Bali";

  return (
    <section className="relative w-full h-screen flex items-center px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background Image */}
      <img
        src={heroBg}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Gradient overlay for text readability (thick on left to thin on right) */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/70 to-transparent z-0"></div>

      <div className="relative z-10 max-w-3xl">
        {/* Top greeting */}
        <p className="font-jakarta text-sm md:text-base font-semibold tracking-wider text-gray-300 mb-2 uppercase">
          Selamat Datang Di
        </p>

        {/* Main Title - Poppins */}
        <h1 className="font-poppins text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2">
          {title}
        </h1>

        {/* Subtitle - Poppins */}
        <h2 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 mb-6">
          {subtitle}
        </h2>

        {/* Description - Plus Jakarta Sans */}
        <p className="font-jakarta text-base md:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
          Desa penghasil salak terbaik di Bali, kaya akan tradisi Hindu, alam yang asri, dan keramahan warga yang tulus.
        </p>

        {/* Buttons - Plus Jakarta Sans */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#destinations" className="font-jakarta bg-white text-brand hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-300 text-center inline-block">
            Jelajahi Wisata
          </a>
          <a href="#packages" className="font-jakarta bg-white/10 border border-white/40 text-white hover:bg-white/20 font-semibold px-8 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 text-center inline-block">
            Paket & Akomodasi
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
