# Deploy na Vercel

## Decisão atual

O deploy oficial da Vercel deste repositório deve usar `Deploy/` como Root Directory.

## Motivo

- `Deploy/` contém uma cópia autocontida do app com `package.json`, `src/`, `prisma/` e `public/`.
- O build anterior falhava quando a Vercel tentava compilar a raiz do repositório e misturava arquivos de contextos diferentes.
- Centralizar o deploy em `Deploy/` reduz o acoplamento entre a aplicação publicada e os arquivos auxiliares da raiz.

## Como manter

- No projeto da Vercel, configure o Root Directory como `Deploy`.
- Preserve esse mesmo caminho em qualquer recriação do projeto, integração por botão de deploy ou ajuste manual de build settings.
- Não tente configurar `rootDirectory` em `vercel.json`, porque o schema da Vercel rejeita essa propriedade.
- Sempre valide `pnpm typecheck` e `pnpm run build` dentro de `Deploy/` antes de publicar mudanças de infraestrutura ou dependências.

## Ajuste no dashboard

Para um projeto da Vercel que ja existe:

1. Abra o projeto na Vercel.
2. Entre em `Settings`.
3. Abra `General`.
4. Em `Build & Deployment Settings`, defina `Root Directory` como `Deploy`.
5. Salve a configuracao.
6. Rode um novo deploy a partir da branch `main`.

Sem esse ajuste no dashboard, a Vercel continua tentando construir a raiz do repositório.

## Impacto prático

- A Vercel passa a instalar dependências e executar o build usando `Deploy/package.json`.
- A documentação e as correções de deploy devem considerar `Deploy/` como a fonte oficial da publicação.
