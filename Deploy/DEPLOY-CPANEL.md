# Arquivos para subir

Esta pasta contem apenas o necessario para upload no cPanel.

## Configuracao do Node.js App

No formulario do cPanel, use:

- Application root: a pasta para onde voce extrair este pacote, por exemplo `raiz-app`
- Application URL: seu dominio ou subdominio
- Application startup file: `app.js`

## Variaveis de ambiente

Edite o arquivo `.env` antes do upload ou replique os mesmos valores no painel:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://seu-dominio`
- `NEXTAUTH_URL=https://seu-dominio`
- `NEXTAUTH_SECRET=sua-chave-grande`
- `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public`
- `ADMIN_EMAIL=admin@raiz-interiors.com`
- `APIFY_API_TOKEN=` apenas se for usar sincronizacao do Instagram

## Depois do upload

No terminal do servidor:

```bash
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH
cd ~/raiz-app
npm install
npm run build
```

Depois clique em `Restart` na aplicacao Node.js do cPanel.
