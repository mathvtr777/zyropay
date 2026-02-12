import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Providers from "./pages/Providers";
import Products from "./pages/Products";
import CheckoutBuilder from "./pages/CheckoutBuilder";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Plans from "./pages/Plans";
import PublicCheckout from "./pages/PublicCheckout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Auth from "./pages/Auth";
import PaymentLinks from "./pages/PaymentLinks";
import Checkouts from "./pages/Checkouts";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="priva-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout/:checkoutId" element={<PublicCheckout />} /> {/* Legacy support */}
            <Route path="/c/:checkoutSlug/:productSlug" element={<PublicCheckout />} /> {/* New structure */}
            <Route path="/checkout/:checkoutId/success" element={<CheckoutSuccess />} />
            <Route path="/plans" element={<Plans />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment-links" element={<PaymentLinks />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/checkouts" element={<Checkouts />} />
            <Route path="/checkout-builder/:checkoutId" element={<CheckoutBuilder />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
