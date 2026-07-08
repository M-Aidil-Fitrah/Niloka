"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CartItem } from "@/lib/contracts";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import {
  fetchCartAction,
  addToCartAction,
  removeFromCartAction,
  updateCartItemQuantityAction,
  clearCartAction,
} from "@/lib/actions/checkout-actions";

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from database if user is logged in, else set empty
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

  const checkAuth = () => {
    if (!user) {
      router.push("/auth/login");
      return false;
    }
    return true;
  };

  const addItem = async (newItem: Omit<CartItem, "id">) => {
    if (!checkAuth()) return;
    try {
      const res = await addToCartAction(newItem);
      if (res.ok && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error("Failed to add item to cart", err);
    }
  };

  const removeItem = async (id: string) => {
    if (!checkAuth()) return;
    try {
      const res = await removeFromCartAction(id);
      if (res.ok && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
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
    }
  };

  const clearCart = async () => {
    if (!checkAuth()) return;
    try {
      const res = await clearCartAction();
      if (res.ok) {
        setItems(res.items);
      }
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
      }}
    >
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
