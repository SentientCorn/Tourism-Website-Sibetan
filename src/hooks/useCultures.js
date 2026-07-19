import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

export const useCultures = (options = {}) => {
  const { onUnauthorized } = options;
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCultures = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cultures`);
      if (response.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch cultures');
      const data = await response.json();
      
      const formattedData = data.map(culture => ({
        ...culture,
        originalImages: culture.images ? culture.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
        images: culture.images ? culture.images.map(img => formatImagePath(img.imageUrl || img)) : [],
        image: culture.images && culture.images.length > 0 ? formatImagePath(culture.images[0].imageUrl || culture.images[0]) : formatImagePath(null)
      }));

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

  return { cultures, loading, error, refetch: fetchCultures };
};
