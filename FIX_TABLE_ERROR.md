# Erro: Tabela provider_credentials não existe

## Problema
```
Could not find the table 'public.provider_credentials' in the schema cache
```

## Causa
A tabela `provider_credentials` ainda não foi criada no banco de dados Supabase.

## Solução

### Passo 1: Criar a tabela provider_credentials

1. Acesse o Supabase Dashboard: https://rhesplerpuaibdvyoety.supabase.co
2. Vá em **SQL Editor**
3. Abra o arquivo `supabase_create_provider_credentials_table.sql`
4. Cole e execute o SQL completo
5. Verifique se a tabela foi criada em **Table Editor > provider_credentials**

### Passo 2: Criar a tabela payment_links (se ainda não criou)

1. No mesmo **SQL Editor**
2. Abra o arquivo `supabase_create_payment_links_table.sql`
3. Cole e execute o SQL completo
4. Verifique se a tabela foi criada em **Table Editor > payment_links**

### Passo 3: Reiniciar o servidor

```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### Passo 4: Testar novamente

1. Vá em **Provedores**
2. Clique em **Conectar** na Pushin Pay
3. Cole seu token de acesso
4. Clique em **Conectar Provedor**
5. ✅ Deve funcionar agora!

## Tabelas Necessárias

Para o sistema funcionar completamente, você precisa destas tabelas:

1. ✅ `provider_credentials` - Armazena credenciais criptografadas dos gateways
2. ✅ `payment_links` - Armazena links de pagamento gerados com slugs

## Verificar se as tabelas existem

No Supabase Dashboard:
1. Vá em **Table Editor**
2. Você deve ver:
   - `provider_credentials`
   - `payment_links`

Se não vê essas tabelas, execute os SQLs mencionados acima.

## Ordem de Execução

Execute nesta ordem:
1. `supabase_create_provider_credentials_table.sql` (primeiro)
2. `supabase_create_payment_links_table.sql` (segundo)

Depois disso, tudo deve funcionar! 🚀
