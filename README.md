# Vibe Web Starter

> **"유지보수성 최우선" 및 "모듈화"를 핵심 가치로 하는 바이브 코딩(Vibe Coding) 환경**

FastAPI + SQLAlchemy 2.0 + React 19 + Tailwind 4 기반의 Production-Ready 풀스택 웹 애플리케이션 템플릿

---

## 핵심 특징

- **도메인 플러그인 구조**: 새로운 비즈니스 도메인을 독립적으로 추가 가능 (충돌 최소화)
- **계층화된 아키텍처**: 명확한 책임 분리로 테스트 가능하고 유지보수 쉬움
- **타입 안전성**: Pydantic v2 + SQLAlchemy 2.0 + TypeScript로 런타임 에러 최소화
- **비동기 최적화**: async/await 기반으로 높은 처리량 보장
- **모던 기술 스택**: React 19, Tailwind 4, Zustand 등 최신 기술 적용
- **운영 준비 완료**: Request ID 로깅, Health Check, 전역 에러/로딩 처리 내장

---

## 기술 스택

### 백엔드
- **Framework**: FastAPI 0.109.0
- **ORM**: SQLAlchemy 2.0.25 (async)
- **Database**: SQLite (기본) / PostgreSQL (선택)
- **Migration**: Alembic 1.13.1
- **Validation**: Pydantic v2.5.3
- **Auth**: JWT (python-jose)

### 프론트엔드
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **State**: Zustand 5.0.9
- **Router**: React Router DOM 7.12.0

---

## 빠른 시작

### 사전 준비

