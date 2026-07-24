import React from 'react';
import { Plus } from 'lucide-react';

const AdminActionBar = ({ title, isAddMode, onAddClick }) => {
  return (
    <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
      <div>
        <h2 className="font-poppins font-bold text-base text-slate-900">
          {title}
        </h2>
      </div>
      
      <button
        type="button"
        onClick={onAddClick}
        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
          isAddMode
            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
            : 'bg-[#1B3461] hover:bg-[#1B3461]/90 text-white shadow-xs'
        }`}
      >
        <Plus className={`w-4 h-4 transition-transform duration-300 ${isAddMode ? 'rotate-45' : 'rotate-0'}`} />
        <span>{isAddMode ? 'Tutup Form' : 'Tambah Data Baru'}</span>
      </button>
    </div>
  );
};

export default AdminActionBar;
