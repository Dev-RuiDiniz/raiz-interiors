# Diagnostico de LCP nas Paginas de Projetos

Data da analise: 2026-04-18

Escopo priorizado:

- listagem de projetos: `/en/projects`
- detalhe de projeto: `/en/projects/summer-house-comporta`
- validacao adicional em segundo detalhe: `/en/projects/contemporary-city-house`

## Resumo executivo

O problema de `LCP 3.66s` mencionado na sessao anterior nao aparece nas paginas de projetos. Esse numero estava associado ao baseline da homepage. Nas rotas de projetos, os baselines medidos nesta sessao ja estavam abaixo de `2.5s`, mas havia dois anti-patterns claros no pipeline de imagem:

1. a listagem de projetos marcava os tres primeiros cards como `priority`
2. a pagina de detalhe marcava a primeira imagem da galeria como `priority`, apesar de ela estar abaixo da dobra

Esses dois pontos geravam concorrencia desnecessaria com a imagem hero/LCP. O trabalho desta sessao foi endurecer o comportamento dessas rotas sem tocar em layout, conteudo ou qualidade visual.

## Mapeamento dos componentes e origem das imagens

### Listagem de projetos

- `src/app/[locale]/(site)/projects/page.tsx`
  - pagina server-side
  - carrega `getProjectsContent()` e `getPublishedProjectsSettings(locale)`
  - repassa dados para `ProjectsClient`
- `src/app/[locale]/(site)/projects/projects-client.tsx`
  - renderiza o hero textual da pagina
  - renderiza a grid de cards
  - usa `ProjectCard` interno no mesmo arquivo
- `ProjectCard` em `src/app/[locale]/(site)/projects/projects-client.tsx`
  - renderiza `SiteImage`
  - props principais:
    - `src={project.coverImage}`
    - `fill`
    - `priority={...}`
    - `sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"`
- origem das imagens
  - `src/lib/cms/content-service.ts` -> `getProjectsContent()`
  - sem fetch client-side
  - fallback local/default em `src/lib/cms/default-projects.ts`

### Pagina individual de projeto

- `src/app/[locale]/(site)/projects/[slug]/page.tsx`
  - pagina server-side
  - carrega `getProjectDetailContent(slug)` e `getProjectsContent()`
  - monta dados localizados
  - repassa para `ProjectDetailClient`
- `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`
  - hero principal do projeto com `SiteImage`
  - galeria em grid de 2 colunas com `SiteImage`
  - lightbox com `SiteImage`
  - props principais no hero:
    - `src={project.coverImage}`
    - `fill`
    - `priority`
    - `sizes="100vw"`
  - props principais na galeria:
    - `src={image}`
    - `fill`
    - antes desta sessao: `priority={index === 0}`
    - agora: `loading="lazy"`
    - `sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 44vw, 50vw"`
- origem das imagens
  - `src/lib/cms/content-service.ts` -> `getProjectDetailContent(slug)`
  - galeria vem de `project.images`
  - fallback para `defaultProjectDetails[slug].images`

### Componente de imagem compartilhado

- `src/components/ui/site-image.tsx`
  - wrapper de `next/image`
  - estado herdado da sessao anterior:
    - preserva JPG/PNG originais por padrao
    - `quality` padrao em `90`
    - loading default: `eager` quando `priority`, caso contrario `lazy`
    - blur automatico quando existe `blurDataURL` no manifesto

### Configuracao global relevante

- `next.config.ts`
  - `images.formats = ['image/avif', 'image/webp']`
  - `images.qualities = [75, 90]`
  - `deviceSizes` terminando em `1600`
  - headers de cache para `/2026/:path*` e `/_next/static/:path*`
- `src/lib/fonts.ts`
  - fontes via `next/font`
  - `display: 'swap'`
- scripts bloqueantes
  - nao foi encontrado `<Script>` bloqueante nas rotas auditadas

## Elementos candidatos a LCP por tipo de pagina

### 1. Listagem de projetos `/en/projects`

Comportamento observado em producao atual da Vercel:

- nao havia hero background ativo no DOM da pagina de projetos
- os tres primeiros cards estavam com `loading="eager"`
- os `currentSrc` observados eram:
  - `summer_house_in_comporta.webp&w=640&q=75`
  - `contemporary_city_house.webp&w=640&q=75`
  - `elegant_and_tmeless_duplex.webp&w=640&q=75`

