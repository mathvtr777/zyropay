import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { callEdgeFunction } from "@/lib/supabase-edge";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentRedirect() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const redirect = async () => {
            if (!slug) {
                setError("Link inválido");
                setLoading(false);
                return;
            }

            try {
                // Call Edge Function to get redirect URL
                const { data, error } = await callEdgeFunction('get-redirect', {
                    slug
                });

                if (error) throw error;

                if (!data.success) {
                    throw new Error(data.error || 'Link não encontrado');
                }

                // Redirect to the payment gateway
                window.location.href = data.redirectUrl;
            } catch (err: any) {
                console.error('Redirect error:', err);
                setError(err.message || 'Link de pagamento não encontrado');
                setLoading(false);

                // Redirect to 404 after 3 seconds
                setTimeout(() => {
                    navigate('/404', { replace: true });
                }, 3000);
            }
        };

        redirect();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Redirecionando...</h2>
                                <p className="text-muted-foreground">
                                    Você será redirecionado para a página de pagamento em instantes.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-destructive">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Link não encontrado</h2>
                                <p className="text-muted-foreground mb-4">{error}</p>
                                <p className="text-sm text-muted-foreground">
                                    Redirecionando para a página inicial...
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
