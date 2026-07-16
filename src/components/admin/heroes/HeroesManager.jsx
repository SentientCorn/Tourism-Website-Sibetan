import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const HeroesManager = ({ token, API_BASE, SERVER_ORIGIN, showMessage, onUnauthorized }) => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: '', subtitle: '', order: '0', images: null
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/heroes`);
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setHeroes(data);
    } catch (err) {
      showMessage('error', 'Gagal mengambil data hero banner dari server');
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
      const res = await fetch(`${API_BASE}/heroes/${id}`, {
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
      const res = await fetch(`${API_BASE}/heroes`, {
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
        setForm({ title: '', subtitle: '', order: '0', images: null });
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
            Gambar Laman Utama
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
            Form Tambah Gambar Laman Utama (Hero Banner)
          </h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Title (Judul Banner)</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Subtitle (Sub-judul Banner)</label>
              <input type="text" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Order (Urutan Angka, mis: 0, 1, 2)</label>
              <input type="number" value={form.order} onChange={e => setForm({...form, order: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-3">
              <label className="block font-bold mb-1">Upload Foto Hero Banner*</label>
              <input type="file" multiple accept="image/*" required onChange={e => setForm({...form, images: e.target.files})} className="w-full border p-1.5 rounded bg-slate-50" />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded font-semibold text-slate-600">Batal</button>
              <button type="submit" className="px-4 py-2 bg-[#1B3461] text-white rounded font-bold">Simpan Hero Banner</button>
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
                          onClick={() => handleDelete(h.id)}
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

export default HeroesManager;
