/**
 * 404 Not Found Page
 *
 * 존재하지 않는 라우트에 접근했을 때 표시되는 페이지입니다.
 */

import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="text-8xl font-black text-indigo-200 mb-4">404</div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-slate-500 mb-10">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            이전 페이지
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
