# Vibe Web Starter 개선 로드맵 초안

> 목표: 웹을 모르는 사람도 쉽게 바이브코딩할 수 있는 소프트랜딩 프레임워크
> 기준: 세팅 쉬움 · 러닝커브 낮음 · 구조 탄탄 · 설명 충분 · 제품화 가능 · 가볍게 유지

---

## 현재 상태 진단

### 잘 되어 있는 것

| 영역 | 상태 | 비고 |
|------|------|------|
| 아키텍처 | ★★★★★ | Layered + Domain Plugin, 매우 체계적 |
| 문서화 | ★★★★☆ | 5,000줄+ 한국어 문서, 초보자 가이드 있음 |
| 코드 품질 도구 | ★★★★★ | black/isort/ruff/mypy/eslint 모두 설정됨 |
| 예제 도메인 | ★★★★☆ | sample_domain으로 전 계층 예시 제공 |
| 타입 안전성 | ★★★★★ | Pydantic v2 + TypeScript 전면 적용 |
| 로깅/모니터링 | ★★★★☆ | Request ID, Health Check, Rich 로깅 |
| CLAUDE.md 체계 | ★★★★☆ | 루트 허브 + 계층별 .md (방금 구성 완료) |

### 부족하거나 없는 것

| 영역 | 상태 | 문제점 |
|------|------|--------|
| 원커맨드 셋업 | ❌ 없음 | 백엔드·프론트 각각 수동 설치 필요 |
| Docker 환경 | ❌ 없음 | 로컬 Python/Node 직접 설치 필수 |
| 인증 시스템 | ⚠️ 스텁만 | JWT 프레임워크만 있고 실제 로그인/회원가입 미구현 |
| DB 시드 데이터 | ❌ 없음 | 첫 실행 시 빈 화면, 초보자 당혹 |
| 테스트 예시 | ⚠️ 부족 | 테스트 디렉토리는 있지만 실행 가능한 예시 부족 |
| UI 컴포넌트 | ⚠️ 기본만 | Button/Card/Input/Modal 4개뿐 |
| 배포 가이드 | ❌ 없음 | 제품화를 위한 배포 설정 전무 |
| CLI 스캐폴딩 | ❌ 없음 | 새 도메인 생성 시 수동 파일 생성 필요 |
| 국제화(i18n) | ❌ 없음 | 한국어 하드코딩 |
| 환경별 분리 | ⚠️ 기본 | .env 하나로 dev/staging/prod 관리 |

---

## 개선 제안 (우선순위순)

### P0: 즉시 필요 (바이브코딩 첫 경험을 좌우)

#### 1. 원커맨드 셋업 스크립트

**현재 문제**: 백엔드(venv → pip install → .env → alembic) + 프론트(cd client → npm install) 최소 6단계

**제안**:
```
# 프로젝트 루트에서 한 줄로 실행
make setup          # 또는 ./setup.sh
```

**구현 범위**:
- `Makefile` 생성 (setup, dev, test, lint, clean 타겟)
- `setup.sh` (크로스 플랫폼 셋업 스크립트)
- Python venv 자동 생성 + 의존성 설치
- `.env.example` → `.env` 자동 복사 (이미 있으면 스킵)
- `npm install` 자동 실행
- 최종 확인 메시지 출력

**Makefile 예시**:
```makefile
.PHONY: setup dev test lint clean

setup:              # 최초 1회: 전체 환경 구성
	python -m venv .venv
	.venv/bin/pip install -r requirements.txt
	cp -n .env.example .env 2>/dev/null || true
	cd client && npm install

dev:                # 백엔드 + 프론트 동시 실행
	@echo "Starting backend on :8000 and frontend on :3000..."
	.venv/bin/python -m server.main & cd client && npm run dev

test:               # 전체 테스트
	.venv/bin/pytest tests/
	cd client && npm run lint

lint:               # 코드 품질 검사
	.venv/bin/black --check server/
	.venv/bin/ruff check server/
	cd client && npm run lint

clean:              # 환경 정리
	rm -rf .venv client/node_modules
```

