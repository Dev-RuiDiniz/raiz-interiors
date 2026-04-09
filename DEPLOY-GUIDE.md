# 🚀 DEPLOY RAIZ INTERIORS - GUIA COMPLETO

## 📋 SITUAÇÃO ATUAL
- ✅ **Local:** Favicon funcionando
- ❌ **Produção:** Favicon antiga (Vercel)
- ❌ **Causa:** Mudanças não enviadas para Vercel

## 🔧 SOLUÇÃO MAIS ASSERTIVA

### Passo 1: Instalar Git
```bash
# Baixar Git: https://git-scm.com/download/win
# Instalar normalmente
```

### Passo 2: Configurar Repositório
```bash
cd "c:\Users\Rafael\Downloads\raiz-interiors-main\raiz-interiors-main"

# Inicializar git
git init

# Configurar usuário (substitua pelos seus dados)
git config user.name "Seu Nome"
git config user.email "seu@email.com"

# Adicionar todos os arquivos
git add .

# Commit das mudanças
git commit -m "feat: adicionar favicon RAIZ e configurações anti-cache

- Adicionar favicon-raiz.ico personalizado
- Configurar headers no-cache para favicon
- Atualizar layout com meta tags anti-cache
- Modificar proxy.ts para incluir novo favicon"

# Criar branch main
git branch -M main
```

### Passo 3: Enviar para GitHub
```bash
# Criar repositório no GitHub: https://github.com/new
# Nome sugerido: raiz-interiors

# Conectar ao GitHub (substitua SEU_USERNAME)
git remote add origin https://github.com/SEU_USERNAME/raiz-interiors.git

# Enviar para GitHub
git push -u origin main
```

### Passo 4: Deploy na Vercel
1. Acesse: https://vercel.com
2. **Import Project** → **From Git**
3. Conecte sua conta GitHub
4. Selecione o repositório `raiz-interiors`
5. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
6. **Deploy**

## ✅ VERIFICAÇÃO
Após deploy, teste:
- https://seu-dominio.vercel.app/favicon-raiz.ico?v=4
- Deve mostrar a logo da RAIZ

## 🔄 ALTERNATIVA: Deploy Manual
Se preferir deploy manual:

```bash
# Criar arquivo zip (excluindo node_modules e .next)
Compress-Archive -Path * -DestinationPath raiz-interiors-deploy.zip -Exclude "node_modules",".next","*.log","tmp",".git"

# Upload manual na Vercel
# 1. Acesse vercel.com
# 2. Import Project → Upload
# 3. Selecione raiz-interiors-deploy.zip
```

## 📁 ARQUIVOS MODIFICADOS
- `src/app/layout.tsx` - Favicon + meta tags
- `next.config.ts` - Headers no-cache
- `src/proxy.ts` - Matcher atualizado
- `public/favicon-raiz.ico` - Arquivo favicon

---
**IMPORTANTE:** Não esqueça de configurar as variáveis de ambiente na Vercel!