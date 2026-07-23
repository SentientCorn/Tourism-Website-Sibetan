import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

let packagesCache = null;
let packagesPromise = null;

export const usePackages = (options = {}) => {
  const { onUnauthorized } = options;
  const [packages, setPackages] = useState(packagesCache || []);
  const [loading, setLoading] = useState(!packagesCache);
  const [error, setError] = useState(null);

  const fetchPackages = async (force = false) => {
    if (!force && packagesCache) {
      setPackages(packagesCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (force || !packagesPromise) {
        packagesPromise = fetch(`${API_BASE}/tour-packages`)
          .then(async (response) => {
            if (response.status === 401 && onUnauthorized) {
              onUnauthorized();
              return null;
            }
            if (!response.ok) throw new Error('Failed to fetch packages');
            return response.json();
          })
          .finally(() => {
            packagesPromise = null;
          });
      }

      const data = await packagesPromise;
      if (!data) return;

      const formattedData = data.map(pkg => {
        const images = pkg.images ? pkg.images.map(img => formatImagePath(img.imageUrl || img)) : [];
        const image = images.length > 0 ? images[0] : formatImagePath(null);

        let priceStr = pkg.price;
        if (typeof pkg.price === 'number' || (!isNaN(pkg.price) && pkg.price !== '' && pkg.price !== null)) {
          priceStr = `Rp ${Number(pkg.price).toLocaleString('id-ID')}`;
        }

        const facilitiesList = Array.isArray(pkg.facilities)
          ? pkg.facilities
          : (typeof pkg.facilities === 'string'
            ? pkg.facilities.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
            : (Array.isArray(pkg.features) ? pkg.features : []));

        const rawPriceNum = pkg.price;
        const contactPerson = pkg.contact?.name || pkg.contactName || pkg.contactPerson || 'Admin Wisata';
        const contactPhone = pkg.contact?.phone || pkg.contactPhone || pkg.whatsapp || pkg.phone || '6281234567890';
        const contactNote = pkg.contact?.note || pkg.contactNote || '';

        let durationStr = pkg.duration || pkg.durationOrType || '-';
        if (durationStr !== '-' && (typeof durationStr === 'number' || (!isNaN(durationStr) && /^\d+$/.test(String(durationStr).trim())))) {
          durationStr = `${durationStr} Hari`;
        }

        return {
          ...pkg,
          rawPrice: rawPriceNum,
          price: priceStr || 'Rp 0',
          durationOrType: durationStr,
          maxPax: pkg.capacity || pkg.maxPax || '',
          description: pkg.description || '-',
          fullDescription: pkg.description || pkg.fullDescription || '-',
          facilities: facilitiesList,
          features: facilitiesList,
          contactPerson: contactPerson,
          contactName: contactPerson,
          whatsapp: contactPhone,
          contactPhone: contactPhone,
          contactNote: contactNote,
          originalImages: pkg.images ? pkg.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
          images: images.length > 0 ? images : [image],
          image: image,
          photoCount: images.length
        };
      });

      packagesCache = formattedData;
      setPackages(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return { packages, loading, error, refetch: () => fetchPackages(true) };
};
