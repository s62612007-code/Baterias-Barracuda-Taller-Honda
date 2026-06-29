#!/usr/bin/env python3
"""Sube dist/ a www.bateriascali.es (Piensa) por FTP."""

from __future__ import annotations

import os
import sys
from ftplib import FTP, error_perm
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
REMOTE_ROOT = "html"
SITE_URL = os.environ.get("SITE_URL", "https://www.bateriascali.es").rstrip("/")

HOST = os.environ.get("FTP_HOST", "217.160.80.231")
USER = os.environ.get("FTP_USER", "bateriascali.es")
PASS = os.environ.get("FTP_PASS", "")


def ensure_dir(ftp: FTP, path: str) -> None:
    parts = [p for p in path.split("/") if p]
    ftp.cwd("/")
    for part in parts:
        try:
            ftp.cwd(part)
        except error_perm:
            ftp.mkd(part)
            ftp.cwd(part)
    ftp.cwd("/")


def upload_file(ftp: FTP, local: Path, remote: str) -> None:
    remote_dir = "/".join(remote.split("/")[:-1])
    if remote_dir:
        ensure_dir(ftp, remote_dir)
    with local.open("rb") as handle:
        ftp.storbinary(f"STOR {remote}", handle)


def upload_tree(ftp: FTP, local_dir: Path, remote_prefix: str) -> int:
    count = 0
    for path in sorted(local_dir.rglob("*")):
        if path.is_file():
            rel = path.relative_to(local_dir).as_posix()
            remote = f"{remote_prefix}/{rel}" if remote_prefix else rel
            upload_file(ftp, path, remote)
            print(f"  ↑ {remote}")
            count += 1
    return count


def main() -> int:
    if not PASS:
        print("Defina FTP_PASS (o cree .env con DEPLOY_PASS)")
        return 1
    if not DIST.is_dir():
        print("Ejecute npm run build primero")
        return 1

    ftp = FTP(HOST, timeout=120)
    ftp.login(USER, PASS)
    print(f"Conectado → /{REMOTE_ROOT}/")

    uploaded = upload_tree(ftp, DIST, REMOTE_ROOT)
    ftp.quit()
    print(f"\n✓ {uploaded} archivos publicados en {SITE_URL}/#marca-duncan")
    return 0


if __name__ == "__main__":
    sys.exit(main())
