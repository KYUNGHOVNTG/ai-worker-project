/**
 * Core Module
 *
 * 프로젝트의 핵심 기능과 공통 모듈
 * 이 모듈은 프로젝트 전체에서 사용되며, 변경 시 신중해야 합니다.
 */

// API
export { apiClient } from './api';
export type { ApiResponse, PaginatedResponse, ApiError } from './api';

// Store
export { useAuthStore } from './store';

// Hooks
export { useApi, useDebounce } from './hooks';

// UI Components
export { Button, Card, CardHeader, CardBody, CardFooter, Input, Modal } from './ui';

// Layout Components
export { Header, Sidebar, MainLayout } from './layout';

// Error Handling
export { ErrorBoundary, ApiErrorHandler } from './errors';
export type { ApiErrorData } from './errors';

// Loading Management
export { LoadingOverlay, LoadingManager } from './loading';
