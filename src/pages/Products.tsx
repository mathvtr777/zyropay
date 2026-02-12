import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  ExternalLink,
  Copy,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  LayoutTemplate
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

import { store } from "@/lib/store";
import { Product, Checkout } from "@/types";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Initial fetch
    setProducts(store.getProducts());
    setCheckouts(store.getCheckouts());

    // Subscribe to changes
    const unsubscribe = store.subscribe(() => {
      setProducts(store.getProducts());
      setCheckouts(store.getCheckouts());
    });
    return unsubscribe;
  }, []);

  const getCheckoutUrl = (product: Product) => {
    const checkout = store.getCheckout(product.checkoutId);
    if (!checkout) return "#";
    // Constructing the new public URL format: /c/:checkoutSlug/:productSlug
    // Using product ID as slug for now since we don't have a product slug field yet.
    // In a real app, we'd slugify the product name.
    const productSlug = product.id;
    return `${window.location.origin}/c/${checkout.slug}/${productSlug}`;
  };

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link do checkout foi copiado para a área de transferência.",
    });
  };

  const handleCreateProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const checkoutId = formData.get("checkoutId") as string;
    if (!checkoutId) {
      toast({
        title: "Erro",
        description: "Selecione um checkout para o produto.",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      checkoutId: checkoutId,
      sales: 0,
      status: "active",
    };

    store.createProduct(newProduct);
    setIsDialogOpen(false);
    toast({
      title: "Produto criado!",
      description: "Seu produto foi criado com sucesso.",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    store.deleteProduct(productId);
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie seus produtos e vincule checkouts.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Criar Novo Produto</DialogTitle>
                <DialogDescription>
                  Preencha os dados do produto e escolha um checkout.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProduct}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: Curso de Marketing Digital"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva seu produto..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Valor (R$)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="297.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="checkoutId">Checkout</Label>
                      <Link to="/checkouts" className="text-xs text-primary hover:underline flex items-center">
                        <Plus className="h-3 w-3 mr-1" />
                        Criar novo checkout
                      </Link>
                    </div>
                    <Select name="checkoutId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um checkout" />
                      </SelectTrigger>
                      <SelectContent>
                        {checkouts.map((checkout) => (
                          <SelectItem key={checkout.id} value={checkout.id}>
                            {checkout.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      O visual e configurações de pagamento serão herdados deste checkout.
                    </p>
                  </div>

                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="gradient-primary">
                    Criar Produto
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto ainda</h3>
            <p className="text-muted-foreground text-center mb-6">
              Crie seu primeiro produto para começar a vender.
            </p>
            <Button className="gradient-primary" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Produto
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const checkoutUrl = getCheckoutUrl(product);
              const checkout = store.getCheckout(product.checkoutId);

              return (
                <Card key={product.id} className="hover-lift overflow-hidden">
                  <div className="h-2 gradient-primary" />
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                        <Badge
                          variant={product.status === "active" ? "default" : "secondary"}
                          className={
                            product.status === "active"
                              ? "bg-success/10 text-success"
                              : ""
                          }
                        >
                          {product.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                      {checkout && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <LayoutTemplate className="h-3 w-3" />
                          <span>Checkout: <strong>{checkout.name}</strong></span>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/checkout-builder/${product.checkoutId}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar Checkout
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Checkout
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Preço</span>
                      <span className="text-2xl font-bold gradient-text">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vendas</span>
                      <span className="font-medium">{product.sales}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={checkoutUrl}
                        readOnly
                        className="text-xs bg-muted"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleCopyUrl(checkoutUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" asChild>
                        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
