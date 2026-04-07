---
name: code-review
description: "변경된 코드를 프로젝트 규칙에 맞게 리뷰. 코드 리뷰, 검토해줘, 체크해줘 등의 요청에 사용."
disable-model-invocation: true
user-invocable: true
argument-hint: "[file-or-scope (optional)]"
---

# 코드 리뷰

대상: `$ARGUMENTS` (미지정 시 `git diff`로 변경사항 전체 리뷰)

## 리뷰 절차

### 1단계: 변경사항 파악

```bash
git diff --name-only          # 변경된 파일 목록
git diff                      # 전체 diff
git diff --staged             # staged 변경사항
```

### 2단계: 빌드·실행 오류 점검

변경된 코드가 **빌드 실패 또는 런타임 에러를 유발하는지** 우선 검사한다.

#### 백엔드 빌드·실행 오류

- [ ] **import 오류**: 존재하지 않는 모듈/클래스를 import하는지, 순환 import가 발생하는지
- [ ] **타입 불일치**: 함수 시그니처와 호출부의 인자 타입/개수가 맞는지
- [ ] **async/await 누락**: async 함수 호출 시 `await` 빠뜨림, 동기 함수에 `await` 사용
- [ ] **마이그레이션 누락**: 모델 필드를 변경/추가했는데 Alembic 마이그레이션이 없는 경우
- [ ] **환경 변수 누락**: 새로운 설정값을 참조하는데 `.env.example`에 추가하지 않은 경우
- [ ] **의존성 누락**: 새 패키지를 사용하는데 `requirements.txt`에 추가하지 않은 경우

#### 프론트엔드 빌드·실행 오류

- [ ] **import 경로 오류**: 존재하지 않는 파일/컴포넌트를 import하는지
- [ ] **타입 에러**: TypeScript 컴파일을 통과하지 못하는 코드 (`tsc --noEmit` 기준)
- [ ] **JSX 문법 오류**: 닫히지 않은 태그, 잘못된 props 전달
- [ ] **라우트 미등록**: 새 페이지를 만들었는데 `App.tsx`에 라우트를 추가하지 않은 경우
- [ ] **의존성 누락**: 새 패키지를 사용하는데 `package.json`에 추가하지 않은 경우

### 3단계: 프로젝트 규칙 체크리스트

각 항목을 검사하고 **위반 시 구체적 코드 위치와 수정 방안**을 제시한다.

#### 백엔드 (server/)

- [ ] **SQLAlchemy 1.x 금지**: `session.query()` 사용 여부 → `await db.execute(select(...))` 2.0 문법
- [ ] **SQL Injection 방지**: `f"SELECT ... {var}"` 또는 `.format()` 사용 여부 → `text()` + `:param` 바인딩
- [ ] **커스텀 예외**: `raise HTTPException(detail=str(e))` → `ApplicationException` 등 사용
- [ ] **도메인 격리**: 다른 도메인의 Service를 직접 import/호출 여부 → Repository를 통해서만
- [ ] **5계층 준수**: Router에 비즈니스 로직 / Calculator에 DB 접근 여부
- [ ] **보안**: `eval()`, `exec()`, `os.system()`, `shell=True` 사용 여부
- [ ] **민감 정보**: 코드에 하드코딩된 비밀번호, 키, 접속 정보 여부

#### 프론트엔드 (client/)

- [ ] **core/ui 재사용**: 기존 공통 컴포넌트를 무시하고 직접 구현했는지
- [ ] **apiClient 사용**: 직접 axios를 import하여 호출하는지 → `apiClient` 사용 필수
- [ ] **React import**: `import React from 'react'` 여부 → named import만
- [ ] **타입 안전성**: `any` 타입 남용 여부
- [ ] **보안**: `eval()`, `innerHTML`, `dangerouslySetInnerHTML` 사용 여부
- [ ] **미사용 import**: 사용하지 않는 import 존재 여부

### 4단계: 리포트 출력

```
## 코드 리뷰 결과

### 빌드·실행 오류 (즉시 수정 필요)
| # | 파일:라인 | 유형 | 현재 코드 | 수정 방안 |
|---|-----------|------|-----------|-----------|

### 규칙 위반 사항 (수정 필요)
| # | 파일:라인 | 규칙 | 현재 코드 | 수정 방안 |
|---|-----------|------|-----------|-----------|

### 권장 사항 (선택)
| # | 파일:라인 | 내용 |
|---|-----------|------|

### 통과 항목
- [x] 체크된 항목 목록
```

## 주의사항

- 리뷰만 수행하고 코드를 직접 수정하지 않는다 (사용자 확인 후 수정)
- CLAUDE.md에 명시된 규칙만 검사한다 — 개인 취향의 스타일 지적 금지
- 빌드·실행 오류는 최상단에 배치하여 우선 해결하도록 안내한다
