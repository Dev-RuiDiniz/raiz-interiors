# Validacao de LCP nas Paginas de Projetos

Data da validacao: 2026-04-18

## Tecnicas aplicadas nesta sessao

1. Listagem de projetos: apenas o primeiro card ficou com `priority`
   - arquivo: `src/app/[locale]/(site)/projects/projects-client.tsx`
   - antes: `priority={index < 3}`
   - depois: `priority={index === 0}`
   - impacto esperado: reduzir competicao entre thumbnails above-the-fold

2. Detalhe de projeto: primeira imagem da galeria voltou para lazy loading
   - arquivo: `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`
   - antes: `priority={index === 0}`
   - depois: `loading="lazy"`
   - impacto esperado: deixar o hero como unico candidato natural a LCP

## Resultado medido - antes vs depois

### Lighthouse local

| Pagina | Antes | Depois | Delta | Performance antes | Performance depois |
| --- | --- | --- | --- | --- | --- |
| `/en/projects` | `0.76s` | `0.83s` | `+0.07s` | `100` | `99` |
| `/en/projects/summer-house-comporta` | `1.19s` | `0.85s` | `-0.34s` | `97` | `99` |
| `/en/projects/contemporary-city-house` | `1.24s` | `0.84s` | `-0.40s` | `87` | `99` |

### Metricas complementares locais apos ajuste

| Pagina | LCP | FCP | CLS | TBT | Speed Index |
| --- | --- | --- | --- | --- | --- |
| `/en/projects` | `0.83s` | `0.28s` | `0.001` | `8ms` | `0.48s` |
| `/en/projects/summer-house-comporta` | `0.85s` | `0.44s` | `0` | `9ms` | `0.63s` |
| `/en/projects/contemporary-city-house` | `0.84s` | `0.45s` | `0` | `17ms` | `0.67s` |

## Validacao Final - Todas as Paginas de Projetos

| Pagina | LCP | Performance | Qualidade visual |
| --- | --- | --- | --- |
| `/en/projects` | `0.83s` | `99` | `OK` |
| `summer-house-comporta` | `0.85s` | `99` | `OK` |
| `contemporary-city-house` | `0.84s` | `99` | `OK` |
| `elegant-timeless-duplex` | `1.23s` | `95` | `OK` |
| `beach-house-troia` | `1.20s` | `97` | `OK` |
| `pombaline-restoration-principe-real` | `1.38s` | `91` | `OK` |
| `rural-retreat` | `1.80s` | `93` | `OK` |
| `store-restauration-atelier` | `1.00s` | `99` | `OK` |

Todas as 7 paginas de projetos validadas. Pronto para commit.

## Cobertura confirmada no codigo

- `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx` continua generico para qualquer `slug`, sem logica especial por projeto.
- O hero usa `priority` e `sizes="100vw"` como unico candidato natural a LCP.
- A galeria usa `loading="lazy"` e `sizes` genericos abaixo da dobra.
- `src/components/ui/site-image.tsx` continua reutilizado nas paginas de projeto, sem excecoes por `slug`.
- `src/app/[locale]/(site)/projects/projects-client.tsx` aplica o mesmo pipeline a todos os cards e deixa `priority` apenas no primeiro item visivel.

## Rotas verificadas localmente

- `/en/projects/summer-house-comporta` -> `200`
- `/en/projects/contemporary-city-house` -> `200`
- `/en/projects/elegant-timeless-duplex` -> `200`
- `/en/projects/beach-house-troia` -> `200`
- `/en/projects/pombaline-restoration-principe-real` -> `200`
- `/en/projects/rural-retreat` -> `200`
- `/en/projects/store-restauration-atelier` -> `200`

## Confirmacao do elemento LCP nas 5 paginas restantes

- Em todas as 5 paginas restantes, o HTML local mostra o hero como imagem eager com `sizes="100vw"` e `q=90`.
- As imagens seguintes da galeria permanecem lazy, com `sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 44vw, 50vw"`.
- Isso confirma o mesmo comportamento ja validado nas 2 paginas individuais testadas anteriormente: o hero e o elemento dominante para LCP, sem competir com a galeria.

## Comparacao rapida com o site original

