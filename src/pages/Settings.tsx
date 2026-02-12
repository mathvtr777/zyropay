import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Copy, Eye, EyeOff, Key, Moon, Sun, Upload, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [showApiToken, setShowApiToken] = useState(false);
  const apiToken = "priva_sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(apiToken);
    toast({
      title: "Token copiado!",
      description: "O token da API foi copiado para a área de transferência.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie sua conta e preferências.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="checkout">
              <Upload className="h-4 w-4 mr-2" />
              Checkout
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados de perfil.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" defaultValue="Usuário Demo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" defaultValue="demo@priva.app" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" />
                </div>
                <Button className="gradient-primary" onClick={handleSave}>
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência do painel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    <div>
                      <p className="font-medium">Tema</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === "dark" ? "Modo escuro" : "Modo claro"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo do Checkout</CardTitle>
                <CardDescription>
                  Seu logo aparecerá em todos os checkouts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Fazer Upload
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG ou SVG. Máximo 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações Padrão</CardTitle>
                <CardDescription>
                  Defina as configurações padrão para novos checkouts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Cor Principal</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      defaultValue="#7B2CF5"
                      className="h-10 w-20 rounded-lg border border-border cursor-pointer"
                    />
                    <Input defaultValue="#7B2CF5" className="flex-1" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Timer de Expiração</p>
                    <p className="text-sm text-muted-foreground">
                      Ativar por padrão
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tema Escuro</p>
                    <p className="text-sm text-muted-foreground">
                      Usar tema escuro por padrão
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button className="gradient-primary" onClick={handleSave}>
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Token da API</CardTitle>
                <CardDescription>
                  Use este token para integrar a PRIVA com outros sistemas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={showApiToken ? apiToken : "••••••••••••••••••••••••••••••••"}
                      readOnly
                      className="pr-20 font-mono"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-10 top-1/2 -translate-y-1/2"
                      onClick={() => setShowApiToken(!showApiToken)}
                    >
                      {showApiToken ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2"
                      onClick={handleCopyToken}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <p className="text-sm text-warning">
                    <strong>Atenção:</strong> Mantenha este token em segredo. Não
                    compartilhe publicamente.
                  </p>
                </div>
                <Button variant="outline">Gerar Novo Token</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domínio Personalizado</CardTitle>
                <CardDescription>
                  Configure um domínio próprio para seus checkouts. (PRO)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domínio</Label>
                  <Input
                    id="domain"
                    placeholder="checkout.seusite.com.br"
                    disabled
                  />
                </div>
                <Button disabled>
                  Configurar Domínio (PRO)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
