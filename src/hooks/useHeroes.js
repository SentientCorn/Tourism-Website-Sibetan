import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

export const useHeroes = (options = {}) => {
  const { onUnauthorized } = options;
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/heroes`);
      if (response.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch heroes');
      const data = await response.json();
      
      const sortedData = data.sort((a, b) => (a.order || 0) - (b.order || 0));

      const formattedData = sortedData.map(hero => ({
        ...hero,
        imageUrl: hero.imageUrl ? formatImagePath(hero.imageUrl) : null,
        originalImages: hero.images ? hero.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
        images: hero.images ? hero.images.map(img => formatImagePath(img.imageUrl || img)) : [],
        image: hero.images && hero.images.length > 0 ? formatImagePath(hero.images[0].imageUrl || hero.images[0]) : formatImagePath(null)
      }));

      setHeroes(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  return { heroes, loading, error, refetch: fetchHeroes };
};
