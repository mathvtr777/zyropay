import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutSettings } from "./types";

interface Props {
  settings: CheckoutSettings;
  onChange: (s: CheckoutSettings) => void;
}

export function ContentTab({ settings, onChange }: Props) {
  const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Textos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Texto do Botão</Label>
          <Input
            value={settings.buttonText}
            onChange={(e) => set({ buttonText: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Título Personalizado</Label>
          <Input
            value={settings.customTitle}
            onChange={(e) => set({ customTitle: e.target.value })}
            placeholder="Deixe vazio para usar o nome do produto"
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição Personalizada</Label>
          <Textarea
            value={settings.customDescription}
            onChange={(e) => set({ customDescription: e.target.value })}
            placeholder="Deixe vazio para usar a descrição do produto"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