- **Python 3.12+**: [다운로드](https://www.python.org/downloads/) (설치 시 "Add Python to PATH" 체크)
- **Node.js 18+**: [다운로드](https://nodejs.org/)
- **Git**: [다운로드](https://git-scm.com/downloads)

### 셋업

PowerShell을 열고 프로젝트 폴더로 이동한 뒤 아래 명령어를 **순서대로** 실행하세요.

**① Python 가상환경 생성** — 프로젝트 전용 패키지 공간을 만듭니다.
```powershell
python -m venv .venv
```

**② Python 패키지 설치** — 백엔드 의존성을 설치합니다.
```powershell
.venv\Scripts\python -m pip install --upgrade pip -q
.venv\Scripts\pip install -r requirements.txt -q
```

**③ 환경 변수 파일 생성** — `.env.example`을 복사해 `.env`를 만듭니다. (이미 있으면 건너뜁니다)
```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

**④ 프론트엔드 패키지 설치** — React 의존성을 설치합니다.
```powershell
cd client; npm install --silent; cd ..
```

**⑤ 데이터베이스 초기화** — 테이블을 생성합니다.   `
```powershell
.venv\Scripts\python -m alembic upgrade head
```

**⑥ 초기 데이터 삽입** — 샘플 데이터를 넣습니다.
```powershell
.venv\Scripts\python scripts\seed.py
```

**⑦ 개발 서버 실행** — 백엔드와 프론트엔드를 동시에 시작합니다.
```powershell
.venv\Scripts\python scripts\dev.py
```

> **`make` 사용하기** — `make setup` / `make dev` 같은 명령어를 쓰고 싶다면 아래 가이드를 따르세요.

<details>
<summary>▶ <code>make</code> 설치 및 설정 (초보자 전체 과정)</summary>

### 1단계 — Git Bash 설치

Git을 아직 설치하지 않았다면 [git-scm.com/downloads](https://git-scm.com/downloads)에서 다운로드하세요.
설치 중 옵션은 **모두 기본값**으로 두면 됩니다. 설치가 완료되면 **Git Bash** 터미널이 함께 설치됩니다.

> 이미 Git이 설치되어 있다면 이 단계는 건너뜁니다.

---

### 2단계 — `make` 설치

아래 두 가지 방법 중 편한 것을 선택하세요. **방법 A (winget)** 가 더 간단합니다.

#### 방법 A: winget 사용 (Windows 10/11 권장)

PowerShell 또는 명령 프롬프트를 열고 다음을 실행합니다:

```powershell
winget install GnuWin32.Make
```

설치가 완료되면 **3단계**로 이동하세요.

#### 방법 B: 직접 다운로드

1. [gnuwin32.sourceforge.net/packages/make.htm](https://gnuwin32.sourceforge.net/packages/make.htm) 접속
2. **"Complete package, except sources"** 링크 클릭하여 설치 파일(`.exe`) 다운로드
3. 다운로드한 `.exe` 실행 → 설치 경로는 기본값(`C:\Program Files (x86)\GnuWin32`) 유지

---

### 3단계 — PATH 환경 변수 등록

`make`를 어느 터미널에서나 쓸 수 있게 시스템 PATH에 추가해야 합니다.

1. 키보드에서 `Windows 키 + S` → "환경 변수" 검색 → **"시스템 환경 변수 편집"** 클릭
2. 하단의 **"환경 변수(N)..."** 버튼 클릭
3. "시스템 변수" 목록에서 **`Path`** 선택 → **"편집"** 클릭
4. **"새로 만들기"** 클릭 후 아래 경로 붙여넣기:
   ```
   C:\Program Files (x86)\GnuWin32\bin
   ```
5. **확인 → 확인 → 확인** 으로 창을 모두 닫습니다.

> winget으로 설치했다면 경로가 다를 수 있습니다.
> Git Bash를 열고 `which make` 를 실행해서 경로가 표시되면 이미 인식된 것입니다.

---

### 4단계 — 설치 확인

**Git Bash**를 새로 열고 (기존에 열려 있던 창은 PATH 변경이 반영 안 됩니다) 아래 명령어를 실행합니다:

```bash
make --version
```

아래와 비슷한 내용이 출력되면 정상입니다:

```
GNU Make 3.81
...
```

---

### 5단계 — VS Code에서 Git Bash를 기본 터미널로 설정

VS Code 터미널에서 `make` 명령어를 바로 쓰려면 터미널을 Git Bash로 바꿔야 합니다.

1. VS Code에서 `Ctrl + Shift + P` → **"Terminal: Select Default Profile"** 검색 후 클릭
2. 목록에서 **"Git Bash"** 선택
3. 이후 `Ctrl + `` ` `` ` 로 새 터미널을 열면 Git Bash가 기본으로 열립니다.

---

### 6단계 — 프로젝트 실행

Git Bash 터미널에서 프로젝트 폴더로 이동한 뒤 실행합니다:

```bash
make setup   # 최초 1회: 가상환경, 의존성, DB 초기화
make dev     # 백엔드(:8000) + 프론트엔드(:5173) 동시 실행
```

</details>

### 확인

| 서비스 | 주소 |
|--------|------|
| 프론트엔드 | http://localhost:5173 |
| 백엔드 API 문서 | http://localhost:8000/docs |
| Health Check | http://localhost:8000/core/health |

---

## 데이터베이스 설정

### 기본: SQLite (설정 불필요)

`make setup` 실행 시 자동으로 `dev.db` 파일이 생성됩니다. 별도 DB 설치 없이 바로 개발을 시작할 수 있습니다.

### 선택: PostgreSQL / Supabase

운영 환경이나 PostgreSQL이 필요한 경우 `.env` 파일을 수정하세요:

```env
# SQLite 줄을 주석 처리하고 아래를 활성화
# DATABASE_URL=sqlite+aiosqlite:///./dev.db
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
```

Supabase 사용 시:
1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. Settings > Database > Connection string (Transaction pooler) 복사
3. `postgresql://` → `postgresql+asyncpg://` 변경
4. 비밀번호 특수문자 URL 인코딩 (`!` → `%21`, `@` → `%40`)

---

## Makefile 전체 명령어

| 명령어 | 설명 |
|--------|------|
| `make setup` | 전체 개발 환경 구성 (최초 1회) |
| `make dev` | 백엔드 + 프론트엔드 동시 실행 |
| `make test` | pytest + 프론트엔드 lint |
| `make lint` | black, isort, ruff, mypy, tsc, eslint 전체 검사 |
| `make migrate` | `alembic upgrade head` 실행 |
| `make seed` | 시드 데이터 삽입 (`scripts/seed.py`) |
| `make sdd-sync` | 스키마 동기화 (OpenAPI → TS 타입 자동 생성) |
| `make clean` | `.venv`, `node_modules`, `__pycache__` 삭제 |

---

## 프로젝트 구조

```
vibe-web-starter/
├── server/                      # 백엔드 (FastAPI)
│   ├── main.py                  # 진입점
│   └── app/
│       ├── core/                # 핵심 인프라
│       ├── shared/              # 공유 컴포넌트
│       ├── domain/              # 비즈니스 도메인
│       └── api/                 # API 엔드포인트
│
├── client/                      # 프론트엔드 (React)
│   └── src/
│       ├── core/                # 핵심 유틸리티
│       └── domains/             # 도메인별 기능
│
├── alembic/                     # DB 마이그레이션
├── scripts/                     # 유틸리티 스크립트
├── tests/                       # 테스트
├── docs/                        # 프로젝트 문서
├── .env.example                 # 환경 변수 예제
├── requirements.txt             # Python 의존성
└── Makefile                     # 개발 명령어 (크로스플랫폼)
```

---

## 문서 가이드

| 문서 | 내용 |
|------|------|
| [초보자 설치 가이드](./docs/guides/BEGINNER_SETUP_GUIDE.md) | 비개발자용 단계별 설치·실행 안내 |
| [개발자 설치 가이드](./docs/guides/DEVELOPER_SETUP_GUIDE.md) | 개발자용 빠른 환경 구성 |
| [아키텍처 가이드](./docs/guides/ARCHITECTURE_GUIDE.md) | 시스템 설계 철학 및 레이어 구조 |
| [개발 가이드](./docs/guides/DEVELOPMENT_GUIDE.md) | 도메인 추가 6단계, 코딩 규칙, 마이그레이션 |
| [server/README.md](./server/README.md) | 백엔드 상세 가이드 |
| [client/README.md](./client/README.md) | 프론트엔드 상세 가이드 |

---

## 개발 워크플로우

### 새 도메인 추가
```bash
# 백엔드
mkdir -p server/app/domain/{domain_name}/{models,schemas,repositories,calculators,formatters}

# 프론트엔드
mkdir -p client/src/domains/{domain_name}/{components,pages}
```

자세한 내용은 [docs/guides/DEVELOPMENT_GUIDE.md](./docs/guides/DEVELOPMENT_GUIDE.md) 참조

### DB 스키마 변경 (반드시 Alembic 사용)
```bash
make migrate                                              # 마이그레이션 적용
.venv/bin/alembic revision --autogenerate -m "설명"       # 새 마이그레이션 생성
```

---

## 라이센스

MIT License
