import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, Zap, ArrowRight, BarChart3, Database, Book, FileCode, Layout, BookOpen, Layers, Code } from 'lucide-react';
import { LoadingOverlay } from './core/loading';
import { DocumentViewer } from './components/DocumentViewer';

interface DocumentConfig {
  title: string;
  filePath: string;
}

function App() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [documentViewer, setDocumentViewer] = useState<{
    isOpen: boolean;
    title: string;
    filePath: string;
  }>({
    isOpen: false,
    title: '',
    filePath: '',
  });

  const documents: Record<string, DocumentConfig> = {
    architecture: { title: '아키텍처', filePath: '/ARCHITECTURE.md' },
    serverDocs: { title: '서버 문서', filePath: '/server/README.md' },
    clientDocs: { title: '클라이언트 문서', filePath: '/client/README.md' },
    devGuide: { title: '개발 가이드', filePath: '/DEVELOPMENT_GUIDE.md' },
  };

  const openDocument = (key: keyof typeof documents) => {
    const doc = documents[key];
    setDocumentViewer({
      isOpen: true,
      title: doc.title,
      filePath: doc.filePath,
    });
  };

  const closeDocument = () => {
    setDocumentViewer({
      isOpen: false,
      title: '',
      filePath: '',
    });
  };

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

      {/* 문서 뷰어 */}
      <DocumentViewer
        isOpen={documentViewer.isOpen}
        onClose={closeDocument}
        title={documentViewer.title}
        filePath={documentViewer.filePath}
      />

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
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => openDocument('architecture')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <Layout size={16} />
              아키텍처
            </button>
            <button onClick={() => openDocument('serverDocs')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <FileCode size={16} />
              서버 문서
            </button>
            <button onClick={() => openDocument('clientDocs')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <Book size={16} />
              클라이언트 문서
            </button>
            <button onClick={() => openDocument('devGuide')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <BookOpen size={16} />
              개발 가이드
            </button>
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
          <span>New: 바이브코딩 환경 2026</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
          바이브코딩 웹 템플릿, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">누구나 쉽게 1분만에 시작</span>
        </h1>

        <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-12">
          AI 바이브코딩 환경 웹 서비스 템플릿. 유지보수성 최우선 및 모듈화를 핵심 가치로 하는 바이브 코딩(Vibe Coding) 환경을 제공합니다.
        </p>

        {/* 기술 스택 배지 */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <div className="px-5 py-2.5 bg-slate-800 text-slate-100 font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all">
            FastAPI
          </div>
          <div className="px-5 py-2.5 bg-slate-700 text-slate-100 font-bold rounded-xl border border-slate-600 hover:bg-slate-600 transition-all">
            SQLAlchemy 2.0
          </div>
          <div className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl border border-indigo-500 hover:bg-indigo-500 transition-all">
            React 19
          </div>
          <div className="px-5 py-2.5 bg-violet-600 text-white font-bold rounded-xl border border-violet-500 hover:bg-violet-500 transition-all">
            Tailwind 4
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group">
            프로젝트 시작하기
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 text-lg font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
            문서 살펴보기
          </button>
        </div>
      </section>

      {/* 3. Feature Cards - 글래스모피즘 */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] hover:bg-white/80 transition-all hover:-translate-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">도메인 플러그인 구조</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              새로운 비즈니스 도메인을 독립적으로 추가 가능. 각 도메인은 자체 완결적이며 충돌을 최소화합니다.
            </p>
          </div>

          <div className="group p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] hover:bg-white/80 transition-all hover:-translate-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">계층화된 아키텍처</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Router-Service-Provider-Calculator-Formatter 구조로 명확한 책임 분리와 테스트 용이성을 보장합니다.
            </p>
          </div>

          <div className="group p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] hover:bg-white/80 transition-all hover:-translate-y-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">타입 안전성 & 비동기 최적화</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Pydantic v2, SQLAlchemy 2.0, TypeScript로 런타임 에러 최소화. async/await로 높은 처리량 보장.
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