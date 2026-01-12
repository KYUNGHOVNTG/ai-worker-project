/**
 * MainLayout Component (Skeleton)
 *
 * 메인 레이아웃 - Header, Sidebar, Content 영역 구성
 *
 * @example
 * <MainLayout>
 *   <YourPageComponent />
 * </MainLayout>
 */

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // TODO: 반응형 레이아웃
  // TODO: 사이드바 토글 상태 관리
  // TODO: 모바일 뷰 최적화

  return (
    <div className="layout">
      <Header />

      <div className="layout-container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
};
