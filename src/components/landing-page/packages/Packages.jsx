import React, { useState } from 'react';
import SectionHeader from '../../ui/SectionHeader';
import Modal from '../../ui/Modal';
import { usePackages } from '../../../hooks/usePackages';
import PackageCard from './PackageCard';
import PackageModalContent from './PackageModalContent';

const Packages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { packages: packagesData, loading, error } = usePackages();

  return (
    <section id="packages" className="py-20 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface-card">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Section from reusable UI component */}
        <SectionHeader 
          pillText="Menginap & Berwisata"
          title="Paket Wisata & Akomodasi"
          description="Nikmati pengalaman wisata terbaik dengan paket perjalanan dan pilihan akomodasi nyaman di Desa Sibetan."
        />

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Memuat paket wisata...</div>
        ) : error ? (
          <div className="text-center py-12 text-rose-500 font-medium">Gagal memuat paket wisata: {error}</div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {packagesData.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                onClickDetail={() => setSelectedPackage(pkg)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedPackage} 
        onClose={() => setSelectedPackage(null)}
      >
        {selectedPackage && (
          <PackageModalContent pkg={selectedPackage} />
        )}
      </Modal>
    </section>
  );
};

export default Packages;
