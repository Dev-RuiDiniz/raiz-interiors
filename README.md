# RAIZ Interiors

Website da RAIZ Interiors construído com Next.js, TypeScript e Tailwind CSS.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- NextAuth

## Estrutura importante

- `src/`: aplicação principal
- `public/`: imagens e assets públicos
- `prisma/`: schema e configuração do banco
- `Deploy/`: aplicação que a Vercel deve construir em produção, mantida como unidade isolada de deploy dentro da raiz do repositório

Para o deploy hospedado na Vercel, a decisão atual do projeto é usar `Deploy/` como Root Directory. A raiz continua útil para desenvolvimento e comparação, mas o pipeline publicado deve instalar dependências, rodar `build` e ler a configuração a partir de `Deploy/`.

## Rodando localmente

```bash
npm install
npm run dev
```

Para produção:

```bash
npm run build
npm start
```

## Variáveis de ambiente

Use `.env.example` como base:

```bash
cp .env.example .env.local
```

Valores disponíveis:

```env
DATABASE_URL=""
DIRECT_URL=""
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-only-nextauth-secret"
APIFY_API_TOKEN=""
```

## Preview na Vercel

Este repositório está configurado para publicar a versão de `Deploy/` na Vercel.

- Defina o Root Directory do projeto como `Deploy`.
- Mantenha qualquer override manual do dashboard alinhado com esse mesmo caminho.
- Não use `rootDirectory` em `vercel.json`, porque essa propriedade não faz parte do schema aceito pela Vercel.
- A documentação operacional dessa decisão está em `docs/vercel-deploy.md`.

## GitHub

Repositório esperado:

- Nome: `raiz-interiors`
- Descrição: `Premium interior design studio website built with Next.js for RAIZ Interiors.`
