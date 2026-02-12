import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  History,
  Settings,
  Crown,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Link as LinkIcon,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Links de Pagamento", href: "/payment-links", icon: LinkIcon },
  { name: "Provedores", href: "/providers", icon: CreditCard },
  { name: "Produtos", href: "/products", icon: ShoppingBag },
  { name: "Checkouts", href: "/checkouts", icon: LayoutTemplate },
  { name: "Transações", href: "/transactions", icon: History },
  { name: "Configurações", href: "/settings", icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight">PRIVA</span>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-primary p-5 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20 mb-6">
            <div className="bg-white/20 w-8 h-8 rounded flex items-center justify-center mb-3">
              <Crown className="h-5 w-5" />
            </div>
            <p className="font-bold mb-1">Upgrade para PRO</p>
            <p className="text-xs opacity-80 mb-4 leading-relaxed">
              Checkouts ilimitados e recursos premium esperam por você.
            </p>
            <Link to="/plans">
              <button className="w-full py-2 bg-background/90 text-primary font-semibold text-sm rounded-lg hover:bg-background transition-colors">
                Ver Planos
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-3 px-2 border-t border-border/50 pt-4">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold overflow-hidden border border-border">
              <span className="text-xs">UD</span>
            </div>
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="text-sm font-semibold truncate">Usuário Demo</p>
              <p className="text-[10px] text-muted-foreground truncate">demo@priva.app</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 flex-1">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold text-lg">PRIVA</span>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
