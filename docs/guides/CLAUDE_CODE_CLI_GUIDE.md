# Claude Code CLI 설치 및 기본 사용법 가이드 (Windows)

> Windows 환경에서 Claude Code를 설치하고 터미널 CLI로 사용하는 방법을 단계별로 안내합니다.

---

## 목차

1. [Claude Code란?](#1-claude-code란)
2. [사전 요구사항](#2-사전-요구사항)
3. [설치](#3-설치)
4. [최초 실행 및 인증](#4-최초-실행-및-인증)
5. [기본 사용법](#5-기본-사용법)
6. [주요 슬래시 커맨드](#6-주요-슬래시-커맨드)
7. [프로젝트에서 사용하기](#7-프로젝트에서-사용하기)
8. [비용 및 구독 안내](#8-비용-및-구독-안내)
9. [자주 묻는 질문](#9-자주-묻는-질문)

---

## 1. Claude Code란?

Claude Code는 Anthropic이 만든 **AI 코딩 어시스턴트 CLI 도구**입니다.
터미널에서 직접 Claude와 대화하며 코드 작성, 디버깅, 파일 수정, 프로젝트 탐색 등을 수행할 수 있습니다.

- 프로젝트 파일을 직접 읽고, 수정하고, 실행
- 터미널 명령 자동 실행
- 여러 파일에 걸친 작업 자동화
- 팀 단위 개발 워크플로에 통합 가능

---

## 2. 사전 요구사항

### 운영체제

- Windows 10 또는 Windows Server 2019 이상

### 필수 설치 항목

| 항목 | 이유 | 설치 링크 |
|------|------|----------|
| **Git for Windows** | Claude Code 내부 동작에 필수 | [git-scm.com](https://git-scm.com/download/win) |
| 인터넷 연결 | 설치 및 실행 중 필수 | — |

> **Git 설치 시 주의**: 설치 옵션 중 **"Git from the command line and also from 3rd-party software"** 를 선택해야 합니다.

### npm으로 설치하는 경우만 추가 필요

- **Node.js 18 이상** ([nodejs.org](https://nodejs.org))
- 네이티브 설치 방식 권장 — Node.js 없이도 설치 가능

---

## 3. 설치

### 방법 1. PowerShell로 설치 (권장)

자동 업데이트가 지원되는 공식 네이티브 설치 방법입니다.
**PowerShell을 열고** 아래 명령을 실행하세요 (관리자 권한 불필요):

```powershell
irm https://claude.ai/install.ps1 | iex
```

> PowerShell 여는 법: `Win + R` → `powershell` 입력 → 엔터

---

### 방법 2. CMD로 설치

명령 프롬프트(CMD)를 사용하는 경우:

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

> CMD 여는 법: `Win + R` → `cmd` 입력 → 엔터

---

### 방법 3. WinGet으로 설치

Windows 패키지 매니저(WinGet)를 사용하는 경우 (수동 업데이트):

```powershell
winget install Anthropic.ClaudeCode
```

---

### 방법 4. npm으로 설치

Node.js가 이미 설치된 경우:

```powershell
npm install -g @anthropic-ai/claude-code
```

> npm 방식은 Deprecated 예정이므로 방법 1을 권장합니다.

---

### 설치 확인

터미널을 **새로 열고** 아래 명령을 실행합니다:

```powershell
claude --version
```

버전 번호가 출력되면 설치 성공입니다.

```powershell
claude doctor
```

설치 상태 및 환경을 종합 진단하는 명령어입니다. 문제가 있으면 여기서 확인하세요.

---

## 4. 최초 실행 및 인증

### 처음 실행하기

PowerShell 또는 CMD에서:

```powershell
claude
```

처음 실행하면 **브라우저가 자동으로 열리며 로그인 화면**이 표시됩니다.

---

### 인증 방법 선택

| 방법 | 대상 | 설명 |
|------|------|------|
| **Claude.ai 구독** (권장) | Pro / Max / Team / Enterprise 사용자 | 구독 포함 사용량으로 사용, 별도 과금 없음 |
| **Anthropic Console** | API 크레딧 사용자 | 토큰 기반 과금 |

---

### API Key 방식으로 인증 (Console 사용자)

1. [console.anthropic.com](https://console.anthropic.com)에서 API Key 발급
2. PowerShell에서 환경변수 설정:

```powershell
# 현재 세션에만 적용
$env:ANTHROPIC_API_KEY = "sk-ant-여기에키입력"
```

**영구 설정 (재시작 후에도 유지):**

1. `Win + S` → "환경 변수" 검색 → **"시스템 환경 변수 편집"** 클릭
2. **"환경 변수"** 버튼 클릭
3. "사용자 변수"에서 **"새로 만들기"** 클릭
4. 변수 이름: `ANTHROPIC_API_KEY`, 값: `sk-ant-...` 입력 후 확인

---

### 로그인 / 로그아웃

```powershell
claude auth login    # 로그인 (브라우저 열림)
claude auth logout   # 로그아웃
```

---

## 5. 기본 사용법

### 대화형 모드 (Interactive Mode)

터미널에서 Claude와 여러 차례 대화하며 작업하는 기본 모드입니다.

```powershell
claude
```

`>` 프롬프트가 나타나면 자연어로 요청을 입력합니다:

```
> 현재 디렉토리의 파일 구조를 설명해줘
> src/App.tsx 파일을 읽고 버그를 찾아줘
> 새 컴포넌트 Button.tsx를 만들어줘
```

종료: `Ctrl + D` 또는 `/exit` 입력

---

### 단일 명령 모드 (Non-interactive Mode)

응답 후 즉시 종료되는 모드입니다. 스크립트 자동화에 적합합니다.

```powershell
claude -p "이 프로젝트의 기술 스택을 요약해줘"
```

파이프 입력도 지원합니다:

```powershell
type error.log | claude -p "이 에러의 원인을 분석해줘"
```

---

### 이전 대화 이어받기

```powershell
claude -c          # 가장 최근 대화 재개
claude -r "세션명"  # 특정 세션 재개
```

---

### 주요 CLI 명령어

| 명령어 | 설명 |
|--------|------|
| `claude` | 대화형 세션 시작 |
| `claude "작업 내용"` | 초기 프롬프트와 함께 시작 |
| `claude -p "쿼리"` | 단일 쿼리 실행 후 종료 |
| `claude -c` | 최근 대화 이어받기 |
| `claude --version` | 버전 확인 |
| `claude update` | 수동 업데이트 |
| `claude doctor` | 설치 상태 진단 |
| `claude auth login` | 로그인 |
| `claude auth logout` | 로그아웃 |

---

### 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| `?` | 전체 단축키 목록 표시 |
| `Tab` | 명령어 자동완성 |
| `↑` / `↓` | 이전/다음 입력 기록 탐색 |
| `Shift + Tab` | 권한 모드 전환 (default → plan → auto) |
| `Ctrl + R` | 이전 입력 역방향 검색 |
| `Ctrl + D` | 세션 종료 |

---

## 6. 주요 슬래시 커맨드

대화형 모드에서 `/`로 시작하는 명령어입니다.

### 기본

| 커맨드 | 설명 |
|--------|------|
| `/help` | 사용 가능한 모든 커맨드 목록 표시 |
| `/clear` | 현재 대화 기록 초기화 |
| `/exit` | 세션 종료 (`Ctrl+D`와 동일) |
| `/resume` | 이전 대화 재개 |

### 설정

| 커맨드 | 설명 |
|--------|------|
| `/model` | 사용할 Claude 모델 변경 |
| `/config` | 설정 변경 (모델, 테마 등) |
| `/login` | 계정 로그인 또는 전환 |
| `/logout` | 로그아웃 |

### 프로젝트

| 커맨드 | 설명 |
|--------|------|
| `/memory` | CLAUDE.md 파일 열기/편집 |
| `/status` | 현재 세션 상태 확인 |
| `/cost` | API 토큰 사용량 및 비용 확인 |
| `/mcp` | MCP 서버 관리 |

---

## 7. 프로젝트에서 사용하기

### 프로젝트 폴더에서 실행

프로젝트 폴더 안에서 `claude`를 실행하면 해당 디렉토리를 기준으로 파일 읽기/쓰기가 수행됩니다.

```powershell
cd C:\Users\나\프로젝트폴더
claude
```

```
> package.json을 읽고 의존성 목록을 정리해줘
> src/components/ 폴더 구조를 설명해줘
> README.md를 한국어로 다시 작성해줘
```

---

### CLAUDE.md — 프로젝트 지침 파일

프로젝트 루트에 `CLAUDE.md` 파일을 작성하면 Claude가 세션 시작 시 **자동으로 로드**합니다.
프로젝트의 규칙, 기술 스택, 주의사항 등을 여기에 작성해두면 매번 설명할 필요가 없습니다.

```
my-project/
├── CLAUDE.md     ← 여기에 프로젝트 규칙 작성
├── src/
└── ...
```

**CLAUDE.md 작성 예시:**
```markdown
# 프로젝트 이름

## 기술 스택
- Backend: FastAPI + SQLAlchemy
- Frontend: React + TypeScript

## 핵심 규칙
- 모든 API 응답은 ApiResponse[T] 래퍼 사용
- TypeScript any 타입 사용 금지
- DB 변경 시 반드시 Alembic 마이그레이션 사용
```

---

### .claude/ 디렉토리

프로젝트별 Claude 설정 파일을 저장하는 폴더입니다.

```
.claude/
├── settings.json    # 허용/차단할 명령어 등 권한 설정
└── skills/          # 커스텀 슬래시 커맨드 정의
```

**settings.json 예시 (특정 명령어만 허용):**
```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Edit", "Write"],
    "deny": ["Bash(rm -rf *)"]
  }
}
```

---

### 터미널 명령 직접 실행 (`!` 접두사)

대화형 모드에서 `!`를 붙이면 셸 명령을 직접 실행할 수 있습니다.

```
> ! npm install
> ! git status
> ! dir
```

---

## 8. 비용 및 구독 안내

### 구독 플랜별 비교

| 플랜 | 비용 | Claude Code 사용 |
|------|------|-----------------|
| **Claude Pro** | 월 $20 | 구독 포함, 별도 과금 없음 |
| **Claude Max** | 월 $100 / $200 | 더 높은 사용량 한도 |
| **Claude Team** | 사용자당 월 $30 | 팀 협업 + 관리 기능 |
| **API (Console)** | 토큰 기반 과금 | 사용량만큼 과금 |

> **권장**: Claude Pro 이상 구독 시 Claude Code 사용이 구독에 포함되어 별도 과금이 없습니다.

---

### 사용량 확인

대화형 모드에서 `/cost`를 입력하면 현재 세션의 토큰 사용량과 비용을 확인할 수 있습니다.

---

## 9. 자주 묻는 질문

### Q. 설치 후 `claude`를 입력하면 "명령을 찾을 수 없습니다" 오류가 나요

터미널을 **완전히 닫고 새로 열어서** 다시 시도하세요.
그래도 안 된다면 `claude doctor`로 진단하거나, 설치를 다시 진행하세요.

---

### Q. Git 관련 오류가 발생해요

Git for Windows가 설치되어 있지 않거나 PATH에 등록되지 않은 경우입니다.

1. [git-scm.com](https://git-scm.com/download/win)에서 Git 설치
2. 설치 시 **"Git from the command line and also from 3rd-party software"** 옵션 선택
3. 터미널 재시작 후 `git --version`으로 확인

---

### Q. 최신 버전으로 업데이트하려면?

```powershell
claude update
```

PowerShell로 네이티브 설치한 경우 **백그라운드에서 자동 업데이트**됩니다.

---

### Q. 회사 프록시 환경에서 사용하려면?

PowerShell에서 환경변수로 프록시를 설정하세요:

```powershell
$env:HTTPS_PROXY = "http://proxy.company.com:8080"
```

영구 설정은 시스템 환경 변수에 `HTTPS_PROXY`를 추가하세요.

---

### Q. 사용할 모델을 변경하고 싶어요

대화 중 `/model` 커맨드로 변경하거나, 시작 시 플래그를 사용하세요:

```powershell
claude --model claude-opus-4-6
```

| 모델 ID | 특징 |
|---------|------|
| `claude-sonnet-4-6` | 기본값, 빠르고 균형 잡힌 성능 |
| `claude-opus-4-6` | 최고 성능, 복잡한 작업에 적합 |
| `claude-haiku-4-5-20251001` | 빠른 응답, 간단한 작업에 적합 |

---

### Q. WSL(Windows Subsystem for Linux)에서 사용하려면?

WSL 터미널에서 Linux 설치 명령을 사용하세요:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

WSL과 Windows 네이티브 환경은 **별도 설치**가 필요합니다.

---

## 참고 링크

- 공식 문서: [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code)
- 이슈 및 피드백: [github.com/anthropics/claude-code/issues](https://github.com/anthropics/claude-code/issues)
