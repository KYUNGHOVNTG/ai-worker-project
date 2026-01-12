/**
 * App Component
 *
 * 애플리케이션의 루트 컴포넌트
 * 라우팅 및 전역 상태를 설정합니다.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SamplePage } from '@/domains/sample';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route - Redirect to Sample */}
        <Route path="/" element={<Navigate to="/sample" replace />} />

        {/* Sample Domain Routes */}
        <Route path="/sample" element={<SamplePage />} />

        {/* TODO: Add more domain routes here */}
        {/* <Route path="/your-domain" element={<YourDomainPage />} /> */}

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * 404 Not Found Page
 */
const NotFound: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go Home</a>
    </div>
  );
};

export default App;
