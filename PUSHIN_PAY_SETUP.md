# Pushin Pay - Configuração Simplificada

## ✅ Correção Aplicada

A Pushin Pay foi configurada para usar **apenas um token**, simplificando o processo de integração.

## 🔧 Como Configurar

### 1. Obter Token da Pushin Pay
1. Acesse: https://pushinpay.com.br/
2. Faça login na sua conta
3. Vá em **Configurações > API** ou **Integrações**
4. Copie seu **Token de API**

### 2. Configurar no Sistema

Ao conectar a Pushin Pay no sistema:

**Opção 1 (Recomendada):**
- **Client ID / API Key**: Cole seu Token
- **Client Secret / Token**: Cole o mesmo Token

**Opção 2:**
- **Client ID / API Key**: Cole seu Token
- **Client Secret / Token**: Deixe em branco (o sistema usará o API Key)

> **Nota:** O sistema aceita o token em qualquer um dos dois campos. Se ambos estiverem preenchidos, usará o Secret. Se apenas um estiver preenchido, usará o que estiver disponível.

## 🚀 Testar

1. Configure o token conforme acima
2. Vá em **Links de Pagamento**
3. Selecione **Pushin Pay**
4. Insira valor e descrição
5. Clique em **Gerar Link**
6. ✅ Você receberá um link PIX REAL!

## 📋 Características

- **Método**: PIX instantâneo
- **Expiração**: 1 hora
- **Retorno**: URL com QR Code
- **Confirmação**: Instantânea

## 🔄 Deploy

Após a correção, faça deploy da Edge Function:

```bash
supabase functions deploy create-payment-link
```

Pronto! A Pushin Pay está configurada para usar apenas um token. 🎉
