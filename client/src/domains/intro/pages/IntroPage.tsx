import { ArrowRight, ArrowLeft, Sparkles, Terminal, Bug, FileText, Search, Bot, Zap, AlertCircle, CheckCircle2, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SectionLabel({ children, color = 'indigo' }: { children: React.ReactNode; color?: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-700',
    violet: 'bg-violet-100 text-violet-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
  };
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${colorMap[color]} rounded-full text-sm font-semibold mb-4`}>
      {children}
    </div>
  );
}

export function IntroPage() {
  const navigate = useNavigate();

  const skills = [
    {
      cmd: '/feature',
      label: '기능 추가',
      desc: '요구사항을 입력하면 구현 로드맵을 자동 생성합니다. 무엇을 만들지 정의하는 단계.',
      icon: <Sparkles size={18} />,
      color: 'from-violet-500 to-purple-600',
      step: '1단계',
    },
    {
      cmd: '/execute',
      label: '로드맵 실행',
      desc: '생성된 로드맵을 태스크 단위로 순차 실행합니다. 각 단계마다 승인 후 진행.',
      icon: <Terminal size={18} />,
      color: 'from-blue-500 to-cyan-500',
      step: '2단계',
    },
    {
      cmd: '/fix',
      label: '버그 수정',
      desc: '에러 증상을 설명하면 원인 분석부터 수정까지 자동으로 처리합니다.',
      icon: <Bug size={18} />,
      color: 'from-rose-500 to-orange-500',
      step: '보조',
    },
    {
      cmd: '/make-doc',
      label: '문서 생성',
      desc: '로드맵, 테스트 시나리오, 가이드 문서를 규칙에 맞게 자동 작성합니다.',
      icon: <FileText size={18} />,
      color: 'from-amber-500 to-yellow-500',
      step: '보조',
    },
    {
      cmd: '/code-review',
      label: '코드 리뷰',
      desc: '변경된 코드의 아키텍처 준수, 보안, 성능 이슈를 자동으로 검토합니다.',
      icon: <Search size={18} />,
      color: 'from-emerald-500 to-teal-500',
      step: '보조',
    },
  ];

  const beforeAfter = [
    {
      before: 'Claude에게 직접 "이 기능 만들어줘" 요청',
      after: '/feature로 요구사항 정의 → 로드맵 생성 → /execute로 단계별 실행',
      label: '기능 개발',
    },
    {
      before: '에러 메시지를 복사해서 Claude에 붙여넣기',
      after: '/fix 실행 → 증상 입력 → 원인 분석 → 수정 계획 확인 후 자동 수정',
      label: '버그 수정',
    },
    {
      before: '코드를 직접 붙여넣고 구조를 설명',
      after: 'CLAUDE.md가 프로젝트 규칙을 항상 로드 → 설명 없이 바로 작업 가능',
      label: '컨텍스트 유지',
    },
    {
      before: '대화가 길어지면 AI가 앞 내용을 잊음',
      after: '태스크 단위 실행으로 범위를 쪼개서 진행 → 일관된 결과 유지',
      label: '일관성',
    },
  ];

  const scenarios = [
    {
      title: '기존 ERP 화면을 웹으로 옮기기',
      steps: [
        '/feature "매출 현황 조회 화면" 실행',
        '요구사항 파일(docs/feature/)에 기존 화면 스펙 작성',
        'AI가 로드맵 생성 → /execute로 순차 구현',
        '백엔드 API + 프론트 화면이 함께 완성됨',
      ],
      tag: '마이그레이션',
      color: 'border-blue-200 bg-blue-50/50',
      tagColor: 'bg-blue-100 text-blue-700',
    },
    {
      title: '반복 업무를 API로 자동화하기',
      steps: [
        '/feature "월별 마감 집계 API" 실행',
        '기존 ERP 쿼리나 로직을 요구사항으로 입력',
        'AI가 FastAPI 엔드포인트 + DB 모델 생성',
        '로컬에서 바로 호출 가능한 REST API 완성',
      ],
      tag: '자동화',
      color: 'border-emerald-200 bg-emerald-50/50',
      tagColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: '데이터 조회/입력 화면 새로 만들기',
      steps: [
        '테이블 구조(DDL)와 화면 요구사항을 docs/specs/에 작성',
        '/feature로 스펙 분석 → 로드맵 자동 생성',
        '/execute로 모델·API·화면 순서대로 구현',
        'Alembic 마이그레이션까지 자동 생성됨',
      ],
      tag: '신규 개발',
      color: 'border-violet-200 bg-violet-50/50',
      tagColor: 'bg-violet-100 text-violet-700',
    },
  ];

  return (
    <div className="min-h-screen bg-mesh selection:bg-indigo-100">
      {/* 네비게이션 */}
      <nav className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 shrink-0 whitespace-nowrap text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            메인으로
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-4 h-4" fill="currentColor" />
            </div>
            <span className="text-base font-bold whitespace-nowrap text-slate-900">때리러와</span>
          </div>
          <a
            href="/docs/guides/CLAUDE_CODE_CLI_GUIDE.md"
            className="text-sm font-medium whitespace-nowrap shrink-0 text-indigo-600 hover:text-indigo-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            CLI 가이드 →
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6">

        {/* Hero */}
        <section className="pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
            <Bot size={15} />
            때리러와 v2 — 팀 공유
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            토이 프로젝트에서<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">실전 업무로.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-4">
            바이브코딩이 뭔지는 알고, 한 번쯤 써봤습니다.
            <br />
            이제 실제 업무에 쓰는 방법을 정리했습니다.
          </p>
          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            이 스타터팩은 AI가 흔들리지 않게 잡아주는 <strong className="text-slate-600">구조</strong>입니다.
            Claude Code가 이 구조를 읽고, 우리 팀 규칙대로 코드를 만듭니다.
          </p>
        </section>

        {/* 토이 PJ vs 실전 — Before/After */}
        <section className="pb-24">
          <div className="text-center mb-12">
            <SectionLabel color="amber"><AlertCircle size={15} /> 달라지는 것</SectionLabel>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">지금까지 vs 앞으로</h2>
            <p className="text-slate-500">Claude Code를 그냥 쓰는 것과, 이 스타터팩과 함께 쓰는 것의 차이</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {beforeAfter.map((item) => (
              <div key={item.label} className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_1fr] gap-3 items-center p-5 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider md:w-20 shrink-0">{item.label}</span>
                <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <AlertCircle size={15} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-500">{item.before}</p>
                </div>
                <ChevronRight size={18} className="text-indigo-400 mx-auto hidden md:block" />
                <div className="flex items-start gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <CheckCircle2 size={15} className="text-indigo-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-indigo-700 font-medium">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 이 스타터팩이 하는 일 */}
        <section className="pb-24">
          <div className="text-center mb-12">
            <SectionLabel color="indigo"><Layers size={15} /> 구조의 역할</SectionLabel>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">AI가 일관된 코드를 만들려면</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Claude는 아무 폴더에서나 써도 코드를 만들어줍니다.
              <br />
              하지만 다음 번에 같은 방식으로 만들어준다는 보장은 없습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">CLAUDE.md — 규칙 자동 로드</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Claude Code를 켤 때마다 프로젝트 규칙을 자동으로 읽습니다. 매번 설명할 필요 없이 항상 같은 기준으로 코드를 작성합니다.
              </p>
            </div>

            <div className="p-6 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-2xl">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-4">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">레이어드 아키텍처 — 충돌 방지</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Router → Service → Repository 구조가 정해져 있습니다. AI가 기능을 추가해도 기존 코드와 충돌하지 않는 위치에 작성합니다.
              </p>
            </div>

            <div className="p-6 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-2xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                <Terminal size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Skills — 반복 작업 자동화</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                슬래시 커맨드로 기능 추가, 버그 수정, 문서 생성을 실행합니다. 이 팀만의 작업 방식을 명령어 하나로 통일합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 실전 워크플로 — Skills */}
        <section className="pb-24">
          <div className="text-center mb-12">
            <SectionLabel color="violet"><Bot size={15} /> Skills 사용법</SectionLabel>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">실전 워크플로</h2>
            <p className="text-slate-500">
              Claude Code 터미널에서 슬래시 커맨드를 입력하면 됩니다.
              <br />
              처음 써보는 분은 <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-sm">/feature</code> → <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-sm">/execute</code> 순서로 시작하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {skills.map((skill) => (
              <div
                key={skill.cmd}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 p-5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      {skill.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{skill.step}</span>
                  </div>
                  <code className="inline-block text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md mb-1.5">{skill.cmd}</code>
                  <p className="text-sm font-bold text-white mb-1.5">{skill.label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{skill.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 터미널 예시 */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20">
              <div className="flex items-center gap-2 px-5 py-3 bg-slate-800/60 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-500 ml-2 font-mono">claude-code — 때리러와</span>
              </div>
              <div className="p-5 space-y-4 font-mono text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-500">$</span>
                    <span className="text-violet-400 font-bold">/feature</span>
                    <span className="text-slate-300">매출 현황 조회 화면</span>
                  </div>
                  <p className="text-slate-600 ml-5 text-xs">→ docs/feature/매출현황.md 템플릿 생성</p>
                  <p className="text-slate-600 ml-5 text-xs">→ 요구사항 작성 후 재실행 → 로드맵 자동 생성</p>
                </div>
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-500">$</span>
                    <span className="text-blue-400 font-bold">/execute</span>
                  </div>
                  <p className="text-slate-600 ml-5 text-xs">→ 로드맵 파일 확인 → 태스크 목록 표시</p>
                  <p className="text-slate-600 ml-5 text-xs">→ Task 1: DB 모델 생성 [승인? y]</p>
                  <p className="text-slate-600 ml-5 text-xs">→ Task 2: API 엔드포인트 [승인? y]</p>
                  <p className="text-slate-600 ml-5 text-xs">→ Task 3: 프론트 화면 [승인? y]</p>
                </div>
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-500">$</span>
                    <span className="text-rose-400 font-bold">/fix</span>
                    <span className="text-slate-300">조회 버튼 클릭 시 500 에러</span>
                  </div>
                  <p className="text-slate-600 ml-5 text-xs">→ 원인 분석 → 수정 계획 제시 → 승인 후 자동 수정</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ERP 업무 적용 시나리오 */}
        <section className="pb-24">
          <div className="text-center mb-12">
            <SectionLabel color="emerald"><CheckCircle2 size={15} /> 실전 시나리오</SectionLabel>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">ERP 업무에 적용하는 법</h2>
            <p className="text-slate-500">
              로컬 환경에서 바로 시작할 수 있는 실제 시나리오입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <div key={scenario.title} className={`p-6 border rounded-2xl ${scenario.color}`}>
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${scenario.tagColor}`}>
                  {scenario.tag}
                </span>
                <h3 className="font-bold text-slate-900 mb-4 leading-snug">{scenario.title}</h3>
                <ol className="space-y-2">
                  {scenario.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* 시작하기 CTA */}
        <section className="pb-32">
          <div className="p-10 bg-slate-900 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20" />
            <div className="relative">
              <h2 className="text-3xl font-black text-white mb-3">지금 시작하기</h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Claude Code CLI 설치부터 첫 번째 <code className="text-violet-400">/feature</code> 실행까지,
                단계별 가이드가 준비되어 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-7 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all active:scale-95"
                >
                  Claude Code CLI 설치 가이드
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all active:scale-95 border border-white/20"
                >
                  <BookOpen size={18} />
                  초보자 설치 가이드
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white/30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">때리러와 — 팀 내부 공유용</p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            메인으로 돌아가기
          </button>
        </div>
      </footer>
    </div>
  );
}
