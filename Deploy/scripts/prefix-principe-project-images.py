from pathlib import Path
import json
import shutil

root = Path(r"d:/Grafica RJ Print/raiz-interiors/Deploy")
project_dir = root / "public/2026/projects/principe_real_pombaline_restoration"
data_path = root / "data/admin-projects.json"

backup_dir = project_dir / "_backup_before_principe_prefix"
backup_dir.mkdir(exist_ok=True)

renamed = {}

for path in sorted(project_dir.iterdir()):
    if not path.is_file():
        continue
    if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue

    if path.name.startswith("principe_"):
        renamed[path.name] = path.name
        continue

    backup_path = backup_dir / path.name
    if not backup_path.exists():
        shutil.copy2(path, backup_path)

    target_name = f"principe_{path.name}"
    target_path = project_dir / target_name
    if target_path.exists():
        target_path.unlink()
    path.rename(target_path)
    renamed[path.name] = target_name

data = json.loads(data_path.read_text(encoding="utf-8"))

for project in data:
    if project.get("slug") != "pombaline-restoration-principe-real":
        continue

    project["images"] = [
        f"/2026/projects/principe_real_pombaline_restoration/{renamed.get(Path(img).name, Path(img).name)}"
        for img in project.get("images", [])
    ]

data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"Renamed {len(renamed)} image entries with prefix 'principe_'")
print(f"Updated JSON references in: {data_path}")
