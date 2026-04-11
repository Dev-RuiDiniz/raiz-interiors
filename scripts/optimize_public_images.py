from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"
MANIFEST_PATH = ROOT / "src" / "generated" / "webp-manifest.json"
RASTER_EXTENSIONS = {".jpg", ".jpeg", ".png"}
DEFAULT_PROFILE = {
    "max_edge": 2400,
    "quality": 84,
    "alpha_quality": 88,
}
PREMIUM_PROFILE = {
    "max_edge": 3000,
    "quality": 88,
    "alpha_quality": 92,
}
PROFILE_RULES = (
    ("2026/home/galeria_inicial/", PREMIUM_PROFILE),
    ("2026/projects/fotos_capa_menu_projectos/", PREMIUM_PROFILE),
    ("2026/projects/", PREMIUM_PROFILE),
    ("2026/about_us/", PREMIUM_PROFILE),
    ("2026/services/", PREMIUM_PROFILE),
)
SKIP_PREFIXES = ("uploads/admin/",)

try:
    RESAMPLING_LANCZOS = Image.Resampling.LANCZOS
except AttributeError:
    RESAMPLING_LANCZOS = Image.LANCZOS


def build_public_path(path: Path) -> str:
    return "/" + path.relative_to(PUBLIC_DIR).as_posix()


def select_profile(source_path: Path) -> dict[str, int]:
    relative_path = source_path.relative_to(PUBLIC_DIR).as_posix().lower()

    for prefix, profile in PROFILE_RULES:
        if relative_path.startswith(prefix):
            return profile

    return DEFAULT_PROFILE


def should_skip(source_path: Path) -> bool:
    relative_path = source_path.relative_to(PUBLIC_DIR).as_posix().lower()
    return relative_path.startswith(SKIP_PREFIXES)


def is_ui_asset(source_path: Path) -> bool:
    name = source_path.name.lower()
    return "logo" in name or "icon" in name


def create_webp_variant(source_path: Path, profile: dict[str, int]) -> str | None:
    target_path = source_path.with_suffix(".webp")
    source_mtime = source_path.stat().st_mtime

    if target_path.exists() and target_path.stat().st_mtime >= source_mtime:
        return build_public_path(target_path)

    try:
        with Image.open(source_path) as image:
            image = ImageOps.exif_transpose(image)
            width, height = image.size
            longest_edge = max(width, height)
            max_edge = profile["max_edge"]

            if longest_edge > max_edge:
                scale = max_edge / longest_edge
                resized_size = (max(1, round(width * scale)), max(1, round(height * scale)))
                image = image.resize(resized_size, RESAMPLING_LANCZOS)

            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

            save_options = {"format": "WEBP", "method": 6}
            if image.mode == "RGBA":
                if is_ui_asset(source_path):
                    save_options["lossless"] = True
                else:
                    save_options["quality"] = profile["alpha_quality"]
            else:
                save_options["quality"] = profile["quality"]

            image.save(target_path, **save_options)
    except Exception as error:
        print(f"Falha ao converter {source_path}: {error}")
        return None

    return build_public_path(target_path)


def main() -> None:
    manifest: dict[str, str] = {}
    total_converted = 0

    for source_path in sorted(PUBLIC_DIR.rglob("*")):
        if not source_path.is_file():
            continue
        if source_path.suffix.lower() not in RASTER_EXTENSIONS:
            continue
        if should_skip(source_path):
            continue

        profile = select_profile(source_path)
        webp_path = create_webp_variant(source_path, profile)
        if not webp_path:
            continue

        manifest[build_public_path(source_path)] = webp_path
        total_converted += 1

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"WebP variants geradas: {total_converted}")
    print(f"Manifesto salvo em: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
