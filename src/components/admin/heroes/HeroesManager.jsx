import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon, Eye } from 'lucide-react';
import Modal from '../../ui/Modal';
import ImageUploader from '../../ui/ImageUploader';
import AdminActionBar from '../../ui/AdminActionBar';
import AdminFormCard from '../../ui/AdminFormCard';
import AdminTable from '../../ui/AdminTable';
import { useHeroes } from '../../../hooks/useHeroes';

const HeroesManager = ({ token, API_BASE, SERVER_ORIGIN, showMessage, onUnauthorized }) => {
  const { heroes, loading, refetch: fetchData } = useHeroes({ onUnauthorized });
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', subtitle: '', order: '0'
  });

  const resetForm = () => {
    setForm({ title: '', subtitle: '', order: '0' });
    setExistingImageUrl(null);
    setSelectedFiles([]);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (item) => {
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      order: item.order !== undefined && item.order !== null ? String(item.order) : '0'
    });
    setExistingImageUrl(item.imageUrl || null);
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

  const handleDelete = async (id) => {
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menghapus data');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus data ini dari database?')) return;

    setActionLoading(true);
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
        if (editId === id) resetForm();
        fetchData();
      } else {
        showMessage('error', data.error || 'Gagal menghapus data');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat menghapus data');
    } finally {
      setActionLoading(false);
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

    const url = editId ? `${API_BASE}/heroes/${editId}` : `${API_BASE}/heroes`;
    const method = editId ? 'PUT' : 'POST';

    setActionLoading(true);
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
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { header: 'ID', key: 'id', className: 'font-mono font-bold text-slate-700' },
    { header: 'Preview', key: 'preview', render: (h) => (
      h.imageUrl ? (
        <img src={h.imageUrl} alt={h.title || 'hero'} className="w-16 h-10 object-cover rounded shadow-xs" />
      ) : (
        <span className="text-slate-400">No Image</span>
      )
    )},
    { header: 'Judul', key: 'title', className: 'font-bold text-slate-900', render: (h) => h.title || '-' },
    { header: 'Sub Judul', key: 'subtitle', className: 'text-slate-600', render: (h) => h.subtitle || '-' },
    { header: 'Urutan', key: 'order', className: 'font-bold' },
    { header: 'Aksi', key: 'action', headerClassName: 'text-right', className: 'text-right space-x-2', render: (h) => (
      <>
        <button
          type="button"
          onClick={() => setPreviewItem(h)}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => handleEditClick(h)}
          className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => handleDelete(h.id)}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </button>
      </>
    )}
  ];

  return (
    <div>
      <AdminActionBar 
        title="Gambar Laman Utama" 
        isAddMode={showAddForm && !editId} 
        onAddClick={() => {
          if (showAddForm && !editId) {
            resetForm();
          } else {
            setEditId(null);
            setForm({ title: '', subtitle: '', order: '0' });
            setExistingImageUrl(null);
            setSelectedFiles([]);
            setShowAddForm(true);
          }
        }} 
      />

      <AdminFormCard
        isOpen={showAddForm}
        title="Gambar Laman Utama"
        editId={editId}
        actionLoading={actionLoading}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        submitTextAdd="Simpan Hero Banner"
        submitTextEdit="Simpan Perubahan"
        gridCols="md:grid-cols-3"
      >
        <div>
          <label className="block font-bold mb-1">Judul Banner</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-bold mb-1">Sub Judul Banner</label>
          <input type="text" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-bold mb-1">Urutan (Angka, mis: 0, 1, 2)</label>
          <input type="number" value={form.order} onChange={e => setForm({...form, order: e.target.value})} className="w-full border p-2 rounded" />
        </div>

        {editId && existingImageUrl && (
          <div className="md:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
            <label className="block font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>Gambar Saat Ini di Database (Akan diganti jika Anda memilih foto baru di bawah):</span>
            </label>
            <div className="max-w-xs bg-white rounded-lg border border-slate-200 p-1.5 shadow-2xs">
              <img src={existingImageUrl} alt="existing hero" className="w-full h-32 object-cover rounded" />
            </div>
          </div>
        )}

        <div className="md:col-span-3 mt-2">
          <ImageUploader 
            editMode={!!editId}
            label={editId ? 'Upload Foto Baru (Opsional, untuk mengganti gambar hero di atas)*' : 'Upload Foto Hero Banner*'}
            onFilesSelected={(newFiles) => setSelectedFiles(prev => [...prev, ...newFiles])}
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
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover rounded mb-1.5" />
                    <div className="w-full flex items-center justify-between gap-1 px-1 mb-1">
                      <span className="truncate text-[10px] text-slate-600 font-medium" title={file.name}>{file.name}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveSelectedFile(idx)} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                      <span>Batal Unggah</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminFormCard>

      <AdminTable 
        loading={loading}
        data={heroes}
        columns={columns}
        emptyMessage="Belum ada data hero banner di database backend."
        editId={editId}
      />

      {/* Detail Modal Preview */}
      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)}>
        {previewItem && (
          <div className="relative w-full h-[450px] sm:h-[550px] flex items-center px-6 sm:px-12 overflow-hidden rounded-xl">
            <img
              src={previewItem.imageUrl}
              alt={previewItem.title || 'Desa Sibetan'}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B3461] via-[#1B3461]/70 to-transparent z-0"></div>

            <div className="relative z-10 max-w-2xl">
              <p className="font-jakarta text-xs sm:text-sm font-semibold tracking-wider text-gray-300 mb-2 uppercase">
                Selamat Datang Di
              </p>
              <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-white leading-tight mb-2">
                {previewItem.title || 'Desa Sibetan'}
              </h1>
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-white/90 mb-4">
                {previewItem.subtitle || 'Karangasem, Bali'}
              </h2>
              <p className="font-jakarta text-sm sm:text-base text-gray-300 leading-relaxed mb-6 max-w-xl">
                Desa penghasil salak terbaik di Bali, kaya akan tradisi Hindu, alam yang asri, dan keramahan warga yang tulus.
              </p>
              <div className="flex gap-3">
                <span className="bg-white text-[#1B3461] font-bold px-6 py-2.5 rounded-lg text-xs shadow-md">
                  Jelajahi Wisata
                </span>
                <span className="bg-white/10 border border-white/40 text-white font-bold px-6 py-2.5 rounded-lg text-xs backdrop-blur-sm">
                  Paket & Akomodasi
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HeroesManager;
