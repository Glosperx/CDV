#!/usr/bin/env bash
#
# Generează variantele WebP responsive din PNG-urile sursă.
#
# Setul anterior (poze/mic, poze/mediu) era inutilizabil: 13 din 15 imagini
# aveau "mic" și "mediu" la aceeași dimensiune (300px), iar raporturile de
# aspect nu corespundeau sursei — manual.png e 1200x1600 (portret), dar
# manual.webp era 300x225 (peisaj). Aici redimensionăm doar pe lățime, cu
# `-resize L 0`, deci înălțimea rezultă proporțional și nu se mai deformează.
#
# Rulare: npm run build:img

set -euo pipefail

cd "$(dirname "$0")/.."

SRC="resurse/imagini/poze"
WIDTHS=(400 800 1200)
QUALITY=80

command -v cwebp >/dev/null 2>&1 || {
  echo "EROARE: cwebp nu este instalat. Rulează: brew install webp" >&2
  exit 1
}

for w in "${WIDTHS[@]}"; do
  mkdir -p "$SRC/w$w"
done

count=0
for png in "$SRC"/*.png; do
  [ -e "$png" ] || continue
  name="$(basename "$png" .png)"

  # Lățimea sursei: nu mărim imaginea peste dimensiunea originală
  src_w="$(sips -g pixelWidth "$png" | awk '/pixelWidth/{print $2}')"

  for w in "${WIDTHS[@]}"; do
    out="$SRC/w$w/$name.webp"
    if [ "$w" -gt "$src_w" ]; then
      # Sursa e mai mică decât nivelul cerut: copiem la dimensiune nativă
      cwebp -quiet -q "$QUALITY" "$png" -o "$out"
    else
      cwebp -quiet -q "$QUALITY" -resize "$w" 0 "$png" -o "$out"
    fi
  done
  count=$((count + 1))
done

echo "Generate variante WebP pentru $count imagini (lățimi: ${WIDTHS[*]})."
for w in "${WIDTHS[@]}"; do
  echo "  w$w: $(du -sh "$SRC/w$w" | cut -f1)"
done
