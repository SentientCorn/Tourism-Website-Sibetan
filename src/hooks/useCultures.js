import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

let culturesCache = null;
let culturesPromise = null;

export const useCultures = (options = {}) => {
  const { onUnauthorized } = options;
  const [cultures, setCultures] = useState(culturesCache || []);
  const [loading, setLoading] = useState(!culturesCache);
  const [error, setError] = useState(null);

  const fetchCultures = async (force = false) => {
    if (!force && culturesCache) {
      setCultures(culturesCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (force || !culturesPromise) {
        culturesPromise = fetch(`${API_BASE}/cultures`)
          .then(async (response) => {
            if (response.status === 401 && onUnauthorized) {
              onUnauthorized();
              return null;
            }
            if (!response.ok) throw new Error('Failed to fetch cultures');
            return response.json();
          })
          .finally(() => {
            culturesPromise = null;
          });
      }

      const data = await culturesPromise;
      if (!data) return;

      const formattedData = data.map(culture => {
        const images = culture.images ? culture.images.map(img => formatImagePath(img.imageUrl || img)) : [];
        const image = images.length > 0 ? images[0] : formatImagePath(null);

        return {
          ...culture,
          originalImages: culture.images ? culture.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
          images: images.length > 0 ? images : [image],
          image: image,
          photoCount: images.length
        };
      });

      culturesCache = formattedData;
      setCultures(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCultures();
  }, []);

  return { cultures, loading, error, refetch: () => fetchCultures(true) };
};
