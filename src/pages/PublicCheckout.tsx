import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Copy, Check, Clock, AlertCircle, Loader2,
  ShieldCheck, Star, AlertTriangle, Gift, HelpCircle, Play,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { store } from "@/lib/store";
import { Checkout, Product } from "@/types";

const cardStyleMap: Record<string, string> = {
  rounded: "rounded-2xl",
  sharp: "rounded-none",
  pill: "rounded-3xl",
};

const titleSizeMap: Record<string, string> = {
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const bodySizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
};

const fontWeightMap: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const widthMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export default function PublicCheckout() {
  const { checkoutId, checkoutSlug, productSlug } = useParams();
  const { toast } = useToast();

  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<"pending" | "processing" | "paid" | "expired">("pending");
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    let foundCheckout: Checkout | undefined;
    let foundProduct: Product | undefined;

    if (checkoutId) {
      // Legacy/Direct ID access
      foundCheckout = store.getCheckout(checkoutId);
      // If accessed via ID, we might not have a product context, so we might need to handle generic checkout view
      // OR we just show the checkout with placeholder product info if no product is passed.
      // For now, let's assume if accessed via ID it's a preview or direct link, potentially missing product
    } else if (checkoutSlug && productSlug) {
      // New Slug access
      foundCheckout = store.getCheckoutBySlug(checkoutSlug);
      foundProduct = store.getProductBySlug(productSlug);
    }

    if (!foundCheckout) {
      setError("Checkout não encontrado.");
    } else {
      setCheckout(foundCheckout);
      if (foundCheckout.settings.showTimer) {
        setTimeLeft(foundCheckout.settings.timerMinutes * 60);
      }
    }

    if (productSlug && !foundProduct) {
      setError("Produto não encontrado.");
    } else {
      setProduct(foundProduct || null); // It's okay to be null if we are just previewing checkout template
    }

    setLoading(false);
  }, [checkoutId, checkoutSlug, productSlug]);


  useEffect(() => {
    if (status !== "pending" || !checkout?.settings.showTimer) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setStatus("expired"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, checkout?.settings.showTimer]);

  useEffect(() => {
    if (status !== "processing") return;
    const timeout = setTimeout(() => {
      setStatus("paid");
      if (checkout?.settings.redirectUrl) {
        window.location.href = checkout.settings.redirectUrl;
      } else {
        // Default success page or behavior
        window.location.href = `/checkout/${checkout?.id}/success`;
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [status, checkout]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Carregando...</div>;

  if (error || !checkout) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white flex-col gap-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h1 className="text-xl font-bold">{error || "Erro desconhecido"}</h1>
    </div>
  );

  const s = checkout.settings;
  const p = product || {
    name: "Produto Exemplo",
    description: "Descrição do produto exemplo.",
    price: 100.00,
    image: "📦"
  }; // Fallback for preview

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const pixCode = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540" +
    p.price.toFixed(2).replace(".", "") +
    "5802BR5925PRIVA PAGAMENTOS LTDA6009SAO PAULO62070503***63041234";

  const handleCopyPix = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setStatus("processing");
    toast({ title: "Código PIX copiado!", description: "Cole no seu aplicativo de banco para pagar." });
    setTimeout(() => setCopied(false), 3000);
  };

  if (status === "paid") {
    // This might be redirected before rendering if using useEffect, but as a fallback:
    return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Pagamento Aprovado! Redirecionando...</div>;
  }

  const borderRadius = cardStyleMap[s.cardStyle] || "rounded-2xl";
  const videoEmbedUrl = s.showVideo && s.videoUrl ? getEmbedUrl(s.videoUrl) : null;

  const videoSection = s.showVideo && (
    <div className={`aspect-video ${borderRadius} overflow-hidden`}>
      {videoEmbedUrl ? (
        <iframe
          src={videoEmbedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Vídeo"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: s.cardColor }}>
          <Play className="h-8 w-8 opacity-30" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: s.backgroundColor, fontFamily: s.fontFamily }}>
      {/* Header */}
      <div className="py-4" style={{ backgroundColor: s.headerColor }}>
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`container mx-auto px-6 py-8 ${widthMap[s.checkoutWidth]}`}>
        {/* Status Banners */}
        {status === "expired" && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Pagamento Expirado</p>
              <p className="text-sm text-red-400/70">Atualize a página para gerar um novo código PIX.</p>
            </div>
          </div>
        )}
        {status === "processing" && (
          <div className="mb-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />
            <div>
              <p className="font-medium text-yellow-400">Aguardando Pagamento</p>
              <p className="text-sm text-yellow-400/70">Estamos verificando seu pagamento...</p>
            </div>
          </div>
        )}

        {/* Urgency */}
        {s.showUrgency && s.urgencyText && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0" />
            <span className="text-sm text-orange-300 font-medium">{s.urgencyText}</span>
          </div>
        )}

        <Card className={`overflow-hidden border-0 ${borderRadius}`} style={{ backgroundColor: s.cardColor }}>
          <CardContent className="p-6 space-y-6" style={{ color: s.textColor }}>

            {/* Video above */}
            {s.videoPosition === "above" && videoSection}

            {/* Product */}
            <div className="flex items-start gap-4">
              {s.showProductImage && (
                <div
                  className={`h-20 w-20 ${borderRadius} flex items-center justify-center text-4xl shrink-0`}
                  style={{ backgroundColor: s.theme === "dark" ? "#27272a" : "#f4f4f5" }}
                >
                  {p.image || "📦"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className={`${titleSizeMap[s.titleSize]} ${fontWeightMap[s.fontWeight]}`}>
                  {s.customTitle || p.name}
                </h1>
                {s.showDescription && (
                  <p className={`${bodySizeMap[s.bodySize]} opacity-60 mt-1`}>
                    {s.customDescription || p.description}
                  </p>
                )}
              </div>
            </div>

            {/* Video below */}
            {s.videoPosition === "below" && videoSection}

            {/* Bonuses */}
            {s.showBonuses && s.bonuses.some((b) => b.title) && (
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Gift className="h-4 w-4" style={{ color: s.headerColor }} />
                  Bônus inclusos
                </p>
                <div className="space-y-2">
                  {s.bonuses.filter((b) => b.title).map((bonus, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 ${borderRadius} border border-white/5`}
                      style={{ backgroundColor: s.theme === "dark" ? "#1c1c1e" : "#fafafa" }}
                    >
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                        style={{ backgroundColor: s.headerColor }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{bonus.title}</p>
                        {bonus.description && <p className="text-xs opacity-50 mt-0.5">{bonus.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Form */}
            {/* Note: In this refactor, we are using settings from the Checkout, but the product *used to* have flags for collecting info. 
                Ideally, these should be moved to the Checkout Settings "fields" tab, which we implemented previously.
                For now, let's assume if it's in the checkout settings, we show it. 
                Checking s.fields... we created FieldsTab but I need to check if 'fields' property exists in CheckoutSettings.
                Looking at CheckoutSettings interface in types.ts (from context):
                It has `collectName`, `collectEmail`, `collectPhone`, `collectCpf`, `collectAddress`.
            */}
            <div className="space-y-4">
              {(s.collectName) && (
                <div className="space-y-2">
                  <Label style={{ color: s.textColor }}>Nome completo</Label>
                  <Input
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-white/10"
                    style={{ backgroundColor: s.theme === "dark" ? "#27272a" : "#fff", color: s.textColor }}
                  />
                </div>
              )}
              {(s.collectEmail) && (
                <div className="space-y-2">
                  <Label style={{ color: s.textColor }}>E-mail</Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-white/10"
                    style={{ backgroundColor: s.theme === "dark" ? "#27272a" : "#fff", color: s.textColor }}
                  />
                </div>
              )}
              {(s.collectPhone) && (
                <div className="space-y-2">
                  <Label style={{ color: s.textColor }}>Telefone</Label>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-white/10"
                    style={{ backgroundColor: s.theme === "dark" ? "#27272a" : "#fff", color: s.textColor }}
                  />
                </div>
              )}
            </div>

            {/* PIX Section */}
            <div className={`p-6 ${borderRadius}`} style={{ backgroundColor: s.theme === "dark" ? "#27272a" : "#f4f4f5" }}>
              <div className="text-center space-y-4">
                <Badge variant="secondary" className="bg-white/10 text-white/70">
                  Pague via PIX
                </Badge>

                {/* QR Code Placeholder */}
                <div
                  className={`h-40 w-40 mx-auto ${borderRadius} flex items-center justify-center border-2 bg-white`}
                  style={{ borderColor: s.theme === "dark" ? "#52525b" : "#d4d4d8" }}
                >
                  <div className="text-center">
                    <div className="grid grid-cols-5 gap-1 p-2">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 ${Math.random() > 0.5 ? "bg-zinc-900" : "bg-transparent"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">QR Code PIX</p>
                  </div>
                </div>

                {/* Timer */}
                {s.showTimer && status === "pending" && (
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 opacity-50" />
                    <span className="opacity-70">
                      Expira em <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Guarantee */}
            {s.showGuarantee && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <ShieldCheck className="h-5 w-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-300">Garantia de {s.guaranteeDays} dias</p>
                  <p className="text-xs text-green-400/70">Reembolso completo, sem perguntas.</p>
                </div>
              </div>
            )}

            {/* Testimonial */}
            {s.showTestimonials && s.testimonialText && (
              <div className="p-4 rounded-xl border border-white/5" style={{ backgroundColor: s.theme === "dark" ? "#1c1c1e" : "#fafafa" }}>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm italic opacity-80">"{s.testimonialText}"</p>
                {s.testimonialAuthor && <p className="text-xs mt-2 opacity-50">— {s.testimonialAuthor}</p>}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between py-2">
              <span className="opacity-60">Total</span>
              <span className="text-3xl font-bold" style={{ color: s.headerColor }}>
                R$ {p.price.toFixed(2)}
              </span>
            </div>

            {/* CTA Button */}
            <Button
              className="w-full h-14 text-lg text-white"
              style={{ backgroundColor: s.buttonColor }}
              onClick={handleCopyPix}
              disabled={status === "expired" || status === "processing"}
            >
              {copied ? (
                <><Check className="h-5 w-5 mr-2" /> Código Copiado!</>
              ) : status === "processing" ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Verificando...</>
              ) : (
                <><Copy className="h-5 w-5 mr-2" /> {s.buttonText}</>
              )}
            </Button>

            {/* FAQ */}
            {s.showFaq && s.faqItems.some((f) => f.question) && (
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" style={{ color: s.headerColor }} />
                  Perguntas frequentes
                </p>
                <Accordion type="single" collapsible className="w-full">
                  {s.faqItems.filter((f) => f.question).map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-white/10">
                      <AccordionTrigger className="text-sm py-3 hover:no-underline">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-sm opacity-70">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Instructions */}
            {s.showInstructions && (
              <div className="text-center text-sm opacity-50 space-y-1">
                <p>1. Copie o código PIX acima</p>
                <p>2. Abra o app do seu banco</p>
                <p>3. Escolha pagar com PIX copia e cola</p>
                <p>4. Cole o código e confirme o pagamento</p>
              </div>
            )}

            {/* Security badge */}
            {s.showSecurityBadge && (
              <div className="flex items-center justify-center gap-2 pt-2 opacity-40">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs">Pagamento 100% seguro</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm opacity-30" style={{ color: s.textColor }}>
            Pagamento seguro via{" "}
            <span className="font-medium" style={{ color: s.headerColor }}>PRIVA</span>
          </p>
        </div>
      </div>
    </div>
  );
}