**무게**: 파일 1~2개, 유지보수 부담 거의 없음

---

#### 2. DB 시드 데이터 + 초기 마이그레이션 자동화

**현재 문제**: 첫 실행 시 Supabase 계정 필요 + SQL 직접 실행 + 빈 화면

**제안**:
- `scripts/seed.py` — 샘플 도메인의 예시 데이터 자동 삽입
- `make setup`에 시드 포함: `alembic upgrade head && python scripts/seed.py`
- SQLite 폴백 옵션 (Supabase 없이도 로컬 개발 가능)

**SQLite 폴백의 가치**:
```
# .env에서 한 줄만 바꾸면 Supabase 없이 시작 가능
DATABASE_URL=sqlite+aiosqlite:///./dev.db
```
- 초보자가 Supabase 가입 없이도 즉시 시작
- 나중에 제품화할 때 PostgreSQL로 전환
- `aiosqlite` 패키지 하나만 추가

**무게**: 스크립트 1개 + aiosqlite 의존성 1개

---

#### 3. 동시 실행 (concurrently) 설정

**현재 문제**: 터미널 2개 열어서 백엔드/프론트 따로 실행

**제안**: 루트 `package.json` 또는 Makefile로 통합
```bash
make dev    # 백엔드 + 프론트 동시 기동
```

또는 루트에 간단한 `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd server && python -m server.main\" \"cd client && npm run dev\"",
    "setup": "cd client && npm install"
  }
}
```

**무게**: Makefile만 쓰면 의존성 추가 없음

---

### P1: 제품화를 위해 중요 (하지만 가볍게)

#### 4. 인증 시스템 실제 구현

**현재 상태**: JWT 프레임워크(python-jose, passlib, bcrypt)는 설치됨, 실제 로그인/회원가입 엔드포인트 미구현

**제안**: 최소한의 인증 도메인 추가
```
server/app/domain/auth/
  models/user.py        # User 모델
  schemas/auth.py       # LoginRequest, RegisterRequest, TokenResponse
  repositories/         # UserRepository
  service.py            # AuthService (register, login, refresh)

client/src/domains/auth/
  types.ts / api.ts / store.ts
  pages/LoginPage.tsx
  pages/RegisterPage.tsx
  components/ProtectedRoute.tsx
```

**범위 제한**: 이메일+비밀번호 로그인만. OAuth는 가이드 문서로 안내.

**무게**: 도메인 1개 추가 (기존 아키텍처 그대로 활용)

---

#### 5. UI 컴포넌트 보강

**현재**: Button, Card, Input, Modal (4개)

**추가 제안** (실제 제품에 필수적인 것만):

| 컴포넌트 | 용도 | 비고 |
|----------|------|------|
| `Table` | 데이터 목록 표시 | 정렬·페이지네이션 포함 |
| `Select` | 드롭다운 선택 | |
| `Toast/Notification` | 성공·에러 알림 | 현재 에러는 콘솔에만 표시 |
| `Tabs` | 탭 네비게이션 | 도메인 페이지 내 구분 |
| `Badge` | 상태 표시 | |
| `Textarea` | 긴 텍스트 입력 | Input의 확장 |
| `Skeleton` | 로딩 플레이스홀더 | |
| `Pagination` | 페이지 전환 | 목록 페이지 필수 |

**접근**: 한번에 다 만들지 말고, 도메인 추가 시 필요한 것부터 점진적으로

**무게**: 파일당 50~100줄, 외부 라이브러리 불필요 (Tailwind로 충분)

---

#### 6. Docker Compose 개발 환경

**제안**: 선택적 Docker 지원 (필수가 아닌 옵션)

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: vibedb
      POSTGRES_USER: vibe
      POSTGRES_PASSWORD: vibe
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  backend:
    build: ./server
    ports: ["8000:8000"]
    depends_on: [db]
    env_file: .env

  frontend:
    build: ./client
    ports: ["3000:3000"]

volumes:
  pgdata:
