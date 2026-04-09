# Verificacao Pre-Deploy da RAIZ Interiors
# Execute este script para verificar se tudo esta pronto para producao

Write-Host "Verificando configuracao da RAIZ Interiors..." -ForegroundColor Green
Write-Host ""

# Verificar arquivos essenciais
$filesToCheck = @(
    "src\app\layout.tsx",
    "next.config.ts",
    "src\proxy.ts",
    "public\favicon-raiz.ico",
    "package.json"
)

$allFilesExist = $true
foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "OK - $file" -ForegroundColor Green
    } else {
        Write-Host "AUSENTE - $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

# Verificar conteudo dos arquivos modificados
Write-Host "Verificando conteudo dos arquivos modificados..." -ForegroundColor Yellow

# Verificar layout.tsx
$layoutContent = Get-Content "src\app\layout.tsx" -Raw
if ($layoutContent -match "favicon-raiz.ico") {
    Write-Host "OK - layout.tsx - Favicon configurado" -ForegroundColor Green
} else {
    Write-Host "ERRO - layout.tsx - Favicon NAO configurado" -ForegroundColor Red
}

# Verificar next.config.ts
$configContent = Get-Content "next.config.ts" -Raw
if ($configContent -match "favicon-raiz.ico") {
    Write-Host "OK - next.config.ts - Headers configurados" -ForegroundColor Green
} else {
    Write-Host "ERRO - next.config.ts - Headers NAO configurados" -ForegroundColor Red
}

# Verificar proxy.ts
$proxyContent = Get-Content "src\proxy.ts" -Raw
if ($proxyContent -match "favicon-raiz.ico") {
    Write-Host "OK - proxy.ts - Matcher atualizado" -ForegroundColor Green
} else {
    Write-Host "ERRO - proxy.ts - Matcher NAO atualizado" -ForegroundColor Red
}

Write-Host ""

# Verificar se favicon existe
$faviconSize = (Get-Item "public\favicon-raiz.ico" -ErrorAction SilentlyContinue).Length
if ($faviconSize -gt 0) {
    $sizeKB = [math]::Round($faviconSize/1024, 1)
    Write-Host "OK - Favicon: $sizeKB KB" -ForegroundColor Green
} else {
    Write-Host "ERRO - Favicon nao encontrado ou vazio" -ForegroundColor Red
}

Write-Host ""

# Status final
if ($allFilesExist) {
    Write-Host "STATUS: PRONTO PARA DEPLOY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "PROXIMOS PASSOS:" -ForegroundColor Cyan
    Write-Host "1. Execute: .\deploy.ps1" -ForegroundColor White
    Write-Host "2. Configure repositorio GitHub" -ForegroundColor White
    Write-Host "3. Importe na Vercel" -ForegroundColor White
} else {
    Write-Host "STATUS: ARQUIVOS AUSENTES!" -ForegroundColor Red
    Write-Host "Verifique os arquivos marcados em vermelho acima." -ForegroundColor Yellow
}