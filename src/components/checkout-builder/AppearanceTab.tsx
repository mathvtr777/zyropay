import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function AppearanceTab({ settings, onChange }: Props) {
  const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

  const ColorField = ({ label, field }: { label: string; field: keyof CheckoutSettings }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={settings[field] as string}
          onChange={(e) => set({ [field]: e.target.value })}
          className="h-10 w-14 rounded-lg border border-border cursor-pointer"
        />
        <Input
          value={settings[field] as string}
          onChange={(e) => set({ [field]: e.target.value })}
          className="flex-1 font-mono text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Modo</Label>
            <Select value={settings.theme} onValueChange={(v) => set({ theme: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="auto">Automático (Sistema)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Logo (URL)</Label>
            <Input
              value={settings.logoUrl}
              onChange={(e) => set({ logoUrl: e.target.value })}
              placeholder="https://seusite.com/logo.png"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estilo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Arredondamento</Label>
            <Select value={settings.borderRadius} onValueChange={(v: any) => set({ borderRadius: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Reto</SelectItem>
                <SelectItem value="sm">Pequeno</SelectItem>
                <SelectItem value="md">Médio</SelectItem>
                <SelectItem value="lg">Grande</SelectItem>
                <SelectItem value="full">Total</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sombra</Label>
            <Select value={settings.shadow} onValueChange={(v: any) => set({ shadow: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                <SelectItem value="sm">Suave</SelectItem>
                <SelectItem value="md">Média</SelectItem>
                <SelectItem value="lg">Intensa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorField label="Cabeçalho" field="headerColor" />
          <ColorField label="Fundo" field="backgroundColor" />
          <ColorField label="Card" field="cardColor" />
          <ColorField label="Texto" field="textColor" />
          <ColorField label="Botão" field="buttonColor" />
        </CardContent>
      </Card>
    </div>
  );
}