Componente responsavel:

- `ProjectCard` em `src/app/[locale]/(site)/projects/projects-client.tsx`

Diagnostico de LCP da listagem:

- o LCP visivel da listagem e o primeiro card heroico da grade, nao um texto nem background
- a pagina ja estava rapida, mas tres imagens above-the-fold concorriam pela banda logo no inicio
- isso era um risco estrutural, mesmo com score alto

Estado local final observado apos ajuste:

- apenas o primeiro card fica com `loading="eager"`
- os demais cards ficam `loading="lazy"`
- `currentSrc` do primeiro card local:
  - `/_next/image?...summer_house_in_comporta.jpg&w=1080&q=90`
- geometria observada:
  - renderizado em `321x240.75`
  - `sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"`

### 2. Detalhe de projeto `/en/projects/summer-house-comporta`

Comportamento observado em producao atual da Vercel:

- hero acima da dobra com `loading="eager"`
- primeira imagem da galeria tambem com `loading="eager"`
- `currentSrc` observados:
  - hero: `summer_house_in_comporta.webp&w=1080&q=75`
  - primeira galeria: `00_minimal...Raiz.webp&w=640&q=75`

Componente responsavel:

- hero e galeria em `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`

Diagnostico de LCP do detalhe:

- o elemento acima da dobra e o hero cover do projeto
- a primeira imagem da galeria esta abaixo da dobra, com topo em `y=675.29`
- portanto, o `priority` da primeira imagem da galeria nao ajuda o LCP e ainda compete com o hero

Estado local final observado apos ajuste:

- hero mantido com `loading="eager"` e `sizes="100vw"`
- primeira imagem da galeria passou para `loading="lazy"`
- `currentSrc` local do hero:
  - `/_next/image?...summer_house_in_comporta.jpg&w=1080&q=90`
- geometria observada:
  - hero renderizado em `1019x331.79`
  - primeira galeria continua abaixo da dobra e agora lazy

## Cascata de carregamento e blockers

### Listagem

- antes desta sessao:
  - 3 thumbnails above-the-fold com eager
  - logos e cards podiam competir no inicio
- depois:
  - 1 thumbnail com eager
  - restante lazy

### Detalhe

- antes desta sessao:
  - hero eager
  - primeira imagem da galeria tambem eager, mesmo abaixo da dobra
- depois:
  - hero segue como unico candidato natural a LCP
  - galeria volta a lazy loading

### Blockers gerais

- nao ha fetch client-side de CMS/API antes de renderizar essas paginas
- fontes ja usam `next/font` com `display=swap`
- nao foram encontrados scripts sincronamente bloqueantes nessas rotas
- o bottleneck encontrado foi de priorizacao de requests, nao de CSS ou fontes

## Benchmarks de referencia

### Lighthouse - listagem de projetos

| Ambiente | URL | Performance | LCP | FCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- |
| Producao Vercel atual | `/en/projects` | `99` | `0.90s` | `0.39s` | `0` | `1ms` |
| Hostinger referencia | `/en/projects` | `84` | `2.53s` | `0.27s` | `0` | `104ms` |
| Local antes desta sessao | `/en/projects` | `100` | `0.76s` | `0.41s` | `0.001` | `7ms` |

### Lighthouse - detalhe de projeto

| Ambiente | URL | Performance | LCP | FCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- |
| Producao Vercel atual | `/en/projects/summer-house-comporta` | `98` | `0.95s` | `0.44s` | `0` | `27ms` |
| Hostinger referencia | `/en/projects/summer-house-comporta` | `99` | `0.85s` | `0.29s` | `0` | `43ms` |
| Local antes desta sessao | `/en/projects/summer-house-comporta` | `97` | `1.19s` | `0.45s` | `0` | `79ms` |

## Conclusao do diagnostico

- As paginas de projetos ja estavam dentro da meta de `LCP < 2.5s` antes desta sessao.
- O problema de `3.66s` nao era dessas rotas; era da homepage medida anteriormente.
- Ainda assim, havia duas prioridades incorretas que podiam degradar o LCP do detalhe e aumentar a competicao na listagem.
- A otimizacao correta aqui nao era reduzir qualidade nem mexer no layout; era alinhar `priority` e `lazy loading` ao que realmente esta above-the-fold.
