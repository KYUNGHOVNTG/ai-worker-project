/**
 * Protected Route
 *
 * 미인증 상태에서 접근 시 /login으로 리다이렉트합니다.
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/useAuthStore';

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
