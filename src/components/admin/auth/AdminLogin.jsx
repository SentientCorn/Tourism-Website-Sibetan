import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, AlertCircle, ExternalLink } from 'lucide-react';

const AdminLogin = ({ API_BASE, onLoginSuccess }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
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
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.admin?.username || loginForm.username);
      onLoginSuccess(data.token, data.admin?.username || loginForm.username);
    } catch (err) {
      setAuthError(`Gagal terhubung ke backend server (${API_BASE})`);
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading}
            className="w-full bg-[#1B3461] hover:bg-blue-900 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-[#1B3461] inline-flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