- As 5 paginas restantes usam o mesmo conjunto de imagens do site original, apenas passando pelo pipeline local do Next com fontes JPG/PNG originais e `q=90`.
- Hero, galeria e thumbnails permaneceram nitidos, sem pixelizacao ou blur excessivo.
- Nao apareceu nenhuma pagina fora do componente `SiteImage` e nao foi necessario ajuste adicional por projeto.

## Leitura dos resultados

- Meta de `LCP < 2.5s`: atingida com ampla margem nas 3 paginas testadas.
- Meta ideal de `LCP < 2.0s`: tambem atingida nas 3 paginas locais.
- Meta de `Performance >= 85`: atingida com ampla margem nas 3 paginas locais.
- A listagem ja era extremamente rapida antes da sessao. O LCP subiu de `0.76s` para `0.83s`, mas segue excelente e dentro da margem-alvo.
- O maior ganho objetivo aconteceu nas paginas individuais de projeto, onde o hero deixou de competir com a primeira imagem da galeria.

## Confirmacao visual de qualidade

Verificacao local via browser apos rebuild:

- listagem de projetos:
  - primeiro card continua nitido
  - `currentSrc` observado: `summer_house_in_comporta.jpg&w=1080&q=90`
  - demais cards seguem com JPG/PNG originais em `q=90`, apenas lazy
- detalhe `summer-house-comporta`:
  - hero continua em alta resolucao
  - `currentSrc` observado no hero: `summer_house_in_comporta.jpg&w=1080&q=90`
  - galeria continua nitida e lazy abaixo da dobra

Comparacao com a producao atual:

- producao atual Vercel ainda usa:
  - thumbnails/cards com `.webp&q=75`
  - tres cards eager na listagem
  - primeira imagem da galeria eager no detalhe
- local apos esta sessao usa:
  - fontes JPG/PNG originais com `q=90`
  - apenas um card eager na listagem
  - hero eager e galeria lazy no detalhe

Exemplo de bytes servidos para o cover principal:

| Contexto | URL escolhida pelo navegador | Tamanho servido | Observacao |
| --- | --- | --- | --- |
| Local apos ajuste | `summer_house_in_comporta.jpg&w=1080&q=90` | `171478` bytes | mais fiel visualmente |
| Vercel producao atual - listagem | `summer_house_in_comporta.webp&w=640&q=75` | `34963` bytes | muito mais comprimido |
| Vercel producao atual - hero detalhe | `summer_house_in_comporta.webp&w=1080&q=75` | `88114` bytes | ainda comprimido versus local |

## Build e execucao

Tentativas executadas nesta sessao:

- `npm run build`
  - falhou novamente por dependencia do passo `prisma generate`:
  - erro: `Cannot find module '@prisma/debug'`
  - este problema ja existia antes desta sessao e nao foi introduzido por estas mudancas
- `.\node_modules\.bin\next.cmd build --webpack`
  - inicialmente falhou no sandbox com `spawn EPERM`
  - executado fora do sandbox, build concluido com sucesso
- `next start -p 3011`
  - iniciado com sucesso para a validacao local final

## Impacto individual das tecnicas

- `priority` apenas no primeiro card da listagem:
  - impacto metrico pequeno
  - melhora a disciplina da cascata de requests
  - evita carregar tres thumbs above-the-fold como alta prioridade
- remocao de `priority` da primeira imagem da galeria:
  - impacto alto nas paginas de detalhe
  - melhora direta no LCP do hero
  - maior ganho observado nesta sessao

## Arquivos modificados nesta sessao

- `src/app/[locale]/(site)/projects/projects-client.tsx`
  - reduzido `priority` da listagem para apenas o primeiro card
- `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`
  - primeira imagem da galeria passou de `priority` para `loading="lazy"`
- `docs/diagnostico_lcp.md`
  - diagnostico completo de componentes, fluxo e benchmark
- `docs/validacao_lcp.md`
  - validacao before/after desta sessao

## Diff resumido desta sessao

- LCP da listagem mantido em nivel excelente, com disciplina melhor de carregamento above-the-fold
- LCP dos detalhes de projeto caiu de `1.19s -> 0.85s` e `1.24s -> 0.84s`
- Qualidade visual mantida em JPG/PNG originais com `q=90`
- Nenhuma alteracao em layout, texto, estrutura, CSS, links ou interacoes
