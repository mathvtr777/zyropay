import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    title: "Total de Vendas",
    value: "R$ 12.450,00",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Vendas Hoje",
    value: "R$ 1.280,00",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Checkouts Ativos",
    value: "24",
    change: "+3",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Taxa de Conversão",
    value: "68%",
    change: "-2.1%",
    trend: "down",
    icon: CreditCard,
  },
];

const chartData = [
  { name: "Jan", vendas: 4000 },
  { name: "Fev", vendas: 3000 },
  { name: "Mar", vendas: 5000 },
  { name: "Abr", vendas: 4500 },
  { name: "Mai", vendas: 6000 },
  { name: "Jun", vendas: 5500 },
  { name: "Jul", vendas: 7000 },
];

const recentTransactions = [
  {
    id: "1",
    product: "Curso de Marketing Digital",
    customer: "João Silva",
    amount: "R$ 297,00",
    status: "paid",
    date: "Há 5 min",
  },
  {
    id: "2",
    product: "E-book Vendas Online",
    customer: "Maria Santos",
    amount: "R$ 47,00",
    status: "pending",
    date: "Há 12 min",
  },
  {
    id: "3",
    product: "Mentoria Premium",
    customer: "Carlos Oliveira",
    amount: "R$ 997,00",
    status: "paid",
    date: "Há 25 min",
  },
  {
    id: "4",
    product: "Template Notion",
    customer: "Ana Costa",
    amount: "R$ 29,00",
    status: "expired",
    date: "Há 1 hora",
  },
];

const statusColors = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  expired: "bg-destructive/10 text-destructive",
};

const statusLabels = {
  paid: "Pago",
  pending: "Pendente",
  expired: "Expirado",
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está um resumo das suas vendas.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart and Recent Transactions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Volume de Vendas</CardTitle>
              <CardDescription>Últimos 7 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `R$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Vendas"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="vendas"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVendas)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Últimas vendas realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{transaction.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.customer} · {transaction.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[transaction.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[transaction.status as keyof typeof statusLabels]}
                      </span>
                      <span className="font-semibold">{transaction.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
