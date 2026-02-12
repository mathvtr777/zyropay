export interface CheckoutSettings {
  // Appearance
  headerColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  buttonColor: string;
  theme: "light" | "dark" | "auto";
  logoUrl: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  shadow: "none" | "sm" | "md" | "lg";

  // Typography
  fontFamily: string;
  titleSize: string;
  bodySize: string;
  fontWeight: string;

  // Content
  buttonText: string;
  customTitle: string;
  customDescription: string;

  // Timer
  showTimer: boolean;
  timerMinutes: number;

  // Layout
  checkoutWidth: string;
  showProductImage: boolean;
  showDescription: boolean;
  showInstructions: boolean;
  cardStyle: string;

  // Trust elements
  showSecurityBadge: boolean;
  showGuarantee: boolean;
  guaranteeDays: number;
  showTestimonials: boolean;
  testimonialText: string;
  testimonialAuthor: string;
  showUrgency: boolean;
  urgencyText: string;

  // Video
  showVideo: boolean;
  videoUrl: string;
  videoPosition: string;

  // Bonuses
  showBonuses: boolean;
  bonuses: { title: string; description: string }[];

  // FAQ
  showFaq: boolean;
  faqItems: { question: string; answer: string }[];

  // Tracking
  facebookPixelId: string;
  googleTagId: string;
  tiktokPixelId: string;

  // Fields
  fields: {
    cpf: { enabled: boolean; required: boolean; order: number };
    phone: { enabled: boolean; required: boolean; order: number };
    address: { enabled: boolean; required: boolean; order: number };
    birthDate: { enabled: boolean; required: boolean; order: number };
  };

  // UX
  steps: 1 | 2;
  floatingButton: boolean;
  autocomplete: boolean;
  loadingAnimation: boolean;

  // Payments
  paymentProvider: string;
  paymentMethods: {
    creditCard: boolean;
    pix: boolean;
    boleto: boolean;
  };
  paymentOrder: ("creditCard" | "pix" | "boleto")[];
  maxInstallments: number;
  installmentsText: string;
  pixDiscount: number;
  pixDiscountType: "percent" | "fixed";
  pixDiscountValue: number;

  // Post-payment
  successUrl: string;
  webhookUrl: string;
  redirectDelay: number;
  upsellUrl: string;
  whatsappMessage: string;

  // Advanced
  timeout: number;
  maxAttempts: number;
  blockByIp: boolean;
}

export const defaultSettings: CheckoutSettings = {
  headerColor: "#7B2CF5",
  backgroundColor: "#09090b",
  cardColor: "#18181b",
  textColor: "#fafafa",
  buttonColor: "#7B2CF5",
  theme: "dark",
  logoUrl: "",
  borderRadius: "lg",
  shadow: "md",

  fontFamily: "Inter",
  titleSize: "lg",
  bodySize: "sm",
  fontWeight: "bold",

  buttonText: "Pagar com PIX",
  customTitle: "",
  customDescription: "",

  showTimer: true,
  timerMinutes: 15,

  checkoutWidth: "md",
  showProductImage: true,
  showDescription: true,
  showInstructions: true,
  cardStyle: "rounded",

  showSecurityBadge: true,
  showGuarantee: false,
  guaranteeDays: 7,
  showTestimonials: false,
  testimonialText: "",
  testimonialAuthor: "",
  showUrgency: false,
  urgencyText: "Últimas vagas disponíveis!",

  showVideo: false,
  videoUrl: "",
  videoPosition: "above",

  showBonuses: false,
  bonuses: [{ title: "Bônus 1", description: "Descrição do bônus" }],

  showFaq: false,
  faqItems: [{ question: "Pergunta exemplo?", answer: "Resposta exemplo." }],

  facebookPixelId: "",
  googleTagId: "",
  tiktokPixelId: "",

  fields: {
    cpf: { enabled: true, required: true, order: 1 },
    phone: { enabled: true, required: true, order: 2 },
    address: { enabled: false, required: true, order: 3 },
    birthDate: { enabled: false, required: false, order: 4 },
  },

  steps: 1,
  floatingButton: false,
  autocomplete: true,
  loadingAnimation: true,

  paymentProvider: "kirvano",
  paymentMethods: {
    creditCard: true,
    pix: true,
    boleto: true,
  },
  paymentOrder: ["creditCard", "pix", "boleto"],
  maxInstallments: 12,
  installmentsText: "Juros de 2.99% a.m.",
  pixDiscount: 0,
  pixDiscountType: "percent",
  pixDiscountValue: 0,

  successUrl: "",
  webhookUrl: "",
  redirectDelay: 5,
  upsellUrl: "",
  whatsappMessage: "Olá! Acabei de fazer uma compra.",

  timeout: 15,
  maxAttempts: 3,
  blockByIp: false,
};
