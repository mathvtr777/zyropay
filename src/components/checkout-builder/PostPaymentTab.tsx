import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutSettings } from "./types";

interface Props {
    settings: CheckoutSettings;
    onChange: (s: CheckoutSettings) => void;
}

export function PostPaymentTab({ settings, onChange }: Props) {
    const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Redirecionamento</CardTitle>
                    <CardDescription>
                        Para onde o cliente vai após o pagamento aprovado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>URL de Sucesso (Obrigado)</Label>
                        <Input
                            value={settings.successUrl}
                            onChange={(e) => set({ successUrl: e.target.value })}
                            placeholder="https://seusite.com/obrigado"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Delay de Redirecionamento (segundos)</Label>
                        <Input
                            type="number"
                            min="0"
                            max="60"
                            value={settings.redirectDelay}
                            onChange={(e) => set({ redirectDelay: parseInt(e.target.value) })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Webhook e Integração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <Input
                            value={settings.webhookUrl}
                            onChange={(e) => set({ webhookUrl: e.target.value })}
                            placeholder="https://api.seusite.com/webhook"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Upsell URL (Opcional)</Label>
                        <Input
                            value={settings.upsellUrl}
                            onChange={(e) => set({ upsellUrl: e.target.value })}
                            placeholder="https://seusite.com/upsell"
                        />
                        <p className="text-xs text-muted-foreground">
                            Se preenchido, será ofertado após a compra principal.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">WhatsApp Automático</CardTitle>
                    <CardDescription>
                        Mensagem padrão para o botão de WhatsApp na página de obrigado.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label>Mensagem</Label>
                        <Textarea
                            value={settings.whatsappMessage}
                            onChange={(e) => set({ whatsappMessage: e.target.value })}
                            placeholder="Olá! Acabei de fazer uma compra..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
