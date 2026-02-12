import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Palette, Type, Settings, LayoutGrid, Shield, Video, BarChart3, ListChecks, CreditCard, Rocket, ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

import { defaultSettings } from "@/components/checkout-builder/types";
import { AppearanceTab } from "@/components/checkout-builder/AppearanceTab";
import { TypographyTab } from "@/components/checkout-builder/TypographyTab";
import { ContentTab } from "@/components/checkout-builder/ContentTab";
import { LayoutTab } from "@/components/checkout-builder/LayoutTab";
import { TrustTab } from "@/components/checkout-builder/TrustTab";
import { ExtrasTab } from "@/components/checkout-builder/ExtrasTab";
import { TrackingTab } from "@/components/checkout-builder/TrackingTab";
import { CheckoutPreview } from "@/components/checkout-builder/CheckoutPreview";
import { FieldsTab } from "@/components/checkout-builder/FieldsTab";
import { PaymentTab } from "@/components/checkout-builder/PaymentTab";
import { PostPaymentTab } from "@/components/checkout-builder/PostPaymentTab";

import { store } from "@/lib/store";
import { Checkout } from "@/types";

export default function CheckoutBuilder() {
  const { checkoutId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [checkoutName, setCheckoutName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checkoutId) {
      const foundCheckout = store.getCheckout(checkoutId);
      if (foundCheckout) {
        setCheckout(foundCheckout);
        setSettings(foundCheckout.settings);
        setCheckoutName(foundCheckout.name);
      } else {
        toast({
          title: "Checkout não encontrado",
          description: "Redirecionando para a lista de checkouts...",
          variant: "destructive",
        });
        setTimeout(() => navigate("/checkouts"), 2000);
      }
      setLoading(false);
    }
  }, [checkoutId, navigate, toast]);

  const handleSave = () => {
    if (checkout && checkoutId) {
      store.updateCheckout(checkoutId, {
        name: checkoutName,
        settings: settings,
      });
      toast({
        title: "Alterações salvas!",
        description: "Seu checkout foi atualizado com sucesso.",
      });
    }
  };

  const handleCopy = async () => {
    // This is just a base URL copy, real usage depends on product
    const baseUrl = `https://priva.app/checkout/${checkout?.slug}`;
    await navigator.clipboard.writeText(baseUrl);
    toast({ title: "Link base copiado!", description: "Use este link base em seus produtos." });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground">Carregando editor...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!checkout) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/checkouts")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <Input
                value={checkoutName}
                onChange={(e) => setCheckoutName(e.target.value)}
                className="text-2xl font-bold h-auto px-2 py-1 border-transparent hover:border-input focus:border-input w-[300px]"
              />
              <p className="text-sm text-muted-foreground px-2">
                Editando checkout: {checkout.slug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link Base
            </Button>
            <Button className="gradient-primary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Settings */}
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="flex w-full overflow-x-auto">
              <TabsTrigger value="appearance" className="flex-1 min-w-0">
                <Palette className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Visual</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex-1 min-w-0">
                <Type className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Fonte</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex-1 min-w-0">
                <Settings className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Texto</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex-1 min-w-0">
                <LayoutGrid className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Layout</span>
              </TabsTrigger>
              <TabsTrigger value="trust" className="flex-1 min-w-0">
                <Shield className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Trust</span>
              </TabsTrigger>
              <TabsTrigger value="fields" className="flex-1 min-w-0">
                <ListChecks className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Campos</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex-1 min-w-0">
                <CreditCard className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Pagamento</span>
              </TabsTrigger>
              <TabsTrigger value="post-payment" className="flex-1 min-w-0">
                <Rocket className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Sucesso</span>
              </TabsTrigger>
              <TabsTrigger value="extras" className="flex-1 min-w-0">
                <Video className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Extras</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex-1 min-w-0">
                <BarChart3 className="h-4 w-4 mr-1 shrink-0" />
                <span className="hidden sm:inline truncate">Pixel</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-280px)] mt-6 pr-4">
              <TabsContent value="appearance">
                <AppearanceTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="typography">
                <TypographyTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="content">
                <ContentTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="layout">
                <LayoutTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="trust">
                <TrustTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="fields">
                <FieldsTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="payment">
                <PaymentTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="post-payment">
                <PostPaymentTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="extras">
                <ExtrasTab settings={settings} onChange={setSettings} />
              </TabsContent>
              <TabsContent value="tracking">
                <TrackingTab settings={settings} onChange={setSettings} />
              </TabsContent>
            </ScrollArea>
          </Tabs>

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <CheckoutPreview settings={settings} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
