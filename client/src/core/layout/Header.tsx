/**
 * Header Component
 *
 * 상단 네비게이션 헤더
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 shrink-0">
      <Link to="/" className="flex items-center gap-2 font-bold text-slate-800 hover:text-indigo-600 transition-colors">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="text-white w-4 h-4" fill="currentColor" />
        </div>
        Vibe Web Starter
      </Link>

      <div className="ml-auto flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-slate-500">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <LogIn size={16} />
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};
