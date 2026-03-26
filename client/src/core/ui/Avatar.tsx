import React, { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
  src?: string;
}

const COLOR_POOL = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-rose-100 text-rose-600',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-brand-100 text-brand-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getColorClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_POOL[Math.abs(hash) % COLOR_POOL.length];
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '', src }) => {
  const [imgError, setImgError] = useState(false);

  const initials = getInitials(name);
  const colorClass = getColorClass(name);
  const showImage = !!src && src.trim() !== '' && !imgError;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name}
        title={name}
        className={[
          'rounded-full object-cover shrink-0',
          sizeClasses[size],
          className,
        ].join(' ')}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={[
        'rounded-full flex items-center justify-center font-bold shrink-0',
        sizeClasses[size],
        colorClass,
        className,
      ].join(' ')}
      title={name}
    >
      {initials}
    </div>
  );
};
