# 디자인시스템

## 기본 정보

| 항목 | 내용 |
|------|------|
| 메뉴명 | 디자인시스템 |
| 도메인명 | design-system |
| 프론트 경로 | `/design-system` |
| API 경로 | 없음 (프론트엔드 전용) |
| DB 테이블 | 없음 |

## 소스 원본

`D:\cursorAI\MNS_PMS\client\src\core\` 기반 이식

- UI 컴포넌트 20개 (기존 4개 교체 + 신규 16개)
- 훅 3개 (useConfirm, usePagination, useTableFilter)
- 유틸 2개 (formatters, exportExcel) + toast 교체
- 스토어 1개 (useToastStore)
- 쇼케이스 페이지 (DesignSystemPage)

## 디자인 차별화 요소

MNS_PMS 소스를 기반으로 하되, 이 프로젝트만의 색상 톤을 적용:
- Brand 컬러: Indigo 계열 (MNS_PMS의 Blue 대신)
- 프로젝트 이름에 맞는 UI 문구 조정

## 의존성

- `xlsx` — Excel export 기능 (신규 설치 필요)
- `framer-motion` — 이미 설치됨
- `zustand` — 이미 설치됨
- `lucide-react` — 이미 설치됨
