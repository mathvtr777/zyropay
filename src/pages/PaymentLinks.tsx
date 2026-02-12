import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { availableProviders, Provider } from "./Providers";
import { Link2, Copy, Check, ExternalLink } from "lucide-react";

export default function PaymentLinks() {
    const [selectedProviderId, setSelectedProviderId] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [generatedLink, setGeneratedLink] = useState<string>("");
    const [copiedLink, setCopiedLink] = useState(false);
    const { toast } = useToast();

    const handleGenerateLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProviderId || !amount) {
            toast({
                title: "Erro ao gerar link",
                description: "Por favor, selecione um provedor e informe o valor.",
                variant: "destructive",
            });
            return;
        }

        // Simulando a geração de um link
        const provider = availableProviders.find(p => p.id === selectedProviderId);
        const linkId = Math.random().toString(36).substr(2, 9);
        const mockLink = `https://priva.app/pay/${provider?.id}/${linkId}?amount=${amount}`;

        setGeneratedLink(mockLink);
        toast({
            title: "Link gerado com sucesso!",
            description: "Seu link de pagamento está pronto para ser compartilhado.",
        });
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(generatedLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        toast({
            title: "Link copiado!",
            description: "O link foi copiado para a área de transferência.",
        });
    };

    const selectedProvider = availableProviders.find(p => p.id === selectedProviderId);

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold">Gerar Link de Pagamento</h1>
                    <p className="text-muted-foreground">
                        Crie links de pagamento rápidos para enviar aos seus clientes.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurar Link</CardTitle>
                            <CardDescription>
                                Defina os detalhes do pagamento.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleGenerateLink} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="provider">Provedor</Label>
                                    <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
                                        <SelectTrigger id="provider">
                                            <SelectValue placeholder="Selecione um provedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableProviders.map((provider) => (
                                                <SelectItem key={provider.id} value={provider.id}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{provider.logo}</span>
                                                        <span>{provider.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Valor (R$)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0,00"
                                        min="0"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição (Opcional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Ex: Consultoria de Marketing"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <Button type="submit" className="w-full gradient-primary">
                                    <Link2 className="h-4 w-4 mr-2" />
                                    Gerar Link
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className={`transition-opacity duration-300 ${generatedLink ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <CardHeader>
                            <CardTitle>Link Gerado</CardTitle>
                            <CardDescription>
                                Copie e envie para seu cliente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {generatedLink ? (
                                <>
                                    <div className="p-4 rounded-xl bg-accent/50 border border-accent space-y-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                                                {selectedProvider?.logo}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Pagamento via {selectedProvider?.name}</p>
                                                <p className="text-2xl font-bold">R$ {parseFloat(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground break-all bg-background p-2 rounded border">
                                            {generatedLink}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button onClick={copyLink} className="flex-1" variant="outline">
                                            {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                            Copiar
                                        </Button>
                                        <Button variant="secondary" className="flex-1" asChild>
                                            <a href={generatedLink} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Testar
                                            </a>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                                    <Link2 className="h-8 w-8 mb-2 opacity-50" />
                                    <p>Preencha o formulário para gerar um link</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
