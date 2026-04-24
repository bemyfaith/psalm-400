#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
SRC_MP3="$ROOT_DIR/assets/mp3"
SRC_SCORE="$ROOT_DIR/assets/scores"
SRC_PSALM_AUDIO="$ROOT_DIR/assets/psalm-audio"
SRC_PSALM_SCORE="$ROOT_DIR/assets/psalm-scores"
DST_MP3="$DIST_DIR/assets/mp3"
DST_SCORE="$DIST_DIR/assets/scores"
DST_PSALM_AUDIO="$DIST_DIR/assets/psalm-audio"
DST_PSALM_SCORE="$DIST_DIR/assets/psalm-scores"

rm -rf "$DIST_DIR"
mkdir -p "$DST_MP3" "$DST_SCORE" "$DST_PSALM_AUDIO" "$DST_PSALM_SCORE"

# Core site files
cp "$ROOT_DIR/index.html" "$DIST_DIR/"
cp "$ROOT_DIR/psalm-data.js" "$DIST_DIR/"
cp "$ROOT_DIR/psalm-data-psalm.js" "$DIST_DIR/"
cp "$ROOT_DIR/psalm-data-f.js" "$DIST_DIR/"

# Deployment notes / metadata files that should remain available in the published bundle.
for f in README.md; do
  cp "$ROOT_DIR/$f" "$DIST_DIR/" 2>/dev/null || true
done

# Copy the checked-in assets into the publish directory.
shopt -s nullglob
if [ -d "$SRC_MP3" ]; then
  cp -f "$SRC_MP3"/*.mp3 "$DST_MP3/" 2>/dev/null || true
fi
if [ -d "$SRC_SCORE" ]; then
  cp -f "$SRC_SCORE"/*.jpg "$DST_SCORE/" 2>/dev/null || true
  cp -f "$SRC_SCORE"/*.png "$DST_SCORE/" 2>/dev/null || true
fi
if [ -d "$SRC_PSALM_AUDIO" ]; then
  cp -f "$SRC_PSALM_AUDIO"/*.mp3 "$DST_PSALM_AUDIO/" 2>/dev/null || true
fi
if [ -d "$SRC_PSALM_SCORE" ]; then
  cp -f "$SRC_PSALM_SCORE"/*.jpg "$DST_PSALM_SCORE/" 2>/dev/null || true
  cp -f "$SRC_PSALM_SCORE"/*.png "$DST_PSALM_SCORE/" 2>/dev/null || true
fi
shopt -u nullglob

# Keep a simple deployment index for sanity checks.
cat > "$DIST_DIR/deploy-info.txt" <<EOF
psalm-400 static bundle
source: $ROOT_DIR
assets: mp3 + scores copied from checked-in assets/
EOF

echo "Built site into $DIST_DIR"
