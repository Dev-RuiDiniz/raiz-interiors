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

## Impacto prático

- A Vercel passa a instalar dependências e executar o build usando `Deploy/package.json`.
- A documentação e as correções de deploy devem considerar `Deploy/` como a fonte oficial da publicação.
