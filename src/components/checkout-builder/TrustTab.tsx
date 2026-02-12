import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutSettings } from "./types";

interface Props {
  settings: CheckoutSettings;
  onChange: (s: CheckoutSettings) => void;
}

export function TrustTab({ settings, onChange }: Props) {
  const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selo de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Exibir selo de pagamento seguro</Label>
              <p className="text-sm text-muted-foreground">Mostra ícone de cadeado e texto</p>
            </div>
            <Switch
              checked={settings.showSecurityBadge}
              onCheckedChange={(v) => set({ showSecurityBadge: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Garantia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar garantia</Label>
              <p className="text-sm text-muted-foreground">Selo de garantia de reembolso</p>
            </div>
            <Switch
              checked={settings.showGuarantee}
              onCheckedChange={(v) => set({ showGuarantee: v })}
            />
          </div>
          {settings.showGuarantee && (
            <div className="space-y-2">
              <Label>Dias de garantia</Label>
              <Input
                type="number"
                min={1}
                max={365}
                value={settings.guaranteeDays}
                onChange={(e) => set({ guaranteeDays: parseInt(e.target.value) || 7 })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Depoimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar depoimento</Label>
              <p className="text-sm text-muted-foreground">Prova social no checkout</p>
            </div>
            <Switch
              checked={settings.showTestimonials}
              onCheckedChange={(v) => set({ showTestimonials: v })}
            />
          </div>
          {settings.showTestimonials && (
            <>
              <div className="space-y-2">
                <Label>Texto do depoimento</Label>
                <Textarea
                  value={settings.testimonialText}
                  onChange={(e) => set({ testimonialText: e.target.value })}
                  placeholder="Melhor investimento que já fiz..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Nome do autor</Label>
                <Input
                  value={settings.testimonialAuthor}
                  onChange={(e) => set({ testimonialAuthor: e.target.value })}
                  placeholder="João Silva"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Urgência / Escassez</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar texto de urgência</Label>
              <p className="text-sm text-muted-foreground">Gatilho de escassez</p>
            </div>
            <Switch
              checked={settings.showUrgency}
              onCheckedChange={(v) => set({ showUrgency: v })}
            />
          </div>
          {settings.showUrgency && (
            <div className="space-y-2">
              <Label>Texto</Label>
              <Input
                value={settings.urgencyText}
                onChange={(e) => set({ urgencyText: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
