import React, { useState, useEffect } from 'react';
import {
  Users, Star, Bell, Download, Plus, Search, Filter,
  Mail, Lock, ChevronRight, CheckCircle, XCircle,
  AlertCircle, Info, BarChart2, Loader2, Trash2, UserPlus,
  RefreshCw,
} from 'lucide-react';
import {
  Button,
  Card, CardHeader, CardBody, CardFooter,
  Input,
  Select,
  Badge,
  StatCard,
  ProgressBar,
  Avatar,
  DataTable,
  Modal,
  Pagination,
  Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonStatCard,
  EmptyState,
  Breadcrumb,
  Tabs,
} from '@/core/ui';
import type { TableColumn } from '@/core/ui';
import { toast } from '@/core/utils/toast';
import {
  formatDate, formatDateShort, formatDateTime, formatDateRange,
  formatCurrency, formatNumber, formatPercent,
} from '@/core/utils/formatters';
import { exportToExcel } from '@/core/utils/exportExcel';
import { useConfirm, usePagination, useTableFilter } from '@/core/hooks';

/* ── 더미 데이터 ── */
const sampleData: Record<string, unknown>[] = [
  { name: '김민준', dept: '개발팀',     role: '시니어 개발자', score: 92, status: '활성', joined: '2023-03-15' },
  { name: '이서연', dept: '마케팅팀',   role: '마케팅 리드',   score: 88, status: '활성', joined: '2024-01-08' },
  { name: '박지호', dept: '영업팀',     role: '영업 매니저',   score: 76, status: '활성', joined: '2022-07-20' },
  { name: '최수아', dept: '인사팀',     role: 'HR 스페셜리스트', score: 94, status: '비활성', joined: '2023-09-01' },
  { name: '정우성', dept: '재무팀',     role: '재무 분석가',   score: 81, status: '활성', joined: '2025-02-14' },
  { name: '한예진', dept: '디자인팀',   role: 'UI/UX 디자이너', score: 87, status: '활성', joined: '2024-06-03' },
  { name: '오동현', dept: '고객성공팀', role: 'CS 매니저',     score: 65, status: '만료', joined: '2021-11-30' },
  { name: '윤소희', dept: '개발팀',     role: '프론트엔드 개발자', score: 90, status: '활성', joined: '2025-01-20' },
];

const tableColumns: TableColumn<Record<string, unknown>>[] = [
  {
    key: 'name',
    header: '이름',
    render: (val) => (
      <div className="flex items-center gap-3">
        <Avatar name={String(val)} size="sm" />
        <span className="font-medium text-slate-800">{String(val)}</span>
      </div>
    ),
  },
  { key: 'dept',   header: '부서' },
  { key: 'role',   header: '직책' },
  {
    key: 'score',
    header: '점수',
    render: (val) => (
      <div className="flex items-center gap-3 w-36">
        <ProgressBar value={Number(val)} className="flex-1" />
        <span className="text-xs font-semibold text-slate-600 w-7 text-right">{String(val)}</span>
      </div>
    ),
  },
  {
    key: 'status',
    header: '상태',
    render: (val) => {
      const map: Record<string, 'success' | 'warning' | 'danger'> = {
        활성: 'success', 비활성: 'warning', 만료: 'danger',
      };
      return <Badge variant={map[String(val)] ?? 'default'}>{String(val)}</Badge>;
    },
  },
  { key: 'joined', header: '등록일' },
];

/* ── 섹션 구분선 ── */
const SectionTitle: React.FC<{ title: string; desc?: string }> = ({ title, desc }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
  </div>
);

/* ── 포맷터 샘플 데이터 ── */
const FORMATTER_SAMPLES = [
  { label: 'formatDate', input: '2026-03-06', output: formatDate('2026-03-06') },
  { label: 'formatDateShort', input: '2026-03-06', output: formatDateShort('2026-03-06') },
  { label: 'formatDateTime', input: '2026-03-06T09:00:00', output: formatDateTime('2026-03-06T09:00:00') },
  { label: 'formatDateRange', input: '2026-03-01 ~ 2026-03-31', output: formatDateRange('2026-03-01', '2026-03-31') },
  { label: 'formatCurrency', input: '1234567', output: formatCurrency(1234567) },
  { label: 'formatNumber', input: '1234567', output: formatNumber(1234567) },
  { label: 'formatPercent', input: '0.856', output: formatPercent(0.856) },
  { label: 'formatDate(null)', input: 'null', output: formatDate(null) },
  { label: 'formatCurrency(undefined)', input: 'undefined', output: formatCurrency(undefined) },
];

