import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Copy, Trash2, Eye, LayoutTemplate } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { store } from "@/lib/store";
import { Checkout } from "@/types";
import { defaultSettings } from "@/components/checkout-builder/types";

export default function Checkouts() {
    const [checkouts, setCheckouts] = useState<Checkout[]>([]);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        setCheckouts(store.getCheckouts());
        const unsubscribe = store.subscribe(() => {
            setCheckouts(store.getCheckouts());
        });
        return unsubscribe;
    }, []);

    const handleCreateCheckout = () => {
        const newCheckout: Checkout = {
            id: `chk_${Math.random().toString(36).substr(2, 9)}`,
            name: "Novo Checkout",
            slug: `checkout-${Math.random().toString(36).substr(2, 6)}`,
            settings: { ...defaultSettings },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            active: true,
        };
        store.createCheckout(newCheckout);
        toast({
            title: "Checkout criado!",
            description: "Você será redirecionado para o editor.",
        });
        navigate(`/checkout-editor/${newCheckout.id}`);
    };

    const handleDuplicate = (checkout: Checkout) => {
        const newCheckout: Checkout = {
            ...checkout,
            id: `chk_${Math.random().toString(36).substr(2, 9)}`,
            name: `${checkout.name} (Cópia)`,
            slug: `${checkout.slug}-copy`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        store.createCheckout(newCheckout);
        toast({
            title: "Checkout duplicado!",
            description: "Uma cópia foi criada com sucesso.",
        });
    };

    const handleDelete = (id: string) => {
        try {
            store.deleteCheckout(id);
            toast({
                title: "Checkout removido",
                description: "O checkout foi removido com sucesso.",
            });
        } catch (error: any) {
            toast({
                title: "Erro ao remover",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Checkouts</h1>
                        <p className="text-muted-foreground">
                            Gerencie seus modelos de checkout reutilizáveis.
                        </p>
                    </div>
                    <Button className="gradient-primary" onClick={handleCreateCheckout}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Checkout
                    </Button>
                </div>

                {checkouts.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-16">
                        <LayoutTemplate className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum checkout criado</h3>
                        <p className="text-muted-foreground text-center mb-6">
                            Crie seu primeiro checkout para vincular aos seus produtos.
                        </p>
                        <Button className="gradient-primary" onClick={handleCreateCheckout}>
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Checkout
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {checkouts.map((checkout) => (
                            <Card key={checkout.id} className="hover-lift overflow-hidden group">
                                <div
                                    className="h-32 bg-muted flex items-center justify-center border-b"
                                    style={{ backgroundColor: checkout.settings.backgroundColor || "#f4f4f5" }}
                                >
                                    <div
                                        className="w-3/4 h-3/4 rounded-lg shadow-sm border bg-white opacity-80"
                                        style={{
                                            borderRadius: checkout.settings.borderRadius === "full" ? "1rem" : undefined,
                                            backgroundColor: checkout.settings.cardColor
                                        }}
                                    />
                                </div>
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg truncate">{checkout.name}</CardTitle>
                                        <CardDescription className="text-xs truncate">
                                            /{checkout.slug}
                                        </CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link to={`/checkout-builder/${checkout.id}`}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Editar
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(checkout)}>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Duplicar
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => handleDelete(checkout.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <Badge variant={checkout.active ? "outline" : "secondary"}>
                                            {checkout.active ? "Ativo" : "Inativo"}
                                        </Badge>
                                        <span className="text-xs">
                                            Atualizado há {Math.floor((new Date().getTime() - new Date(checkout.updatedAt).getTime()) / (1000 * 60 * 60))}h
                                        </span>
                                    </div>
                                    <Button variant="outline" className="w-full mt-4" asChild>
                                        <Link to={`/checkout-builder/${checkout.id}`}>
                                            Editar Visual
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
