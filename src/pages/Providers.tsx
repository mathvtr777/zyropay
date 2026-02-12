import { useState } from "react";
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
import { Check, Copy, Plus, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    connected: true,
    webhookUrl: "https://priva.app/webhook/mercadopago/abc123",
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
];

export default function Providers() {
  const [providers, setProviders] = useState(availableProviders);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const { toast } = useToast();

  const handleConnect = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsDialogOpen(true);
  };

  const handleDisconnect = (providerId: string) => {
    setProviders(
      providers.map((p) =>
        p.id === providerId ? { ...p, connected: false, webhookUrl: undefined } : p
      )
    );
    toast({
      title: "Provedor desconectado",
      description: "O provedor foi removido com sucesso.",
    });
  };

  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProvider) {
      const webhookUrl = `https://priva.app/webhook/${selectedProvider.id}/${Math.random().toString(36).substr(2, 9)}`;
      setProviders(
        providers.map((p) =>
          p.id === selectedProvider.id ? { ...p, connected: true, webhookUrl } : p
        )
      );
      setIsDialogOpen(false);
      toast({
        title: "Provedor conectado!",
        description: `${selectedProvider.name} foi conectado com sucesso.`,
      });
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
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID / API Key</Label>
                <Input
                  id="client-id"
                  placeholder="Insira seu Client ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">Client Secret / Token</Label>
                <Input
                  id="secret"
                  type="password"
                  placeholder="Insira seu Secret"
                  required
                />
              </div>
              <div className="p-4 rounded-xl bg-accent/50 border border-accent">
                <p className="text-sm text-accent-foreground">
                  <strong>Importante:</strong> Após conectar, você receberá uma URL de webhook
                  para configurar no painel do {selectedProvider?.name}.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="gradient-primary">
                Conectar Provedor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
