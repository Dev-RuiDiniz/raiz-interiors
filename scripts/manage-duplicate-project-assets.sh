#!/usr/bin/env bash

set -euo pipefail

MODE="${1:-}"
APP_ROOT="${2:-$(pwd)}"
BACKUP_ROOT="$APP_ROOT/backup_duplicate_assets_2026"
MANIFEST_PATH="$BACKUP_ROOT/manifest.txt"

if [[ -z "$MODE" ]]; then
  echo "Uso: bash scripts/manage-duplicate-project-assets.sh <quarantine|restore|purge> [app_root]"
  exit 1
fi

FILES=(
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_living_room_suspended_staircase_interior_design_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_microcement_bathroom_detail_interior_design_by_raiz.jpeg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_microcement_bathroom_interior_design_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_microcement_bathroom_interior_design.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_microcement_bathroom_with_walk_in_shower_interior_design_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_microcement_kitchen_interior_design_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_microcement_wood_kitchen_interior_design_by_raiz_2.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_microcement_wood_kitchen_interior_design_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_outdoor_city_terrace_interior_architecture_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_outdoor_city_terrace_with_firepit_interior_architecture_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_room_interior_design_by_raiz_2.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_room_interior_design_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_staircase_interior_architecture_by_raiz.jpg"
  "public/2026/projects/contemporary_city_house/contemporary_minimalist_suspended_staircase_interior_architecture_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/clean_and_minimal_attic_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/clean_and_minimal_attic_design_details_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/elegant_and_luxury_bathroom_interior_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/elegant_and_timeless_marble_bathroom_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/elegant_timeless_luxury_master_suite_bespoke_closet_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/elegant_timeless_luxury_master_suite_bespoke_closet_with_mirror_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/elegant_timeless_luxury_master_suite_bespoke_headboard_by_raiz.png"
  "public/2026/projects/elegant_and_timeless_duplex/elegant_timeless_luxury_master_suite_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/elegant_timeless_luxury_master_suite_interior_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/minimal_and_contemporary_bathroom_design_by_raiz.png"
  "public/2026/projects/elegant_and_timeless_duplex/modern_and_contemporary_bespoke_headboard_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/modern_and_contemporary_bespoke_headboard_interior_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/modern_and_contemporary_bespoke_wardrobe_design_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/modern_contemporary_staircase_design_with_led_lighting_detail_projected_by_raiz.jpg"
  "public/2026/projects/elegant_and_timeless_duplex/modern_contemporary_staircase_design_with_led_lighting_projected_by_raiz.png"
  "public/2026/projects/elegant_and_timeless_duplex/modern_contemporary_suspended_steps_staircase_design_with_led_lighting_projected_by_raiz.png"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_dinning_room_interior_design_by_raiz.jpg"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_living_room_interior_design_by_raiz.jpg"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_living_room_with_curved_sofa_interior_design_by_raiz.jpg"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_living_room_with_fireplace_interior_design_by_raiz.jpg"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_master_suite_interior_design_by_raiz.jpg"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_microcement_bathroom_interior_design_by_raiz.jpg"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_microcement_hall_interior_design_by_raiz.jpg"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_office_interior_design_by_raiz.jpg"
  "public/2026/projects/beach_house_troia/contemporary_beach_house_open_kitchen_and_dinning_room_interior_design_by_raiz.jpg"
  "public/2026/projects/principe_real_pombaline_restoration/principe_18.jpg"
  "public/2026/projects/principe_real_pombaline_restoration/principe_17.jpg"
  "public/2026/projects/principe_real_pombaline_restoration/principe_11.png"
  "public/2026/projects/principe_real_pombaline_restoration/principe_10.jpg"
  "public/2026/projects/principe_real_pombaline_restoration/principe_9.jpg"
  "public/2026/projects/principe_real_pombaline_restoration/principe_6.jpg"
  "public/2026/projects/principe_real_pombaline_restoration/principe_06.jpg"
  "public/2026/projects/principe_real_pombaline_restoration/principe_4.jpg"
  "public/2026/projects/principe_real_pombaline_restoration/principe_2.jpg"
  "public/2026/projects/rural_retreat/stone_ruin_restoration_project_for_a_guest_house_rural_mountain_retreat_by_raiz_2.jpg"
  "public/2026/projects/rural_retreat/stone_ruin_restoration_project_for_a_guest_house_rural_mountain_retreat_by_raiz.jpg"
  "public/2026/projects/rural_retreat/stone_ruin_restoration_project_for_a_rural_mountain_retreat_by_raiz.jpg"
  "public/2026/projects/rural_retreat/textured_old_wood_rural_retreat_in_the_mountain_project_by_raiz.jpg"
  "public/2026/projects/store_and_restauration_atelier/3_img_5845.jpg"
  "public/2026/projects/store_and_restauration_atelier/store_03.jpg"
  "public/2026/projects/store_and_restauration_atelier/img_5811.jpg"
  "public/2026/projects/store_and_restauration_atelier/store_05.jpg"
  "public/2026/projects/store_and_restauration_atelier/img_5850.jpg"
  "public/2026/projects/store_and_restauration_atelier/img_5833.jpg"
  "public/2026/projects/store_and_restauration_atelier/store_08.jpg"
)

ensure_backup_dir() {
  mkdir -p "$BACKUP_ROOT"
}

quarantine() {
  ensure_backup_dir
  : > "$MANIFEST_PATH"

  local moved=0

  for relative_path in "${FILES[@]}"; do
    local source_path="$APP_ROOT/$relative_path"
    local backup_path="$BACKUP_ROOT/$relative_path"

    if [[ ! -f "$source_path" ]]; then
      echo "Ignorado (nao encontrado): $relative_path"
      continue
    fi

    mkdir -p "$(dirname "$backup_path")"
    mv "$source_path" "$backup_path"
    echo "$relative_path" >> "$MANIFEST_PATH"
    echo "Movido para quarentena: $relative_path"
    moved=$((moved + 1))
  done

  echo
  echo "Arquivos movidos: $moved"
  echo "Backup em: $BACKUP_ROOT"
  echo "Manifesto em: $MANIFEST_PATH"
}

restore() {
  if [[ ! -f "$MANIFEST_PATH" ]]; then
    echo "Manifesto nao encontrado em $MANIFEST_PATH"
    exit 1
  fi

  local restored=0

  while IFS= read -r relative_path; do
    [[ -z "$relative_path" ]] && continue

    local source_path="$BACKUP_ROOT/$relative_path"
    local target_path="$APP_ROOT/$relative_path"

    if [[ ! -f "$source_path" ]]; then
      echo "Ignorado (nao encontrado no backup): $relative_path"
      continue
    fi

    mkdir -p "$(dirname "$target_path")"
    mv "$source_path" "$target_path"
    echo "Restaurado: $relative_path"
    restored=$((restored + 1))
  done < "$MANIFEST_PATH"

  echo
  echo "Arquivos restaurados: $restored"
}

purge() {
  if [[ ! -d "$BACKUP_ROOT" ]]; then
    echo "Backup nao encontrado em $BACKUP_ROOT"
    exit 1
  fi

  rm -rf "$BACKUP_ROOT"
  echo "Backup removido em definitivo: $BACKUP_ROOT"
}

case "$MODE" in
  quarantine)
    quarantine
    ;;
  restore)
    restore
    ;;
  purge)
    purge
    ;;
  *)
    echo "Modo invalido: $MODE"
    echo "Uso: bash scripts/manage-duplicate-project-assets.sh <quarantine|restore|purge> [app_root]"
    exit 1
    ;;
esac
