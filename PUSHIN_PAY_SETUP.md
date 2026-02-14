# Pushin Pay - Configuração Simplificada

## ✅ Correção Aplicada

A Pushin Pay foi configurada para usar **apenas um token de acesso**, tornando a integração mais simples e direta.

## 🔧 Como Configurar

### 1. Obter Token da Pushin Pay
1. Acesse: https://pushinpay.com.br/
2. Faça login na sua conta
3. Vá em **Configurações > API** ou **Integrações**
4. Copie seu **Token de Acesso**

### 2. Configurar no Sistema

Ao conectar a Pushin Pay no sistema:

1. Clique em **Conectar** no card da Pushin Pay
2. Cole seu **Token de Acesso** no campo único
3. Clique em **Conectar Provedor**

> **Nota:** A Pushin Pay usa apenas um token. O formulário mostrará apenas um campo para você colar o token.

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
