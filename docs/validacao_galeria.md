# Validacao da Galeria

Data da validacao: 2026-04-19

## Build e execucao local

- build executado com sucesso: `next build --webpack`
- servidor local iniciado em `http://127.0.0.1:3011`

## Antes vs depois: URL da primeira imagem da galeria

Projeto usado para o before/after detalhado: `summer-house-comporta`

| Contexto | URL escolhida pelo browser | Tamanho | Observacao |
| --- | --- | --- | --- |
| Producao antes da correcao | `/_next/image?...00_minimal...jpg&w=640&q=90` | `90033` bytes | largura insuficiente para equivalencia visual com o original |
| Local apos a correcao | `/_next/image?...00_minimal...jpg&w=1280&q=90` | `368044` bytes | largura alta, mantendo `lazy` |
| Original Hostinger | arquivo direto `00_minimal...jpg` | `504980` bytes | entrega em largura cheia, usada como referencia |

O hero nao foi alterado:

- antes: `/_next/image?...summer_house_in_comporta.jpg&w=1600&q=90`
- depois: `/_next/image?...summer_house_in_comporta.jpg&w=1600&q=90`

## Confirmacao tecnica nas 7 paginas

Todas as paginas abaixo mantiveram:

- hero em `w=1600&q=90`
- galeria com `loading="lazy"`
- galeria com `sizes="(max-width: 768px) 100vw, 1200px"`
- galeria escolhendo `w=1280&q=90` no desktop local validado

| Pagina | Hero | Primeira imagem da galeria | Resultado visual |
| --- | --- | --- | --- |
| `summer-house-comporta` | `w=1600&q=90` | `w=1280&q=90` | OK |
| `contemporary-city-house` | `w=1600&q=90` | `w=1280&q=90` | OK |
| `elegant-timeless-duplex` | `w=1600&q=90` | `w=1280&q=90` | OK |
| `beach-house-troia` | `w=1600&q=90` | `w=1280&q=90` | OK |
| `pombaline-restoration-principe-real` | `w=1600&q=90` | `w=1280&q=90` | OK |
| `rural-retreat` | `w=1600&q=90` | `w=1280&q=90` | OK |
| `store-restauration-atelier` | `w=1600&q=90` | `w=1280&q=90` | OK |

## Comparacao com o site original

Checagem por pagina no original `darkgrey-wallaby-265708.hostingersite.com`:

- `summer-house-comporta`: original entrega a primeira imagem da galeria em `1600px`; local corrigido passou a `1280w` e ficou nitido no mesmo enquadramento
- `contemporary-city-house`: original `1440px`; local corrigido `1280w`
- `elegant-timeless-duplex`: original `1600px`; local corrigido `1280w`
- `beach-house-troia`: original `1600px`; local corrigido `1280w`
- `pombaline-restoration-principe-real`: original `1600px`; local corrigido `1280w`
- `rural-retreat`: original `1162px`; local corrigido `1280w`
- `store-restauration-atelier`: original `1600px`; local corrigido `1280w`

Conclusao visual:

- a galeria deixou de cair em `640w`
- o nivel de nitidez voltou ao patamar esperado para um portfolio premium
- nao foi necessario mexer em hero, layout, listagem, CSS ou lightbox

## Lighthouse local apos a correcao

Auditorias executadas no build local corrigido:

| Pagina | Performance | LCP | FCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- |
| `/en/projects/summer-house-comporta` | `97` | `0.85s` | `0.60s` | `0` | `130ms` |
| `/en/projects/contemporary-city-house` | `97` | `1.06s` | `0.41s` | `0` | `96ms` |
| `/en/projects/rural-retreat` | `92` | `1.76s` | `0.45s` | `0` | `85ms` |

Conclusao de performance:

- `LCP < 2.5s` mantido
- `Performance >= 85` mantida
- como a galeria continua lazy, a melhoria de qualidade nao degradou o LCP das paginas

## Arquivos modificados nesta tarefa

- `src/app/[locale]/(site)/projects/[slug]/project-detail-client.tsx`
  - galeria recebeu `quality={90}` explicito
  - `sizes` passou a priorizar largura alta no desktop (`1200px`)
- `docs/diagnostico_galeria.md`
  - investigacao da causa raiz
- `docs/validacao_galeria.md`
  - validacao tecnica, visual e de performance

## Diff resumido

- antes: a galeria escolhia `w=640&q=90`
- depois: a galeria escolhe `w=1280&q=90`
- hero permaneceu em `w=1600&q=90`
- `loading="lazy"` foi mantido na galeria
- performance continuou dentro da meta
