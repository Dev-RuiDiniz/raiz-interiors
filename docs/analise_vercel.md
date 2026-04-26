# Analise do Repositorio e da Producao Vercel

Data da analise: 2026-04-18  
Repositorio analisado: `Dev-RuiDiniz/raiz-interiors`  
Producao observada: <https://raiz-interiors-inky.vercel.app/en>

## Estrutura do projeto

- Framework: Next.js 16.0.7
- Runtime UI: React 19.2.0
- Processamento de imagem local: `sharp`
- Gerenciador de pacotes configurado: `pnpm`

Arquivos de configuracao relevantes:

- `package.json`
- `next.config.ts`
- `src/components/ui/site-image.tsx`
- `src/lib/asset-variants.ts`
- `src/generated/webp-manifest.json`
- `src/generated/blur-manifest.json`
- `scripts/optimize_public_images.py`

Configuracao ausente:

- `vercel.json` nao esta presente no repositorio.

## Onde as imagens estao no repositorio

Resumo por extensao em `public/`:

- `216` arquivos `.webp`
- `166` arquivos `.jpg`
- `46` arquivos `.png`
- `6` arquivos `.JPEG`
- `5` arquivos `.svg`

Principais diretorios com imagens:

- `public/2026/projects/summer_house_comporta` (`58` arquivos)
- `public/2026/projects/contemporary_city_house` (`40`)
- `public/2026/projects/principe_real_pombaline_restoration` (`38`)
- `public/2026/projects/elegant_and_timeless_duplex` e backups associados (`32` + backups)
- `public/2026/projects/fotos_capa_menu_projectos` (`20`)
- `public/2026/services` e `public/2026/services/fotos_capa_menu_servi_os`
- `public/2026/home/galeria_inicial`
- `public/2026/home/selected_projects`
- arquivos compartilhados na raiz de `public/` como os logos

## Pipeline de imagem encontrado antes do ajuste

1. `SiteImage` usava `preserveQuality = false` por padrao.
2. Quando `src` era string, `getOptimizedAssetPath(src)` trocava o arquivo original pelo equivalente em `src/generated/webp-manifest.json`.
3. O script `scripts/optimize_public_images.py` gerava variantes `.webp` com:
   - `MAX_SIZE = (1600, 1600)`
   - `quality = 78` para imagens sem alpha
4. A producao da Vercel servia essas variantes `.webp` atraves de `/_next/image?...q=75`.

Resultado pratico antes do ajuste:

- origem em JPG/PNG maior e mais detalhada
- substituicao para `.webp` pre-gerado, limitado a 1600 px
- nova passagem pelo otimizador do Next/Vercel com `q=75`

Isto caracteriza dupla compressao para praticamente todas as imagens visiveis da homepage e para as galerias de projeto.

## Comportamento observado em producao antes do ajuste

No HTML SSR salvo da Vercel, a homepage `/en` usava:

- `/_next/image?url=%2F2026%2Fhome%2Fbeautiful_homes.webp&w=640|828|1080|1280|1920&q=75`
- `/_next/image?url=%2F2026%2Fhome%2Fgaleria_inicial%2F*.webp&w=640|828|1080|1280|1920&q=75`
- `/_next/image?url=%2F2026%2Fprojects%2Ffotos_capa_menu_projectos%2F*.webp&w=640|828|1080|1280|1920&q=75`
- `/_next/image?url=%2Fraizlogo_*.png&w=640|828&q=75`

Ou seja:

- a homepage producao estava responsiva via `srcset`
- a qualidade padrao observada era `q=75`
- o problema nao era lentidao da Vercel; era a origem que ja chegava comprimida demais ao otimizador

## Comparacao repo vs referencia original

Escopo da tabela: todas as imagens referenciadas na homepage `/en`, com equivalencia para o arquivo-fonte no repositorio e a variante `.webp` gerada automaticamente.

