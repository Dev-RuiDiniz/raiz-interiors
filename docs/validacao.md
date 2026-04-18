# Validacao

Data da validacao: 2026-04-18

## Build e execucao local

Dependencias instaladas no clone via `pnpm`.

Resultados de build:

- O build direto do Next passou com `.\node_modules\.bin\next.cmd build --webpack`.
- O script completo de `pnpm build` continua dependente da etapa `prisma generate` e, neste ambiente, apresentou problema de resolucao do pacote `@prisma/debug`. Isso nao foi alterado nesta tarefa porque foge do escopo de qualidade de imagem.

Execucao local:

- `next start` foi iniciado com sucesso em `http://127.0.0.1:3010`.
- O HTML servido localmente apos a correcao passou a apontar para os arquivos originais (`.jpg` / `.png`) com `q=90` e largura maxima `1600`.
- Os logos passaram a ser servidos diretamente como `/raizlogo_preta.png` e `/raizlogo_white.png`, sem `/_next/image`.

## Confirmacoes funcionais da pipeline final

No HTML local final:

- homepage e capas de projeto usam `/_next/image?...q=90`
- o `src` voltou ao arquivo-fonte original do repo
- `srcset` agora vai ate `1600w`, nao mais `1920w`
- lazy loading permaneceu sob controle do `next/image`

Exemplos servidos localmente apos a correcao:

| URL local | Resultado |
| --- | --- |
| `/_next/image?url=%2F2026%2Fhome%2Fbeautiful_homes.png&w=1600&q=90` | PNG, `1600x1600`, `1026673` bytes |
| `/_next/image?url=%2F2026%2Fhome%2Fgaleria_inicial%2Fsuite_4k.jpg&w=1600&q=90` | JPEG, `1600x1032`, `222180` bytes |
| `/_next/image?url=%2F2026%2Fprojects%2Ffotos_capa_menu_projectos%2Fsummer_house_in_comporta.jpg&w=1600&q=90` | JPEG, `1600x1200`, `354072` bytes |
| `/raizlogo_preta.png` | PNG, `1600x376`, `19042` bytes |

Comparacao direta com a entrega antiga da producao:

- antes: `/_next/image?...webp&q=75`
- depois: `/_next/image?...jpg|png&q=90`

Isto aproxima os bytes servidos localmente dos arquivos de referencia do Hostinger e elimina a etapa de dupla compressao.

## Lighthouse

Medicoes registradas:

| Ambiente | Performance | LCP | CLS | TBT | Speed Index |
| --- | --- | --- | --- | --- | --- |
| Vercel producao atual antes do deploy da correcao | `86` | `3.19s` | `0.001` | `238ms` | `4.70s` |
| Hostinger original | `78` | `4.47s` | n/d | n/d | n/d |
| Build local apos a correcao | `88` | `3.66s` | `0` | `125ms` | `2.04s` |

Leitura dos resultados:

- O score de performance local ficou `>= 85`.
- O alvo de `LCP < 2.5s` nao foi atingido nem no baseline atual da Vercel nem no build local apos a correcao.
- Portanto, a correcao de qualidade de imagem nao piorou o score geral, mas tambem nao resolve sozinha o gargalo de LCP do projeto.

## Verificacao visual

- A homepage local ficou visivelmente mais proxima da referencia original.
- Nao foram observadas regressses de layout, tipografia, cores, estrutura ou interacoes durante a revisao visual.
- A nitidez melhorou principalmente nos banners/galeria e nas capas de projeto, que deixaram de sair do `.webp` pre-gerado muito comprimido.

## Arquivos modificados nesta tarefa

- `next.config.ts`
  - qualidade do otimizador ajustada para `90`
  - `deviceSizes` alinhado ao teto de `1600`
- `src/components/ui/site-image.tsx`
  - padrao alterado para preservar o arquivo-fonte
  - `quality` padrao definida em `90`
- `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`
  - imagens de projeto deixaram de forcar a variante otimizada antiga
- `src/components/layout/header.tsx`
  - logos marcados como `unoptimized`
- `docs/analise_original.md`
- `docs/analise_vercel.md`
- `docs/diagnostico.md`
- `docs/validacao.md`

## Status final desta etapa

- Correcao aplicada no clone local na branch `fix/image-quality`
- Documentacao gerada
- Pronto para revisar `git status`
- Nenhum `git add`, `git commit` ou `git push` foi executado
