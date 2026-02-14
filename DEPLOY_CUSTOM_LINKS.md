# Sistema de Links Personalizados - Guia de Deploy

## ✅ O que foi implementado

### 1. Database Schema
- ✅ Adicionada coluna `slug` (unique) para links curtos
- ✅ Adicionada coluna `clicks` para rastreamento
- ✅ Adicionada coluna `last_clicked_at` para analytics
- ✅ Índice criado para buscas rápidas por slug

### 2. Supabase Edge Functions
- ✅ **get-redirect**: Busca link por slug e redireciona
- ✅ **create-payment-link**: Atualizada para gerar slugs únicos

### 3. Frontend
- ✅ **PaymentRedirect.tsx**: Página de redirecionamento (`/p/:slug`)
- ✅ **slugGenerator.ts**: Utilitário para gerar slugs únicos
- ✅ **config.ts**: Configuração do domínio
- ✅ **App.tsx**: Rota `/p/:slug` adicionada
- ✅ **PaymentLinks.tsx**: Atualizada para mostrar link personalizado

### 4. Configuration
- ✅ Variável `VITE_APP_DOMAIN=https://zyrocheckout.com.br` adicionada

---

## 🚀 Deploy - Passo a Passo

### Passo 1: Criar Tabela payment_links no Banco de Dados

1. Acesse o Supabase Dashboard: https://rhesplerpuaibdvyoety.supabase.co
2. Vá em **SQL Editor**
3. Abra o arquivo `supabase_create_payment_links_table.sql`
4. Cole e execute o SQL completo
5. Verifique se a tabela foi criada em **Table Editor > payment_links**

### Passo 2: Deploy das Edge Functions

```bash
# Deploy da função get-redirect
supabase functions deploy get-redirect

# Deploy da função create-payment-link (atualizada)
supabase functions deploy create-payment-link
```

### Passo 3: Deploy do Frontend na Vercel

```bash
# Commit e push das alterações
git add .
git commit -m "feat: implement custom domain payment links with slug redirection"
git push origin main
```

A Vercel fará deploy automaticamente.

### Passo 4: Verificar Variáveis de Ambiente na Vercel

1. Acesse Vercel Dashboard
2. Vá em **Settings > Environment Variables**
3. Adicione (se não existir):
   ```
   VITE_APP_DOMAIN=https://zyrocheckout.com.br
   ```
4. Redeploy se necessário

---

## 🧪 Como Testar

### Teste 1: Criar Link de Pagamento

1. Acesse: https://zyrocheckout.com.br/payment-links
2. Selecione um provedor configurado (ex: Stripe)
3. Insira valor: `10.00`
4. Descrição: `Teste de link personalizado`
5. Clique em **Gerar Link**
6. ✅ Você deve ver um link como: `https://zyrocheckout.com.br/p/A7K9M2`

### Teste 2: Testar Redirecionamento

1. Copie o link gerado
2. Abra em uma nova aba anônima
3. ✅ Você deve ver a página "Redirecionando..."
4. ✅ Deve ser redirecionado para o checkout do gateway (Stripe/Mercado Pago)

### Teste 3: Verificar Contador de Clicks

1. No Supabase, vá em **Table Editor > payment_links**
2. Encontre o registro pelo slug
3. ✅ A coluna `clicks` deve ter incrementado
4. ✅ A coluna `last_clicked_at` deve ter timestamp recente

### Teste 4: Testar Slug Inválido

1. Acesse: `https://zyrocheckout.com.br/p/INVALID`
2. ✅ Deve mostrar mensagem "Link não encontrado"
3. ✅ Deve redirecionar para página inicial após 3 segundos

---

## 📊 Fluxo Completo

```
1. Usuário cria link no dashboard
   ↓
2. Edge Function cria checkout no gateway (Stripe/MP)
   ↓
3. Gera slug único (ex: A7K9M2)
   ↓
4. Salva no banco: slug + URL real do gateway
   ↓
5. Retorna: https://zyrocheckout.com.br/p/A7K9M2
   ↓
6. Cliente clica no link
   ↓
7. Página /p/A7K9M2 carrega
   ↓
8. Chama Edge Function get-redirect
   ↓
9. Incrementa contador de clicks
   ↓
10. Redireciona para URL real do gateway
```

---

## 🔍 Troubleshooting

### Erro: "Link não encontrado"
- ✅ Verifique se o slug existe no banco de dados
- ✅ Confirme que a Edge Function `get-redirect` está deployada
- ✅ Verifique logs da Edge Function no Supabase

### Erro: "Failed to generate unique slug"
- ✅ Improvável (1 em 2 bilhões de colisão)
- ✅ Verifique se a coluna `slug` tem constraint UNIQUE
- ✅ Aumente `maxAttempts` se necessário

### Link não redireciona
- ✅ Abra DevTools > Network
- ✅ Verifique se a chamada para `get-redirect` retorna sucesso
- ✅ Confirme que `payment_url` está preenchido no banco

### Domínio não funciona
- ✅ Verifique se `VITE_APP_DOMAIN` está correto no `.env`
- ✅ Confirme que o domínio está configurado na Vercel
- ✅ Teste com `http://localhost:5173` localmente

---

## 📈 Próximas Melhorias (Opcional)

- [ ] Analytics: Dashboard com gráficos de clicks por link
- [ ] Expiração: Links que expiram após X dias
- [ ] QR Code: Gerar QR Code automaticamente para cada link
- [ ] Custom Slugs: Permitir usuário escolher slug personalizado
- [ ] UTM Parameters: Adicionar parâmetros de rastreamento
- [ ] Link Preview: Mostrar preview do produto antes de redirecionar

---

## ✅ Checklist Final

- [ ] SQL migration executada no Supabase
- [ ] Edge Functions deployadas
- [ ] Frontend deployado na Vercel
- [ ] Variável `VITE_APP_DOMAIN` configurada
- [ ] Teste de criação de link funcionando
- [ ] Teste de redirecionamento funcionando
- [ ] Contador de clicks incrementando
- [ ] Slug inválido mostra 404

**Pronto! Seu sistema de links personalizados está funcionando!** 🎉
