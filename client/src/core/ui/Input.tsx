/**
 * Input Component (Skeleton)
 *
 * 재사용 가능한 인풋 컴포넌트
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error="Invalid email"
 * />
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  // TODO: 에러 상태 스타일링
  // TODO: 레이블, 헬퍼텍스트 스타일링

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && (
        <span className="input-error-text">{error}</span>
      )}
      {helperText && !error && (
        <span className="input-helper-text">{helperText}</span>
      )}
    </div>
  );
};