```

**가치**: Supabase 없이도 로컬 PostgreSQL로 개발 가능
**무게**: docker-compose.yml 1개 + Dockerfile 2개 (각 10줄)

---

### P2: 있으면 좋지만 급하지 않음

#### 7. 도메인 스캐폴딩 CLI

**현재 문제**: 새 도메인 만들 때 10+개 파일을 수동 생성

**제안**: 간단한 Python 스크립트
```bash
python scripts/create_domain.py payment
# → server/app/domain/payment/ (models, schemas, repositories, service)
# → client/src/domains/payment/ (types, api, store, components, pages)
# → "router.py에 이 줄을 추가하세요" 안내 출력
```

**무게**: Python 스크립트 1개 (템플릿 문자열 기반, 100~200줄)

---

#### 8. 테스트 예시 보강

**제안**:
```
tests/
  unit/
    test_sample_calculator.py   # Calculator 단위 테스트 예시
    test_sample_formatter.py    # Formatter 단위 테스트 예시
  integration/
    test_sample_api.py          # API 통합 테스트 예시
    conftest.py                 # 테스트 DB 세션 픽스처
```

- 각 계층별 테스트 작성법을 예시로 보여줌
- `make test`로 한 번에 실행
- 초보자가 "어떻게 테스트를 짜는지" 복사해서 시작 가능

**무게**: 예시 파일 3~4개

---

#### 9. 배포 가이드 (문서만)

실제 배포 설정보다 **문서 가이드**가 더 적절:

```
DOC/DEPLOYMENT_GUIDE.md
  1. Vercel + Supabase (프론트 + 관리형 DB) — 가장 쉬움
  2. Railway (풀스택 원클릭 배포)
  3. Docker + VPS (자체 서버)
```

**무게**: 문서 1개

---

#### 10. 에러 페이지 및 404 처리

**현재**: 라우트 미스매치 시 빈 화면

**제안**:
- `client/src/core/errors/NotFoundPage.tsx` — 404 페이지
- `client/src/core/errors/ErrorPage.tsx` — 500 에러 페이지
- `App.tsx`에 catch-all 라우트 추가

**무게**: 컴포넌트 2개

---

### P3: 장기 (제품 고도화 단계)

#### 11. 국제화 (i18n) 기초 설정

지금은 불필요하지만, 글로벌 제품화 시 필요:
- `react-i18next` 기반 구조만 잡아두기
- `client/src/locales/ko.json`, `en.json`
- 실제 번역은 나중에

#### 12. 환경별 설정 분리

```
.env.development    # 로컬 개발
.env.staging        # 스테이징
.env.production     # 프로덕션
```

#### 13. CI/CD 파이프라인 (GitHub Actions)

```yaml
# .github/workflows/ci.yml
# PR 시: lint + type-check + test
# main merge 시: build + deploy
```

---

## 구현 우선순위 요약

```
Phase 1 (즉시, 1-2일)
├── Makefile (setup/dev/test/lint)
├── SQLite 폴백 옵션
└── DB 시드 스크립트

Phase 2 (1주 내)
├── Auth 도메인 (로그인/회원가입)
├── Toast/Table/Select 컴포넌트
├── 404/에러 페이지
└── Docker Compose (선택적)

Phase 3 (2주 내)
├── 도메인 스캐폴딩 CLI
├── 테스트 예시 보강
└── 배포 가이드 문서

Phase 4 (필요 시)
├── i18n 기초 설정
├── 환경별 설정 분리
└── CI/CD 파이프라인
```

---

## 설계 원칙 (추가 시 반드시 준수)

1. **가볍게 유지** — 외부 라이브러리 최소화, 기존 스택(Tailwind/Zustand/FastAPI)으로 해결
2. **선택적 도입** — Docker, i18n 등은 "있으면 쓰고 없어도 동작" 구조
3. **복사-붙여넣기 가능** — 모든 예시는 그대로 복사해서 동작해야 함
4. **기존 아키텍처 존중** — Layered + Domain Plugin 구조 변경 금지
5. **한국어 우선** — 문서와 주석은 한국어, 코드는 영어
