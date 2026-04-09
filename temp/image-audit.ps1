$paths = @(
  "public/2026/home",
  "public/2026/projects",
  "public/2026/services"
)

Add-Type -AssemblyName System.Drawing

$results = Get-ChildItem $paths -Recurse -File |
  Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp|avif)$' } |
  ForEach-Object {
    $width = ""
    $height = ""
    try {
      $img = [System.Drawing.Image]::FromFile($_.FullName)
      $width = $img.Width
      $height = $img.Height
      $img.Dispose()
    } catch {}
    [PSCustomObject]@{
      Path = $_.FullName.Replace((Get-Location).Path + "\", "")
      SizeKB = [math]::Round($_.Length / 1KB, 1)
      Width = $width
      Height = $height
    }
  } |
  Sort-Object SizeKB -Descending

$results | Export-Csv -NoTypeInformation -Encoding UTF8 "temp/image-audit.csv"
$results | Select-Object -First 20 | ConvertTo-Csv -NoTypeInformation
