/**
 * Sidebar Component
 *
 * 사이드바 네비게이션
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/', label: '홈', icon: LayoutDashboard, exact: true },
  { to: '/sample', label: 'Sample CRUD', icon: Database, exact: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  if (!isOpen) return null;

  return (
    <aside className="w-56 border-r border-slate-200 bg-white shrink-0 flex flex-col">
      <nav className="p-3 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              [
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
              ].join(' ')
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
