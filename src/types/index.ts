import { CheckoutSettings } from "@/components/checkout-builder/types";

export interface Checkout {
    id: string;
    name: string;
    slug: string;
    settings: CheckoutSettings;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    checkoutId: string; // Foreign key to Checkout
    sales: number;
    status: "active" | "inactive";
}
