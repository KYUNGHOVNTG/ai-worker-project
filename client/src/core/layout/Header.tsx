/**
 * Header Component
 *
 * 상단 네비게이션 헤더
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 shrink-0">
      <Link to="/" className="flex items-center gap-2 font-bold text-slate-800 hover:text-indigo-600 transition-colors">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="text-white w-4 h-4" fill="currentColor" />
        </div>
        Vibe Web Starter
      </Link>
    </header>
  );
};
