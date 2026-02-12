import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  product: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  amount: number;
  status: "paid" | "pending" | "expired" | "refunded";
  provider: string;
  date: string;
  transactionId: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    product: "Curso de Marketing Digital",
    customer: { name: "João Silva", email: "joao@email.com", phone: "(11) 99999-1234" },
    amount: 297,
    status: "paid",
    provider: "Mercado Pago",
    date: "2024-01-15T14:30:00",
    transactionId: "MP-1234567890",
  },
  {
    id: "2",
    product: "E-book Vendas Online",
    customer: { name: "Maria Santos", email: "maria@email.com" },
    amount: 47,
    status: "pending",
    provider: "Mercado Pago",
    date: "2024-01-15T13:45:00",
    transactionId: "MP-1234567891",
  },
  {
    id: "3",
    product: "Mentoria Premium",
    customer: { name: "Carlos Oliveira", email: "carlos@email.com", phone: "(21) 98888-5678" },
    amount: 997,
    status: "paid",
    provider: "Kirvano",
    date: "2024-01-15T10:20:00",
    transactionId: "KV-9876543210",
  },
  {
    id: "4",
    product: "Template Notion",
    customer: { name: "Ana Costa", email: "ana@email.com" },
    amount: 29,
    status: "expired",
    provider: "Mercado Pago",
    date: "2024-01-14T22:15:00",
    transactionId: "MP-1234567892",
  },
  {
    id: "5",
    product: "Curso de Marketing Digital",
    customer: { name: "Pedro Lima", email: "pedro@email.com", phone: "(31) 97777-9012" },
    amount: 297,
    status: "refunded",
    provider: "Mercado Pago",
    date: "2024-01-14T18:00:00",
    transactionId: "MP-1234567893",
  },
];

const statusConfig = {
  paid: { label: "Pago", className: "bg-success/10 text-success" },
  pending: { label: "Pendente", className: "bg-warning/10 text-warning" },
  expired: { label: "Expirado", className: "bg-muted text-muted-foreground" },
  refunded: { label: "Reembolsado", className: "bg-destructive/10 text-destructive" },
};

export default function Transactions() {
  const [transactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Produto", "Cliente", "Email", "Valor", "Status", "Provedor", "Data", "ID Transação"];
    const rows = filteredTransactions.map((t) => [
      t.product,
      t.customer.name,
      t.customer.email,
      `R$ ${t.amount.toFixed(2)}`,
      statusConfig[t.status].label,
      t.provider,
      new Date(t.date).toLocaleDateString("pt-BR"),
      t.transactionId,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transacoes-priva.csv";
    a.click();

    toast({
      title: "Exportado!",
      description: "O arquivo CSV foi baixado com sucesso.",
    });
  };

  const totalPaid = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transações</h1>
            <p className="text-muted-foreground">
              Histórico de todas as suas vendas.
            </p>
          </div>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Recebido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold gradient-text">
                R$ {totalPaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pendente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">
                R$ {totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por produto, cliente ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="expired">Expirados</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Provedor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.product}</TableCell>
                      <TableCell>
                        <div>
                          <p>{transaction.customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        R$ {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[transaction.status].className}>
                          {statusConfig[transaction.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.provider}</TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {transaction.transactionId}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
