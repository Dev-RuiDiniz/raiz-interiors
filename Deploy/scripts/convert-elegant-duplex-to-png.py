from pathlib import Path
from PIL import Image
import json
import shutil

root = Path(r"d:/Grafica RJ Print/raiz-interiors/Deploy")
project_dir = root / "public/2026/projects/elegant_and_timeless_duplex"
cover_path = root / "public/2026/projects/fotos_capa_menu_projectos/elegant_and_tmeless_duplex.jpg"
data_path = root / "data/admin-projects.json"

backup_dir = project_dir / "_backup_before_png_conversion"
backup_dir.mkdir(exist_ok=True)

converted_map = {}

for path in sorted(project_dir.iterdir()):
    if not path.is_file():
        continue
    if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue

    backup_path = backup_dir / path.name
    if not backup_path.exists():
        shutil.copy2(path, backup_path)

    target = path.with_suffix(".png")
    with Image.open(path) as img:
        img.convert("RGB").save(target, format="PNG", optimize=True)

    converted_map[path.name] = target.name
    if path.resolve() != target.resolve() and path.exists():
        path.unlink()

cover_backup_dir = cover_path.parent / "_backup_before_png_conversion"
cover_backup_dir.mkdir(exist_ok=True)
cover_backup = cover_backup_dir / cover_path.name
if cover_path.exists():
    if not cover_backup.exists():
        shutil.copy2(cover_path, cover_backup)
    cover_png = cover_path.with_suffix(".png")
    with Image.open(cover_path) as img:
        img.convert("RGB").save(cover_png, format="PNG", optimize=True)
    cover_path.unlink()
else:
    cover_png = cover_path.with_suffix(".png")

data = json.loads(data_path.read_text(encoding="utf-8"))

for project in data:
    if project.get("slug") != "elegant-timeless-duplex":
        continue

    if isinstance(project.get("coverImage"), str):
        project["coverImage"] = project["coverImage"].rsplit(".", 1)[0] + ".png"

    images = project.get("images", [])
    project["images"] = [img.rsplit(".", 1)[0] + ".png" for img in images]

data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"Converted {len(converted_map)} project images to PNG")
print(f"Updated cover image to: {cover_png.name}")
print(f"Updated JSON references in: {data_path}")
