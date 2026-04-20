#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
SRC_MP3="$ROOT_DIR/../material/基督教资源/新编赞美诗-mp3"
SRC_SCORE="$ROOT_DIR/../material/基督教资源/歌谱"
DST_MP3="$DIST_DIR/assets/mp3"
DST_SCORE="$DIST_DIR/assets/scores"

rm -rf "$DIST_DIR"
mkdir -p "$DST_MP3" "$DST_SCORE"

# Core site files
cp "$ROOT_DIR/index.html" "$DIST_DIR/"
cp "$ROOT_DIR/psalm-data.js" "$DIST_DIR/"

# Deployment notes / metadata files that should remain available in the published bundle.
for f in README.md; do
  cp "$ROOT_DIR/$f" "$DIST_DIR/" 2>/dev/null || true
done

# Copy assets when they exist. Use nullglob to avoid literal patterns on empty dirs.
shopt -s nullglob
if [ -d "$SRC_MP3" ]; then
  cp -f "$SRC_MP3"/*.mp3 "$DST_MP3/" 2>/dev/null || true
fi
if [ -d "$SRC_SCORE" ]; then
  cp -f "$SRC_SCORE"/*.jpg "$DST_SCORE/" 2>/dev/null || true
  cp -f "$SRC_SCORE"/*.png "$DST_SCORE/" 2>/dev/null || true
fi
shopt -u nullglob

# Keep a simple deployment index for sanity checks.
cat > "$DIST_DIR/deploy-info.txt" <<EOF
psalm-400 static bundle
source: $ROOT_DIR
assets: mp3 + scores copied from material/基督教资源
EOF

echo "Built site into $DIST_DIR"
