import React, { useState } from 'react';
import { MapPin, Sparkles, Package, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import AdminLogin from '../../components/admin/auth/AdminLogin';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import AdminTabs from '../../components/admin/layout/AdminTabs';
import DestinationsManager from '../../components/admin/destinations/DestinationsManager';
import CulturesManager from '../../components/admin/cultures/CulturesManager';
import PackagesManager from '../../components/admin/packages/PackagesManager';
import HeroesManager from '../../components/admin/heroes/HeroesManager';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('destinations');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username') || '');
  const [message, setMessage] = useState(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setToken('');
    setUsername('');
    showMessage('error', 'Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {}
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setToken('');
    setUsername('');
    showMessage('success', 'Logout berhasil');
  };

  const tabs = [
    { id: 'destinations', label: 'Destinasi Wisata', icon: MapPin },
    { id: 'cultures', label: 'Kesenian & Adat', icon: Sparkles },
    { id: 'packages', label: 'Paket Wisata & Akomodasi', icon: Package },
    { id: 'heroes', label: 'Gambar Laman Utama', icon: ImageIcon },
  ];

  if (!token) {
    return (
      <AdminLogin 
        API_BASE={API_BASE} 
        onLoginSuccess={(newToken, newUsername) => {
          setToken(newToken);
          setUsername(newUsername);
          showMessage('success', 'Login berhasil! Anda dapat memodifikasi data.');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-jakarta text-slate-800 pb-12">
      <AdminHeader 
        username={username} 
        API_BASE={API_BASE} 
        onLogout={handleLogout} 
      />

      <main className="max-w-6xl mx-auto px-6 mt-6">
        {/* Status Notification */}
        {message && (
          <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 border ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <AdminTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onRefresh={() => setRefreshKey(k => k + 1)} 
        />

        {activeTab === 'destinations' && (
          <DestinationsManager 
            key={`destinations-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        )}

        {activeTab === 'cultures' && (
          <CulturesManager 
            key={`cultures-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        )}

        {activeTab === 'packages' && (
          <PackagesManager 
            key={`packages-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        )}

        {activeTab === 'heroes' && (
          <HeroesManager 
            key={`heroes-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
