/**
 * Global Error Boundary (Class Component)
 *
 * React 애플리케이션 전체의 에러를 포착하고 처리합니다.
 * 모든 컴포넌트 트리의 최상단에 위치하여 예상치 못한 에러를 방지합니다.
 *
 * 사용 가이드:
 *    main.tsx에서 <App /> 컴포넌트를 감싸서 사용하세요.
 *
 *    <ErrorBoundary>
 *      <App />
 *    </ErrorBoundary>
 *
 * 확장 가이드:
 *    - componentDidCatch에서 에러 로깅 서비스 연동 (Sentry, LogRocket 등)
 *    - 에러 타입별로 다른 Fallback UI 제공
 *    - 에러 복구 시도 로직 추가
 *
 * 주의사항:
 *    Error Boundary는 다음 에러를 포착하지 못합니다:
 *    - 이벤트 핸들러 내부 에러 (try-catch 사용)
 *    - 비동기 코드 (setTimeout, Promise)
 *    - SSR 에러
 *    - Error Boundary 자체의 에러
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary 클래스 컴포넌트
 *
 * React 16+에서 제공하는 Error Boundary 기능을 구현합니다.
 * Class Component로만 구현 가능합니다.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * 에러 발생 시 상태 업데이트
   *
   * React가 렌더링 단계에서 에러를 포착하면 이 메서드를 호출합니다.
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    // 다음 렌더링에서 폴백 UI를 표시하도록 상태 업데이트
    return {
      hasError: true,
      error,
    };
  }

  /**
   * 에러 로깅 및 외부 서비스 연동
   *
   * 컴포넌트 트리 어딘가에서 에러가 발생하면 이 메서드가 호출됩니다.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 상세 정보 저장
    this.setState({
      error,
      errorInfo,
    });

    // TODO: 에러 로깅 서비스 연동
    // Example: Sentry
    // Sentry.captureException(error, { extra: errorInfo });

    // TODO: 에러 알림 서비스 연동
    // Example: Slack, Discord webhook
    // notifyErrorToSlack(error, errorInfo);

    // 개발 환경에서 콘솔에 에러 출력
    if (import.meta.env.DEV) {
      console.error('🚨 ErrorBoundary caught an error:');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  /**
   * 에러 상태 초기화
   *
   * 사용자가 "다시 시도" 버튼을 클릭하면 호출됩니다.
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 커스텀 Fallback UI가 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 Fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * 사용 예시:
 *
 * 1. 기본 사용 (main.tsx)
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * 2. 커스텀 Fallback UI
 * ```tsx
 * <ErrorBoundary
 *   fallback={<div>커스텀 에러 화면</div>}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * 3. 특정 영역에만 적용
 * ```tsx
 * <ErrorBoundary>
 *   <Dashboard />
 * </ErrorBoundary>
 * ```
 */
