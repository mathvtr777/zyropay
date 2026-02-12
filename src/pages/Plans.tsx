import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Crown } from "lucide-react";

const plans = [
  {
    name: "FREE",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "Até 10 checkouts",
      "5 vendas por mês",
      "1 provedor de pagamento",
      "Checkout padrão",
      "Suporte por email",
    ],
    limitations: [
      "Sem personalização avançada",
      "Sem domínio personalizado",
      "Sem múltiplos provedores",
    ],
    cta: "Plano Atual",
    current: true,
    popular: false,
  },
  {
    name: "PRO",
    price: "R$ 97",
    period: "/mês",
    description: "Para quem quer escalar",
    features: [
      "Checkouts ilimitados",
      "Vendas ilimitadas",
      "Múltiplos provedores",
      "Domínio personalizado",
      "Checkout 100% customizável",
      "Timer de urgência",
      "Variações de produto",
      "Suporte prioritário via WhatsApp",
      "Webhooks avançados",
      "API completa",
    ],
    limitations: [],
    cta: "Subir para PRO",
    current: false,
    popular: true,
  },
];

export default function Plans() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm mb-4">
              <Crown className="h-4 w-4" />
              Planos PRIVA
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Escolha o plano ideal para você
            </h1>
            <p className="text-muted-foreground text-lg">
              Comece grátis e escale conforme seu negócio cresce.
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-8 ${
                  plan.popular
                    ? "border-primary bg-card premium-shadow"
                    : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Recomendado
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Inclui:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3 mb-8 pb-8 border-b border-border">
                    {plan.limitations.map((limitation) => (
                      <p key={limitation} className="text-sm text-muted-foreground line-through">
                        {limitation}
                      </p>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <Button
                  className={`w-full h-14 text-lg ${
                    plan.popular ? "gradient-primary glow-effect" : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  disabled={plan.current}
                >
                  {plan.current ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      {plan.cta}
                    </>
                  ) : (
                    <>
                      <Crown className="h-5 w-5 mr-2" />
                      {plan.cta}
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Dúvidas? Entre em contato pelo{" "}
              <a href="#" className="text-primary hover:underline">
                suporte@priva.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
