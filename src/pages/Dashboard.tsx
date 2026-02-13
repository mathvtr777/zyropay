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
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";
import { useDashboardStats } from "@/hooks/useSupabase";

// Mock chart data - will be replaced with real data later
const chartData = [
  { name: "Jan", value: 0 },
  { name: "Fev", value: 0 },
  { name: "Mar", value: 0 },
  { name: "Abr", value: 0 },
  { name: "Mai", value: 0 },
  { name: "Jun", value: 0 },
  { name: "Jul", value: 0 },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: "Vendas Totais",
      value: `R$ ${(stats?.totalSales || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      change: "+0%",
      trend: "up" as const,
      diff: "vs mês anterior",
      icon: DollarSign,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      title: "Vendas Hoje",
      value: `R$ ${(stats?.salesToday || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      change: "+0%",
      trend: "up" as const,
      diff: "vs ontem",
      icon: TrendingUp,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
    {
      title: "Checkouts Ativos",
      value: String(stats?.activeCheckouts || 0),
      change: "+0",
      trend: "up" as const,
      diff: "esta semana",
      icon: ShoppingBag,
      iconBg: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "Taxa de Conversão",
      value: `${stats?.conversionRate || 0}%`,
      change: "+0%",
      trend: "up" as const,
      diff: "vs mês anterior",
      icon: CreditCard,
      iconBg: "bg-amber-500/10 text-amber-500",
    },
  ];

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
        {statsCards.map((stat, index) => (
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
            <Button variant="link" className="text-xs font-bold text-primary h-auto p-0" asChild>
              <Link to="/transactions">Ver Todas</Link>
            </Button>
          </div>
          <div className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Nenhuma transação ainda</p>
              <p className="text-xs mt-2">Suas vendas aparecerão aqui</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
