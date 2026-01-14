/**
 * Sidebar Component (Skeleton)
 *
 * 사이드바 네비게이션
 *
 * @example
 * <Sidebar isOpen={isOpen} onClose={handleClose} />
 */

import React from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose: _onClose }) => {
  // TODO: 메뉴 아이템 리스트
  // TODO: 활성 메뉴 하이라이트
  // TODO: 접기/펼치기 기능
  // TODO: 서브메뉴 지원
  // TODO: 모바일에서 오버레이 사이드바

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <nav className="sidebar-nav">
        {/* Navigation Menu Items */}
        <ul>
          <li>Dashboard</li>
          <li>Analytics</li>
          <li>Settings</li>
        </ul>
      </nav>
    </aside>
  );
};
