---
name: make-doc
description: "프로젝트 문서를 규칙에 맞게 생성. 로드맵, 테스트 시나리오, 가이드, 보고서 작성 시 사용."
disable-model-invocation: false
user-invocable: true
argument-hint: "[type: roadmap|test-scenario|guide|report] [name]"
---

# 문서 생성

타입: `$0`
이름: `$1`
추가 내용: `$ARGUMENTS`

## 문서 종류별 위치 및 파일명 규칙

| 타입 | 저장 위치 | 파일명 형식 |
|------|-----------|-------------|
| `roadmap` | `docs/roadmaps/` | `YYYY-MM-DD-roadmap-{name}.md` |
| `test-scenario` | `docs/test-scenarios/` | `YYYY-MM-DD-test-scenario-{name}.md` |
| `guide` (특정 기능) | `docs/guides/` | `YYYY-MM-DD-{name}-guide.md` |
| `guide` (공통/영구 참조) | `docs/guides/` | `{NAME}_GUIDE.md` (날짜 없음, 대문자) |
| `report` | `docs/reports/` | `YYYY-MM-DD-{name}.md` |

## 날짜 규칙

- 오늘 날짜를 파일명에 사용 (YYYY-MM-DD)
- **공통·영구 참조 가이드**만 날짜 없음 (ALEMBIC_GUIDE, ARCHITECTURE 등)
- 그 외 모든 문서는 날짜 필수

## 작성 절차

1. 타입과 이름을 확인하여 정확한 파일 경로 결정
2. 해당 디렉토리가 없으면 생성
3. 문서 내용 작성
4. 파일명 규칙 준수 여부 재확인

## 문서 작성 스타일

- 마크다운 형식
- 한국어 작성 (기술 용어는 영어 허용)
- 명확한 제목과 섹션 구분
- 체크리스트, 테이블 등 구조화된 형식 활용
