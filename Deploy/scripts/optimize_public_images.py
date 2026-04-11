from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"
MANIFEST_PATH = ROOT / "src" / "generated" / "webp-manifest.json"
MAX_SIZE = (2200, 2200)
RASTER_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def build_public_path(path: Path) -> str:
    return "/" + path.relative_to(PUBLIC_DIR).as_posix()


def create_webp_variant(source_path: Path) -> str | None:
    target_path = source_path.with_suffix(".webp")

    try:
        with Image.open(source_path) as image:
            image = ImageOps.exif_transpose(image)
            image.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)

            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

            save_options = {"format": "WEBP", "method": 6}
            if image.mode == "RGBA":
                save_options["lossless"] = True
            else:
                save_options["quality"] = 82

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

        webp_path = create_webp_variant(source_path)
        if not webp_path:
            continue

        manifest[build_public_path(source_path)] = webp_path
        total_converted += 1

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"WebP variants geradas: {total_converted}")
    print(f"Manifesto salvo em: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
