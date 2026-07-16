import React, { useState } from 'react';
import SectionHeader from '../../ui/SectionHeader';
import Modal from '../../ui/Modal';
import packagesData from '../../../data/packages.json';
import PackageCard from './PackageCard';
import PackageModalContent from './PackageModalContent';

const Packages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <section id="packages" className="py-20 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface-card">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Section from reusable UI component */}
        <SectionHeader 
          pillText="Menginap & Berwisata"
          title="Paket Wisata & Akomodasi"
          description="Nikmati pengalaman wisata terbaik dengan paket perjalanan dan pilihan akomodasi nyaman di Desa Sibetan."
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {packagesData.map((pkg) => (
            <PackageCard 
              key={pkg.id} 
              pkg={pkg} 
              onClickDetail={() => setSelectedPackage(pkg)}
            />
          ))}
        </div>

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
