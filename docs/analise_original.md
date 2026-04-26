# Analise do Site Original

Data da coleta: 2026-04-18  
Referencia: <https://darkgrey-wallaby-265708.hostingersite.com/en>

## Escopo

Esta analise cobre todas as imagens referenciadas no HTML SSR da homepage `/en`, que e a vitrine principal usada como referencia visual para comparar a producao na Vercel. O comportamento observado nesta pagina tambem representa a forma como o site original entrega imagens: ativos estaticos, same-origin, sem pipeline explicito de otimizacao em runtime.

## Metodologia

- HTML da homepage salvo localmente e auditado para extrair referencias de imagem.
- Cada URL de imagem foi requisitada individualmente para registrar `Content-Type`, `Cache-Control`, `Content-Length`, bytes efetivos e dimensoes reais.
- Dimensoes e formato foram confirmados a partir do binario baixado.

## Comportamento geral observado

- Todas as imagens sao servidas diretamente pelo mesmo host (`darkgrey-wallaby-265708.hostingersite.com`).
- Nao foi detectado CDN externo, query params de transformacao, `/_next/image`, Cloudinary, Imgix ou outro servico de otimizacao.
- No HTML SSR salvo, as imagens de conteudo aparecem como arquivos estaticos diretos.
- Nao foi observado `srcset` ou `sizes` nas imagens de conteudo da homepage.
- O carregamento e misto: a imagem visivel acima da dobra nao traz `loading="lazy"` no SSR; imagens secundarias/carrossel/cards aparecem com lazy loading em inspecao manual da pagina.
- Headers repetidos no original: `Cache-Control: max-age=31536000, public`, com `Content-Type` coerente com o formato do arquivo.

## Inventario de imagens encontradas na homepage `/en`

| # | URL completa | Formato | Dimensoes reais | Tamanho | Qualidade aparente | Loading / responsividade | Headers principais |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/HOME/Beautiful%20Homes.png` | PNG | 1600x1600 | 2.38 MB | alta | sem `srcset` / `sizes`; arquivo direto | `image/png`; `Cache-Control=max-age=31536000, public`; `Content-Length=2495792` |
| 2 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/HOME/GALERIA%20INICIAL/IMG_0820_SnapseedCopy.jpg` | JPEG | 768x1344 | 68.96 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=70610` |
| 3 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/HOME/GALERIA%20INICIAL/SUITE%204K.jpg` | JPEG | 1600x1032 | 205.73 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=210670` |
| 4 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/HOME/GALERIA%20INICIAL/beautiful%20and%20timeless%20comporta%20summer%20house%20interior%20design%20by%20RAIZ.jpg` | JPEG | 1600x928 | 210.03 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=215069` |
| 5 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/HOME/GALERIA%20INICIAL/contemporary%20minimalist%20living%20room%20suspended%20staircase%20and%20fireplace%20interior%20design%20by%20RAIZ%20.jpg` | JPEG | 1600x952 | 272.53 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=279075` |
| 6 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/HOME/GALERIA%20INICIAL/contemporary-beach-house-living-room-with-fireplace-interior-design-by-RAIZ.jpg` | JPEG | 1600x1007 | 299.24 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=306424` |
| 7 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/HOME/GALERIA%20INICIAL/elegant%20timeless%20luxury%20master%20suite%20interior%20design%20by%20RAIZ.jpg` | JPEG | 1600x999 | 221.20 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=226512` |
| 8 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/PROJECTS/_fotos%20capa%20menu%20projectos/BEACH%20HOUSE%20in%20TROIA.jpg` | JPEG | 1600x1104 | 369.63 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=378499` |
| 9 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/PROJECTS/_fotos%20capa%20menu%20projectos/CONTEMPORARY%20CITY%20HOUSE.jpg` | JPEG | 1600x1200 | 286.85 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=293732` |
| 10 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/PROJECTS/_fotos%20capa%20menu%20projectos/ELEGANT%20and%20TMELESS%20DUPLEX.jpg` | JPEG | 1600x1067 | 220.29 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=225575` |
| 11 | `https://darkgrey-wallaby-265708.hostingersite.com/2026/PROJECTS/_fotos%20capa%20menu%20projectos/SUMMER%20HOUSE%20in%20COMPORTA.jpg` | JPEG | 1600x1200 | 325.63 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/jpeg`; `Cache-Control=max-age=31536000, public`; `Content-Length=333444` |
| 12 | `https://darkgrey-wallaby-265708.hostingersite.com/raizlogo-white.png` | PNG | 1600x376 | 3.03 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/png`; `Cache-Control=max-age=31536000, public`; `Content-Length=3104` |
| 13 | `https://darkgrey-wallaby-265708.hostingersite.com/raizlogo-preta.png` | PNG | 1600x376 | 15.29 KB | alta | sem `srcset` / `sizes`; arquivo direto | `image/png`; `Cache-Control=max-age=31536000, public`; `Content-Length=15654` |

## Conclusoes

- O site original privilegia arquivos estaticos relativamente pesados, com qualidade visual alta e compressao conservadora.
- A homepage de referencia nao depende de otimizacao agressiva em runtime.
- A referencia de qualidade a perseguir na Vercel nao exige trocar layout nem markup; exige apenas evitar compressao excessiva e perda de resolucao na pipeline de imagens.
