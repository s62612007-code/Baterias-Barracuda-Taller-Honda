#!/usr/bin/env python3
"""Elimina en FTP archivos/carpetas del cotizador que ya no están en dist/."""

from __future__ import annotations

import os
import sys
from ftplib import FTP, error_perm
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
REMOTE_ROOT = "html"

HOST = os.environ.get("FTP_HOST", "217.76.150.40")
USER = os.environ.get("FTP_USER", "hondabateriacali.com")
PASS = os.environ.get("FTP_PASS", "")


def expected_paths() -> set[str]:
    paths: set[str] = set()
    for file in DIST.rglob("*"):
        if file.is_file():
            rel = file.relative_to(DIST).as_posix()
            paths.add(f"{REMOTE_ROOT}/{rel}")
    return paths


def list_remote_files(ftp: FTP, prefix: str = REMOTE_ROOT) -> list[str]:
    """Lista rutas relativas a / de todos los archivos bajo prefix."""
    files: list[str] = []
    stack = [prefix]

    while stack:
        current = stack.pop()
        try:
            ftp.cwd("/")
            for part in current.split("/"):
                if part:
                    ftp.cwd(part)
        except error_perm:
            continue

        entries: list[str] = []
        try:
            ftp.retrlines("NLST", entries.append)
        except error_perm:
            continue

        for name in entries:
            if name in (".", ".."):
                continue
            path = f"{current}/{name}" if current else name
            try:
                ftp.cwd("/")
                for part in path.split("/"):
                    if part:
                        ftp.cwd(part)
                # es directorio
                stack.append(path)
                ftp.cwd("/")
            except error_perm:
                files.append(path)

    return sorted(files)


def delete_file(ftp: FTP, remote: str) -> None:
    ftp.cwd("/")
    parts = remote.split("/")
    name = parts[-1]
    for part in parts[:-1]:
        if part:
            ftp.cwd(part)
    ftp.delete(name)


def delete_dir(ftp: FTP, remote: str) -> None:
    ftp.cwd("/")
    parts = [p for p in remote.split("/") if p]
    for part in parts[:-1]:
        ftp.cwd(part)
    ftp.rmd(parts[-1])


def main() -> int:
    if not PASS:
        print("Defina FTP_PASS en .env")
        return 1
    if not DIST.is_dir():
        print("Ejecute npm run build primero")
        return 1

    keep = expected_paths()
    ftp = FTP(HOST, timeout=120)
    ftp.login(USER, PASS)
    print(f"Conectado → /{REMOTE_ROOT}/")

    remote_files = list_remote_files(ftp)
    orphans = [p for p in remote_files if p not in keep]

    if not orphans:
        print("✓ Sin archivos huérfanos")
        ftp.quit()
        return 0

    print(f"Eliminando {len(orphans)} archivo(s) del cotizador antiguo…")
    for path in sorted(orphans, key=len, reverse=True):
        try:
            delete_file(ftp, path)
            print(f"  ✕ {path}")
        except error_perm as exc:
            print(f"  ! {path}: {exc}")

    # Quitar carpetas vacías conocidas del cotizador
    for folder in (
        f"{REMOTE_ROOT}/config",
        f"{REMOTE_ROOT}/data",
        f"{REMOTE_ROOT}/images",
        f"{REMOTE_ROOT}/images/logos",
        f"{REMOTE_ROOT}/images/referencias",
    ):
        try:
            delete_dir(ftp, folder)
            print(f"  ✕ dir {folder}/")
        except error_perm:
            pass

    ftp.quit()
    print(f"\n✓ Limpieza completada ({len(orphans)} archivos)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
