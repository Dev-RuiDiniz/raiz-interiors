# Performance Rollout

## O que ja esta preparado no projeto

- Preferencia automatica por arquivos `.webp` via `src/generated/webp-manifest.json`
- Cache de assets em `next.config.ts`
- Cache complementar para `public/` via `public/.htaccess`
- `SiteImage` com lazy loading padrao e `sizes` mais consistentes
- Script de otimizacao em `scripts/optimize_public_images.py`

## Passo 1. Gerar WebP e manifesto

Execute antes do build:

```bash
python scripts/optimize_public_images.py
```

Isso gera:

- arquivos `.webp` ao lado das imagens originais em `public/`
- manifesto em `src/generated/webp-manifest.json`

## Passo 2. Build e deploy

```bash
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH
export CIRCLE_NODE_TOTAL=1
export NODE_OPTIONS=--max-old-space-size=4096

node fix-project-assets.js
python scripts/optimize_public_images.py
npx prisma generate
npx next build --webpack
mkdir -p .next/standalone/.next
rm -rf .next/standalone/public
cp -r public .next/standalone/
rm -rf .next/standalone/.next/static
cp -r .next/static .next/standalone/.next/
```

## Passo 3. Cloudflare

### Configuracao recomendada

- Proxy do dominio ativo
- `Caching Level`: `Standard`
- `Browser Cache TTL`: `1 month` ou maior
- `Auto Minify`: `CSS`, `JS`, `HTML`
- `Polish`: `Lossy`
- `WebP`: ativo
- `Brotli`: ativo

### Regras uteis

- Cache Everything apenas para assets estaticos
- Nao forcar cache agressivo para HTML dinamico

## Passo 4. Validar

```bash
curl -I https://raiz-interiors.com/2026/services/interior_design.webp
curl -I https://raiz-interiors.com/2026/services/interior_design.jpg
curl -I https://raiz-interiors.com/_next/static/chunks/...
```

Objetivo:

- `Cache-Control: public, max-age=31536000, immutable`
- `cf-cache-status: HIT` ou `MISS` seguido de `HIT` depois

## Passo 5. O que monitorar

- peso das imagens acima da dobra
- pagina de detalhe de projeto
- home hero
- cards de `projects` e `services`