| Imagem original | Equivalente no repo | Repo fonte | Repo `.webp` gerado | Observacao |
| --- | --- | --- | --- | --- |
| `Beautiful Homes.png` | `/2026/home/beautiful_homes.png` | PNG, `3240x3240`, `6.20 MB` | WebP, `1600x1600`, `1.58 MB` | origem do repo e maior que a referencia; a degradacao vinha do pipeline, nao da falta de resolucao |
| `IMG_0820_SnapseedCopy.jpg` | `/2026/home/galeria_inicial/img_0820_snapseedcopy.jpg` | JPEG, `768x1344`, `202.16 KB` | WebP, `768x1344`, `21.38 KB` | mesma resolucao do original servido, mas compactado agressivamente no `.webp` |
| `SUITE 4K.jpg` | `/2026/home/galeria_inicial/suite_4k.jpg` | JPEG, `4375x2822`, `2.78 MB` | WebP, `1600x1032`, `77.52 KB` | corte forte de bytes antes da Vercel |
| `beautiful ... comporta ... RAIZ.jpg` | `/2026/home/galeria_inicial/beautiful_and_timeless_comporta_summer_house_interior_design_by_raiz.jpg` | JPEG, `3852x2233`, `1.24 MB` | WebP, `1600x928`, `96.33 KB` | fonte no repo e suficiente |
| `contemporary minimalist ... RAIZ .jpg` | `/2026/home/galeria_inicial/contemporary_minimalist_living_room_suspended_staircase_and_fireplace_interior_design_by_raiz.jpg` | JPEG, `1991x1185`, `419.16 KB` | WebP, `1600x952`, `139.36 KB` | fonte ainda maior que a entrega original do Hostinger |
| `contemporary-beach-house ... RAIZ.jpg` | `/2026/home/galeria_inicial/contemporary_beach_house_living_room_with_fireplace_interior_design_by_raiz.jpg` | JPEG, `2397x1509`, `706.55 KB` | WebP, `1600x1007`, `150.59 KB` | degradacao concentrada no `.webp` |
| `elegant timeless luxury master suite ...` | `/2026/home/galeria_inicial/elegant_timeless_luxury_master_suite_interior_design_by_raiz.jpg` | JPEG, `5140x3209`, `4.41 MB` | WebP, `1600x999`, `87.13 KB` | o `.webp` ficava muito mais leve que a referencia original |
| `BEACH HOUSE in TROIA.jpg` | `/2026/projects/fotos_capa_menu_projectos/beach_house_in_troia.jpg` | JPEG, `2500x1725`, `1.29 MB` | WebP, `1600x1104`, `210.53 KB` | fonte adequada; perda vinha do pre-processamento |
| `CONTEMPORARY CITY HOUSE.jpg` | `/2026/projects/fotos_capa_menu_projectos/contemporary_city_house.jpg` | JPEG, `2048x1536`, `942.99 KB` | WebP, `1600x1200`, `110.30 KB` | mesma padronizacao de 1600 px no `.webp` |
| `ELEGANT and TMELESS DUPLEX.jpg` | `/2026/projects/fotos_capa_menu_projectos/elegant_and_tmeless_duplex.png` | PNG, `6004x4003`, `34.79 MB` | WebP, `1600x1067`, `78.82 KB` | caso extremo: fonte enorme no repo, mas entrega pre-fix extremamente comprimida |
| `SUMMER HOUSE in COMPORTA.jpg` | `/2026/projects/fotos_capa_menu_projectos/summer_house_in_comporta.jpg` | JPEG, `4032x3024`, `3.87 MB` | WebP, `1600x1200`, `167.04 KB` | mesma causa raiz das demais capas |
| `raizlogo-white.png` | `/raizlogo_white.png` | PNG, `1600x376`, `3.82 KB` | WebP, `1600x376`, `1.13 KB` | logo passava sem necessidade pelo otimizador do Next |
| `raizlogo-preta.png` | `/raizlogo_preta.png` | PNG, `1600x376`, `18.60 KB` | WebP, `1600x376`, `10.12 KB` | logo tambem sofria conversao/otimizacao desnecessaria |

## Conclusoes

- O repositorio nao estava carente de imagens em alta resolucao para os principais ativos da homepage.
- A perda visual vinha da troca sistematica para `.webp` pre-gerado e da segunda otimizacao em runtime.
- Como nao existe `vercel.json`, o controle relevante estava concentrado no codigo Next e nos manifests gerados.
