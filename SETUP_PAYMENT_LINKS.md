# Guia de Setup - Sistema de Links de Pagamento REAIS

## ✅ O que foi implementado

### 1. Database Schema
- ✅ Tabela `provider_credentials` para credenciais criptografadas
- ✅ Tabela `payment_links` para histórico de links gerados
- ✅ Políticas RLS para segurança por usuário

### 2. Supabase Edge Function
- ✅ `/supabase/functions/create-payment-link/index.ts`
- ✅ Adapters REAIS para:
  - **Stripe** - Pagamentos internacionais
  - **Mercado Pago** - América Latina
  - **Asaas** - Cobranças Brasil
- ✅ Criptografia/descriptografia de credenciais
- ✅ Tratamento de erros completo

### 3. Frontend
- ✅ `Providers.tsx` - Salva credenciais criptografadas
- ✅ `PaymentLinks.tsx` - Gera links REAIS via Edge Function
- ✅ Hooks React Query para gerenciamento de estado
- ✅ Validação de provedores configurados

---

## 🚀 Setup Passo a Passo

### Passo 1: Executar Schema SQL

1. Acesse o Supabase Dashboard: https://rhesplerpuaibdvyoety.supabase.co
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo de `supabase_schema.sql`
4. Verifique se as tabelas foram criadas em **Table Editor**

### Passo 2: Deploy da Edge Function

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login no Supabase
supabase login

# Link ao projeto
supabase link --project-ref rhesplerpuaibdvyoety

# Deploy da função
supabase functions deploy create-payment-link
```

### Passo 3: Configurar Secrets da Edge Function

No Supabase Dashboard > Edge Functions > Secrets, adicione:

```bash
ENCRYPTION_KEY=<gere-uma-chave-aleatoria-32-caracteres>
```

Para gerar uma chave segura:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Passo 4: Adicionar Variável de Ambiente (Opcional)

No arquivo `.env`:
```env
VITE_ENCRYPTION_PASSPHRASE=<mesma-chave-do-passo-3>
```

---

## 🧪 Como Testar

### 1. Obter Credenciais de Teste

#### Stripe (Recomendado para começar)
1. Acesse: https://dashboard.stripe.com/register
2. Crie uma conta de teste
3. Vá em **Developers > API Keys**
4. Copie:
   - **Publishable key** (começa com `pk_test_...`) → API Key
   - **Secret key** (começa com `sk_test_...`) → Secret Key

#### Mercado Pago
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Crie uma aplicação de teste
3. Copie as credenciais de teste:
   - **Public Key** → API Key
   - **Access Token** → Secret Key

#### Asaas
1. Acesse: https://www.asaas.com/
2. Crie uma conta sandbox
3. Vá em **Integrações > API**
4. Copie o **API Key**

### 2. Configurar Provedor no Sistema

1. Faça login no sistema
2. Vá em **Provedores**
3. Clique em **Conectar** no provedor desejado
4. Cole as credenciais:
   - **Client ID / API Key**: Cole a chave pública/API key
   - **Client Secret / Token**: Cole a chave secreta/token
5. Clique em **Conectar Provedor**

### 3. Gerar Link de Pagamento

1. Vá em **Links de Pagamento**
2. Selecione o provedor configurado
3. Insira:
   - **Valor**: Ex: 10.00
   - **Descrição**: Ex: "Teste de pagamento"
4. Clique em **Gerar Link**
5. ✅ Você receberá uma URL REAL do provedor!

### 4. Testar o Link

1. Copie o link gerado
2. Abra em uma nova aba
3. Você verá a página de checkout REAL do provedor
4. Use cartões de teste:

**Stripe Test Cards:**
- Sucesso: `4242 4242 4242 4242`
- Falha: `4000 0000 0000 0002`
- CVV: qualquer 3 dígitos
- Data: qualquer data futura

**Mercado Pago Test Cards:**
- Sucesso: `5031 4332 1540 6351`
- CVV: 123
- Data: qualquer data futura

---

## 🔍 Verificação

### Verificar se funcionou:

1. **No Supabase**:
   - Vá em **Table Editor > payment_links**
   - Você deve ver o link gerado com `payment_url` preenchido

2. **No Dashboard do Provedor**:
   - **Stripe**: Dashboard > Payments > Payment Links
   - **Mercado Pago**: Vendas > Preferências de pagamento
   - **Asaas**: Cobranças > Links de pagamento

3. **No Sistema**:
   - O link deve começar com:
     - Stripe: `https://buy.stripe.com/...`
     - Mercado Pago: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...`
     - Asaas: `https://www.asaas.com/c/...`

---

## 🐛 Troubleshooting

### Erro: "Provider not configured"
- ✅ Verifique se você salvou as credenciais em **Provedores**
- ✅ Confirme que o provedor está marcado como "Conectado"

### Erro: "Failed to decrypt credentials"
- ✅ Verifique se `ENCRYPTION_KEY` está configurado na Edge Function
- ✅ Confirme que a chave tem 32 caracteres ou mais

### Erro: "Stripe API error" / "Mercado Pago API error"
- ✅ Verifique se as credenciais estão corretas
- ✅ Confirme que está usando credenciais de TEST/SANDBOX
- ✅ Verifique se a conta do provedor está ativa

### Link não abre
- ✅ Copie o link completo (não corte nenhuma parte)
- ✅ Abra em modo anônimo para evitar cache
- ✅ Verifique se o link não expirou (alguns provedores têm expiração)

---

## 📚 Próximos Passos (Opcional)

### 1. Adicionar mais provedores
- Kirvano
- Gerencianet (Efí)
- Pagar.me

### 2. Implementar Webhooks
- Receber notificações de pagamento
- Atualizar status automaticamente
- Registrar transações

### 3. Modo Produção
- Trocar credenciais de sandbox para produção
- Adicionar toggle sandbox/production
- Implementar rate limiting

---

## 🎉 Conclusão

Agora você tem um sistema COMPLETO e FUNCIONAL de geração de links de pagamento com:
- ✅ Integração REAL com APIs dos provedores
- ✅ Credenciais criptografadas
- ✅ Segurança com RLS
- ✅ Interface amigável

**Teste agora e veja os links REAIS funcionando!** 🚀
