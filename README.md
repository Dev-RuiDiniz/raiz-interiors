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
- `Deploy/`: snapshot preservado da versão atual do projeto, limpo de artefatos pesados e temporários

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

Este repositório está preparado para um primeiro deploy de teste focado no site público.

- O site público usa fallbacks quando `DATABASE_URL` não está configurada.
- Admin, autenticação e rotas de API continuam no projeto, mas o objetivo inicial é validar o frontend público.
- Se o preview exigir dados dinâmicos futuros, basta configurar as variáveis de ambiente na Vercel.

## GitHub

Repositório esperado:

- Nome: `raiz-interiors`
- Descrição: `Premium interior design studio website built with Next.js for RAIZ Interiors.`
