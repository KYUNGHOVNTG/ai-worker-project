---
name: code-review
description: "변경된 코드를 MNS_PMS 프로젝트 규칙에 맞게 리뷰. 코드 리뷰, 검토해줘, 체크해줘 등의 요청에 사용."
disable-model-invocation: true
user-invocable: true
argument-hint: "[file-or-scope (optional)]"
---

# MNS_PMS 코드 리뷰

대상: `$ARGUMENTS` (미지정 시 `git diff`로 변경사항 전체 리뷰)

## 리뷰 절차

### 1단계: 변경사항 파악

```bash
git diff --name-only          # 변경된 파일 목록
git diff                      # 전체 diff
git diff --staged             # staged 변경사항
```

### 2단계: 프로젝트 규칙 체크리스트

각 항목을 검사하고 **위반 시 구체적 코드 위치와 수정 방안**을 제시한다.

#### 백엔드 (server/)

- [ ] **SQLAlchemy 1.x 금지**: `session.query()` 사용 여부 → `await db.execute(select(...))` 2.0 문법
- [ ] **SQL Injection 방지**: `f"SELECT ... {var}"` 또는 `.format()` 사용 여부 → `text()` + `:param` 바인딩
- [ ] **CodeMasterCache**: `JOIN CM_CODEDETAIL` 또는 `fn_GetCodeName()` 사용 여부 → Formatter에서 `CodeMasterCache`
- [ ] **커스텀 예외**: `raise HTTPException(detail=str(e))` → `BusinessLogicException` 등 사용
- [ ] **도메인 격리**: 다른 도메인의 Service를 직접 import/호출 여부 → Repository를 통해서만
- [ ] **5계층 준수**: Router에 비즈니스 로직 / Calculator에 DB 접근 여부
- [ ] **보안**: `eval()`, `exec()`, `os.system()`, `shell=True` 사용 여부
- [ ] **민감 정보**: 코드에 하드코딩된 비밀번호, 키, 접속 정보 여부

#### 프론트엔드 (client/)

- [ ] **core/ui 재사용**: 기존 공통 컴포넌트를 무시하고 직접 구현했는지
- [ ] **수동 camelCase 변환**: `toXxx()` 같은 변환 함수 작성 여부 → Axios 인터셉터 자동 변환
- [ ] **React import**: `import React from 'react'` 여부 → named import만
- [ ] **타입 안전성**: `any` 타입 남용, Skeleton `rounded` boolean 사용 여부
- [ ] **보안**: `eval()`, `innerHTML`, `dangerouslySetInnerHTML` 사용 여부
- [ ] **미사용 import**: 사용하지 않는 import 존재 여부

### 3단계: 리포트 출력

```
## 코드 리뷰 결과

### 위반 사항 (수정 필요)
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
