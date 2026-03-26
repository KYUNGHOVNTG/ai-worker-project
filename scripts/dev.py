"""
크로스플랫폼 개발 서버 실행 스크립트

백엔드(FastAPI :8000)와 프론트엔드(Vite :5173)를 동시에 실행합니다.
Ctrl+C로 두 서버 모두 종료합니다.

실행 방법:
    python scripts/dev.py
    make dev
"""

import os
import signal
import subprocess
import sys
from pathlib import Path

# 프로젝트 루트 경로
ROOT = Path(__file__).parent.parent


def main() -> None:
    procs: list[subprocess.Popen] = []

    try:
        # 백엔드 서버
        backend_cmd = [
            sys.executable,
            "-m",
            "uvicorn",
            "server.main:app",
            "--reload",
            "--host",
            "0.0.0.0",
            "--port",
            "8000",
        ]
        procs.append(subprocess.Popen(backend_cmd, cwd=ROOT))

        # 프론트엔드 서버
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        procs.append(subprocess.Popen([npm_cmd, "run", "dev"], cwd=ROOT / "client"))

        # 자식 프로세스가 종료될 때까지 대기
        for p in procs:
            p.wait()

    except KeyboardInterrupt:
        print("\n서버를 종료합니다...")
    finally:
        for p in procs:
            try:
                if sys.platform == "win32":
                    p.terminate()
                else:
                    os.killpg(os.getpgid(p.pid), signal.SIGTERM)
            except (ProcessLookupError, OSError):
                pass
        for p in procs:
            p.wait()


if __name__ == "__main__":
    main()
