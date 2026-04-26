from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance
import shutil

base = Path(r"d:/Grafica RJ Print/raiz-interiors/Deploy/public/2026/projects/elegant_and_timeless_duplex")
backup_dir = base / "_backup_before_denoise"
backup_dir.mkdir(exist_ok=True)

extensions = {".jpg", ".jpeg", ".png"}
files = [p for p in base.iterdir() if p.is_file() and p.suffix.lower() in extensions]

for path in files:
    backup_path = backup_dir / path.name
    if not backup_path.exists():
      shutil.copy2(path, backup_path)

    with Image.open(path) as img:
        original_format = img.format or ("PNG" if path.suffix.lower() == ".png" else "JPEG")
        work = img.convert("RGB")

        denoised = work.filter(ImageFilter.MedianFilter(size=3))
        denoised = denoised.filter(ImageFilter.SMOOTH_MORE)

        blended = Image.blend(work, denoised, 0.32)
        blended = ImageEnhance.Sharpness(blended).enhance(1.08)
        blended = ImageEnhance.Contrast(blended).enhance(1.01)

        if original_format.upper() == "PNG" or path.suffix.lower() == ".png":
            blended.save(path, format="PNG", optimize=True)
        else:
            blended.save(path, format="JPEG", quality=95, subsampling=0, optimize=True)

print(f"Processed {len(files)} files in {base}")
