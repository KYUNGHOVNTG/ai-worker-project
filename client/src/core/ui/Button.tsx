/**
 * Button Component (Skeleton)
 *
 * 재사용 가능한 버튼 컴포넌트
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // TODO: variant, size에 따른 스타일 적용
  // TODO: isLoading 상태일 때 스피너 표시
  // TODO: Framer Motion 애니메이션 추가

  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
