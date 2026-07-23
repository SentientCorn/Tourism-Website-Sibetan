import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

let destinationsCache = null;
let destinationsPromise = null;

export const useDestinations = (options = {}) => {
  const { onUnauthorized } = options;
  const [destinations, setDestinations] = useState(destinationsCache || []);
  const [loading, setLoading] = useState(!destinationsCache);
  const [error, setError] = useState(null);

  const fetchDestinations = async (force = false) => {
    if (force) {
      destinationsCache = null;
    }

    if (!force && destinationsCache) {
      setDestinations(destinationsCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (force || !destinationsPromise) {
        destinationsPromise = fetch(`${API_BASE}/destinations`)
          .then(async (response) => {
            if (response.status === 401 && onUnauthorized) {
              onUnauthorized();
              return null;
            }
            if (!response.ok) throw new Error('Failed to fetch destinations');
            return response.json();
          })
          .finally(() => {
            destinationsPromise = null;
          });
      }

      const data = await destinationsPromise;
      if (!data) return;

      const getGoogleMapsEmbedUrl = (dest) => {
        let source = String(dest.mapsSource || dest.mapEmbedUrl || '').trim();

        const lat = dest.latitude !== null && dest.latitude !== undefined && dest.latitude !== '' ? Number(dest.latitude) : null;
        const lng = dest.longitude !== null && dest.longitude !== undefined && dest.longitude !== '' ? Number(dest.longitude) : null;

        // 1. HIGHEST PRIORITY: If lat & lng are set explicitly (e.g. via MapPicker)
        if (lat && lng && !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
          const label = encodeURIComponent(dest.title || 'Lokasi Wisata');
          return `https://maps.google.com/maps?q=${lat},${lng}(${label})&hl=id&z=16&output=embed`;
        }

        // 2. SECOND PRIORITY: If user pasted an <iframe> snippet
        if (source.includes('<iframe')) {
          const match = source.match(/src=["']([^"']+)["']/);
          if (match && match[1]) {
            return match[1];
          }
        }

        // 3. THIRD PRIORITY: If user provided a direct maps/embed URL
        if (source.includes('maps/embed')) {
          return source;
        }

        // 4. FOURTH PRIORITY: Extract lat/lng from a Google Maps share link
        if (source.includes('google.com/maps') || source.includes('maps.google')) {
          const atMatch = source.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
          if (atMatch) {
            const extractedLat = Number(atMatch[1]);
            const extractedLng = Number(atMatch[2]);
            const label = encodeURIComponent(dest.title || 'Lokasi Wisata');
            return `https://maps.google.com/maps?q=${extractedLat},${extractedLng}(${label})&hl=id&z=16&output=embed`;
          }
        }

        // 5. FALLBACK: Search string query based on title + address
        const searchString = [
          dest.title || '',
          dest.address || 'Desa Sibetan, Bebandem',
          'Karangasem, Bali'
        ].filter(Boolean).join(', ');

        return `https://maps.google.com/maps?q=${encodeURIComponent(searchString)}&hl=id&z=16&output=embed`;
      };

      const getGoogleMapsLink = (dest) => {
        let source = String(dest.mapsSource || dest.mapEmbedUrl || '').trim();

        if (source.startsWith('http') && !source.includes('output=embed') && !source.includes('<iframe')) {
          return source;
        }

        const lat = dest.latitude ? Number(dest.latitude) : null;
        const lng = dest.longitude ? Number(dest.longitude) : null;
        if (lat && lng && !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
          return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        }

        const searchQuery = [
          dest.title || '',
          dest.address || 'Desa Sibetan, Karangasem, Bali'
        ].filter(Boolean).join(', ');

        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
      };

      const formattedData = data.map(dest => {
        const images = dest.images ? dest.images.map(img => formatImagePath(img.imageUrl || img)) : [];
        const image = images.length > 0 ? images[0] : formatImagePath(null);

        return {
          ...dest,
          location: dest.address || dest.location || 'Desa Sibetan, Karangasem',
          time: dest.openHours || dest.time || 'Setiap Hari',
          description: dest.description || '-',
          fullDescription: dest.description || dest.fullDescription || '-',
          mapEmbedUrl: getGoogleMapsEmbedUrl(dest),
          mapLink: getGoogleMapsLink(dest),
          originalImages: dest.images ? dest.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
          images: images.length > 0 ? images : [image],
          image: image,
          photoCount: images.length
        };
      });

      destinationsCache = formattedData;
      setDestinations(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return { destinations, loading, error, refetch: () => fetchDestinations(true) };
};
