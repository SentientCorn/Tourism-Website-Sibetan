// src/services/api.js
export const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';
export const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

// Helper to format image paths properly with SERVER_ORIGIN
export const formatImagePath = (path) => {
  if (!path) return 'https://via.placeholder.com/800x400?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${SERVER_ORIGIN}/${path.replace(/^\//, '')}`;
};
