# Script de Deploy Automático para RAIZ Interiors
# Execute este script para enviar as mudanças para produção

Write-Host "🚀 Iniciando deploy da RAIZ Interiors..." -ForegroundColor Green

# Verificar se git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "📥 Baixe em: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Verificar se já é um repositório git
if (Test-Path ".git") {
    Write-Host "✅ Repositório Git já existe" -ForegroundColor Green
} else {
    Write-Host "📝 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    git config user.name "RAIZ Interiors"
    git config user.email "admin@raiz-interiors.com"
}

# Verificar status dos arquivos
Write-Host "📋 Verificando arquivos modificados..." -ForegroundColor Yellow
git status --porcelain

# Adicionar arquivos
Write-Host "📤 Adicionando arquivos..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
git commit -m "feat: adicionar favicon RAIZ e configurações anti-cache

- Adicionar favicon-raiz.ico personalizado
- Configurar headers no-cache para favicon
- Atualizar layout com meta tags anti-cache
- Modificar proxy.ts para incluir novo favicon"

# Verificar se remote já existe
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "✅ Remote 'origin' já configurado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Remote 'origin' não configurado!" -ForegroundColor Yellow
    Write-Host "📝 Configure manualmente:" -ForegroundColor Cyan
    Write-Host "   git remote add origin https://github.com/SEU_USERNAME/raiz-interiors.git" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "🎯 PROXIMOS PASSOS:" -ForegroundColor Green
Write-Host "1. Configure o remote no GitHub (se nao configurado)" -ForegroundColor White
Write-Host "2. Execute: git push -u origin main" -ForegroundColor White
Write-Host "3. Importe o projeto na Vercel a partir do GitHub" -ForegroundColor White
Write-Host ""
Write-Host "Ver DEPLOY-GUIDE.md para instrucoes completas" -ForegroundColor Cyan