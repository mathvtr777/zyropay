# Problema Identificado: Edge Function Rodando Localmente

## 🔍 O que descobri

Os logs mostram `localhost:9999`, o que significa que:
- ✅ A Edge Function está rodando **localmente** no seu computador
- ❌ A Edge Function **NÃO está deployada** no Supabase Cloud

## 🎯 Solução

Você precisa fazer o **deploy manual** da Edge Function no Supabase Dashboard.

---

## 📋 PASSO A PASSO COMPLETO

### PASSO 1: Parar o servidor local

Se você tem algum terminal rodando com `supabase start` ou similar:
1. Vá no terminal
2. Aperte `Ctrl + C` para parar

### PASSO 2: Fazer deploy manual no Supabase

#### 2.1 - Acessar o Dashboard
1. Abra: https://rhesplerpuaibdvyoety.supabase.co
2. Clique em: **Edge Functions** (menu lateral)

#### 2.2 - Verificar se a função existe
- Você vê a função `create-payment-link` na lista?
  - **SIM** → Vá para o PASSO 3
  - **NÃO** → Continue aqui

#### 2.3 - Criar a função (se não existir)
1. Clique em: **New Function** ou **Create Function**
2. Nome: `create-payment-link`
3. Clique em: **Create**

#### 2.4 - Colar o código
1. Você verá um editor de código
2. **APAGUE TODO** o código que está lá
3. Abra o arquivo no seu computador: 
   ```
   supabase/functions/create-payment-link/index.ts
   ```
4. **Copie TODO** o conteúdo (Ctrl+A, Ctrl+C)
5. **Cole** no editor do Supabase (Ctrl+V)
6. Clique em: **Deploy** ou **Save**

### PASSO 3: Adicionar variável de ambiente

1. No Supabase Dashboard, vá em: **Settings** (engrenagem)
2. Clique em: **Edge Functions**
3. Procure: **Secrets** ou **Environment Variables**
4. Clique em: **Add new secret**
5. Preencha:
   - **Name:** `ENCRYPTION_KEY`
   - **Value:** `zyrocheckout-secure-key-2024-change-in-production`
6. Clique em: **Save**

### PASSO 4: Testar

1. Volte para: https://zyrocheckout.com.br
2. Vá em: **Payment Links**
3. Tente gerar um link
4. ✅ **Deve funcionar agora!**

---

## ✅ Como saber se funcionou?

Quando você tentar gerar o link novamente:
- ❌ Se aparecer `localhost:9999` nos logs → Ainda está rodando localmente
- ✅ Se NÃO aparecer localhost → Está usando o Supabase Cloud!

---

## 📝 Resumo Visual

```
Problema: Edge Function rodando em localhost
          ↓
Solução: Deploy manual no Supabase Dashboard
          ↓
1. Supabase Dashboard
2. Edge Functions
3. Create Function: create-payment-link
4. Copiar código de: supabase/functions/create-payment-link/index.ts
5. Colar e Deploy
6. Settings → Edge Functions → Add Secret
7. ENCRYPTION_KEY = zyrocheckout-secure-key-2024-change-in-production
8. ✅ Testar!
```

---

**Depois de fazer isso, tente gerar o link novamente e me avisa se funcionou! 🚀**
