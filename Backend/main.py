from __future__ import annotations

import os
import signal
import subprocess
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent


def start_backend() -> int:
    env = os.environ.copy()
    process = subprocess.Popen(
        ["node", "server.js"],
        cwd=ROOT_DIR,
        env=env,
    )

    def shutdown(_signum, _frame):
        if process.poll() is None:
            process.terminate()
        raise SystemExit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        return process.wait()
    except KeyboardInterrupt:
        shutdown(signal.SIGINT, None)
        return 0


if __name__ == "__main__":
    sys.exit(start_backend())
