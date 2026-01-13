import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, Zap, ArrowRight, BarChart3, Database } from 'lucide-react';
import { LoadingOverlay } from './core/loading';

function App() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    // 백엔드 연결 확인
    const checkConnection = async () => {
      try {
        await axios.get('http://localhost:8000/api/v1/health'); // 실제 API 경로에 맞춰 조정 필요
        setConnectionStatus('ok');
      } catch (err) {
        setConnectionStatus('error');
      }
    };
    checkConnection();
  }, []);

  return (
    <>
      {/* 전역 로딩 오버레이 */}
      <LoadingOverlay />

      <div className="min-h-screen bg-mesh selection:bg-indigo-100">
      {/* 1. 네비게이션 - 플로팅 스타일 */}
      <nav className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">AI-Worker</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">분석도구</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">데이터셋</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">보안</a>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              connectionStatus === 'ok' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                connectionStatus === 'ok' ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />
              Node: {connectionStatus === 'ok' ? 'Stable' : 'Offline'}
            </div>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95">
              시작하기
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - 와이드 & 클린 */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-8">
          <Activity size={16} />
          <span>New: 2026 AI 모델 업데이트 완료</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
          데이터 분석을 더 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">지능적이고 빠르게</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
          FastAPI의 고성능 서버와 Supabase의 강력한 보안 인프라를 하나로. 
          당신의 비즈니스 데이터를 AI가 즉시 통찰력 있는 정보로 전환합니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group">
            분석 프로젝트 생성
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 text-lg font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
            데모 체험하기
          </button>
        </div>
      </section>

      {/* 3. Feature Cards - 글래스모피즘 */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] hover:bg-white/80 transition-all hover:-translate-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">실시간 지능형 대시보드</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              데이터의 흐름을 초단위로 분석하여 그래프로 시각화합니다. 2026년형 예측 알고리즘이 탑재되었습니다.
            </p>
          </div>

          <div className="group p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] hover:bg-white/80 transition-all hover:-translate-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">금융급 엔터프라이즈 보안</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Supabase RLS와 고도화된 토큰 시스템을 통해 모든 데이터 접근 권한을 철저하게 관리합니다.
            </p>
          </div>

          <div className="group p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] hover:bg-white/80 transition-all hover:-translate-y-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Supabase 하이브리드 클라우드</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              클라우드의 유연함과 로컬의 속도를 동시에. 최적화된 PostgreSQL 연결을 보장합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm">
            © 2026 AI-Worker Project. All rights reserved.
          </div>
          <div className="flex gap-8 text-slate-400 text-sm font-medium">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Github</a>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

export default App;