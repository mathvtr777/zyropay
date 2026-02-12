import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckoutSettings } from "./types";
import { CreditCard, QrCode, ScrollText } from "lucide-react";
import { availableProviders } from "@/pages/Providers";

interface Props {
    settings: CheckoutSettings;
    onChange: (s: CheckoutSettings) => void;
}

export function PaymentTab({ settings, onChange }: Props) {
    const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

    const toggleMethod = (method: keyof typeof settings.paymentMethods, value: boolean) => {
        const newMethods = { ...settings.paymentMethods };
        newMethods[method] = value;
        set({ paymentMethods: newMethods });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
                    <CardDescription>
                        Selecione quais formas de pagamento você aceita.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Processador de Pagamento</Label>
                        <Select
                            value={settings.paymentProvider}
                            onValueChange={(v) => set({ paymentProvider: v })}
                        >
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Selecione um processador" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableProviders.map((provider) => (
                                    <SelectItem key={provider.id} value={provider.id}>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs font-bold">
                                                {provider.logo}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-sm font-medium">{provider.name}</span>
                                                <span className="text-[10px] text-muted-foreground line-clamp-1">
                                                    {provider.description}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Apenas provedores conectados podem processar pagamentos reais.
                        </p>
                    </div>
                    <Separator />

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <Label className="text-base">Cartão de Crédito</Label>
                                <p className="text-xs text-muted-foreground">Visa, Mastercard, Elo, etc.</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.paymentMethods.creditCard}
                            onCheckedChange={(v) => toggleMethod("creditCard", v)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <QrCode className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <Label className="text-base">PIX</Label>
                                <p className="text-xs text-muted-foreground">Pagamento instantâneo.</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.paymentMethods.pix}
                            onCheckedChange={(v) => toggleMethod("pix", v)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <ScrollText className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <Label className="text-base">Boleto Bancário</Label>
                                <p className="text-xs text-muted-foreground">Com registro.</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.paymentMethods.boleto}
                            onCheckedChange={(v) => toggleMethod("boleto", v)}
                        />
                    </div>
                </CardContent>
            </Card>

            {settings.paymentMethods.creditCard && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Parcelamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Máximo de Parcelas</Label>
                                <Select
                                    value={String(settings.maxInstallments)}
                                    onValueChange={(v) => set({ maxInstallments: parseInt(v) })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                            <SelectItem key={i} value={String(i)}>{i}x</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Texto de Juros</Label>
                                <Input
                                    value={settings.installmentsText}
                                    onChange={(e) => set({ installmentsText: e.target.value })}
                                    placeholder="Ex: Sem juros"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {settings.paymentMethods.pix && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Desconto no PIX</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-1/3 space-y-2">
                                <Label>Tipo</Label>
                                <Select
                                    value={settings.pixDiscountType}
                                    onValueChange={(v: any) => set({ pixDiscountType: v })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percent">% Porcentagem</SelectItem>
                                        <SelectItem value="fixed">R$ Fixo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label>Valor do Desconto</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={settings.pixDiscountValue}
                                    onChange={(e) => set({ pixDiscountValue: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
