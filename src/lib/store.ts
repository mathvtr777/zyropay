import { Checkout, Product } from "@/types";
import { defaultSettings } from "@/components/checkout-builder/types";

// Mock Data
const initialCheckouts: Checkout[] = [
    {
        id: "chk_default",
        name: "Checkout Padrão",
        slug: "padrao",
        settings: { ...defaultSettings },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        active: true,
    },
    {
        id: "chk_dark",
        name: "Checkout Escuro",
        slug: "dark-mode",
        settings: {
            ...defaultSettings,
            theme: "dark",
            headerColor: "#000000",
            buttonColor: "#10b981", // Emerald
            borderRadius: "full",
            shadow: "lg"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        active: true,
    },
];

const initialProducts: Product[] = [
    {
        id: "prod_1",
        name: "Curso de Marketing Digital",
        description: "Aprenda marketing digital do zero ao avançado",
        price: 297,
        checkoutId: "chk_default",
        sales: 42,
        status: "active",
    },
    {
        id: "prod_2",
        name: "Mentoria Premium",
        description: "Acompanhamento individual",
        price: 997,
        checkoutId: "chk_dark",
        sales: 15,
        status: "active",
    },
];

// In-memory "Database"
let checkouts = [...initialCheckouts];
let products = [...initialProducts];

// Listeners for simple reactivity
type Listener = () => void;
const listeners: Listener[] = [];

const notify = () => {
    listeners.forEach((l) => l());
};

export const store = {
    subscribe: (listener: Listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    },

    // Checkouts
    getCheckouts: () => [...checkouts],
    getCheckout: (id: string) => checkouts.find((c) => c.id === id),
    getCheckoutBySlug: (slug: string) => checkouts.find((c) => c.slug === slug),

    createCheckout: (checkout: Checkout) => {
        checkouts.push(checkout);
        notify();
    },
    updateCheckout: (id: string, updates: Partial<Checkout>) => {
        checkouts = checkouts.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
        notify();
    },
    deleteCheckout: (id: string) => {
        // Soft delete check if used by product?
        const isUsed = products.some(p => p.checkoutId === id);
        if (isUsed) throw new Error("Este checkout está em uso por um ou mais produtos e não pode ser excluído.");

        checkouts = checkouts.filter((c) => c.id !== id);
        notify();
    },

    // Products
    getProducts: () => [...products],
    getProduct: (id: string) => products.find((p) => p.id === id),
    getProductBySlug: (slug: string) => {
        // Simulating slug generation from name for now. In real app, Product should have a slug field.
        // For this mock, we'll try to match ID or loosely match name-slug
        return products.find(p => p.id === slug || p.name.toLowerCase().replace(/\s+/g, '-') === slug);
    },

    createProduct: (product: Product) => {
        products.push(product);
        notify();
    },
    updateProduct: (id: string, updates: Partial<Product>) => {
        products = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
        notify();
    },
    deleteProduct: (id: string) => {
        products = products.filter((p) => p.id !== id);
        notify();
    },
};
