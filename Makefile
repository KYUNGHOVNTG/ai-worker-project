.PHONY: setup dev test lint clean migrate seed help

PYTHON := .venv/bin/python
PIP    := .venv/bin/pip
PYTEST := .venv/bin/pytest
BLACK  := .venv/bin/black
ISORT  := .venv/bin/isort
RUFF   := .venv/bin/ruff
MYPY   := .venv/bin/mypy
ALEMBIC := .venv/bin/alembic

# ──────────────────────────────────────────────
# help
# ──────────────────────────────────────────────
help:
	@echo ""
	@echo "Vibe Web Starter — 사용 가능한 명령어"
	@echo "────────────────────────────────────────"
	@echo "  make setup    개발 환경 전체 구성 (최초 1회)"
	@echo "  make dev      백엔드 + 프론트엔드 동시 실행"
	@echo "  make test     pytest + lint 실행"
	@echo "  make lint     코드 품질 전체 검사"
	@echo "  make migrate  alembic upgrade head 실행"
	@echo "  make seed     시드 데이터 삽입"
	@echo "  make clean    빌드 캐시 및 가상환경 삭제"
	@echo ""

# ──────────────────────────────────────────────
# setup: 클린 환경에서 전체 개발 환경 구성
# ──────────────────────────────────────────────
setup:
	@echo "==> [1/5] Python 가상환경 생성 중..."
	python3 -m venv .venv

	@echo "==> [2/5] Python 패키지 설치 중..."
	$(PIP) install --upgrade pip -q
	$(PIP) install -r requirements.txt -q

	@echo "==> [3/5] .env 파일 설정 중..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "    .env 파일을 .env.example에서 복사했습니다."; \
		echo "    ⚠️  .env 파일을 열어 DATABASE_URL 등 설정을 확인하세요."; \
	else \
		echo "    .env 파일이 이미 존재합니다. 덮어쓰지 않습니다."; \
	fi

	@echo "==> [4/5] 프론트엔드 패키지 설치 중..."
	cd client && npm install --silent

	@echo "==> [5/5] DB 마이그레이션 + 시드 데이터 삽입 중..."
	$(ALEMBIC) upgrade head
	@if [ -f scripts/seed.py ]; then \
		$(PYTHON) scripts/seed.py; \
	else \
		echo "    scripts/seed.py 없음 — 시드 건너뜀"; \
	fi

	@echo ""
	@echo "✅ setup 완료! 'make dev'로 서버를 시작하세요."

# ──────────────────────────────────────────────
# dev: 백엔드 + 프론트엔드 동시 실행 (Ctrl+C로 종료)
# ──────────────────────────────────────────────
dev:
	@echo "==> 백엔드(:8000) + 프론트엔드(:5173) 시작..."
	@trap 'kill 0' INT; \
	$(PYTHON) -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000 & \
	cd client && npm run dev & \
	wait

# ──────────────────────────────────────────────
# test: pytest + 프론트엔드 lint
# ──────────────────────────────────────────────
test:
	@echo "==> pytest 실행 중..."
	$(PYTEST) tests/ -v
	@echo "==> 프론트엔드 lint 실행 중..."
	cd client && npm run lint

# ──────────────────────────────────────────────
# lint: 전체 코드 품질 검사
# ──────────────────────────────────────────────
lint:
	@echo "==> [백엔드] black 포맷 검사..."
	$(BLACK) --check server/
	@echo "==> [백엔드] isort 임포트 정렬 검사..."
	$(ISORT) --check-only server/
	@echo "==> [백엔드] ruff 린팅..."
	$(RUFF) check server/
	@echo "==> [백엔드] mypy 타입 검사..."
	$(MYPY) server/
	@echo "==> [프론트엔드] tsc 타입 검사..."
	cd client && npx tsc --noEmit
	@echo "==> [프론트엔드] eslint..."
	cd client && npm run lint

# ──────────────────────────────────────────────
# migrate: alembic upgrade head
# ──────────────────────────────────────────────
migrate:
	@echo "==> DB 마이그레이션 실행 중..."
	$(ALEMBIC) upgrade head

# ──────────────────────────────────────────────
# seed: 시드 데이터 삽입
# ──────────────────────────────────────────────
seed:
	@echo "==> 시드 데이터 삽입 중..."
	$(PYTHON) scripts/seed.py

# ──────────────────────────────────────────────
# clean: 캐시·가상환경·빌드 산출물 삭제
# ──────────────────────────────────────────────
clean:
	@echo "==> .venv 삭제 중..."
	rm -rf .venv
	@echo "==> client/node_modules 삭제 중..."
	rm -rf client/node_modules
	@echo "==> __pycache__ 및 .pyc 파일 삭제 중..."
	find . -type d -name "__pycache__" -not -path "./.venv/*" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -not -path "./.venv/*" -delete 2>/dev/null || true
	@echo "==> client/dist 삭제 중..."
	rm -rf client/dist
	@echo "✅ clean 완료"
