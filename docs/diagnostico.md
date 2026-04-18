# Diagnostico

## Causa raiz

A degradacao visivel das imagens na Vercel nao era causada por falta de banda, layout, CSS ou pelas imagens-fonte da homepage estarem pequenas. O problema era a combinacao de duas camadas de compressao:

1. `scripts/optimize_public_images.py` gerava variantes `.webp` limitadas a `1600x1600` com `quality = 78`.
2. `src/components/ui/site-image.tsx`, por padrao, trocava o `src` original pelo caminho do `.webp` via `getOptimizedAssetPath`.
3. A producao da Vercel/Next ainda passava esse `.webp` por `/_next/image?...q=75`.

Em outras palavras:

- arquivo-fonte original -> `.webp` gerado com perdas
- `.webp` gerado -> nova otimizacao Next/Vercel em `q=75`

Para logos, o problema era semelhante, mas desnecessario: PNGs pequenos tambem estavam sendo servidos por `next/image` em `q=75`.

## Tabela comparativa imagem por imagem

Escopo: imagens referenciadas na homepage `/en`, que sao o conjunto diretamente afetado e usado como referencia de qualidade.

| Imagem | Original site | Repo fonte | Repo `.webp` antes do ajuste | Diagnostico |
| --- | --- | --- | --- | --- |
| `Beautiful Homes` | PNG, `1600x1600`, `2.38 MB` | PNG, `3240x3240`, `6.20 MB` | WebP, `1600x1600`, `1.58 MB` | fonte no repo e suficiente; perda vinha da troca para `.webp` e nova otimizacao |
| `IMG_0820_SnapseedCopy` | JPEG, `768x1344`, `68.96 KB` | JPEG, `768x1344`, `202.16 KB` | WebP, `768x1344`, `21.38 KB` | imagem ja pequena por natureza; o `.webp` a empurrava para compressao visual agressiva |
| `SUITE 4K` | JPEG, `1600x1032`, `205.73 KB` | JPEG, `4375x2822`, `2.78 MB` | WebP, `1600x1032`, `77.52 KB` | perda severa de detalhe por bytes baixos demais antes do Next |
| `beautiful ... comporta ...` | JPEG, `1600x928`, `210.03 KB` | JPEG, `3852x2233`, `1.24 MB` | WebP, `1600x928`, `96.33 KB` | dupla compressao |
| `contemporary minimalist ...` | JPEG, `1600x952`, `272.53 KB` | JPEG, `1991x1185`, `419.16 KB` | WebP, `1600x952`, `139.36 KB` | dupla compressao |
| `contemporary-beach-house ...` | JPEG, `1600x1007`, `299.24 KB` | JPEG, `2397x1509`, `706.55 KB` | WebP, `1600x1007`, `150.59 KB` | dupla compressao |
| `elegant timeless luxury master suite ...` | JPEG, `1600x999`, `221.20 KB` | JPEG, `5140x3209`, `4.41 MB` | WebP, `1600x999`, `87.13 KB` | dupla compressao muito agressiva |
| `BEACH HOUSE in TROIA` | JPEG, `1600x1104`, `369.63 KB` | JPEG, `2500x1725`, `1.29 MB` | WebP, `1600x1104`, `210.53 KB` | dupla compressao |
| `CONTEMPORARY CITY HOUSE` | JPEG, `1600x1200`, `286.85 KB` | JPEG, `2048x1536`, `942.99 KB` | WebP, `1600x1200`, `110.30 KB` | dupla compressao |
| `ELEGANT and TMELESS DUPLEX` | JPEG, `1600x1067`, `220.29 KB` | PNG, `6004x4003`, `34.79 MB` | WebP, `1600x1067`, `78.82 KB` | entrega anterior extremamente comprimida, apesar de fonte enorme |
| `SUMMER HOUSE in COMPORTA` | JPEG, `1600x1200`, `325.63 KB` | JPEG, `4032x3024`, `3.87 MB` | WebP, `1600x1200`, `167.04 KB` | dupla compressao |
| `raizlogo-white` | PNG, `1600x376`, `3.03 KB` | PNG, `1600x376`, `3.82 KB` | WebP, `1600x376`, `1.13 KB` | passar logo por `next/image` nao agregava valor e reduzia fidelidade |
| `raizlogo-preta` | PNG, `1600x376`, `15.29 KB` | PNG, `1600x376`, `18.60 KB` | WebP, `1600x376`, `10.12 KB` | mesmo problema dos logos |

## Solucao aplicada

A solucao escolhida foi corrigir o pipeline, nao trocar o design e nao substituir o conteudo visual:

- manter os arquivos-fonte originais do repositorio como origem para o `next/image`
- elevar a qualidade do otimizador do Next para `90`
- limitar `deviceSizes` maximo a `1600`, alinhando a entrega ao tamanho efetivamente usado pelo site original
- impedir a otimizacao desnecessaria dos logos via `unoptimized`
- desativar o uso forcado das variantes `.webp` pre-geradas nas galerias de projeto

Essa abordagem preserva:

- layout
- textos
- estrutura
- lazy loading
- responsividade
- comportamento funcional

## Arquivos modificados

- `next.config.ts`
  - adicionados `images.qualities: [75, 90]`
  - `deviceSizes` ajustado para terminar em `1600`
- `src/components/ui/site-image.tsx`
  - `preserveQuality` passou a ser `true` por padrao
  - `quality` padrao passou a `90`
- `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`
  - desabilitado o caminho antigo que forcava imagens de projeto para a variante otimizada previamente
- `src/components/layout/header.tsx`
  - logos marcados como `unoptimized`

## Justificativa tecnica

- Baixar novamente os arquivos do Hostinger nao era necessario para os ativos principais da homepage, porque o repo ja continha fontes iguais ou maiores que a entrega de referencia.
- A degradacao estava no pipeline de transformacao, nao na ausencia de resolucao.
- Corrigir apenas a pipeline atende ao objetivo de deixar a Vercel visualmente proxima do original sem sacrificar a velocidade estrutural da plataforma.
