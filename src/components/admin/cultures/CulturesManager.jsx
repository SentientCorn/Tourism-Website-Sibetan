import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';

const CulturesManager = ({ token, API_BASE, SERVER_ORIGIN, showMessage, onUnauthorized }) => {
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', tag: '', description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cultures`);
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setCultures(data);
    } catch (err) {
      showMessage('error', 'Gagal mengambil data kebudayaan dari server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ title: '', tag: '', description: '' });
    setExistingImages([]);
    setSelectedFiles([]);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (item) => {
    setForm({
      title: item.title || '',
      tag: item.tag || '',
      description: item.description || ''
    });
    setExistingImages(item.images || []);
    setSelectedFiles([]);
    setEditId(item.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveOldImage = async (imageId) => {
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus foto lama ini dari database?')) return;

    try {
      const res = await fetch(`${API_BASE}/cultures/images/${imageId}`, {
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
        showMessage('success', data.message || 'Foto berhasil dihapus');
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
        fetchData();
      } else {
        showMessage('error', data.error || 'Gagal menghapus foto');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat menghapus foto');
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menghapus data');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus data ini dari database?')) return;

    try {
      const res = await fetch(`${API_BASE}/cultures/${id}`, {
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
        if (editId === id) resetForm();
        fetchData();
      } else {
        showMessage('error', data.error || 'Gagal menghapus data');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat menghapus data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showMessage('error', `Silakan login terlebih dahulu untuk ${editId ? 'memperbarui' : 'menambah'} data`);
      return;
    }

    const payload = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== '') {
        payload.append(key, form[key]);
      }
    });
    selectedFiles.forEach(file => {
      payload.append('images', file);
    });

    const url = editId ? `${API_BASE}/cultures/${editId}` : `${API_BASE}/cultures`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
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
        showMessage('success', data.message || `Data berhasil ${editId ? 'diperbarui' : 'ditambahkan'}`);
        resetForm();
        fetchData();
      } else {
        showMessage('error', data.error || `Gagal ${editId ? 'memperbarui' : 'menambahkan'} data`);
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
            Kesenian & Adat
          </h2>
        </div>
        
        <button
          onClick={() => {
            if (showAddForm && !editId) {
              resetForm();
            } else {
              setEditId(null);
              setForm({ title: '', tag: '', description: '' });
              setExistingImages([]);
              setSelectedFiles([]);
              setShowAddForm(true);
            }
          }}
          className="bg-[#1B3461] hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm && !editId ? 'Tutup Form' : 'Tambah Data Baru'}</span>
        </button>
      </div>

      {/* Add / Edit Form Section */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm mb-6 animate-fadeIn">
          <h3 className="font-bold text-sm text-[#1B3461] mb-4 border-b pb-2 flex items-center justify-between">
            <span>{editId ? `Form Edit Kesenian & Adat (ID: ${editId})` : 'Form Tambah Kesenian & Adat'}</span>
            {editId && <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Mode Edit</span>}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Title (Nama Kesenian/Adat)*</label>
              <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Tag (mis. Tari, Musik, Tradisi)*</label>
              <input type="text" required value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold mb-1">Description (Deskripsi)*</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" />
            </div>

            {/* Existing Images section (Only in Edit Mode) */}
            {editId && existingImages.length > 0 && (
              <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                <label className="block font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span>Daftar Gambar Saat Ini di Database ({existingImages.length} foto):</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative bg-white rounded-lg border border-slate-200 p-1.5 shadow-2xs flex flex-col items-center">
                      <img
                        src={img.imageUrl.startsWith('http') ? img.imageUrl : `${SERVER_ORIGIN}/${img.imageUrl.replace(/^\//, '')}`}
                        alt="existing"
                        className="w-full h-24 object-cover rounded mb-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOldImage(img.id)}
                        className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus Foto Ini</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload & Preview List */}
            <div className="md:col-span-2 mt-2">
              <label className="block font-bold mb-1 text-slate-700">
                {editId ? 'Tambah Foto Baru (Akan ditambahkan ke daftar gambar di atas):' : 'Upload Foto Budaya (Multiple)*'}
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2 rounded-lg bg-slate-50 text-xs"
              />
              
              {selectedFiles.length > 0 && (
                <div className="mt-3 bg-blue-50/50 p-3 rounded-xl border border-blue-200">
                  <label className="block font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Daftar Foto Baru yang Dipilih ({selectedFiles.length} file siap diunggah):</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative bg-white rounded-lg border border-blue-200 p-1.5 shadow-2xs flex flex-col items-center">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded mb-1.5"
                        />
                        <div className="w-full flex items-center justify-between gap-1 px-1 mb-1">
                          <span className="truncate text-[10px] text-slate-600 font-medium" title={file.name}>{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedFile(idx)}
                          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Batal Unggah</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-3 pt-2 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded font-semibold text-slate-600">Batal</button>
              <button type="submit" className="px-4 py-2 bg-[#1B3461] text-white rounded font-bold">
                {editId ? 'Simpan Perubahan' : 'Simpan Budaya'}
              </button>
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
                    <tr key={c.id} className={`hover:bg-slate-50 ${editId === c.id ? 'bg-amber-50/60' : ''}`}>
                      <td className="p-3.5 font-mono font-bold text-slate-700">{c.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{c.title}</td>
                      <td className="p-3.5"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">{c.tag}</span></td>
                      <td className="p-3.5 text-slate-600 max-w-md truncate">{c.description}</td>
                      <td className="p-3.5 text-slate-600">{c.images?.length || 0} foto</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(c)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
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

export default CulturesManager;
