# Erro: Edge Function returned a non-2xx status code

## O que significa?

A Edge Function foi chamada com sucesso, mas retornou um erro (código de status diferente de 200).

## Causas mais prováveis:

### 1. Falta a variável ENCRYPTION_KEY no Supabase ⚠️

**Solução:**
1. Acesse: https://rhesplerpuaibdvyoety.supabase.co
2. Vá em: **Settings** (engrenagem no menu lateral)
3. Clique em: **Edge Functions**
4. Procure: **"Secrets"** ou **"Environment Variables"**
5. Clique em: **"Add new secret"**
6. Preencha:
   - **Name:** `ENCRYPTION_KEY`
   - **Value:** `zyrocheckout-secure-key-2024-change-in-production`
7. Clique em: **Save**

### 2. Falta SUPABASE_URL e SUPABASE_ANON_KEY

Essas variáveis geralmente já vêm configuradas automaticamente, mas se não estiverem:

1. Mesma tela de **Secrets**
2. Adicione:
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://rhesplerpuaibdvyoety.supabase.co`
   
3. Adicione:
   - **Name:** `SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoZXNwbGVycHVhaWJkdnlvZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzczNzEsImV4cCI6MjA4NjUxMzM3MX0.t5_5JJd6M0v3Qy9hsvJj3xQidk_a73dhFJ-jbCWTAbQ`

### 3. Verificar os logs da Edge Function

Para ver o erro exato:

1. No Supabase Dashboard
2. Vá em: **Edge Functions**
3. Clique em: **create-payment-link**
4. Clique em: **Logs** ou **View Logs**
5. Veja qual é o erro exato
6. **Me envie o erro** que aparece lá

## Passo a passo visual para adicionar ENCRYPTION_KEY:

```
1. https://rhesplerpuaibdvyoety.supabase.co
   ↓
2. Settings (ícone de engrenagem)
   ↓
3. Edge Functions (no menu de Settings)
   ↓
4. Secrets ou Environment Variables
   ↓
5. Add new secret
   ↓
6. Name: ENCRYPTION_KEY
   Value: zyrocheckout-secure-key-2024-change-in-production
   ↓
7. Save
   ↓
8. ✅ Testar novamente
```

## Depois de adicionar a variável:

1. **NÃO precisa** fazer deploy novamente
2. Apenas **teste novamente** gerando um link
3. Deve funcionar! ✅

## Se ainda der erro:

1. Vá nos **Logs** da Edge Function (passo 3 acima)
2. Copie a mensagem de erro
3. Me envie para eu investigar

---

**Resumo:** Provavelmente falta adicionar a variável `ENCRYPTION_KEY` nas configurações do Supabase.
