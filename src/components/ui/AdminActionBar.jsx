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
        onClick={onAddClick}
        className="bg-[#1B3461] hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>{isAddMode ? 'Tutup Form' : 'Tambah Data Baru'}</span>
      </button>
    </div>
  );
};

export default AdminActionBar;
