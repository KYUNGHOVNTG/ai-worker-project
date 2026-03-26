import { ReactNode } from 'react';

export interface TabItem {
  key: string;
  label: string;
  badge?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
  children: ReactNode;
  contentClassName?: string;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  children,
  contentClassName = 'p-6',
  className = '',
}: TabsProps) {
  return (
    <div
      className={[
        'bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]',
        className,
      ].join(' ')}
    >
      <div className="border-b border-slate-200 px-6 pt-2">
        <nav className="-mb-px flex gap-1" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.key)}
                className={[
                  'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand-700'
                    : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                {tab.label}
                {tab.badge}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={contentClassName}>{children}</div>
    </div>
  );
}
