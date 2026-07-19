import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

export const usePackages = (options = {}) => {
  const { onUnauthorized } = options;
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tour-packages`);
      if (response.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch packages');
      const data = await response.json();
      
      const formattedData = data.map(pkg => ({
        ...pkg,
        price: pkg.price,
        features: Array.isArray(pkg.facilities) ? pkg.facilities : (pkg.facilities ? pkg.facilities.split('\n') : []),
        originalImages: pkg.images ? pkg.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
        images: pkg.images ? pkg.images.map(img => formatImagePath(img.imageUrl || img)) : [],
        image: pkg.images && pkg.images.length > 0 ? formatImagePath(pkg.images[0].imageUrl || pkg.images[0]) : formatImagePath(null)
      }));

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

  return { packages, loading, error, refetch: fetchPackages };
};
