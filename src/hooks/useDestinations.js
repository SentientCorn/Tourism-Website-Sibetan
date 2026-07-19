import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

export const useDestinations = (options = {}) => {
  const { onUnauthorized } = options;
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/destinations`);
      if (response.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      
      const formattedData = data.map(dest => ({
        ...dest,
        location: dest.address || dest.location,
        time: dest.openHours || dest.time,
        fullDescription: dest.description,
        mapEmbedUrl: dest.mapsSource || dest.mapEmbedUrl,
        originalImages: dest.images ? dest.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
        images: dest.images ? dest.images.map(img => formatImagePath(img.imageUrl || img)) : [],
        image: dest.images && dest.images.length > 0 ? formatImagePath(dest.images[0].imageUrl || dest.images[0]) : formatImagePath(null)
      }));

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

  return { destinations, loading, error, refetch: fetchDestinations };
};
