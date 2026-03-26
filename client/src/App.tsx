import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import {
  Activity, Zap, ArrowRight, Database, FileCode, BookOpen, Layers, Layout, Code,
  Terminal, Copy, Check, Bot, FileText, Bug, Search,
  Shield, TestTube, AlertTriangle, Palette, Sparkles,
} from 'lucide-react';
import { LoadingOverlay } from './core/loading';
import { DocumentViewer } from './components/DocumentViewer';
import { ToastContainer, ConfirmDialog } from './core/ui';
import { checkDatabaseConnection } from './domains/system/api';
import { toast } from './core/utils/toast';
import { SamplePage } from './domains/sample/pages/SamplePage';
import { DesignSystemPage } from './domains/design-system';
import { NotFoundPage } from './core/errors';
import { LoginPage } from './domains/auth/pages/LoginPage';
import { RegisterPage } from './domains/auth/pages/RegisterPage';
import { ProtectedRoute } from './domains/auth/components/ProtectedRoute';

interface DocumentConfig {
  title: string;
  filePath: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
      title="복사"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  );
}

function LandingPage() {
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
    overview: { title: '프로젝트 개요', filePath: '/README.md' },
    architecture: { title: '아키텍처 가이드', filePath: '/docs/guides/ARCHITECTURE_GUIDE.md' },
    devGuide: { title: '개발 가이드', filePath: '/docs/guides/DEVELOPMENT_GUIDE.md' },
  };

  const openDocument = (key: keyof typeof documents) => {
    const doc = documents[key];
    setDocumentViewer({ isOpen: true, title: doc.title, filePath: doc.filePath });
  };

  const closeDocument = () => {
    setDocumentViewer({ isOpen: false, title: '', filePath: '' });
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get('http://localhost:8000/api/v1/health');
        setConnectionStatus('ok');
      } catch {
        setConnectionStatus('error');
      }
    };
    checkConnection();
  }, []);

  const handleDBCheck = async () => {
    try {
      const result = await checkDatabaseConnection();
      toast.success(result.message);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'DB 연결 실패';
      toast.error(errorMessage);
    }
  };

  const skills = [
    { cmd: '/feature', label: '기능 추가', desc: '요구사항 정의 → 구현 로드맵 자동 생성', icon: <Sparkles size={18} />, color: 'from-violet-500 to-purple-600' },
    { cmd: '/execute', label: '로드맵 실행', desc: '로드맵 태스크를 순차 실행, 진행률 자동 추적', icon: <Terminal size={18} />, color: 'from-blue-500 to-cyan-500' },
    { cmd: '/fix', label: '버그 수정', desc: '증상 수집 → 원인 분석 → 수정 계획 → 자동 수정', icon: <Bug size={18} />, color: 'from-rose-500 to-orange-500' },
    { cmd: '/code-review', label: '코드 리뷰', desc: '변경 코드의 아키텍처·보안·성능 자동 검토', icon: <Search size={18} />, color: 'from-emerald-500 to-teal-500' },
    { cmd: '/make-doc', label: '문서 생성', desc: '로드맵, 테스트 시나리오, 가이드 자동 작성', icon: <FileText size={18} />, color: 'from-amber-500 to-yellow-500' },
  ];

  const builtInFeatures = [
    { icon: <Shield size={20} />, title: 'JWT 인증 시스템', desc: '회원가입·로그인·토큰 자동 갱신·보호 라우트까지 풀스택 구현', tag: 'Auth', color: 'bg-emerald-500' },
    { icon: <Activity size={20} />, title: 'CRUD REST API', desc: 'Swagger UI 자동 문서화, ApiResponse 표준 래퍼, 계층별 책임 분리', tag: 'API', color: 'bg-blue-500' },
    { icon: <Database size={20} />, title: 'DB 마이그레이션', desc: 'Alembic 자동 생성, SQLite↔PostgreSQL 무중단 전환, 시드 스크립트', tag: 'DB', color: 'bg-violet-500' },
    { icon: <TestTube size={20} />, title: '테스트 자동화', desc: '통합 테스트 6종 + 단위 테스트 10종, in-memory DB로 외부 의존성 제로', tag: 'Test', color: 'bg-amber-500' },
    { icon: <AlertTriangle size={20} />, title: '에러 핸들링', desc: '404/500 페이지, ErrorBoundary, API 에러 자동 처리 + Toast 알림', tag: 'UX', color: 'bg-rose-500' },
    { icon: <Palette size={20} />, title: '디자인 시스템', desc: 'Button·Card·Input·Modal·Toast 등 UI 컴포넌트 + 인터랙티브 쇼케이스', tag: 'UI', color: 'bg-indigo-500' },
  ];

  return (
    <>
      <LoadingOverlay />
      <DocumentViewer
        isOpen={documentViewer.isOpen}
        onClose={closeDocument}
        title={documentViewer.title}
        filePath={documentViewer.filePath}
      />

      <div className="min-h-screen bg-mesh selection:bg-indigo-100">
        {/* 네비게이션 */}
        <nav className="sticky top-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5" fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Vibe-Web-Starter v2.0</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <button onClick={() => openDocument('overview')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <FileCode size={16} />
                프로젝트 개요
              </button>
              <button onClick={() => openDocument('architecture')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Layers size={16} />
                아키텍처
              </button>
              <button onClick={() => openDocument('devGuide')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <BookOpen size={16} />
                개발 가이드
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${connectionStatus === 'ok' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${connectionStatus === 'ok' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                Node: {connectionStatus === 'ok' ? 'Stable' : 'Offline'}
              </div>
              <button
                onClick={handleDBCheck}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all active:scale-95 border border-blue-200"
                title="DB 연결 테스트"
              >
                <Database size={14} />
                DB 연결 테스트
              </button>
              <a
                href="/design-system"
                className="px-5 py-2 rounded-xl text-sm font-bold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95"
              >
                디자인 시스템
              </a>
              <a
                href="/sample"
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                CRUD 데모 →
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            바이브코딩 웹 템플릿, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">누구나 쉽게 1분만에 시작</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-12">
            AI 바이브코딩 환경 웹 서비스 템플릿. 유지보수성 최우선 및 모듈화를 핵심 가치로 하는 바이브 코딩(Vibe Coding) 환경을 제공합니다.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="px-5 py-2.5 bg-slate-800 text-slate-100 font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all">FastAPI</div>
            <div className="px-5 py-2.5 bg-slate-700 text-slate-100 font-bold rounded-xl border border-slate-600 hover:bg-slate-600 transition-all">SQLAlchemy 2.0</div>
            <div className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl border border-indigo-500 hover:bg-indigo-500 transition-all">React 19</div>
            <div className="px-5 py-2.5 bg-violet-600 text-white font-bold rounded-xl border border-violet-500 hover:bg-violet-500 transition-all">Tailwind 4</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openDocument('overview')}
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
            >
              프로젝트 시작하기
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/sample"
              className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 text-lg font-bold rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
            >
              <Activity size={20} />
              CRUD 데모 보기
            </a>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
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
                Router-Service-Repository-Calculator-Formatter 구조로 명확한 책임 분리와 테스트 용이성을 보장합니다.
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

        {/* Built-in Features — 이미 구현된 것들 */}
        <section className="max-w-7xl mx-auto px-6 pb-28">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              <Check size={16} />
              Production-Ready
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">clone 직후, 이미 동작하는 것들</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              스타터라는 이름이 무색하게, 실무에 필요한 핵심 기능이 모두 구현되어 있습니다.
              <br />
              스캐폴딩이 아닌, 테스트까지 통과하는 실제 코드입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {builtInFeatures.map((feat) => (
              <div
                key={feat.title}
                className="group relative p-6 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${feat.color} rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                    {feat.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-slate-900">{feat.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{feat.tag}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white" />
                <div className="w-5 h-5 rounded-full bg-violet-500 border-2 border-white" />
              </div>
              <span><strong className="text-slate-700">16</strong> tests passing</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span><strong className="text-slate-700">5</strong> layers architecture</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span><strong className="text-slate-700">0</strong> config to start</span>
            </div>
          </div>
        </section>

        {/* Quick Start 3 Steps */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">3단계로 시작하기</h2>
            <p className="text-slate-500">터미널에서 세 줄이면 개발 서버가 실행됩니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', label: '클론', cmd: 'git clone <repo-url>', desc: '프로젝트 다운로드' },
              { step: '02', label: '셋업', cmd: 'make setup', desc: '의존성 설치 + DB 초기화' },
              { step: '03', label: '실행', cmd: 'make dev', desc: '백엔드 + 프론트 동시 시작' },
            ].map((item) => (
              <div key={item.step} className="relative p-6 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl">
                <div className="text-5xl font-black text-indigo-100 absolute top-4 right-6">{item.step}</div>
                <p className="text-sm font-semibold text-indigo-600 mb-2">{item.label}</p>
                <div className="flex items-center justify-between bg-slate-900 rounded-xl px-4 py-3 mb-3">
                  <code className="text-sm text-slate-200 font-mono">{item.cmd}</code>
                  <CopyButton text={item.cmd} />
                </div>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>프론트엔드: <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">localhost:5173</code></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>API 문서: <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">localhost:8000/docs</code></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span>디자인 시스템: <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">localhost:5173/design-system</code></span>
            </div>
          </div>
        </section>

        {/* AI Skills Section */}
        <section className="max-w-7xl mx-auto px-6 pb-40">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
              <Bot size={16} />
              Claude Code 연동
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">AI 협업 워크플로우</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              슬래시 커맨드 하나로 기능 추가, 버그 수정, 문서 생성을 자동화합니다.
              <br />
              요구사항만 전달하면 로드맵 생성부터 코드 구현까지 AI가 함께합니다.
            </p>
          </div>

          {/* Skills Grid — 카드 디자인 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {skills.map((skill) => (
              <div
                key={skill.cmd}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 p-5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {skill.icon}
                  </div>
                  <code className="inline-block text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md mb-2">{skill.cmd}</code>
                  <p className="text-sm font-bold text-white mb-1">{skill.label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{skill.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 사용 예시 — 터미널 스타일 */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-5 py-3 bg-slate-800/60 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-500 ml-2 font-mono">claude-code</span>
              </div>
              {/* Terminal body */}
              <div className="p-5 space-y-3 font-mono text-sm">
                <div>
                  <span className="text-slate-500">$ </span>
                  <span className="text-violet-400">/feature</span>
                  <span className="text-slate-400"> 게시판 관리</span>
                  <p className="text-slate-600 ml-4 mt-1 text-xs">→ 요구사항 수집 → 로드맵 자동 생성 (docs/roadmaps/)</p>
                </div>
                <div>
                  <span className="text-slate-500">$ </span>
                  <span className="text-violet-400">/execute</span>
                  <p className="text-slate-600 ml-4 mt-1 text-xs">→ 로드맵 선택 → 태스크별 순차 실행 + 완료 기록</p>
                </div>
                <div>
                  <span className="text-slate-500">$ </span>
                  <span className="text-rose-400">/fix</span>
                  <span className="text-slate-400"> 로그인 시 500 에러</span>
                  <p className="text-slate-600 ml-4 mt-1 text-xs">→ 원인 분석 → 수정 계획 → 사용자 승인 → 자동 수정</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-12 bg-white/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 text-sm">© 2026 Vibe-Web-Starter. All rights reserved.</div>
            <div className="flex gap-8 text-slate-400 text-sm font-medium">
              <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600">Terms of Service</a>
              <a href="https://github.com/kyunghovntg/vibe-web-starter" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">Github</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <ToastContainer />
      <ConfirmDialog />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sample" element={<ProtectedRoute><SamplePage /></ProtectedRoute>} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
