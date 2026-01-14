/**
 * Error Fallback UI
 *
 * Error Boundary가 에러를 포착했을 때 보여주는 기본 UI입니다.
 * 최소한의 Skeleton 형태로 제공됩니다.
 *
 * 사용 가이드:
 *    ErrorBoundary 내부에서 자동으로 사용됩니다.
 *    직접 사용할 일은 거의 없지만, 테스트나 커스터마이징을 위해
 *    독립적으로 export 됩니다.
 *
 * 커스터마이징 가이드:
 *    도메인별로 다른 에러 UI가 필요하면
 *    이 컴포넌트를 복사하여 수정하고,
 *    ErrorBoundary의 fallback prop으로 전달하세요.
 */

import { type ErrorInfo } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

/**
 * ErrorFallback 컴포넌트
 *
 * 에러 발생 시 사용자에게 친화적인 메시지를 보여줍니다.
 */
export function ErrorFallback({ error, errorInfo, onReset }: Props) {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* 메인 메시지 */}
        <h1 className="text-3xl font-bold text-slate-900 text-center mb-3">
          앗! 문제가 발생했습니다
        </h1>
        <p className="text-slate-600 text-center mb-8">
          예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            다시 시도
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            홈으로 이동
          </button>
        </div>

        {/* 개발 환경에서만 표시되는 에러 상세 정보 */}
        {isDev && error && (
          <details className="mt-6 p-4 bg-slate-50 rounded-lg">
            <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
              🔧 개발자 정보 (프로덕션에서는 숨겨집니다)
            </summary>
            <div className="mt-3 space-y-3">
              {/* 에러 메시지 */}
              <div>
                <h3 className="font-mono text-sm text-red-600 font-bold">
                  Error:
                </h3>
                <pre className="mt-1 text-xs text-slate-700 overflow-x-auto bg-white p-3 rounded border border-slate-200">
                  {error.toString()}
                </pre>
              </div>

              {/* 스택 트레이스 */}
              {error.stack && (
                <div>
                  <h3 className="font-mono text-sm text-slate-700 font-bold">
                    Stack Trace:
                  </h3>
                  <pre className="mt-1 text-xs text-slate-600 overflow-x-auto bg-white p-3 rounded border border-slate-200 max-h-60">
                    {error.stack}
                  </pre>
                </div>
              )}

              {/* 컴포넌트 스택 */}
              {errorInfo?.componentStack && (
                <div>
                  <h3 className="font-mono text-sm text-slate-700 font-bold">
                    Component Stack:
                  </h3>
                  <pre className="mt-1 text-xs text-slate-600 overflow-x-auto bg-white p-3 rounded border border-slate-200 max-h-60">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* 고객 지원 안내 */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
          문제가 계속되면{' '}
          <a
            href="mailto:support@example.com"
            className="text-indigo-600 hover:underline font-medium"
          >
            고객 지원팀
          </a>
          에 문의해주세요.
        </div>
      </div>
    </div>
  );
}

/**
 * 사용 예시:
 *
 * 1. ErrorBoundary와 함께 (자동)
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * 2. 커스텀 Fallback으로 직접 사용
 * ```tsx
 * <ErrorBoundary
 *   fallback={
 *     <ErrorFallback
 *       error={error}
 *       errorInfo={errorInfo}
 *       onReset={() => window.location.reload()}
 *     />
 *   }
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */
