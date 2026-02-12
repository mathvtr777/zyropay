import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function TypographyTab({ settings, onChange }: Props) {
  const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tipografia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Fonte</Label>
          <Select value={settings.fontFamily} onValueChange={(v) => set({ fontFamily: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Poppins">Poppins</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
              <SelectItem value="Playfair Display">Playfair Display</SelectItem>
              <SelectItem value="DM Sans">DM Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tamanho do Título</Label>
          <Select value={settings.titleSize} onValueChange={(v) => set({ titleSize: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="base">Pequeno</SelectItem>
              <SelectItem value="lg">Médio</SelectItem>
              <SelectItem value="xl">Grande</SelectItem>
              <SelectItem value="2xl">Extra Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tamanho do Corpo</Label>
          <Select value={settings.bodySize} onValueChange={(v) => set({ bodySize: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">Pequeno</SelectItem>
              <SelectItem value="sm">Médio</SelectItem>
              <SelectItem value="base">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Peso da Fonte (Título)</Label>
          <Select value={settings.fontWeight} onValueChange={(v) => set({ fontWeight: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="semibold">Semi-Bold</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="extrabold">Extra Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
