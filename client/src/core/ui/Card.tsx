/**
 * Card Component (Skeleton)
 *
 * 콘텐츠를 담는 카드 컴포넌트
 *
 * @example
 * <Card>
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content</CardBody>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  // TODO: TailwindCSS 스타일 적용
  // TODO: 그림자, 라운딩 등 디자인 적용

  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
};
