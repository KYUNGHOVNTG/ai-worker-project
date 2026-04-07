# 초보자를 위한 프로젝트 설치 및 실행 가이드

> 웹 개발 경험이 없어도 따라할 수 있는 단계별 안내서입니다.

---

## 이 프로젝트는 뭔가요?

**vibe-web-starter**는 웹 서비스를 만들기 위한 **템플릿(틀)**입니다.
마치 파워포인트 템플릿처럼, 기본 구조가 이미 만들어져 있어서 내용만 채우면 됩니다.

- **백엔드** (서버): 데이터를 저장하고 처리하는 부분 → Python으로 작성
- **프론트엔드** (화면): 사용자가 보는 웹 화면 → React(JavaScript)로 작성

---

## 1단계: 필요한 프로그램 설치

아래 3가지를 먼저 설치해야 합니다. 이미 설치되어 있다면 건너뛰세요.

### 1-1. Python 설치

1. https://www.python.org/downloads/ 접속
2. **"Download Python 3.12.x"** 버튼 클릭
3. 다운로드된 파일 실행
4. **중요**: 설치 화면 하단의 **"Add Python to PATH"** 체크박스를 반드시 체크
5. "Install Now" 클릭

**설치 확인**: 터미널(명령 프롬프트)을 열고 입력:
```
python --version
```
`Python 3.12.x` 같은 버전이 표시되면 성공입니다.

### 1-2. Node.js 설치

1. https://nodejs.org/ 접속
2. **LTS 버전** (왼쪽 버튼) 클릭하여 다운로드
3. 다운로드된 파일 실행, 모든 옵션 기본값으로 설치

**설치 확인**:
```
node --version
```
`v18.x.x` 이상이면 성공입니다.

### 1-3. Git 설치

1. https://git-scm.com/downloads 접속
2. 운영체제에 맞는 버전 다운로드 후 설치 (모든 옵션 기본값)

**설치 확인**:
```
git --version
```

---

## 2단계: 프로젝트 다운로드

터미널을 열고 원하는 폴더로 이동한 뒤:

```powershell
git clone https://github.com/KYUNGHOVNTG/vibe-web-starter.git
cd vibe-web-starter
```

---

## 3단계: 프로젝트 설치 및 실행

PowerShell을 열고 프로젝트 폴더에서 아래 명령어를 **순서대로** 실행하세요.

```powershell
# ① Python 가상환경 생성
python -m venv .venv

# ② Python 패키지 설치
.venv\Scripts\python -m pip install --upgrade pip -q
.venv\Scripts\pip install -r requirements.txt -q

# ③ 환경 변수 파일 생성
if (!(Test-Path .env)) { Copy-Item .env.example .env }

# ④ 프론트엔드 패키지 설치
cd client; npm install --silent; cd ..

# ⑤ 데이터베이스 초기화
.venv\Scripts\python -m alembic upgrade head

# ⑥ 샘플 데이터 삽입
.venv\Scripts\python scripts\seed.py

# ⑦ 개발 서버 실행
.venv\Scripts\python scripts\dev.py
```

---

## 4단계: 동작 확인

서버가 실행되면 웹 브라우저를 열고 아래 주소로 접속하세요:

| 화면 | 주소 | 설명 |
|------|------|------|
| 메인 페이지 | http://localhost:5173 | 프론트엔드 화면 |
| API 문서 | http://localhost:8000/docs | 백엔드 API 테스트 화면 |
| 디자인 시스템 | http://localhost:5173/design-system | UI 컴포넌트 쇼케이스 |
| CRUD 데모 | http://localhost:5173/sample | 데이터 생성/조회/수정/삭제 예시 |

> **http://localhost:8000/docs** 페이지에서 API를 직접 테스트해볼 수 있습니다.
> 각 API 항목을 클릭 → "Try it out" → "Execute" 하면 결과를 바로 확인할 수 있습니다.

---

## 서버 종료 방법

터미널에서 `Ctrl + C`를 누르면 백엔드와 프론트엔드가 모두 종료됩니다.

---

## 다음에 다시 실행할 때

설치는 최초 1회만 하면 됩니다. 이후에는 실행 명령만:

```powershell
.venv\Scripts\python scripts\dev.py
```

---

## 문제가 생겼을 때

| 증상 | 해결 방법 |
|------|----------|
| `python`을 못 찾음 | Python 설치 시 "Add to PATH" 체크 확인. 터미널을 닫고 다시 열기 |
| `npm`을 못 찾음 | Node.js 설치 확인. 터미널을 닫고 다시 열기 |
| 포트가 이미 사용중 | 다른 프로그램이 8000 또는 5173 포트를 쓰고 있음. 해당 프로그램 종료 |
| DB 에러 | `dev.db` 파일 삭제 후 마이그레이션 재실행 |
