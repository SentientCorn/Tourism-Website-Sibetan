import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const DestinationsManager = ({ token, API_BASE, showMessage, onUnauthorized }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: '', address: '', mapsSource: '', openHours: '', description: '', tips: '', images: null
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/destinations`);
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setDestinations(data);
    } catch (err) {
      showMessage('error', 'Gagal mengambil data dari server backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menghapus data');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus data ini dari database?')) return;

    try {
      const res = await fetch(`${API_BASE}/destinations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      if (res.status === 401) {
        onUnauthorized();
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menambah data');
      return;
    }

    const payload = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'images' && form[key]) {
        for (let i = 0; i < form[key].length; i++) {
          payload.append('images', form[key][i]);
        }
      } else if (form[key] !== null && form[key] !== '') {
        payload.append(key, form[key]);
      }
    });

    try {
      const res = await fetch(`${API_BASE}/destinations`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: payload
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        showMessage('success', data.message || 'Data baru berhasil ditambahkan');
        setShowAddForm(false);
        fetchData();
        setForm({ title: '', address: '', mapsSource: '', openHours: '', description: '', tips: '', images: null });
      } else {
        showMessage('error', data.error || 'Gagal menambahkan data');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat mengirim data');
    }
  };

  return (
    <div>
      {/* Section Action Bar */}
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="font-poppins font-bold text-base text-slate-900">
            Destinasi Wisata
          </h2>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
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
            Form Tambah Destinasi Wisata
          </h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Title (Nama Wisata)*</label>
              <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Address (Alamat)*</label>
              <input type="text" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Maps Source (URL Google Maps)*</label>
              <input type="text" required value={form.mapsSource} onChange={e => setForm({...form, mapsSource: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Open Hours (Jam Buka)*</label>
              <input type="text" required value={form.openHours} onChange={e => setForm({...form, openHours: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold mb-1">Description (Deskripsi Lengkap)*</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold mb-1">Tips Wisatawan*</label>
              <textarea required rows={2} value={form.tips} onChange={e => setForm({...form, tips: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold mb-1">Upload Foto Destinasi (Multiple)</label>
              <input type="file" multiple accept="image/*" onChange={e => setForm({...form, images: e.target.files})} className="w-full border p-1.5 rounded bg-slate-50" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded font-semibold text-slate-600">Batal</button>
              <button type="submit" className="px-4 py-2 bg-[#1B3461] text-white rounded font-bold">Simpan Destinasi</button>
            </div>
          </form>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-medium text-sm">
            Memuat data dari backend...
          </div>
        ) : (
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
                          onClick={() => handleDelete(d.id)}
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
      </div>
    </div>
  );
};

export default DestinationsManager;
