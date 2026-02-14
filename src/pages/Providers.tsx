import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Plus, Settings, Trash2, Loader2, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useProviderCredentials,
  useSaveProviderCredentials,
  useDeleteProviderCredentials
} from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { encryptCredential } from "@/lib/encryption";

export interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
  connected: boolean;
  webhookUrl?: string;
}

export const availableProviders: Provider[] = [
  {
    id: "kirvano",
    name: "Kirvano",
    logo: "K",
    description: "Plataforma de pagamentos para infoprodutores",
    connected: false,
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    logo: "MP",
    description: "Solução de pagamentos do Mercado Livre",
    connected: false,
  },
  {
    id: "asaas",
    name: "Asaas",
    logo: "A",
    description: "Gestão de cobranças e pagamentos",
    connected: false,
  },
  {
    id: "gerencianet",
    name: "Gerencianet",
    logo: "G",
    description: "Pagamentos via PIX e boleto",
    connected: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "S",
    description: "Pagamentos internacionais",
    connected: false,
  },
  {
    id: "pagarme",
    name: "Pagar.me",
    logo: "P",
    description: "Infraestrutura de pagamentos",
    connected: false,
  },
  {
    id: "pushinpay",
    name: "Pushin Pay",
    logo: "PP",
    description: "Pagamentos via PIX instantâneo",
    connected: false,
  },
];

