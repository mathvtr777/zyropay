import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { CheckoutSettings } from "./types";

interface Props {
  settings: CheckoutSettings;
  onChange: (s: CheckoutSettings) => void;
}

export function ExtrasTab({ settings, onChange }: Props) {
  const set = (patch: Partial<CheckoutSettings>) => onChange({ ...settings, ...patch });

  return (
    <div className="space-y-6">
      {/* Video */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vídeo de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exibir vídeo</Label>
              <p className="text-sm text-muted-foreground">YouTube ou Vimeo embed</p>
            </div>
            <Switch
              checked={settings.showVideo}
              onCheckedChange={(v) => set({ showVideo: v })}
            />
          </div>
          {settings.showVideo && (
            <>
              <div className="space-y-2">
                <Label>URL do vídeo</Label>
                <Input
                  value={settings.videoUrl}
                  onChange={(e) => set({ videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-2">
                <Label>Posição</Label>
                <Select value={settings.videoPosition} onValueChange={(v) => set({ videoPosition: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Acima do produto</SelectItem>
                    <SelectItem value="below">Abaixo do produto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bonuses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bônus e Extras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar bônus</Label>
              <p className="text-sm text-muted-foreground">Lista de bônus inclusos</p>
            </div>
            <Switch
              checked={settings.showBonuses}
              onCheckedChange={(v) => set({ showBonuses: v })}
            />
          </div>
          {settings.showBonuses && (
            <div className="space-y-3">
              {settings.bonuses.map((bonus, i) => (
                <div key={i} className="space-y-2 p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Bônus {i + 1}</Label>
                    {settings.bonuses.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => set({ bonuses: settings.bonuses.filter((_, j) => j !== i) })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={bonus.title}
                    onChange={(e) => {
                      const updated = [...settings.bonuses];
                      updated[i] = { ...updated[i], title: e.target.value };
                      set({ bonuses: updated });
                    }}
                    placeholder="Título do bônus"
                  />
                  <Input
                    value={bonus.description}
                    onChange={(e) => {
                      const updated = [...settings.bonuses];
                      updated[i] = { ...updated[i], description: e.target.value };
                      set({ bonuses: updated });
                    }}
                    placeholder="Descrição curta"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => set({ bonuses: [...settings.bonuses, { title: "", description: "" }] })}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar bônus
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">FAQ / Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar FAQ</Label>
              <p className="text-sm text-muted-foreground">Perguntas e respostas no checkout</p>
            </div>
            <Switch
              checked={settings.showFaq}
              onCheckedChange={(v) => set({ showFaq: v })}
            />
          </div>
          {settings.showFaq && (
            <div className="space-y-3">
              {settings.faqItems.map((item, i) => (
                <div key={i} className="space-y-2 p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Pergunta {i + 1}</Label>
                    {settings.faqItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => set({ faqItems: settings.faqItems.filter((_, j) => j !== i) })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...settings.faqItems];
                      updated[i] = { ...updated[i], question: e.target.value };
                      set({ faqItems: updated });
                    }}
                    placeholder="Pergunta"
                  />
                  <Textarea
                    value={item.answer}
                    onChange={(e) => {
                      const updated = [...settings.faqItems];
                      updated[i] = { ...updated[i], answer: e.target.value };
                      set({ faqItems: updated });
                    }}
                    placeholder="Resposta"
                    rows={2}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => set({ faqItems: [...settings.faqItems, { question: "", answer: "" }] })}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar pergunta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
