# Erro ao Registrar Token da Pushin Pay - RESOLVIDO

## Problema
Ao tentar salvar o token da Pushin Pay, você recebeu um erro relacionado à criptografia.

## Causa
Estava faltando a variável de ambiente `VITE_ENCRYPTION_PASSPHRASE` no arquivo `.env`.

## Solução Aplicada

✅ Adicionada a variável `VITE_ENCRYPTION_PASSPHRASE` ao arquivo `.env`

## Próximos Passos

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   # Pare o servidor (Ctrl+C)
   # Inicie novamente
   npm run dev
   ```

2. **Tente registrar o token novamente:**
   - Vá em **Provedores**
   - Clique em **Conectar** na Pushin Pay
   - Cole seu token de acesso
   - Clique em **Conectar Provedor**

3. **Se ainda der erro:**
   - Abra o DevTools (F12)
   - Vá na aba **Console**
   - Copie a mensagem de erro completa
   - Me envie para eu investigar

## Variáveis de Ambiente Necessárias

Seu arquivo `.env` agora tem todas as variáveis necessárias:

```env
VITE_SUPABASE_URL=https://rhesplerpuaibdvyoety.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_APP_DOMAIN=https://zyrocheckout.com.br
VITE_ENCRYPTION_PASSPHRASE=zyrocheckout-secure-key-2024-change-in-production
```

> **Nota de Segurança:** Em produção, você deve usar uma chave mais forte e armazená-la de forma segura. Esta chave é usada apenas para criptografia client-side antes de enviar ao Supabase.

## Teste

Após reiniciar o servidor, tente:
1. Registrar token da Pushin Pay
2. Gerar um link de pagamento
3. Testar o redirecionamento

Tudo deve funcionar agora! ✅