export default function Providers() {
  const [providers, setProviders] = useState(availableProviders);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const { data: credentials, isLoading } = useProviderCredentials();
  const saveCredentials = useSaveProviderCredentials();
  const deleteCredentials = useDeleteProviderCredentials();

  // Update providers list based on saved credentials
  useEffect(() => {
    if (credentials) {
      setProviders(
        availableProviders.map((p) => ({
          ...p,
          connected: credentials.some(
            (c) => c.provider === p.id && c.is_active
          ),
        }))
      );
    }
  }, [credentials]);

  const handleConnect = (provider: Provider) => {
    setSelectedProvider(provider);
    setApiKey("");
    setSecretKey("");
    setIsDialogOpen(true);
  };

  const handleDisconnect = async (providerId: string) => {
    const credential = credentials?.find((c) => c.provider === providerId);
    if (!credential) return;

    try {
      await deleteCredentials.mutateAsync(credential.id);
      toast({
        title: "Provedor desconectado",
        description: "O provedor foi removido com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao desconectar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    try {
      let encryptedApiKey: string;
      let encryptedSecretKey: string;

      // Pushin Pay usa apenas um token
      if (selectedProvider.id === 'pushinpay') {
        if (!apiKey) {
          toast({
            title: "Campo obrigatório",
            description: "Por favor, insira o token de acesso da Pushin Pay.",
            variant: "destructive",
          });
          return;
        }
        encryptedApiKey = await encryptCredential(apiKey);
        encryptedSecretKey = await encryptCredential(apiKey); // Mesmo token nos dois campos
      } else {
        // Outros provedores usam API Key e Secret Key
        if (!apiKey || !secretKey) {
          toast({
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos.",
            variant: "destructive",
          });
          return;
        }
        encryptedApiKey = await encryptCredential(apiKey);
        encryptedSecretKey = await encryptCredential(secretKey);
      }

      await saveCredentials.mutateAsync({
        provider: selectedProvider.id,
        apiKey: encryptedApiKey,
        secretKey: encryptedSecretKey,
        environment: "sandbox",
      });

      setIsDialogOpen(false);
      setApiKey("");
      setSecretKey("");
      toast({
        title: "Provedor conectado!",
        description: `${selectedProvider.name} foi conectado com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao conectar provedor",
        description: error.message || "Não foi possível salvar as credenciais.",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    if (!selectedProvider) return;

    // Validar se o usuário preencheu as credenciais no formulário
    if (selectedProvider.id === 'pushinpay') {
      if (!apiKey) {
        toast({
          title: "Campo obrigatório",
          description: "Por favor, insira o token de acesso antes de testar.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!apiKey || !secretKey) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos antes de testar.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsTesting(true);
    try {
      // Primeiro, salvar as credenciais temporariamente para testar
      let encryptedApiKey: string;
      let encryptedSecretKey: string;

      if (selectedProvider.id === 'pushinpay') {
        encryptedApiKey = await encryptCredential(apiKey);
        encryptedSecretKey = await encryptCredential(apiKey);
      } else {
        encryptedApiKey = await encryptCredential(apiKey);
        encryptedSecretKey = await encryptCredential(secretKey);
      }

      // Salvar credenciais
      await saveCredentials.mutateAsync({
        provider: selectedProvider.id,
        apiKey: encryptedApiKey,
        secretKey: encryptedSecretKey,
        environment: "sandbox",
      });

      // Aguardar um pouco para garantir que salvou
      await new Promise(resolve => setTimeout(resolve, 500));

      // Agora testar a conexão
      const { data, error } = await supabase.functions.invoke('test-provider-connection', {
        body: { provider: selectedProvider.id }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "✅ Teste bem-sucedido!",
          description: data.message,
        });
      } else {
        toast({
          title: "❌ Falha no teste",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao testar conexão",
        description: error.message || "Não foi possível testar a conexão.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyWebhook = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
    toast({
      title: "URL copiada!",
      description: "A URL do webhook foi copiada para a área de transferência.",
    });
  };

  const connectedProviders = providers.filter((p) => p.connected);
  const availableToConnect = providers.filter((p) => !p.connected);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Provedores de Pagamento</h1>
          <p className="text-muted-foreground">
            Conecte seus provedores de pagamento para começar a receber.
          </p>
        </div>

        {/* Connected Providers */}
        {connectedProviders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Provedores Conectados</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {connectedProviders.map((provider) => (
                <Card key={provider.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 gradient-primary opacity-10 rounded-bl-full" />
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {provider.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <Check className="h-3 w-3 mr-1" />
                          Conectado
                        </Badge>
                      </div>
                      <CardDescription>{provider.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {provider.webhookUrl && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          URL do Webhook
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={provider.webhookUrl}
                            readOnly
                            className="text-xs bg-muted"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyWebhook(provider.webhookUrl!)}
                          >
                            {copiedWebhook ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDisconnect(provider.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Providers */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Adicionar Provedor</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableToConnect.map((provider) => (
              <Card
                key={provider.id}
                className="hover-lift cursor-pointer group"
                onClick={() => handleConnect(provider)}
              >
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center font-bold text-lg group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                    {provider.logo}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription>{provider.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Conectar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Connect Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedProvider && (
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {selectedProvider.logo}
                </div>
              )}
              Conectar {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Insira as credenciais da sua conta {selectedProvider?.name} para conectar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProvider}>
            <div className="space-y-4 py-4">
              {selectedProvider?.id === 'pushinpay' ? (
                // Pushin Pay - apenas token
                <div className="space-y-2">
                  <Label htmlFor="token">Token de Acesso</Label>
                  <Input
                    id="token"
                    placeholder="Insira seu Token de Acesso da Pushin Pay"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Encontre seu token em: Configurações → API → Token de Acesso
                  </p>
                </div>
              ) : (
                // Outros provedores - API Key e Secret
                <>
                  <div className="space-y-2">
                    <Label htmlFor="client-id">Client ID / API Key</Label>
                    <Input
                      id="client-id"
                      placeholder="Insira seu Client ID"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secret">Client Secret / Token</Label>
                    <Input
                      id="secret"
                      type="password"
                      placeholder="Insira seu Secret"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="p-4 rounded-xl bg-accent/50 border border-accent">
                <p className="text-sm text-accent-foreground">
                  <strong>Importante:</strong> Suas credenciais serão criptografadas
                  e armazenadas com segurança. Use credenciais de SANDBOX/TEST para testes.
                </p>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>

              {/* Botão de Teste - sempre visível */}
              <Button
                type="button"
                variant="secondary"
                onClick={handleTestConnection}
                disabled={isTesting || saveCredentials.isPending}
                className="gap-2"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4" />
                    Testar e Salvar
                  </>
                )}
              </Button>

              <Button
                type="submit"
                className="gradient-primary"
                disabled={saveCredentials.isPending || isTesting}
              >
                {saveCredentials.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Sem Testar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
