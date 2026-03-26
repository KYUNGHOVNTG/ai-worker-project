import React from 'react';

/* ─── 기본 Skeleton 블록 ─── */

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  className = '',
  rounded = 'lg',
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={['animate-pulse bg-slate-200', `rounded-${rounded}`, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    />
  );
};

/* ─── 텍스트 여러 줄 ─── */

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={['flex flex-col gap-2.5', className].filter(Boolean).join(' ')}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-slate-200 rounded-lg"
          style={{
            height: '14px',
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

/* ─── 카드 형태 ─── */

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div
      className={[
        'bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="animate-pulse bg-slate-200 rounded-full w-10 h-10" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="animate-pulse bg-slate-200 rounded-lg h-4 w-1/3" />
          <div className="animate-pulse bg-slate-200 rounded-lg h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

/* ─── DataTable 형태 ─── */

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div
      className={[
        'bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-4 px-6 py-3.5 border-b border-slate-100">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-slate-200 rounded-lg h-4 flex-1"
          />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={[
            'flex items-center gap-4 px-6 py-4',
            rowIdx < rows - 1 ? 'border-b border-slate-100' : '',
          ].join(' ')}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="animate-pulse bg-slate-100 rounded-lg h-4 flex-1"
              style={{
                maxWidth: colIdx === 0 ? '40%' : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/* ─── StatCard 형태 ─── */

interface SkeletonStatCardProps {
  className?: string;
}

export const SkeletonStatCard: React.FC<SkeletonStatCardProps> = ({
  className = '',
}) => {
  return (
    <div
      className={[
        'bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="animate-pulse bg-slate-200 rounded-lg h-4 w-20" />
        <div className="animate-pulse bg-slate-100 rounded-xl w-9 h-9" />
      </div>
      <div className="animate-pulse bg-slate-200 rounded-lg h-8 w-24 mb-3" />
      <div className="flex items-center gap-2">
        <div className="animate-pulse bg-slate-100 rounded-md h-5 w-12" />
        <div className="animate-pulse bg-slate-100 rounded-lg h-3 w-16" />
      </div>
    </div>
  );
};