/* ── Excel 내보내기 샘플 ── */
const EXCEL_SAMPLE_DATA = [
  { name: '김민준', dept: '개발팀', salary: 5200000, joined: '2023-03-15', rate: 0.92 },
  { name: '이서연', dept: '마케팅팀', salary: 4800000, joined: '2024-01-08', rate: 0.88 },
  { name: '박지호', dept: '영업팀', salary: 4500000, joined: '2022-07-20', rate: 0.76 },
];
const EXCEL_COLUMNS = [
  { key: 'name', header: '이름', width: 12 },
  { key: 'dept', header: '부서', width: 15 },
  { key: 'salary', header: '급여', width: 15 },
  { key: 'joined', header: '등록일', width: 15 },
  { key: 'rate', header: '달성률', width: 10 },
];

/* ── 메인 컴포넌트 ── */
export const DesignSystemPage: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalBasic, setModalBasic] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalForm, setModalForm] = useState(false);
  const [modalLg, setModalLg] = useState(false);

  const pagination = usePagination({ initialPage: 1, initialPageSize: 20 });
  const [tabsActive, setTabsActive] = useState('overview');
  const [tabsBadgeActive, setTabsBadgeActive] = useState('active');
  const [confirmResult, setConfirmResult] = useState<string | null>(null);

  const confirm = useConfirm();

  const { filters, setFilter, resetFilters, debouncedFilters } = useTableFilter({
    initialFilters: { keyword: '', deptCode: '' },
  });
  const [filterLog, setFilterLog] = useState('입력 대기 중...');
  useEffect(() => {
    setFilterLog(JSON.stringify(debouncedFilters));
  }, [debouncedFilters]);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const handleConfirmDemo = async (variant: 'danger' | 'warning' | 'default') => {
    const labels = { danger: '삭제', warning: '경고 처리', default: '기본 확인' };
    const ok = await confirm({
      title: `${labels[variant]} 확인`,
      message: `이 작업을 ${labels[variant]}하시겠습니까?\n선택 결과가 아래 Toast로 표시됩니다.`,
      confirmText: labels[variant],
      variant,
    });
    if (ok) {
      toast.success(`확인: ${labels[variant]} 처리 완료`);
      setConfirmResult('확인 (true)');
    } else {
      toast.info(`취소: ${labels[variant]} 취소됨`);
      setConfirmResult('취소 (false)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-8 space-y-14">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">디자인 시스템</h1>
            <p className="text-sm text-slate-500 mt-1">
              vibe-web-starter에서 재사용 가능한 공통 컴포넌트 모음입니다. 모든 컴포넌트는 Indigo 브랜드 컬러를 기반으로 합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4" />
              문서 다운로드
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" />
              컴포넌트 추가
            </Button>
          </div>
        </div>

        {/* ── 1. STAT CARDS ── */}
        <section>
          <SectionTitle title="StatCard — 지표 카드" desc="핵심 수치를 강조하는 지표 카드. color prop으로 색상 변형, change prop으로 증감률 표시." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard title="전체 사용자" value="248" unit="명" change={4.2} changeLabel="전월 대비" icon={<Users className="w-5 h-5" />} color="brand" />
            <StatCard title="활성 비율" value="96.3" unit="%" change={1.1} changeLabel="전월 대비" icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
            <StatCard title="평균 점수" value="82" unit="점" change={-2.4} changeLabel="전분기 대비" icon={<Star className="w-5 h-5" />} color="amber" />
            <StatCard title="미처리 알림" value="14" unit="건" icon={<Bell className="w-5 h-5" />} color="rose" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
            <StatCard title="신규 가입" value="37" unit="명" change={12.5} changeLabel="이번주" icon={<Users className="w-5 h-5" />} color="violet" />
            <StatCard title="월간 매출" value="4.2" unit="억원" change={0.8} changeLabel="전월 대비" icon={<BarChart2 className="w-5 h-5" />} color="blue" />
            <StatCard title="완료 작업" value="184" unit="건" change={23.1} changeLabel="전월 대비" icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
            <StatCard title="진행중 프로젝트" value="9" unit="개" icon={<AlertCircle className="w-5 h-5" />} color="amber" />
          </div>
        </section>

        {/* ── 2. BADGES ── */}
        <section>
          <SectionTitle title="Badge — 상태 배지" desc="variant prop으로 6가지 상태 표현. dot prop으로 인디케이터 표시 가능." />
          <Card>
            <CardBody className="py-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="success" dot>완료</Badge>
                <Badge variant="warning" dot>진행중</Badge>
                <Badge variant="danger" dot>반려</Badge>
                <Badge variant="default" dot>미시작</Badge>
                <Badge variant="info" dot>검토중</Badge>
                <Badge variant="violet" dot>보류</Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success">활성</Badge>
                <Badge variant="warning">비활성</Badge>
                <Badge variant="danger">만료</Badge>
                <Badge variant="info">신규</Badge>
                <Badge variant="violet">수습</Badge>
                <Badge variant="default">임시</Badge>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* ── 3. BUTTONS ── */}
        <section>
          <SectionTitle title="Button — 버튼" desc="variant: primary / secondary / outline / ghost / danger. size: sm / md / lg. isLoading prop 지원." />
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">Variants</span>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">
                    <Plus className="w-4 h-4" /> Primary
                  </Button>
                  <Button variant="secondary">
                    <Download className="w-4 h-4" /> Secondary
                  </Button>
                  <Button variant="outline">
                    <Search className="w-4 h-4" /> Outline
                  </Button>
                  <Button variant="ghost">
                    <Filter className="w-4 h-4" /> Ghost
                  </Button>
                  <Button variant="danger">
                    <Trash2 className="w-4 h-4" /> Danger
                  </Button>
                  <Button variant="primary" isLoading={loading} onClick={simulateLoading}>
                    {loading ? '처리중...' : '로딩 예시'}
                  </Button>
                  <Button variant="primary" disabled>
                    비활성화
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">Sizes</span>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="sm" variant="secondary">Secondary SM</Button>
                  <Button size="lg" variant="outline">Outline LG</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* ── 4. AVATAR ── */}
        <section>
          <SectionTitle title="Avatar — 아바타" desc="name prop으로 이니셜 자동 생성. 이름 해시값으로 색상 자동 배정." />
          <Card>
            <CardBody className="py-6">
              <div className="flex items-center gap-4 mb-6">
                {['김민준', '이서연', '박지호', '최수아', '정우성', '한예진', '오동현', '윤소희'].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <Avatar name={name} size="lg" />
                    <span className="text-xs text-slate-500">{name}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 mr-1">Sizes:</span>
                <Avatar name="김민준" size="sm" />
                <Avatar name="김민준" size="md" />
                <Avatar name="김민준" size="lg" />
              </div>
            </CardBody>
          </Card>
        </section>

        {/* ── 5. PROGRESS BAR ── */}
        <section>
          <SectionTitle title="ProgressBar — 진행률" desc="value prop(0-100)에 따라 색상 자동 변경. 80%↑ emerald / 50-79% brand / 50%↓ amber" />
          <Card>
            <CardBody className="py-6">
              <div className="space-y-5">
                {[
                  { label: '영업팀 목표 달성률', value: 92 },
                  { label: '개발팀 목표 달성률', value: 74 },
                  { label: '마케팅팀 목표 달성률', value: 41 },
                  { label: '디자인팀 목표 달성률', value: 58 },
                  { label: '인사팀 목표 달성률', value: 85 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <span className="text-xs font-semibold text-slate-500">{item.value}%</span>
                    </div>
                    <ProgressBar value={item.value} height="md" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>

        {/* ── 6. INPUTS ── */}
        <section>
          <SectionTitle title="Input — 입력 필드" desc="label, placeholder, error, helperText prop 지원. brand 색상 focus ring 적용." />
          <div className="grid grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">기본 상태</span>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <Input
                  label="이메일"
                  type="email"
                  placeholder="example@company.com"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />
                <Input
                  label="비밀번호"
                  type="password"
                  placeholder="••••••••"
                  helperText="8자 이상의 영문, 숫자, 특수문자 조합"
                />
                <Input
                  label="검색"
                  placeholder="이름, 부서, 직책으로 검색..."
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">상태별 변형</span>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <Input
                  label="이메일 (에러)"
                  type="email"
                  defaultValue="invalid-email"
                  error="올바른 이메일 형식을 입력해주세요."
                />
                <Input
                  label="비밀번호 (도움말)"
                  type="password"
                  placeholder="비밀번호 입력"
                  helperText="이전 비밀번호와 동일하게 사용할 수 없습니다."
                />
                <Input
                  label="비활성화"
                  placeholder="수정 불가"
                  disabled
                  defaultValue="비활성화된 입력 필드"
                />
              </CardBody>
            </Card>
          </div>
        </section>

        {/* ── 7. SELECT ── */}
        <section>
          <SectionTitle title="Select — 선택 드롭다운" desc="label, placeholder, error, helperText prop 지원. options 배열로 선택지 구성." />
          <div className="grid grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">기본 상태</span>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <Select
                  label="부서"
                  placeholder="부서를 선택하세요"
                  options={[
                    { value: 'dev', label: '개발팀' },
                    { value: 'marketing', label: '마케팅팀' },
                    { value: 'sales', label: '영업팀' },
                    { value: 'hr', label: '인사팀' },
                    { value: 'design', label: '디자인팀' },
                  ]}
                />
                <Select
                  label="직책"
                  placeholder="직책을 선택하세요"
                  options={[
                    { value: 'staff', label: '사원' },
                    { value: 'senior', label: '시니어' },
                    { value: 'lead', label: '팀장' },
                    { value: 'manager', label: '매니저' },
                  ]}
                  helperText="본인의 현재 직책을 선택하세요."
                />
                <Select
                  label="상태"
                  options={[
                    { value: 'active', label: '활성' },
                    { value: 'inactive', label: '비활성' },
                    { value: 'expired', label: '만료' },
                  ]}
                  defaultValue="active"
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">상태별 변형</span>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <Select
                  label="부서 (에러)"
                  placeholder="부서를 선택하세요"
                  options={[
                    { value: 'dev', label: '개발팀' },
                    { value: 'marketing', label: '마케팅팀' },
                  ]}
                  error="부서를 선택해주세요."
                />
                <Select
                  label="유형"
                  placeholder="유형 선택"
                  options={[
                    { value: 'fulltime', label: '정규' },
                    { value: 'parttime', label: '파트타임' },
                    { value: 'contract', label: '계약' },
                  ]}
                  helperText="유형에 따라 권한이 달라집니다."
                />
                <Select
                  label="비활성화"
                  options={[{ value: 'dev', label: '개발팀' }]}
                  defaultValue="dev"
                  disabled
                />
              </CardBody>
            </Card>
          </div>
        </section>

        {/* ── 8. CARDS ── */}
        <section>
          <SectionTitle title="Card — 카드" desc="CardHeader, CardBody, CardFooter 서브컴포넌트. hover prop으로 호버 효과 활성화." />
          <div className="grid grid-cols-3 gap-5">
            <Card>
              <CardHeader>
                <h3 className="text-base font-semibold text-slate-800">기본 카드</h3>
                <Badge variant="success" dot>활성</Badge>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-slate-500">
                  CardHeader, CardBody, CardFooter 구조로 구성된 기본 카드입니다. 옅은 그림자와 부드러운 테두리가 특징입니다.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">상세 보기</Button>
              </CardFooter>
            </Card>

            <Card hover>
              <CardHeader>
                <h3 className="text-base font-semibold text-slate-800">호버 카드</h3>
                <Badge variant="info">hover</Badge>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-slate-500">
                  hover prop을 주면 마우스 오버 시 위로 살짝 떠오르는 카드입니다. 클릭 가능한 항목에 사용합니다.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="primary" size="sm">
                  <ChevronRight className="w-4 h-4" /> 이동하기
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-base font-semibold text-slate-800">팀 현황</h3>
                <span className="text-xs text-slate-400">개발팀</span>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  {['김민준', '이서연', '윤소희'].map((name) => (
                    <div key={name} className="flex items-center gap-3">
                      <Avatar name={name} size="sm" />
                      <span className="text-sm text-slate-700 flex-1">{name}</span>
                      <Badge variant="success">활성</Badge>
                    </div>
                  ))}
                </div>
              </CardBody>
              <CardFooter>
                <span className="text-xs text-slate-400">총 12명 중 3명 표시</span>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* ── 9. STATUS ICONS ── */}
        <section>
          <SectionTitle title="아이콘 활용 패턴" desc="lucide-react 아이콘을 컬러 컨텍스트에 맞게 활용하는 예시입니다." />
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: <CheckCircle className="w-5 h-5" />, label: '승인됨', bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'success' as const },
              { icon: <AlertCircle className="w-5 h-5" />, label: '검토 필요', bg: 'bg-amber-50', text: 'text-amber-600', badge: 'warning' as const },
              { icon: <XCircle className="w-5 h-5" />, label: '반려됨', bg: 'bg-rose-50', text: 'text-rose-500', badge: 'danger' as const },
              { icon: <Info className="w-5 h-5" />, label: '정보', bg: 'bg-blue-50', text: 'text-blue-600', badge: 'info' as const },
            ].map((item) => (
              <Card key={item.label}>
                <CardBody className="py-6 flex items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.text} shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.label}</p>
                      <Badge variant={item.badge} className="mt-1">{item.badge}</Badge>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* ── 10. DATA TABLE ── */}
        <section>
          <SectionTitle title="DataTable — 데이터 테이블" desc="columns + data prop으로 구성하는 세련된 리스트 뷰. render 함수로 셀 커스텀 가능." />
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-800">사용자 목록</h2>
              <div className="flex items-center gap-2">
                <Input placeholder="검색..." className="w-48" />
                <Button variant="secondary" size="sm">
                  <Filter className="w-4 h-4" /> 필터
                </Button>
              </div>
            </CardHeader>
            <div className="border-t border-slate-100">
              <DataTable columns={tableColumns} data={sampleData} />
            </div>
          </Card>
        </section>

        {/* ── 11. MODAL ── */}
        <section>
          <SectionTitle title="Modal — 모달 다이얼로그" desc="isOpen / onClose prop으로 제어. size: sm / md / lg / xl. ESC 키 및 백드롭 클릭으로 닫기 지원." />
          <Card>
            <CardHeader>
              <span className="text-sm font-semibold text-slate-600">모달 예시 열기</span>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => setModalBasic(true)}>
                  기본 모달
                </Button>
                <Button variant="secondary" onClick={() => setModalConfirm(true)}>
                  확인 모달
                </Button>
                <Button variant="outline" onClick={() => setModalForm(true)}>
                  폼 모달
                </Button>
                <Button variant="ghost" onClick={() => setModalLg(true)}>
                  Large 모달
                </Button>
              </div>
            </CardBody>
          </Card>

          <Modal isOpen={modalBasic} onClose={() => setModalBasic(false)} title="공지사항">
            <p className="text-sm text-slate-600 leading-relaxed">
              vibe-web-starter 디자인 시스템이 업데이트되었습니다. 새로운 컴포넌트를 확인해보세요.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" size="sm" onClick={() => setModalBasic(false)}>닫기</Button>
              <Button variant="primary" size="sm" onClick={() => setModalBasic(false)}>확인했습니다</Button>
            </div>
          </Modal>

          <Modal isOpen={modalConfirm} onClose={() => setModalConfirm(false)} title="항목 삭제" size="sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">정말 삭제하시겠습니까?</p>
                <p className="text-sm text-slate-500 mt-1">
                  이 항목이 영구 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" size="sm" onClick={() => setModalConfirm(false)}>취소</Button>
              <Button variant="danger" size="sm" onClick={() => setModalConfirm(false)}>삭제</Button>
            </div>
          </Modal>

          <Modal isOpen={modalForm} onClose={() => setModalForm(false)} title="사용자 초대">
            <div className="space-y-4">
              <Input label="이름" placeholder="홍길동" />
              <Input label="이메일" type="email" placeholder="hong@company.com" />
              <Select
                label="부서"
                placeholder="부서를 선택하세요"
                options={[
                  { value: 'dev', label: '개발팀' },
                  { value: 'marketing', label: '마케팅팀' },
                  { value: 'sales', label: '영업팀' },
                  { value: 'hr', label: '인사팀' },
                ]}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" size="sm" onClick={() => setModalForm(false)}>취소</Button>
              <Button variant="primary" size="sm" onClick={() => setModalForm(false)}>
                <UserPlus className="w-4 h-4" /> 초대 발송
              </Button>
            </div>
          </Modal>

          <Modal isOpen={modalLg} onClose={() => setModalLg(false)} title="사용자 현황" size="lg">
            <div className="space-y-3">
              {[
                { name: '김민준', dept: '개발팀', status: 'success' as const, statusLabel: '활성' },
                { name: '이서연', dept: '마케팅팀', status: 'success' as const, statusLabel: '활성' },
                { name: '최수아', dept: '인사팀', status: 'warning' as const, statusLabel: '비활성' },
                { name: '오동현', dept: '고객성공팀', status: 'danger' as const, statusLabel: '만료' },
              ].map((emp) => (
                <div key={emp.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <Avatar name={emp.name} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.dept}</p>
                  </div>
                  <Badge variant={emp.status}>{emp.statusLabel}</Badge>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="secondary" size="sm" onClick={() => setModalLg(false)}>닫기</Button>
            </div>
          </Modal>
        </section>

        {/* ── 12. COLOR PALETTE ── */}
        <section>
          <SectionTitle title="컬러 팔레트" desc="Tailwind @theme로 정의된 brand 컬러(Indigo)와 시맨틱 컬러 시스템." />
          <div className="grid grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">Brand (Indigo)</span>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="flex gap-1.5">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full h-8 rounded-md"
                        style={{ backgroundColor: `var(--color-brand-${shade})` }}
                      />
                      <span className="text-[9px] text-slate-400">{shade}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">시맨틱 컬러</span>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Success', cls: 'bg-emerald-500' },
                    { label: 'Warning', cls: 'bg-amber-400' },
                    { label: 'Danger', cls: 'bg-rose-500' },
                    { label: 'Info', cls: 'bg-blue-500' },
                    { label: 'Violet', cls: 'bg-violet-600' },
                    { label: 'Brand', cls: 'bg-brand-600' },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md ${c.cls}`} />
                      <span className="text-xs text-slate-600">{c.label}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* ── 13. FORM EXAMPLE ── */}
        <section>
          <SectionTitle title="폼 레이아웃 예시" desc="Input, Button, Badge 조합으로 구성한 실제 사용 패턴입니다." />
          <div className="grid grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <h3 className="text-base font-semibold text-slate-800">로그인</h3>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <Input label="이메일" type="email" placeholder="name@company.com" />
                <Input label="비밀번호" type="password" placeholder="••••••••" />
                <Button variant="primary" className="w-full justify-center">
                  <Mail className="w-4 h-4" /> 로그인
                </Button>
                <Button variant="secondary" className="w-full justify-center">
                  <Lock className="w-4 h-4" /> 비밀번호 찾기
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-base font-semibold text-slate-800">사용자 등록</h3>
                <Badge variant="info">신규</Badge>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="이름" placeholder="홍길동" />
                  <Select
                    label="부서"
                    placeholder="부서 선택"
                    options={[
                      { value: 'dev', label: '개발팀' },
                      { value: 'marketing', label: '마케팅팀' },
                      { value: 'sales', label: '영업팀' },
                      { value: 'hr', label: '인사팀' },
                    ]}
                  />
                </div>
                <Input label="이메일" type="email" placeholder="hong@company.com" />
                <Input label="등록일" type="date" />
                <div className="flex gap-2 pt-1">
                  <Button variant="primary" className="flex-1 justify-center">
                    <Plus className="w-4 h-4" /> 등록
                  </Button>
                  <Button variant="secondary">취소</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* ── 14. LOADING STATES ── */}
        <section>
          <SectionTitle title="로딩 상태" desc="Loader2 아이콘과 animate-spin으로 표현하는 로딩 패턴입니다." />
          <Card>
            <CardBody className="py-6">
              <div className="flex flex-wrap items-center gap-5">
                <Button variant="primary" isLoading>처리중...</Button>
                <Button variant="secondary" isLoading>로딩중...</Button>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                  데이터를 불러오는 중...
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-xl text-sm text-brand-700">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  저장 중입니다
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* ── 15. TOAST ── */}
        <section>
          <SectionTitle title="Toast — 알림 시스템" desc="toast.success/error/warning/info() 호출 시 우상단 슬라이드 인. 3초 자동 dismiss, X 수동 닫기, 최대 5개 스택." />
          <Card>
            <CardHeader>
              <span className="text-sm font-semibold text-slate-600">4종 Variant 테스트</span>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="flex flex-wrap gap-3 mb-6">
                <Button variant="primary" onClick={() => toast.success('저장되었습니다.')}>
                  <CheckCircle className="w-4 h-4" /> Success
                </Button>
                <Button variant="danger" onClick={() => toast.error('오류가 발생했습니다.')}>
                  <XCircle className="w-4 h-4" /> Error
                </Button>
                <Button variant="primary" className="bg-amber-500 hover:bg-amber-600" onClick={() => toast.warning('주의가 필요합니다.')}>
                  <AlertCircle className="w-4 h-4" /> Warning
                </Button>
                <Button variant="secondary" onClick={() => toast.info('새 공지사항이 있습니다.')}>
                  <Info className="w-4 h-4" /> Info
                </Button>
                <Button variant="outline" onClick={() => {
                  toast.success('첫 번째');
                  setTimeout(() => toast.error('두 번째'), 200);
                  setTimeout(() => toast.warning('세 번째'), 400);
                  setTimeout(() => toast.info('네 번째'), 600);
                  setTimeout(() => toast.success('다섯 번째'), 800);
                }}>
                  스택 5개 동시
                </Button>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 font-mono">
                toast.success('저장되었습니다.')  ←  어디서든 import 후 직접 호출
              </div>
            </CardBody>
          </Card>
        </section>

        {/* ── 16. FORMATTERS ── */}
        <section>
          <SectionTitle title="Formatters — 날짜/숫자 포맷터" desc="Intl API 기반 한국어 로케일 포맷. null/undefined 입력 시 '-' 반환." />
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3.5 text-left font-semibold text-slate-600 w-48">함수</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-slate-600 w-48">입력값</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-slate-600">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {FORMATTER_SAMPLES.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-brand-600">{row.label}</td>
                      <td className="px-6 py-3 text-slate-500 font-mono text-xs">{row.input}</td>
                      <td className="px-6 py-3 text-slate-800 font-medium">
                        {row.output === '-'
                          ? <Badge variant="default">-</Badge>
                          : row.output}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* ── 17. PAGINATION ── */}
        <section>
          <SectionTitle title="Pagination — 페이지 컨트롤" desc="DataTable pagination prop으로 연동하거나 단독 사용. 처음/이전/번호/다음/끝, 최대 5개 버튼, 건수 선택." />
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">단독 Pagination (총 150건)</span>
                <Badge variant="info">현재 페이지: {pagination.page}</Badge>
              </CardHeader>
              <div className="border-t border-slate-100">
                <Pagination {...pagination.paginationProps(150)} />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">DataTable + Pagination + Excel 통합</span>
              </CardHeader>
              <div className="border-t border-slate-100">
                <DataTable
                  columns={tableColumns}
                  data={sampleData}
                  pagination={pagination.paginationProps(sampleData.length)}
                  exportConfig={{ filename: '사용자목록', sheetName: '사용자' }}
                />
              </div>
            </Card>
          </div>
        </section>

        {/* ── 18. SKELETON ── */}
        <section>
          <SectionTitle title="Skeleton — 로딩 스켈레톤" desc="animate-pulse shimmer 효과. 5종: Skeleton / SkeletonText / SkeletonCard / SkeletonTable / SkeletonStatCard." />
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <Card>
                <CardHeader><span className="text-sm font-semibold text-slate-600">Skeleton + SkeletonText</span></CardHeader>
                <CardBody className="pt-0 space-y-4">
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="100%" height={12} />
                  <SkeletonText lines={4} />
                </CardBody>
              </Card>
              <Card>
                <CardHeader><span className="text-sm font-semibold text-slate-600">SkeletonStatCard x 2</span></CardHeader>
                <CardBody className="pt-0 grid grid-cols-2 gap-3">
                  <SkeletonStatCard />
                  <SkeletonStatCard />
                </CardBody>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonTable rows={4} columns={5} />
          </div>
        </section>

        {/* ── 19. CONFIRM DIALOG ── */}
        <section>
          <SectionTitle title="ConfirmDialog — 확인 다이얼로그" desc="useConfirm() 훅으로 async/await 방식 호출. danger/warning/default 3종 variant. ESC·배경 클릭으로 취소." />
          <Card>
            <CardHeader>
              <span className="text-sm font-semibold text-slate-600">variant 별 테스트</span>
              {confirmResult && (
                <Badge variant={confirmResult.startsWith('확인') ? 'success' : 'default'}>
                  마지막 결과: {confirmResult}
                </Badge>
              )}
            </CardHeader>
            <CardBody className="pt-0 space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="danger" onClick={() => handleConfirmDemo('danger')}>
                  <Trash2 className="w-4 h-4" /> 삭제 확인 (danger)
                </Button>
                <Button variant="primary" className="bg-amber-500 hover:bg-amber-600" onClick={() => handleConfirmDemo('warning')}>
                  <AlertCircle className="w-4 h-4" /> 경고 확인 (warning)
                </Button>
                <Button variant="secondary" onClick={() => handleConfirmDemo('default')}>
                  <Info className="w-4 h-4" /> 기본 확인 (default)
                </Button>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 font-mono">
                {'const ok = await confirm({ title: "삭제", message: "...", variant: "danger" });'}
              </div>
            </CardBody>
          </Card>
        </section>

        {/* ── 20. EMPTY STATE ── */}
        <section>
          <SectionTitle title="EmptyState — 빈 상태" desc="데이터 없음/검색 결과 없음/오류 상태. variant: default/search/error. action prop으로 버튼 추가." />
          <div className="grid grid-cols-3 gap-5">
            <Card>
              <CardBody className="py-2">
                <EmptyState
                  variant="default"
                  title="등록된 항목이 없습니다"
                  description="아직 등록된 항목이 없습니다. 첫 번째 항목을 등록해보세요."
                  action={<Button variant="primary" size="sm"><Plus className="w-4 h-4" /> 항목 등록</Button>}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="py-2">
                <EmptyState
                  variant="search"
                  title="검색 결과가 없습니다"
                  description="검색어에 해당하는 항목을 찾을 수 없습니다. 검색어를 확인해주세요."
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="py-2">
                <EmptyState
                  variant="error"
                  title="데이터를 불러오지 못했습니다"
                  description="서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요."
                  action={<Button variant="outline" size="sm"><RefreshCw className="w-4 h-4" /> 다시 시도</Button>}
                />
              </CardBody>
            </Card>
          </div>
        </section>

        {/* ── 21. BREADCRUMB ── */}
        <section>
          <SectionTitle title="Breadcrumb — 경로 네비게이션" desc="items prop으로 경로 지정. 마지막 항목은 현재 페이지(링크 없음)." />
          <div className="space-y-3">
            <Card>
              <CardBody className="py-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-400 mb-2">1단계</p>
                  <Breadcrumb items={[{ label: '대시보드' }]} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">2단계</p>
                  <Breadcrumb items={[
                    { label: '사용자 관리', href: '/design-system' },
                    { label: '사용자 목록' },
                  ]} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">3단계</p>
                  <Breadcrumb items={[
                    { label: '설정', href: '/design-system' },
                    { label: '사용자 관리', href: '/design-system' },
                    { label: '김민준' },
                  ]} />
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* ── 22. EXCEL 내보내기 ── */}
        <section>
          <SectionTitle title="Excel 내보내기 — exportToExcel" desc="xlsx 패키지 기반 클라이언트 다운로드. 파일명에 오늘 날짜 자동 포함. 헤더 굵게 + slate-200 배경." />
          <Card>
            <CardHeader>
              <span className="text-sm font-semibold text-slate-600">직접 호출 + DataTable exportConfig</span>
            </CardHeader>
            <CardBody className="pt-0 space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => exportToExcel({
                  filename: '샘플데이터',
                  sheetName: '사용자목록',
                  columns: EXCEL_COLUMNS,
                  data: EXCEL_SAMPLE_DATA,
                })}>
                  <Download className="w-4 h-4" /> exportToExcel() 직접 호출
                </Button>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 font-mono space-y-1">
                <div>exportToExcel({'{'} filename: "사용자목록", columns: [...], data: [...] {'}'});</div>
                <div className="text-slate-400">// → 사용자목록_2026-03-26.xlsx 다운로드</div>
              </div>
              <p className="text-xs text-slate-400">DataTable에 exportConfig prop을 주면 테이블 우상단에 "Excel 다운로드" 버튼이 자동 표시됩니다.</p>
            </CardBody>
          </Card>
        </section>

        {/* ── 23. useTableFilter ── */}
        <section>
          <SectionTitle title="useTableFilter — 검색/필터 훅" desc="필터 상태 즉시 업데이트 + debouncedFilters 500ms 지연. useDebounce 재사용, TypeScript generic 지원." />
          <Card>
            <CardHeader>
              <span className="text-sm font-semibold text-slate-600">라이브 데모</span>
            </CardHeader>
            <CardBody className="pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="검색어 (keyword)"
                  placeholder="이름으로 검색..."
                  value={String(filters.keyword)}
                  onChange={(e) => setFilter('keyword', e.target.value)}
                />
                <Select
                  label="부서 (deptCode)"
                  placeholder="부서 선택"
                  value={String(filters.deptCode)}
                  onChange={(value) => setFilter('deptCode', value)}
                  options={[
                    { value: '', label: '전체' },
                    { value: 'dev', label: '개발팀' },
                    { value: 'marketing', label: '마케팅팀' },
                    { value: 'sales', label: '영업팀' },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-slate-500 mb-2">filters (즉시 반영)</p>
                  <p className="font-mono text-xs text-slate-700">{JSON.stringify(filters)}</p>
                </div>
                <div className="bg-brand-50 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-brand-600 mb-2">debouncedFilters (500ms 지연 — API 요청용)</p>
                  <p className="font-mono text-xs text-brand-700">{filterLog}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <RefreshCw className="w-4 h-4" /> 필터 초기화
                </Button>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* ── 24. TABS ── */}
        <section>
          <SectionTitle
            title="Tabs — 탭 네비게이션"
            desc="흰색 카드 컨테이너 + underline 스타일 탭. badge prop으로 배지 추가 가능. contentClassName으로 패딩 커스터마이징."
          />
          <div className="space-y-5">
            <Tabs
              tabs={[
                { key: 'overview', label: '개요' },
                { key: 'members', label: '멤버' },
                { key: 'settings', label: '설정' },
              ]}
              activeTab={tabsActive}
              onChange={setTabsActive}
            >
              {tabsActive === 'overview' && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">팀 개요</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: '총 인원', value: '12명' },
                      { label: '활성 비율', value: '97.2%' },
                      { label: '완료 과제', value: '34건' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tabsActive === 'members' && (
                <div className="space-y-2">
                  {['김민준', '이서연', '박지호', '최수아'].map((name) => (
                    <div key={name} className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 transition-colors">
                      <Avatar name={name} size="sm" />
                      <span className="text-sm font-medium text-slate-800">{name}</span>
                      <Badge variant="success" className="ml-auto">활성</Badge>
                    </div>
                  ))}
                </div>
              )}
              {tabsActive === 'settings' && (
                <div className="space-y-4">
                  <Input label="팀명" defaultValue="개발팀" />
                  <Select
                    label="팀장"
                    value="kim"
                    onChange={() => {}}
                    options={[{ value: 'kim', label: '김민준' }, { value: 'lee', label: '이서연' }]}
                  />
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm">저장</Button>
                  </div>
                </div>
              )}
            </Tabs>

            <Tabs
              tabs={[
                { key: 'active', label: '진행중', badge: <Badge variant="info">3</Badge> },
                { key: 'closed', label: '마감', badge: <Badge variant="danger" dot>마감</Badge> },
                { key: 'pending', label: '대기', badge: <Badge variant="warning">1</Badge> },
              ]}
              activeTab={tabsBadgeActive}
              onChange={setTabsBadgeActive}
            >
              <div className="text-sm text-slate-500">
                {tabsBadgeActive === 'active' && '진행중인 항목이 3건 있습니다.'}
                {tabsBadgeActive === 'closed' && '마감된 항목입니다. 수정이 불가합니다.'}
                {tabsBadgeActive === 'pending' && '승인 대기 중인 항목이 1건 있습니다.'}
              </div>
            </Tabs>

            <Card>
              <CardHeader>
                <span className="text-sm font-semibold text-slate-600">사용법</span>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-600 space-y-1">
                  <div>{'<Tabs'}</div>
                  <div className="pl-4">{'tabs={[{ key: "a", label: "탭A" }, { key: "b", label: "탭B", badge: <Badge variant="danger" dot>마감</Badge> }]}'}</div>
                  <div className="pl-4">{'activeTab={activeTab}'}</div>
                  <div className="pl-4">{'onChange={setActiveTab}'}</div>
                  <div>{'>'}</div>
                  <div className="pl-4">{'<콘텐츠 />'}</div>
                  <div>{'</Tabs>'}</div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Footer spacing */}
        <div className="pb-8" />
      </div>
    </div>
  );
};
