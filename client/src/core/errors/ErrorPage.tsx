/**
 * Error Page
 *
 * 애플리케이션 런타임 에러 발생 시 표시되는 페이지입니다.
 * ErrorBoundary의 fallback으로도 사용할 수 있습니다.
 */

import { RefreshCw, Home } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

export function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          오류가 발생했습니다
        </h1>
        <p className="text-slate-500 mb-10">
          예상치 못한 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            새로고침
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
