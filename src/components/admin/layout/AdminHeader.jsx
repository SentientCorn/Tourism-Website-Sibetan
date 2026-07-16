import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';

const AdminHeader = ({ username, API_BASE, onLogout }) => {
  return (
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
              onClick={onLogout}
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
  );
};

export default AdminHeader;
