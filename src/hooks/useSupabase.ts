import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Checkout, Product } from "@/types";

// ============================================
// CHECKOUTS HOOKS
// ============================================

export function useCheckouts() {
    return useQuery({
        queryKey: ["checkouts"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("checkouts")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            return data.map(item => ({
                ...item,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                checkoutId: item.checkout_id,
            })) as Checkout[];
        },
    });
}

export function useCheckout(id: string | undefined) {
    return useQuery({
        queryKey: ["checkout", id],
        queryFn: async () => {
            if (!id) return null;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("checkouts")
                .select("*")
                .eq("id", id)
                .eq("user_id", user.id)
                .single();

            if (error) throw error;

            return {
                ...data,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            } as Checkout;
        },
        enabled: !!id,
    });
}

export function useCreateCheckout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (checkout: Omit<Checkout, "createdAt" | "updatedAt">) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("checkouts")
                .insert({
                    ...checkout,
                    user_id: user.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkouts"] });
        },
    });
}

export function useUpdateCheckout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Checkout> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("checkouts")
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id)
                .eq("user_id", user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["checkouts"] });
            queryClient.invalidateQueries({ queryKey: ["checkout", variables.id] });
        },
    });
}

export function useDeleteCheckout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Check if checkout is being used by products
            const { data: products } = await supabase
                .from("products")
                .select("id")
                .eq("checkout_id", id)
                .eq("user_id", user.id);

            if (products && products.length > 0) {
                throw new Error("Este checkout está em uso por um ou mais produtos e não pode ser excluído.");
            }

            const { error } = await supabase
                .from("checkouts")
                .delete()
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkouts"] });
        },
    });
}

// ============================================
// PRODUCTS HOOKS
// ============================================

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            return data.map(item => ({
                ...item,
                checkoutId: item.checkout_id,
            })) as Product[];
        },
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product: Omit<Product, "sales">) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("products")
                .insert({
                    ...product,
                    checkout_id: product.checkoutId,
                    user_id: user.id,
                    sales: 0,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const updateData: any = { ...updates };
            if (updates.checkoutId) {
                updateData.checkout_id = updates.checkoutId;
                delete updateData.checkoutId;
            }

            const { data, error } = await supabase
                .from("products")
                .update(updateData)
                .eq("id", id)
                .eq("user_id", user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

// ============================================
// DASHBOARD STATS HOOKS
// ============================================

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Get transactions for stats
            const { data: transactions } = await supabase
                .from("transactions")
                .select("amount, status, created_at")
                .eq("user_id", user.id);

            // Get active checkouts count
            const { count: checkoutsCount } = await supabase
                .from("checkouts")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
                .eq("active", true);

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const totalSales = transactions?.reduce((sum, t) =>
                t.status === "paid" ? sum + Number(t.amount) : sum, 0) || 0;

            const salesToday = transactions?.reduce((sum, t) =>
                t.status === "paid" && new Date(t.created_at) >= today
                    ? sum + Number(t.amount) : sum, 0) || 0;

            const salesThisMonth = transactions?.reduce((sum, t) =>
                t.status === "paid" && new Date(t.created_at) >= thisMonth
                    ? sum + Number(t.amount) : sum, 0) || 0;

            const paidCount = transactions?.filter(t => t.status === "paid").length || 0;
            const totalCount = transactions?.length || 1;
            const conversionRate = Math.round((paidCount / totalCount) * 100);

            return {
                totalSales,
                salesToday,
                activeCheckouts: checkoutsCount || 0,
                conversionRate,
                salesThisMonth,
            };
        },
    });
}
