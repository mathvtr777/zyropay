import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CheckoutSettings } from "./types";

interface Props {
    settings: CheckoutSettings;
    onChange: (s: CheckoutSettings) => void;
}

export function FieldsTab({ settings, onChange }: Props) {
    const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

    const toggleField = (field: keyof typeof settings.fields, prop: "enabled" | "required", value: boolean) => {
        const newFields = { ...settings.fields };
        newFields[field] = { ...newFields[field], [prop]: value };
        set({ fields: newFields });
    };

    const FieldRow = ({
        label,
        field
    }: {
        label: string;
        field: keyof typeof settings.fields
    }) => (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
                <Switch
                    checked={settings.fields[field].enabled}
                    onCheckedChange={(v) => toggleField(field, "enabled", v)}
                />
                <Label className={!settings.fields[field].enabled ? "opacity-50" : ""}>
                    {label}
                </Label>
            </div>

            {settings.fields[field].enabled && (
                <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground mr-2">Obrigatório</Label>
                    <Switch
                        checked={settings.fields[field].required}
                        onCheckedChange={(v) => toggleField(field, "required", v)}
                        className="scale-75"
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Campos do Cliente</CardTitle>
                    <CardDescription>
                        Escolha quais dados você precisa coletar do seu cliente.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                    <FieldRow label="CPF / CNPJ" field="cpf" />
                    <Separator />
                    <FieldRow label="Telefone (WhatsApp)" field="phone" />
                    <Separator />
                    <FieldRow label="Endereço Completo" field="address" />
                    <Separator />
                    <FieldRow label="Data de Nascimento" field="birthDate" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Opções de Experiência</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Checkout em 2 Etapas</Label>
                            <p className="text-xs text-muted-foreground">
                                Dados pessoais primeiro, pagamento depois.
                            </p>
                        </div>
                        <Switch
                            checked={settings.steps === 2}
                            onCheckedChange={(v) => set({ steps: v ? 2 : 1 })}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Autocompletar Endereço</Label>
                            <p className="text-xs text-muted-foreground">
                                Preencher endereço automaticamente pelo CEP.
                            </p>
                        </div>
                        <Switch
                            checked={settings.autocomplete}
                            onCheckedChange={(v) => set({ autocomplete: v })}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
