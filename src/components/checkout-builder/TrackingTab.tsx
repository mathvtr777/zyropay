import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckoutSettings } from "./types";

interface Props {
  settings: CheckoutSettings;
  onChange: (s: CheckoutSettings) => void;
}

export function TrackingTab({ settings, onChange }: Props) {
  const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pixels e Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Facebook Pixel ID</Label>
          <Input
            value={settings.facebookPixelId}
            onChange={(e) => set({ facebookPixelId: e.target.value })}
            placeholder="123456789012345"
          />
          <p className="text-xs text-muted-foreground">Rastreia conversões no Facebook/Instagram Ads</p>
        </div>
        <div className="space-y-2">
          <Label>Google Tag (GTM / GA4)</Label>
          <Input
            value={settings.googleTagId}
            onChange={(e) => set({ googleTagId: e.target.value })}
            placeholder="GTM-XXXXXXX ou G-XXXXXXXXXX"
          />
          <p className="text-xs text-muted-foreground">Google Tag Manager ou Google Analytics 4</p>
        </div>
        <div className="space-y-2">
          <Label>TikTok Pixel ID</Label>
          <Input
            value={settings.tiktokPixelId}
            onChange={(e) => set({ tiktokPixelId: e.target.value })}
            placeholder="CXXXXXXXXXXXXXXXXX"
          />
          <p className="text-xs text-muted-foreground">Rastreia conversões no TikTok Ads</p>
        </div>
      </CardContent>
    </Card>
  );
}
