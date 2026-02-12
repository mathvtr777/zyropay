import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Download, ArrowRight } from "lucide-react";

export default function CheckoutSuccess() {
  const { checkoutId } = useParams();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      {/* Success Animation */}
      <div className="max-w-md w-full">
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <CardContent className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="h-24 w-24 mx-auto rounded-full gradient-primary flex items-center justify-center animate-scale-in">
                <Check className="h-12 w-12 text-white" />
              </div>
              {showConfetti && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-2 w-2 rounded-full gradient-primary animate-ping"
                      style={{
                        transform: `rotate(${i * 30}deg) translateY(-50px)`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Success Message */}
            <div className="space-y-2 animate-fade-up">
              <h1 className="text-2xl font-bold text-white">
                Pagamento Confirmado!
              </h1>
              <p className="text-zinc-400">
                Seu pagamento foi processado com sucesso.
              </p>
            </div>

            {/* Order Details */}
            <div className="p-4 rounded-2xl bg-zinc-800 space-y-3 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Produto</span>
                <span className="text-white font-medium">Curso de Marketing Digital</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Valor</span>
                <span className="text-white font-medium">R$ 297,00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">ID da Transação</span>
                <span className="text-zinc-400 font-mono text-xs">{checkoutId}</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-sm text-zinc-400">
                Você receberá um e-mail com os detalhes da sua compra e instruções de acesso.
              </p>
              
              <Button className="w-full gradient-primary h-12">
                <Download className="h-4 w-4 mr-2" />
                Acessar Produto
              </Button>

              <Link to="/">
                <Button variant="ghost" className="w-full text-zinc-400 hover:text-white">
                  Voltar ao Início
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Powered by */}
            <div className="pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-600">
                Pagamento processado por{" "}
                <span className="text-primary font-medium">PRIVA</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
