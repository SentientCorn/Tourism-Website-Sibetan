import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ExternalLink, User, ChevronDown } from 'lucide-react';

const AdminHeader = ({ username, API_BASE, onLogout, logoutLoading }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#1B3461] text-white px-6 py-4 shadow-md relative z-50">
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
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-colors font-jakarta text-sm font-semibold cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{username || 'Admin'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 animate-fadeIn z-50">
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Kembali ke Website
                </a>
                <button 
                  disabled={logoutLoading}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {logoutLoading ? (
                    <div className="w-4 h-4 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></div>
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  {logoutLoading ? 'Memproses...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
