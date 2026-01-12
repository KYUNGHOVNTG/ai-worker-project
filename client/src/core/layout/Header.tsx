/**
 * Header Component (Skeleton)
 *
 * 상단 네비게이션 헤더
 *
 * @example
 * <Header />
 */

import React from 'react';

export const Header: React.FC = () => {
  // TODO: 로고 추가
  // TODO: 네비게이션 메뉴
  // TODO: 사용자 프로필 드롭다운
  // TODO: 알림 아이콘
  // TODO: 테마 토글 (다크모드)

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          {/* Logo */}
          <h1>AI Dashboard</h1>
        </div>

        <nav className="header-nav">
          {/* Navigation Items */}
        </nav>

        <div className="header-actions">
          {/* User Actions */}
        </div>
      </div>
    </header>
  );
};
