# Registro de atualizações — 2026-06-19

Este documento resume todas as mudanças aplicadas ao projeto nesta rodada de trabalho, para facilitar revisão, auditoria e uso futuro.

## 1) Formulário de contacto migrado para Web3Forms

### O que mudou
- A integração anterior baseada em Resend foi substituída por **Web3Forms**.
- O formulário da página de contacto agora envia os dados via Web3Forms no browser.
- O envio interno para persistência no banco continua disponível.

### Arquivos relacionados
- `src/app/[locale]/(site)/contact/contact-client.tsx`
- `src/lib/web3forms-contact.ts`
- `src/app/api/contact/route.ts`
- `src/i18n/dictionaries/en.json`
- `src/i18n/dictionaries/pt.json`
- `.env.local` (local, fora do Git)

### Comportamento atual
- O utilizador preenche o formulário normalmente.
- O frontend envia a mensagem para a Web3Forms.
- Em paralelo, o sistema tenta guardar a submissão no banco local.
- A interface mostra mensagens de sucesso ou erro de forma amigável.

## 2) Manual de uso do painel de controle

### O que foi criado
- Um manual em PDF para orientar o utilizador final no uso do painel administrativo.
- Um segundo PDF técnico com a análise das funções internas do painel.

### Arquivos gerados
- `docs/manual-painel-controle-raiz-interiors.pdf`
- `docs/painel-controle-raiz-interiors.pdf`

### Conteúdo do manual
- Visão rápida dos menus.
- Como usar o painel no dia a dia.
- O que fazer em Projects, Services, Pages, Media, Contacts, Newsletter, Notifications e Settings.
- Boas práticas antes de publicar.
- Problemas comuns e ações rápidas.

## 3) Cron de sincronização do Instagram

### O que foi adicionado
- Endpoint dedicado para execução agendada da sincronização de Instagram.
- Configuração de cron da Vercel para disparo automático.

### Arquivos relacionados
- `src/app/api/cron/instagram-sync/route.ts`
- `vercel.json`

### Observação
- O endpoint valida se a chamada veio do cron da Vercel antes de executar a sincronização.

## 4) Documentação do projeto

### O que foi ajustado
- O `README.md` foi atualizado para refletir o estado atual do projeto.
- O texto ficou alinhado com o ambiente Next.js/Prisma/pnpm e com o fluxo de contacto atual.

### Arquivo relacionado
- `README.md`

## 5) Validações executadas

### Validações de código
- Typecheck executado com sucesso.
- Rotas principais do contacto validadas localmente.

### Validações de documentação
- Os PDFs gerados foram abertos e confirmados com extração de texto.
- As seções principais do manual ficaram legíveis e consistentes.

## 6) Resumo executivo

Nesta rodada, o projeto recebeu:
- nova integração de email com Web3Forms,
- persistência interna do contacto mantida,
- manual de uso para o painel administrativo,
- documentação técnica das funções do painel,
- cron do Instagram configurado,
- e atualização do README.

Se você abrir o repositório depois, este arquivo deve ser o primeiro ponto de referência para entender o que foi alterado.