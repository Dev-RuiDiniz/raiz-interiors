# Diagnostico da Qualidade da Galeria

Data da analise: 2026-04-19

## Resumo

O hero e a galeria das paginas de projeto usam o mesmo componente base de imagem, mas nao percorrem exatamente o mesmo pipeline de selecao de variante no browser. O problema nao estava em `quality`, nem em um componente paralelo de galeria, nem em um servico externo de imagem.

A causa raiz era o `sizes` da galeria em [project-detail-client.tsx](/C:/Users/Rafael/Downloads/raiz-interiors-main/repo-https/src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx). Ele era conservador demais:

- hero: `sizes="100vw"` -> o browser escolhia `w=1600&q=90`
- galeria: `sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 44vw, 50vw"` -> o browser escolhia `w=640&q=90`

Na pratica, o hero era servido com largura alta e a galeria com largura baixa, apesar de ambos passarem por `SiteImage`.

## Trace completo: hero vs galeria

### Hero

Renderizacao:

- arquivo: `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`
- componente: `SiteImage`
- props relevantes:
  - `src={getProjectImageSrc(project.coverImage)}`
  - `fill`
  - `preserveQuality={!useOptimizedProjectImages}`
  - `priority`
  - `sizes="100vw"`

URL observada em producao:

- `/_next/image?url=%2F2026%2Fprojects%2Ffotos_capa_menu_projectos%2Fsummer_house_in_comporta.jpg&w=1600&q=90`

Resultado observado:

- `loading="eager"`
- `Content-Type: image/jpeg`
- `Content-Length: 354072`
- largura escolhida pelo browser: `1600w`

### Galeria

Renderizacao:

- arquivo: `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`
- componente: `SiteImage`
- props relevantes antes da correcao:
  - `src={getProjectImageSrc(image)}`
  - `fill`
  - `preserveQuality={!useOptimizedProjectImages}`
  - `loading="lazy"`
  - `sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 44vw, 50vw"`

URL observada em producao antes da correcao:

- `/_next/image?url=%2F2026%2Fprojects%2Fsummer_house_comporta%2F00_minimal%20entrance%20hall%20w%20sculptural%20wooden%20bench%20and%20handcraft%20lamp%20interiordesign%20by%20Raiz.jpg&w=640&q=90`

Resultado observado:

- `loading="lazy"`
- `Content-Type: image/jpeg`
- `Content-Length: 90033`
- largura escolhida pelo browser: `640w`

## Confirmacao: nao existe componente paralelo de galeria

Busca em `src/` por `gallery|Gallery|lightbox|Lightbox|carousel|Carousel|slider|Slider|SiteImage|site-image` mostrou:

- a pagina de detalhe usa `SiteImage` no hero
- a mesma pagina usa `SiteImage` nos cards da galeria
- a mesma pagina usa `SiteImage` no lightbox

Nao foi encontrado:

- componente third-party de galeria renderizando `<img>` nativo
- `background-image` CSS para os cards da galeria
- branch de codigo separada para hero e galeria

## Origem das imagens

O hero vem de `project.coverImage`.

A galeria vem de `project.images`, resolvida por [content-service.ts](/C:/Users/Rafael/Downloads/raiz-interiors-main/repo-https/src/lib/cms/content-service.ts):

- primeiro tenta `project.images` publicadas no banco/CMS
- depois tenta `detail_gallery` publicado em `page-layout`
- so cai no fallback de `defaultProjectDetails[slug].images` se nao houver layout/imagens publicadas

Isso explica por que a producao estava mostrando a serie `00..26` do projeto `summer-house-comporta`, enquanto o fallback local em [default-projects.ts](/C:/Users/Rafael/Downloads/raiz-interiors-main/repo-https/src/lib/cms/default-projects.ts) tem outra selecao/ordem de imagens.

Mesmo assim, a origem nao era a causa da baixa qualidade. A causa era a largura escolhida para essas imagens da galeria.

## Comparacao direta: producao vs original

Exemplo: `/en/projects/summer-house-comporta`

| Contexto | Hero | Galeria (primeira imagem) |
| --- | --- | --- |
| Producao Vercel antes da correcao | `w=1600&q=90`, `354072` bytes | `w=640&q=90`, `90033` bytes |
| Original Hostinger | arquivo direto, `1600` px de largura | arquivo direto, `1600` px de largura, `504980` bytes |

Conclusao dessa comparacao:

- o hero da Vercel ja estava no patamar correto
- a galeria da Vercel era servida numa variante muito menor do que a do site original
- por isso so a galeria parecia degradada

## Causa raiz

A diferenca no pipeline entre hero e galeria era o valor de `sizes`.

- o hero anunciava `100vw`, entao o browser pedia a variante alta
- a galeria anunciava algo proximo de `42vw`, entao o browser considerava `640w` suficiente para um card de cerca de `578px`

Como o site original serve a mesma imagem da galeria em largura cheia de `1600px`, a diferenca visual ficava evidente.

## Correcao aplicada

Arquivo alterado:

- `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`

Mudanca aplicada apenas na galeria:

- `quality={90}` explicito
- `sizes` alterado de `"(min-width: 1280px) 42vw, (min-width: 1024px) 44vw, 50vw"` para `"(max-width: 768px) 100vw, 1200px"`

Efeito esperado:

- manter `loading="lazy"`
- manter o hero intacto
- forcar a galeria a escolher variantes altas (`w=1280` no desktop local validado)
- aproximar a nitidez do original sem tocar no LCP do hero
