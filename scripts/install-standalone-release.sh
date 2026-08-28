#!/usr/bin/env bash
set -euo pipefail

ARCHIVE=${1:?"usage: install-standalone-release.sh <artifact.tar.gz> [release-id]"}
RELEASE_ID=${2:-$(date -u +%Y%m%d%H%M%S)}
APP_ROOT=${APP_ROOT:-/srv/apps/klyvo-pod}
RELEASES_DIR="$APP_ROOT/releases"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"
CURRENT_LINK="$APP_ROOT/current"
SERVICE=${SERVICE:-klyvo.service}
HEALTH_URL=${HEALTH_URL:-http://127.0.0.1:3010/api/health}

mkdir -p "$RELEASES_DIR"
mkdir "$RELEASE_DIR"
tar -xzf "$ARCHIVE" -C "$RELEASE_DIR"

if [[ ! -f "$RELEASE_DIR/server.js" ]]; then
  echo "invalid standalone artifact: server.js missing" >&2
  rm -rf "$RELEASE_DIR"
  exit 1
fi

PREVIOUS=""
if [[ -L "$CURRENT_LINK" ]]; then PREVIOUS=$(readlink -f "$CURRENT_LINK" || true); fi

ln -s "$RELEASE_DIR" "$APP_ROOT/current.next"
mv -Tf "$APP_ROOT/current.next" "$CURRENT_LINK"
systemctl restart "$SERVICE"

for _ in {1..20}; do
  if curl --fail --silent "$HEALTH_URL" >/dev/null; then
    mapfile -t old_releases < <(find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -nr | tail -n +6 | cut -d' ' -f2-)
    for old_release in "${old_releases[@]}"; do
      [[ "$old_release" == "$(readlink -f "$CURRENT_LINK")" ]] || rm -rf -- "$old_release"
    done
    echo "activated $RELEASE_DIR"
    exit 0
  fi
  sleep 1
done

echo "health check failed; rolling back" >&2
if [[ -n "$PREVIOUS" && -d "$PREVIOUS" ]]; then
  ln -s "$PREVIOUS" "$APP_ROOT/current.rollback"
  mv -Tf "$APP_ROOT/current.rollback" "$CURRENT_LINK"
  systemctl restart "$SERVICE"
fi
exit 1
