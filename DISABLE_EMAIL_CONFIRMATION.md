# Como Desabilitar Confirmação de Email no Supabase

Se você ainda está recebendo solicitações de confirmação de email mesmo após desabilitar no Supabase, siga estes passos:

## 1. Verificar Configurações no Supabase Dashboard

1. Acesse: https://rhesplerpuaibdvyoety.supabase.co
2. Vá em **Authentication** > **Providers** > **Email**
3. Certifique-se que **"Confirm email"** está **DESABILITADO**
4. Clique em **Save**

## 2. Verificar Email Templates

1. Ainda em **Authentication**, vá em **Email Templates**
2. Verifique se o template de confirmação está desabilitado

## 3. Verificar Políticas RLS

Se você tem políticas RLS (Row Level Security) que exigem `email_confirmed_at`, isso pode causar problemas. Verifique:

```sql
-- Execute no SQL Editor para verificar
SELECT * FROM auth.users LIMIT 1;
```

Se `email_confirmed_at` for `null`, mas você tem RLS que exige isso, atualize as políticas.

## 4. Código Atualizado

O código foi atualizado para:

### ✅ Detectar automaticamente se email confirmation está habilitado
```typescript
if (data.session) {
  // Email confirmation DESABILITADO - redireciona direto
  navigate("/dashboard");
} else {
  // Email confirmation HABILITADO - mostra mensagem
  toast({ description: "Verifique seu email..." });
}
```

### ✅ Salvar primeiro nome e sobrenome separadamente
```typescript
options: {
  data: {
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`.trim(),
  },
}
```

## 5. Testar

1. Crie uma nova conta
2. Se a confirmação estiver **desabilitada**: você será redirecionado direto para o dashboard
3. Se a confirmação estiver **habilitada**: você verá a mensagem para verificar o email

## 6. Forçar Desabilitar (Alternativa)

Se ainda não funcionar, você pode forçar via SQL:

```sql
-- Execute no SQL Editor do Supabase
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
```

⚠️ **Atenção:** Isso confirmará TODOS os emails não confirmados. Use com cuidado!

## 7. Verificar Logs

Se o problema persistir, verifique os logs:
1. Vá em **Logs** > **Auth Logs**
2. Procure por erros relacionados a signup
3. Verifique se há alguma política bloqueando

---

**Resumo:** O código agora detecta automaticamente se o email confirmation está habilitado e age de acordo. Certifique-se de desabilitar no Supabase Dashboard.
