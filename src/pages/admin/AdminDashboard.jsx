import React, { useState } from 'react';
import { MapPin, Sparkles, Package, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_BASE, SERVER_ORIGIN } from '../../services/api';
import AdminLogin from '../../components/admin/auth/AdminLogin';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import AdminTabs from '../../components/admin/layout/AdminTabs';
import DestinationsManager from '../../components/admin/destinations/DestinationsManager';
import CulturesManager from '../../components/admin/cultures/CulturesManager';
import PackagesManager from '../../components/admin/packages/PackagesManager';
import HeroesManager from '../../components/admin/heroes/HeroesManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('destinations');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username') || '');
  const [message, setMessage] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

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
    setLogoutLoading(true);
    showMessage('success', 'Memproses logout...');
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {}
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setToken('');
    setUsername('');
    setLogoutLoading(false);
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
      <div className="relative">
        {message && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 min-w-[300px]">
            <div className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 border shadow-lg ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}
        <AdminLogin 
          API_BASE={API_BASE} 
          onLoginSuccess={(newToken, newUsername) => {
            setToken(newToken);
            setUsername(newUsername);
            showMessage('success', 'Login berhasil! Anda dapat memodifikasi data.');
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-jakarta text-slate-800 pb-12">
      <AdminHeader 
        username={username} 
        API_BASE={API_BASE} 
        onLogout={handleLogout} 
        logoutLoading={logoutLoading}
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
