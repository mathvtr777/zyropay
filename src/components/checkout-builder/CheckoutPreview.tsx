import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eye, ShieldCheck, Star, AlertTriangle, Gift, HelpCircle, Play, CreditCard, QrCode, ScrollText, User, MapPin, Calendar, Phone } from "lucide-react";
import { CheckoutSettings } from "./types";

interface Props {
  settings: CheckoutSettings;
}

const widthMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
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

const cardStyleMap: Record<string, string> = {
  rounded: "rounded-2xl",
  sharp: "rounded-none",
  pill: "rounded-3xl",
};

const borderRadiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-3xl", // Using 3xl for full card effect
};

const shadowMap: Record<string, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-xl",
};

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

function VideoEmbed({ url }: { url: string }) {
  const embedUrl = getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="aspect-video rounded-xl bg-zinc-800 flex items-center justify-center border border-border/20">
        <div className="text-center opacity-50">
          <Play className="h-8 w-8 mx-auto mb-2" />
          <p className="text-xs">Cole uma URL do YouTube ou Vimeo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Vídeo de vendas"
      />
    </div>
  );
}

export function CheckoutPreview({ settings }: Props) {
  const isDark = settings.theme === "dark" || (settings.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const videoSection = settings.showVideo && (
    <VideoEmbed url={settings.videoUrl} />
  );

  const containerClass = `${borderRadiusMap[settings.borderRadius]} ${shadowMap[settings.shadow]}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">Preview</span>
      </div>

      <Card className={`overflow-hidden border-0 ${containerClass}`}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: settings.headerColor }}>
          <div className="flex items-center justify-center gap-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-8 object-contain" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
            )}
          </div>
        </div>

        <CardContent
          className={`p-6 space-y-6 ${widthMap[settings.checkoutWidth]} mx-auto transition-colors duration-300`}
          style={{
            backgroundColor: settings.backgroundColor,
            color: settings.textColor,
            fontFamily: settings.fontFamily,
          }}
        >
          {/* Urgency banner */}
          {settings.showUrgency && settings.urgencyText && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0" />
              <span className="text-sm text-orange-300 font-medium">{settings.urgencyText}</span>
            </div>
          )}

          {/* Video above */}
          {settings.videoPosition === "above" && videoSection}

          {/* Product info */}
          <div className="flex items-center gap-4">
            {settings.showProductImage && (
              <div
                className={`h-20 w-20 ${borderRadiusMap[settings.borderRadius]} flex items-center justify-center shrink-0`}
                style={{ backgroundColor: settings.cardColor }}
              >
                <span className="text-3xl">📦</span>
              </div>
            )}
            <div>
              <h3 className={`${titleSizeMap[settings.titleSize]} ${fontWeightMap[settings.fontWeight]}`}>
                {settings.customTitle || "Curso de Marketing Digital"}
              </h3>
              {settings.showDescription && (
                <p className={`${bodySizeMap[settings.bodySize]} opacity-60 mt-1`}>
                  {settings.customDescription || "Aprenda do zero ao avançado"}
                </p>
              )}
            </div>
          </div>

          {/* Video below */}
          {settings.videoPosition === "below" && videoSection}

          <div className="grid gap-6">
            {/* Customer Fields Section */}
            <div className={`p-4 ${borderRadiusMap[settings.borderRadius]} space-y-4`} style={{ backgroundColor: settings.cardColor }}>
              <h4 className="font-semibold text-sm opacity-90 flex items-center gap-2">
                <User className="h-4 w-4" />
                Dados Pessoais
              </h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="h-9 w-full rounded-md bg-background/5 border border-border/10 px-3 flex items-center text-sm opacity-50">
                    Nome Completo
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-9 w-full rounded-md bg-background/5 border border-border/10 px-3 flex items-center text-sm opacity-50">
                    E-mail
                  </div>
                </div>
                {settings.fields.cpf.enabled && (
                  <div className="space-y-1">
                    <div className="h-9 w-full rounded-md bg-background/5 border border-border/10 px-3 flex items-center text-sm opacity-50">
                      CPF / CNPJ {settings.fields.cpf.required && "*"}
                    </div>
                  </div>
                )}
                {settings.fields.phone.enabled && (
                  <div className="space-y-1">
                    <div className="h-9 w-full rounded-md bg-background/5 border border-border/10 px-3 flex items-center text-sm opacity-50 flex gap-2">
                      <Phone className="h-3 w-3" />
                      Telefone {settings.fields.phone.required && "*"}
                    </div>
                  </div>
                )}
                {settings.fields.address.enabled && (
                  <div className="space-y-1">
                    <div className="h-9 w-full rounded-md bg-background/5 border border-border/10 px-3 flex items-center text-sm opacity-50 flex gap-2">
                      <MapPin className="h-3 w-3" />
                      Endereço {settings.fields.address.required && "*"}
                    </div>
                  </div>
                )}
                {settings.fields.birthDate.enabled && (
                  <div className="space-y-1">
                    <div className="h-9 w-full rounded-md bg-background/5 border border-border/10 px-3 flex items-center text-sm opacity-50 flex gap-2">
                      <Calendar className="h-3 w-3" />
                      Data de Nascimento {settings.fields.birthDate.required && "*"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods Section */}
            <div className={`p-4 ${borderRadiusMap[settings.borderRadius]} space-y-4`} style={{ backgroundColor: settings.cardColor }}>
              <h4 className="font-semibold text-sm opacity-90 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pagamento
              </h4>

              <div className="flex gap-2 mb-4">
                {settings.paymentMethods.creditCard && (
                  <div className={`flex-1 h-10 ${borderRadiusMap.sm} border border-primary/50 flex items-center justify-center bg-primary/10 text-primary`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                )}
                {settings.paymentMethods.pix && (
                  <div className={`flex-1 h-10 ${borderRadiusMap.sm} border border-border/10 flex items-center justify-center bg-background/5 opacity-50`}>
                    <QrCode className="h-4 w-4" />
                  </div>
                )}
                {settings.paymentMethods.boleto && (
                  <div className={`flex-1 h-10 ${borderRadiusMap.sm} border border-border/10 flex items-center justify-center bg-background/5 opacity-50`}>
                    <ScrollText className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Simulated Card Form */}
              {settings.paymentMethods.creditCard && (
                <div className="space-y-3 opacity-60 pointer-events-none">
                  <div className="h-9 w-full rounded-md bg-background/5 border border-border/10" />
                  <div className="flex gap-3">
                    <div className="h-9 flex-1 rounded-md bg-background/5 border border-border/10" />
                    <div className="h-9 w-24 rounded-md bg-background/5 border border-border/10" />
                  </div>
                  <div className="h-9 w-full rounded-md bg-background/5 border border-border/10 flex items-center px-3 text-xs">
                    Parcelamento em até {settings.maxInstallments}x
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bonuses */}
          {settings.showBonuses && settings.bonuses.some((b) => b.title) && (
            <div className="space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Gift className="h-4 w-4" style={{ color: settings.headerColor }} />
                Bônus inclusos
              </p>
              <div className="space-y-2">
                {settings.bonuses.filter((b) => b.title).map((bonus, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/20"
                    style={{ backgroundColor: settings.cardColor }}
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                      style={{ backgroundColor: settings.headerColor }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{bonus.title}</p>
                      {bonus.description && (
                        <p className="text-xs opacity-50 mt-0.5">{bonus.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee */}
          {settings.showGuarantee && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <ShieldCheck className="h-5 w-5 text-green-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-300">
                  Garantia de {settings.guaranteeDays} dias
                </p>
                <p className="text-xs text-green-400/70">Reembolso completo, sem perguntas.</p>
              </div>
            </div>
          )}

          {/* Testimonial */}
          {settings.showTestimonials && settings.testimonialText && (
            <div className={`p-4 ${borderRadiusMap[settings.borderRadius]} border border-border/30`} style={{ backgroundColor: settings.cardColor }}>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm italic opacity-80">"{settings.testimonialText}"</p>
              {settings.testimonialAuthor && (
                <p className="text-xs mt-2 opacity-50">— {settings.testimonialAuthor}</p>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-border/10">
            <span className="opacity-60">Total</span>
            <span className="text-2xl font-bold" style={{ color: settings.headerColor }}>
              R$ 297,00
            </span>
          </div>

          {/* Button */}
          <Button
            className={`w-full h-12 text-lg text-white shadow-lg hover:brightness-110 transition-all ${borderRadiusMap[settings.borderRadius]}`}
            style={{ backgroundColor: settings.buttonColor }}
          >
            {settings.buttonText}
          </Button>

          {/* FAQ */}
          {settings.showFaq && settings.faqItems.some((f) => f.question) && (
            <div className="space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <HelpCircle className="h-4 w-4" style={{ color: settings.headerColor }} />
                Perguntas frequentes
              </p>
              <Accordion type="single" collapsible className="w-full">
                {settings.faqItems.filter((f) => f.question).map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border/20">
                    <AccordionTrigger className="text-sm py-3 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm opacity-70">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Security badge */}
          {settings.showSecurityBadge && (
            <div className="flex items-center justify-center gap-2 pt-2 opacity-40">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs">Pagamento 100% seguro</span>
            </div>
          )}
        </CardContent>
      </Card>

      {settings.floatingButton && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            className="rounded-full shadow-xl h-12 px-6"
            style={{ backgroundColor: settings.buttonColor, color: "#fff" }}
          >
            Pagar Agora
          </Button>
        </div>
      )}
    </div>
  );
}
