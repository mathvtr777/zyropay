# Erro: Failed to send a request to the Edge Function

## Problema
```
Erro ao gerar link
Failed to send a request to the Edge Function
```

## Causas Possíveis

1. **Edge Functions não foram deployadas** (mais provável)
2. **Erro de configuração no Supabase**
3. **Falta variável de ambiente no Edge Function**

## Solução

### Opção 1: Deploy via Supabase CLI (Recomendado)

```bash
# 1. Fazer login no Supabase
supabase login

# 2. Linkar ao projeto
supabase link --project-ref rhesplerpuaibdvyoety

# 3. Deploy das Edge Functions
supabase functions deploy create-payment-link
supabase functions deploy get-redirect

# 4. Verificar se foram deployadas
supabase functions list
```

### Opção 2: Deploy via Dashboard (Alternativa)

Se você não tem o Supabase CLI instalado:

1. **Acesse:** https://rhesplerpuaibdvyoety.supabase.co
2. **Vá em:** Edge Functions
3. **Clique em:** Deploy new function
4. **Nome:** `create-payment-link`
5. **Cole o código de:** `supabase/functions/create-payment-link/index.ts`
6. **Repita para:** `get-redirect`

### Opção 3: Instalar Supabase CLI

Se não tem o CLI instalado:

**Windows:**
```bash
# Via Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Ou via NPM
npm install -g supabase
```

**Depois:**
```bash
supabase login
supabase link --project-ref rhesplerpuaibdvyoety
supabase functions deploy create-payment-link
supabase functions deploy get-redirect
```

## Configurar Variáveis de Ambiente no Edge Function

Após deploy, configure as variáveis:

1. **Acesse:** https://rhesplerpuaibdvyoety.supabase.co
2. **Vá em:** Settings > Edge Functions
3. **Adicione:**
   ```
   ENCRYPTION_KEY=your-secret-encryption-key-here-min-32-chars
   ```

> **Importante:** Use a mesma chave que está em `VITE_ENCRYPTION_PASSPHRASE` ou uma chave forte de 32+ caracteres

## Verificar se está funcionando

Após o deploy:

1. **Vá em:** Edge Functions no Dashboard
2. **Você deve ver:**
   - ✅ `create-payment-link` (deployed)
   - ✅ `get-redirect` (deployed)

3. **Teste novamente:**
   - Vá em Payment Links
   - Selecione Pushin Pay
   - Insira valor e descrição
   - Clique em Gerar Link
   - ✅ Deve funcionar!

## Troubleshooting

### Se ainda der erro após deploy:

1. **Verifique os logs:**
   ```bash
   supabase functions logs create-payment-link
   ```

2. **Ou no Dashboard:**
   - Edge Functions > create-payment-link > Logs

3. **Me envie o erro dos logs** para eu investigar

## Resumo dos Comandos

```bash
# Instalar CLI (se necessário)
npm install -g supabase

# Login e deploy
supabase login
supabase link --project-ref rhesplerpuaibdvyoety
supabase functions deploy create-payment-link
supabase functions deploy get-redirect

# Verificar
supabase functions list
```

Depois disso, tudo deve funcionar! 🚀
