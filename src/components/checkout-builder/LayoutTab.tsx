import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckoutSettings } from "./types";

interface Props {
  settings: CheckoutSettings;
  onChange: (s: CheckoutSettings) => void;
}

export function LayoutTab({ settings, onChange }: Props) {
  const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

  const ToggleRow = ({ label, desc, field }: { label: string; desc: string; field: keyof CheckoutSettings }) => (
    <div className="flex items-center justify-between">
      <div>
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Switch
        checked={settings[field] as boolean}
        onCheckedChange={(v) => set({ [field]: v })}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Largura do Checkout</Label>
            <Select value={settings.checkoutWidth} onValueChange={(v) => set({ checkoutWidth: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Estreito (400px)</SelectItem>
                <SelectItem value="md">Médio (480px)</SelectItem>
                <SelectItem value="lg">Largo (560px)</SelectItem>
                <SelectItem value="xl">Extra Largo (640px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estilo do Card</Label>
            <Select value={settings.cardStyle} onValueChange={(v) => set({ cardStyle: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Arredondado</SelectItem>
                <SelectItem value="sharp">Reto</SelectItem>
                <SelectItem value="pill">Muito Arredondado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seções Visíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow label="Imagem do Produto" desc="Mostrar imagem ao lado do título" field="showProductImage" />
          <ToggleRow label="Descrição" desc="Mostrar descrição do produto" field="showDescription" />
          <ToggleRow label="Instruções PIX" desc="Mostrar passos de pagamento" field="showInstructions" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow label="Timer de Expiração" desc="Mostrar contador regressivo" field="showTimer" />
          {settings.showTimer && (
            <div className="space-y-2">
              <Label>Tempo (minutos)</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={settings.timerMinutes}
                onChange={(e) => set({ timerMinutes: parseInt(e.target.value) || 15 })}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
