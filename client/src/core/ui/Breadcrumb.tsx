import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { create } from 'zustand';

/* ─── Types ─── */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/* ─── Zustand Store (MainLayout 연동용) ─── */

interface BreadcrumbState {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  clear: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  clear: () => set({ items: [] }),
}));

/* ─── Hook ─── */

export function useBreadcrumb() {
  const setItems = useBreadcrumbStore((s) => s.setItems);
  const clear = useBreadcrumbStore((s) => s.clear);
  return { setBreadcrumb: setItems, clearBreadcrumb: clear };
}

/* ─── Component ─── */

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className={`flex items-center gap-1 text-sm ${className ?? ''}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight
                size={14}
                className="shrink-0 text-slate-400"
                aria-hidden="true"
              />
            )}

            {isLast || !item.href ? (
              <span
                className={
                  isLast
                    ? 'font-medium text-slate-900'
                    : 'text-slate-500'
                }
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-slate-500 transition-colors hover:text-slate-700"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
