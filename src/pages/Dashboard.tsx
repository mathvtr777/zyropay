import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CreditCard,
  Filter,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";

const stats = [
  {
    title: "Vendas Totais",
    value: "R$ 12.450,00",
    change: "12.5%",
    trend: "up",
    diff: "vs mês anterior",
    icon: DollarSign,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    title: "Vendas Hoje",
    value: "R$ 1.280,00",
    change: "8.2%",
    trend: "up",
    diff: "vs ontem",
    icon: TrendingUp, // Using TrendingUp as 'insights' equivalent
    iconBg: "bg-indigo-500/10 text-indigo-500",
  },
  {
    title: "Checkouts Ativos",
    value: "24",
    change: "+3",
    trend: "up",
    diff: "esta semana",
    icon: ShoppingBag,
    iconBg: "bg-pink-500/10 text-pink-500",
  },
  {
    title: "Taxa de Conversão",
    value: "68%",
    change: "-2.1%",
    trend: "down",
    diff: "vs mês anterior",
    icon: CreditCard,
    iconBg: "bg-amber-500/10 text-amber-500",
  },
];

const chartData = [
  { name: "Jan", value: 4000 },
  { name: "Fev", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Abr", value: 4500 },
  { name: "Mai", value: 6000 },
  { name: "Jun", value: 5500 },
  { name: "Jul", value: 7000 },
];

const recentTransactions = [
  {
    id: "1",
    product: "Curso de Marketing Digital",
    customer: "João Silva",
    time: "5m atrás",
    amount: "R$ 297,00",
    status: "Pago",
    statusColor: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "2",
    product: "E-book Vendas Online",
    customer: "Maria Santos",
    time: "12m atrás",
    amount: "R$ 47,00",
    status: "Pendente",
    statusColor: "bg-amber-500/10 text-amber-500",
  },
  {
    id: "3",
    product: "Mentoria Premium",
    customer: "Carlos Oliveira",
    time: "25m atrás",
    amount: "R$ 997,00",
    status: "Pago",
    statusColor: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "4",
    product: "Pack de Templates Notion",
    customer: "Ana Costa",
    time: "1h atrás",
    amount: "R$ 29,00",
    status: "Expirado",
    statusColor: "bg-rose-500/10 text-rose-500",
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está um resumo das suas vendas.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button className="flex-1 sm:flex-none gap-2 gradient-primary" asChild>
            <Link to="/checkouts">
              <Plus className="h-4 w-4" />
              Novo Checkout
            </Link>
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border p-6 rounded-2xl hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </p>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-emerald-500" : "text-rose-500"
                }`}
            >
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{stat.change}</span>
              <span className="text-muted-foreground font-normal ml-1">
                {stat.diff}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 overflow-hidden relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-bold">Volume de Vendas</h4>
              <p className="text-sm text-muted-foreground">Últimos 7 meses</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 text-[10px] font-bold bg-muted text-muted-foreground rounded">
                2024
              </span>
              <span className="px-2 py-1 text-[10px] font-bold bg-primary text-primary-foreground rounded">
                2025
              </span>
            </div>
          </div>

          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    backgroundColor: "hsl(var(--card))",
                    color: "hsl(var(--card-foreground))",
                  }}
                  itemStyle={{ color: "hsl(var(--primary))" }}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fill="url(#gradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold">Transações Recentes</h4>
            <Button variant="link" className="text-xs font-bold text-primary h-auto p-0">
              Ver Todas
            </Button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-bold truncate">
                    {transaction.product}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {transaction.customer} • {transaction.time}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                  <span className="text-sm font-bold">{transaction.amount}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${transaction.statusColor}`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
