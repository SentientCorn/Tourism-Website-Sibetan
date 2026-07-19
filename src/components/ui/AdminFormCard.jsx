import React from 'react';

const AdminFormCard = ({
  isOpen,
  title,
  editId,
  actionLoading,
  onSubmit,
  onCancel,
  submitTextAdd = 'Simpan',
  submitTextEdit = 'Simpan Perubahan',
  gridCols = 'md:grid-cols-2',
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm mb-6 animate-fadeIn">
      <h3 className="font-bold text-sm text-[#1B3461] mb-4 border-b pb-2 flex items-center justify-between">
        <span>{editId ? `Form Edit ${title} (ID: ${editId})` : `Form Tambah ${title}`}</span>
        {editId && <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Mode Edit</span>}
      </h3>
      
      <form onSubmit={onSubmit} className={`grid grid-cols-1 ${gridCols} gap-4 text-xs`}>
        {children}

        {/* Note: In children, use col-span based on gridCols if needed */}
        {/* We use a full-width container for the buttons */}
        <div className={`col-span-1 ${gridCols === 'md:grid-cols-2' ? 'md:col-span-2' : gridCols === 'md:grid-cols-3' ? 'md:col-span-3' : 'md:col-span-1'} flex justify-end gap-2 mt-3 pt-2 border-t border-slate-100`}>
          <button 
            type="button" 
            disabled={actionLoading} 
            onClick={onCancel} 
            className="px-4 py-2 border hover:bg-slate-50 transition-colors rounded font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={actionLoading} 
            className="px-4 py-2 bg-[#1B3461] hover:bg-blue-900 transition-colors text-white rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px] cursor-pointer"
          >
            {actionLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              editId ? submitTextEdit : submitTextAdd
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFormCard;
