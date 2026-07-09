"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import type { CartItem } from "@/lib/contracts";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import {
  fetchCartAction,
  addToCartAction,
  removeFromCartAction,
  updateCartItemQuantityAction,
  clearCartAction,
} from "@/lib/actions/checkout-actions";

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">, suppressToast?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  totalCount: number;
  isAdding: boolean;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    let active = true;
    if (user) {
      fetchCartAction()
        .then((cartItems) => {
          if (active) {
            setItems(cartItems);
          }
        })
        .catch((err) => {
          console.error("Failed to load cart items from server", err);
          showToast("Gagal memuat keranjang belanja.", "error");
          if (active) {
            setItems([]);
          }
        });
    } else {
      setTimeout(() => {
        if (active) {
          setItems([]);
        }
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [user]);

  const checkAuth = useCallback(() => {
    if (!user) {
      router.push("/auth/login");
      return false;
    }
    return true;
  }, [user, router]);

  const addItem = useCallback(async (newItem: Omit<CartItem, "id">, suppressToast?: boolean) => {
    if (!checkAuth()) return;
    setIsAdding(true);
    try {
      const res = await addToCartAction(newItem);
      if (res.ok && res.items) {
        setItems(res.items);
        if (!suppressToast) {
          showToast("Produk berhasil ditambahkan ke keranjang.", "success");
        }
      }
    } catch (err) {
      console.error("Failed to add item to cart", err);
      showToast("Gagal menambahkan produk ke keranjang.", "error");
    } finally {
      setIsAdding(false);
    }
  }, [checkAuth]);

  const removeItem = useCallback(async (id: string) => {
    if (!checkAuth()) return;
    try {
      const res = await removeFromCartAction(id);
      if (res.ok && res.items) {
        setItems(res.items);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to remove item", err);
      showToast("Gagal menghapus item dari keranjang.", "error");
    }
  }, [checkAuth]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (!checkAuth()) return;
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }
    try {
      const res = await updateCartItemQuantityAction(id, quantity);
      if (res.ok && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error("Failed to update quantity", err);
      showToast("Gagal memperbarui jumlah item.", "error");
    }
  }, [checkAuth, removeItem]);

  const clearCart = useCallback(async () => {
    if (!checkAuth()) return;
    try {
      const res = await clearCartAction();
      if (res.ok) {
        setItems(res.items);
        setSelectedIds(new Set());
      }
    } catch (err) {
      console.error("Failed to clear cart", err);
      showToast("Gagal mengosongkan keranjang.", "error");
    }
  }, [checkAuth]);

  const refreshCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    try {
      const cartItems = await fetchCartAction();
      setItems(cartItems);
    } catch {
      setItems([]);
    }
  }, [user]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === items.length && items.length > 0) return new Set();
      return new Set(items.map((item) => item.id));
    });
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);

  const totalCount = useMemo(() =>
    items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCart,
    totalCount,
    isAdding,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    isCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
  }), [items, totalCount, addItem, removeItem, updateQuantity, clearCart, refreshCart, isAdding, selectedIds, toggleSelect, toggleSelectAll, clearSelection, isCartDrawerOpen, openCartDrawer, closeCartDrawer]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}