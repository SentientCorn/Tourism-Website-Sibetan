import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Sparkles, 
  Package, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ExternalLink, 
  RefreshCw,
  Lock,
  LogOut,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('destinations');
  
  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username') || '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Data states from controllers
  const [destinations, setDestinations] = useState([]);
  const [cultures, setCultures] = useState([]);
  const [tourPackages, setTourPackages] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Form states for creating new items
  const [showAddForm, setShowAddForm] = useState(false);
  const [destinationForm, setDestinationForm] = useState({
    title: '', address: '', mapsSource: '', openHours: '', description: '', tips: '', images: null
  });
  const [cultureForm, setCultureForm] = useState({
    title: '', tag: '', description: '', images: null
  });
  const [packageForm, setPackageForm] = useState({
    title: '', price: '', duration: '', description: '', facilities: '', capacity: '', contactName: '', contactPhone: '', contactNote: '', images: null
  });
  const [heroForm, setHeroForm] = useState({
    title: '', subtitle: '', order: '0', images: null
  });

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Login failed');
        return;
      }
      setToken(data.token);
      setUsername(data.admin?.username || loginForm.username);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.admin?.username || loginForm.username);
      setLoginForm({ username: '', password: '' });
      showMessage('success', 'Login berhasil! Anda dapat memodifikasi data.');
    } catch (err) {
      setAuthError(`Gagal terhubung ke backend server (${API_BASE})`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {}
    setToken('');
    setUsername('');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    showMessage('success', 'Logout berhasil');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Fetch data from backend controllers
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'destinations') {
        const res = await fetch(`${API_BASE}/destinations`);
        const data = await res.json();
        if (Array.isArray(data)) setDestinations(data);
      } else if (activeTab === 'cultures') {
        const res = await fetch(`${API_BASE}/cultures`);
        const data = await res.json();
        if (Array.isArray(data)) setCultures(data);
      } else if (activeTab === 'packages') {
        const res = await fetch(`${API_BASE}/tour-packages`);
        const data = await res.json();
        if (Array.isArray(data)) setTourPackages(data);
      } else if (activeTab === 'heroes') {
        const res = await fetch(`${API_BASE}/heroes`);
        const data = await res.json();
        if (Array.isArray(data)) setHeroes(data);
      }
    } catch (err) {
      showMessage('error', 'Gagal mengambil data dari server backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setShowAddForm(false);
  }, [activeTab]);

  // Handle Delete
  const handleDelete = async (endpoint, id) => {
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menghapus data');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus data ini dari database?')) return;

    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        setToken('');
        setUsername('');
        setAuthError('Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
        return;
      }
      const data = await res.json();
      if (res.ok) {
        showMessage('success', data.message || 'Data berhasil dihapus');
        fetchData();
      } else {
        showMessage('error', data.error || 'Gagal menghapus data');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat menghapus data');
    }
  };

  // Handle Create Form Submissions
  const handleCreateSubmit = async (e, endpoint, formDataObj) => {
    e.preventDefault();
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menambah data');
      return;
    }

    const payload = new FormData();
    Object.keys(formDataObj).forEach(key => {
      if (key === 'images' && formDataObj[key]) {
        for (let i = 0; i < formDataObj[key].length; i++) {
          payload.append('images', formDataObj[key][i]);
        }
      } else if (formDataObj[key] !== null && formDataObj[key] !== '') {
        payload.append(key, formDataObj[key]);
      }
    });

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: payload
      });
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        setToken('');
        setUsername('');
        setAuthError('Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
        return;
      }
      const data = await res.json();
      if (res.ok) {
        showMessage('success', data.message || 'Data baru berhasil ditambahkan');
        setShowAddForm(false);
        fetchData();
        // Reset form
        if (endpoint === 'destinations') setDestinationForm({ title: '', address: '', mapsSource: '', openHours: '', description: '', tips: '', images: null });
        if (endpoint === 'cultures') setCultureForm({ title: '', tag: '', description: '', images: null });
        if (endpoint === 'tour-packages') setPackageForm({ title: '', price: '', duration: '', description: '', facilities: '', capacity: '', contactName: '', contactPhone: '', contactNote: '', images: null });
        if (endpoint === 'heroes') setHeroForm({ title: '', subtitle: '', order: '0', images: null });
      } else {
        showMessage('error', data.error || 'Gagal menambahkan data');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat mengirim data');
    }
  };

  const tabs = [
    { id: 'destinations', label: 'Destinasi Wisata', icon: MapPin },
    { id: 'cultures', label: 'Kesenian & Adat', icon: Sparkles },
    { id: 'packages', label: 'Paket Wisata & Akomodasi', icon: Package },
    { id: 'heroes', label: 'Gambar Laman Utama', icon: ImageIcon },
  ];

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-jakarta text-slate-800">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#1B3461]/10 text-[#1B3461] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-poppins font-bold text-xl text-[#1B3461]">
              Masuk ke Dasbor Admin
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Silakan masuk dengan akun pengelola untuk memodifikasi data.
            </p>
          </div>

          {authError && (
            <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                placeholder="Masukkan username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1B3461] focus:ring-4 focus:ring-[#1B3461]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Masukkan password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1B3461] focus:ring-4 focus:ring-[#1B3461]/10 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1B3461] hover:bg-blue-900 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-[#1B3461] inline-flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-jakarta text-slate-800 pb-12">
      
      {/* Header Bar */}
      <header className="bg-[#1B3461] text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-poppins font-bold text-lg tracking-wider">
              DASBOR ADMIN DESA SIBETAN
            </h1>
            <span className="text-xs bg-blue-500/30 px-2 py-0.5 rounded border border-blue-400/30">
              API: {API_BASE}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/20 text-sm">
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Admin: {username}
              </span>
              <button 
                onClick={handleLogout}
                className="text-white/80 hover:text-white text-xs bg-rose-600/80 hover:bg-rose-600 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>

            <Link
              to="/"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Kembali ke Website
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 mt-6">
        
        {/* Error/Status Notifications */}
        {authError && (
          <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
        {message && (
          <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 border ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-300 pb-3 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold text-sm transition-all ${
                  isActive 
                    ? 'bg-white text-[#1B3461] border-t-2 border-l border-r border-[#1B3461] shadow-xs' 
                    : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button 
            onClick={fetchData} 
            title="Reload Data"
            className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Section Action Bar */}
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="font-poppins font-bold text-base text-slate-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          
          <button
            onClick={() => {
              if (!token) {
                showMessage('error', 'Silakan login terlebih dahulu menggunakan form di pojok kanan atas');
                return;
              }
              setShowAddForm(!showAddForm);
            }}
            className="bg-[#1B3461] hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Form' : 'Tambah Data Baru'}</span>
          </button>
        </div>

        {/* Add Form Section */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm mb-6 animate-fadeIn">
            <h3 className="font-bold text-sm text-[#1B3461] mb-4 border-b pb-2">
              Form Tambah {tabs.find(t => t.id === activeTab)?.label}
            </h3>

            {/* Form Destinations */}
            {activeTab === 'destinations' && (
              <form onSubmit={(e) => handleCreateSubmit(e, 'destinations', destinationForm)} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Title (Nama Wisata)*</label>
                  <input type="text" required value={destinationForm.title} onChange={e => setDestinationForm({...destinationForm, title: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Address (Alamat)*</label>
                  <input type="text" required value={destinationForm.address} onChange={e => setDestinationForm({...destinationForm, address: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Maps Source (URL Google Maps)*</label>
                  <input type="text" required value={destinationForm.mapsSource} onChange={e => setDestinationForm({...destinationForm, mapsSource: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Open Hours (Jam Buka)*</label>
                  <input type="text" required value={destinationForm.openHours} onChange={e => setDestinationForm({...destinationForm, openHours: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Description (Deskripsi Lengkap)*</label>
                  <textarea required rows={3} value={destinationForm.description} onChange={e => setDestinationForm({...destinationForm, description: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Tips Wisatawan*</label>
                  <textarea required rows={2} value={destinationForm.tips} onChange={e => setDestinationForm({...destinationForm, tips: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Upload Foto Destinasi (Multiple)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setDestinationForm({...destinationForm, images: e.target.files})} className="w-full border p-1.5 rounded bg-slate-50" />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded font-semibold text-slate-600">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-[#1B3461] text-white rounded font-bold">Simpan Destinasi</button>
                </div>
              </form>
            )}

            {/* Form Cultures */}
            {activeTab === 'cultures' && (
              <form onSubmit={(e) => handleCreateSubmit(e, 'cultures', cultureForm)} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Title (Nama Kesenian/Adat)*</label>
                  <input type="text" required value={cultureForm.title} onChange={e => setCultureForm({...cultureForm, title: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tag (mis. Tari, Musik, Tradisi)*</label>
                  <input type="text" required value={cultureForm.tag} onChange={e => setCultureForm({...cultureForm, tag: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Description (Deskripsi)*</label>
                  <textarea required rows={3} value={cultureForm.description} onChange={e => setCultureForm({...cultureForm, description: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Upload Foto Budaya (Multiple)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setCultureForm({...cultureForm, images: e.target.files})} className="w-full border p-1.5 rounded bg-slate-50" />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded font-semibold text-slate-600">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-[#1B3461] text-white rounded font-bold">Simpan Budaya</button>
                </div>
              </form>
            )}

            {/* Form Tour Packages */}
            {activeTab === 'packages' && (
              <form onSubmit={(e) => handleCreateSubmit(e, 'tour-packages', packageForm)} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Title (Nama Paket)*</label>
                  <input type="text" required value={packageForm.title} onChange={e => setPackageForm({...packageForm, title: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Price (Harga Angka, mis: 250000)*</label>
                  <input type="number" required value={packageForm.price} onChange={e => setPackageForm({...packageForm, price: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Duration (mis: 1 Hari / 2 Hari)*</label>
                  <input type="text" required value={packageForm.duration} onChange={e => setPackageForm({...packageForm, duration: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-3">
                  <label className="block font-bold mb-1">Description (Deskripsi)*</label>
                  <textarea required rows={2} value={packageForm.description} onChange={e => setPackageForm({...packageForm, description: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Facilities (Fasilitas, pisahkan koma)*</label>
                  <input type="text" required value={packageForm.facilities} onChange={e => setPackageForm({...packageForm, facilities: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Capacity (mis: 2-10 Orang)</label>
                  <input type="text" value={packageForm.capacity} onChange={e => setPackageForm({...packageForm, capacity: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Contact Name (Nama Kontak)</label>
                  <input type="text" value={packageForm.contactName} onChange={e => setPackageForm({...packageForm, contactName: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Contact Phone (No WhatsApp)</label>
                  <input type="text" value={packageForm.contactPhone} onChange={e => setPackageForm({...packageForm, contactPhone: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Contact Note (Catatan Kontak)</label>
                  <input type="text" value={packageForm.contactNote} onChange={e => setPackageForm({...packageForm, contactNote: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-3">
                  <label className="block font-bold mb-1">Upload Foto Paket (Multiple)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setPackageForm({...packageForm, images: e.target.files})} className="w-full border p-1.5 rounded bg-slate-50" />
                </div>
                <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded font-semibold text-slate-600">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-[#1B3461] text-white rounded font-bold">Simpan Paket</button>
                </div>
              </form>
            )}

            {/* Form Heroes */}
            {activeTab === 'heroes' && (
              <form onSubmit={(e) => handleCreateSubmit(e, 'heroes', heroForm)} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Title (Judul Banner)</label>
                  <input type="text" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Subtitle (Sub-judul Banner)</label>
                  <input type="text" value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Order (Urutan Angka, mis: 0, 1, 2)</label>
                  <input type="number" value={heroForm.order} onChange={e => setHeroForm({...heroForm, order: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div className="md:col-span-3">
                  <label className="block font-bold mb-1">Upload Foto Hero Banner*</label>
                  <input type="file" multiple accept="image/*" required onChange={e => setHeroForm({...heroForm, images: e.target.files})} className="w-full border p-1.5 rounded bg-slate-50" />
                </div>
                <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded font-semibold text-slate-600">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-[#1B3461] text-white rounded font-bold">Simpan Hero Banner</button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* Data Table / List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium text-sm">
              Memuat data dari backend...
            </div>
          ) : (
            <>
              {/* Table Destinations */}
              {activeTab === 'destinations' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Judul</th>
                        <th className="p-3.5">Alamat</th>
                        <th className="p-3.5">Jam Buka</th>
                        <th className="p-3.5">Gambar</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {destinations.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-400">Belum ada data destinasi di database backend.</td></tr>
                      ) : (
                        destinations.map(d => (
                          <tr key={d.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-mono font-bold text-slate-700">{d.id}</td>
                            <td className="p-3.5 font-bold text-slate-900">{d.title}</td>
                            <td className="p-3.5 text-slate-600">{d.address}</td>
                            <td className="p-3.5 text-slate-600">{d.openHours}</td>
                            <td className="p-3.5 text-slate-600">{d.images?.length || 0} foto</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDelete('destinations', d.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Cultures */}
              {activeTab === 'cultures' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Judul</th>
                        <th className="p-3.5">Tag</th>
                        <th className="p-3.5">Deskripsi</th>
                        <th className="p-3.5">Gambar</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cultures.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-400">Belum ada data kebudayaan di database backend.</td></tr>
                      ) : (
                        cultures.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-mono font-bold text-slate-700">{c.id}</td>
                            <td className="p-3.5 font-bold text-slate-900">{c.title}</td>
                            <td className="p-3.5"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">{c.tag}</span></td>
                            <td className="p-3.5 text-slate-600 max-w-md truncate">{c.description}</td>
                            <td className="p-3.5 text-slate-600">{c.images?.length || 0} foto</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDelete('cultures', c.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Tour Packages */}
              {activeTab === 'packages' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Judul</th>
                        <th className="p-3.5">Harga</th>
                        <th className="p-3.5">Durasi</th>
                        <th className="p-3.5">Fasilitas</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tourPackages.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-400">Belum ada data paket wisata di database backend.</td></tr>
                      ) : (
                        tourPackages.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-mono font-bold text-slate-700">{p.id}</td>
                            <td className="p-3.5 font-bold text-slate-900">{p.title}</td>
                            <td className="p-3.5 text-emerald-600 font-bold">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                            <td className="p-3.5 text-slate-600">{p.duration}</td>
                            <td className="p-3.5 text-slate-600 max-w-xs truncate">{p.facilities}</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDelete('tour-packages', p.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Hero Banners */}
              {activeTab === 'heroes' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Preview</th>
                        <th className="p-3.5">Judul</th>
                        <th className="p-3.5">Sub Judul</th>
                        <th className="p-3.5">Urutan</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {heroes.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-400">Belum ada data hero banner di database backend.</td></tr>
                      ) : (
                        heroes.map(h => (
                          <tr key={h.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-mono font-bold text-slate-700">{h.id}</td>
                            <td className="p-3.5">
                              {h.imageUrl ? (
                                <img src={h.imageUrl.startsWith('http') ? h.imageUrl : `${SERVER_ORIGIN}/${h.imageUrl.replace(/^\//, '')}`} alt={h.title || 'hero'} className="w-16 h-10 object-cover rounded shadow-xs" />
                              ) : (
                                <span className="text-slate-400">No Image</span>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">{h.title || '-'}</td>
                            <td className="p-3.5 text-slate-600">{h.subtitle || '-'}</td>
                            <td className="p-3.5 font-bold">{h.order}</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDelete('heroes', h.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </>
          )}
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
