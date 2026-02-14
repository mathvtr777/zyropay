# Guia Passo a Passo - Deploy Manual das Edge Functions

## 🎯 O que você precisa fazer

Copiar 2 códigos e colar no Supabase Dashboard. Simples assim!

---

## 📋 PASSO 1: Acessar o Supabase

1. Abra seu navegador
2. Acesse: https://rhesplerpuaibdvyoety.supabase.co
3. Faça login se necessário

---

## 📋 PASSO 2: Ir para Edge Functions

1. No menu lateral esquerdo, procure por **"Edge Functions"**
2. Clique em **Edge Functions**
3. Você verá uma lista (pode estar vazia)

---

## 📋 PASSO 3: Criar a primeira função (create-payment-link)

### 3.1 - Criar nova função

1. Clique no botão **"New Function"** ou **"Create a new function"**
2. No campo **"Function name"**, digite: `create-payment-link`
3. Clique em **"Create function"** ou **"Continue"**

### 3.2 - Colar o código

1. Você verá um editor de código
2. **APAGUE TODO** o código que está lá
3. Abra o arquivo: `supabase/functions/create-payment-link/index.ts` no seu projeto
4. **Copie TODO** o conteúdo desse arquivo
5. **Cole** no editor do Supabase
6. Clique em **"Deploy"** ou **"Save"**

---

## 📋 PASSO 4: Criar a segunda função (get-redirect)

### 4.1 - Criar nova função

1. Volte para a lista de Edge Functions
2. Clique em **"New Function"** novamente
3. No campo **"Function name"**, digite: `get-redirect`
4. Clique em **"Create function"**

### 4.2 - Colar o código

1. **APAGUE TODO** o código que está lá
2. Abra o arquivo: `supabase/functions/get-redirect/index.ts` no seu projeto
3. **Copie TODO** o conteúdo desse arquivo
4. **Cole** no editor do Supabase
5. Clique em **"Deploy"** ou **"Save"**

---

## 📋 PASSO 5: Configurar variável de ambiente

### 5.1 - Ir para Settings

1. No menu lateral, clique em **"Settings"** (ícone de engrenagem)
2. Procure por **"Edge Functions"** ou **"Functions"**
3. Clique em **"Edge Functions"**

### 5.2 - Adicionar variável

1. Procure por **"Environment Variables"** ou **"Secrets"**
2. Clique em **"Add new secret"** ou **"Add variable"**
3. **Name (Nome):** `ENCRYPTION_KEY`
4. **Value (Valor):** `zyrocheckout-secure-key-2024-change-in-production`
5. Clique em **"Save"** ou **"Add"**

---

## ✅ PASSO 6: Verificar se funcionou

1. Volte para **Edge Functions** no menu lateral
2. Você deve ver **2 funções**:
   - ✅ `create-payment-link` (status: deployed)
   - ✅ `get-redirect` (status: deployed)

---

## 🧪 PASSO 7: Testar

1. Volte para seu site: https://zyrocheckout.com.br
2. Vá em **Payment Links**
3. Selecione **Pushin Pay**
4. Digite um valor: `10.00`
5. Descrição: `Teste`
6. Clique em **Gerar Link**
7. ✅ **Deve funcionar!**

---

## ❓ Problemas?

### Se não encontrar "Edge Functions" no menu:
- Procure por "Functions" ou "Database Functions"
- Ou vá direto: https://supabase.com/dashboard/project/rhesplerpuaibdvyoety/functions

### Se der erro ao colar o código:
- Certifique-se de **apagar TODO** o código antigo antes de colar
- Copie o arquivo **completo** do início ao fim

### Se ainda der erro ao gerar link:
- Verifique se as 2 funções estão com status "deployed"
- Verifique se a variável `ENCRYPTION_KEY` foi adicionada
- Me envie uma mensagem com o erro

---

## 📝 Resumo Visual

```
1. Supabase Dashboard
   ↓
2. Edge Functions (menu lateral)
   ↓
3. New Function → Nome: create-payment-link
   ↓
4. Copiar código de: supabase/functions/create-payment-link/index.ts
   ↓
5. Colar e Deploy
   ↓
6. New Function → Nome: get-redirect
   ↓
7. Copiar código de: supabase/functions/get-redirect/index.ts
   ↓
8. Colar e Deploy
   ↓
9. Settings → Edge Functions → Add Secret
   ↓
10. Nome: ENCRYPTION_KEY
    Valor: zyrocheckout-secure-key-2024-change-in-production
   ↓
11. ✅ PRONTO!
```

---

**Qualquer dúvida, me chame que eu te ajudo! 🚀**
