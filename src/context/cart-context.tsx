"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CartItem } from "@/lib/contracts";
import { cartItems as defaultCartItems } from "@/lib/mock-data";

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
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("niloka_cart");
      const initialItems = stored ? JSON.parse(stored) : defaultCartItems;
      setTimeout(() => {
        setItems(initialItems);
        setIsInitialized(true);
      }, 0);
    } catch {
      setTimeout(() => {
        setItems(defaultCartItems);
        setIsInitialized(true);
      }, 0);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("niloka_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Failed to persist cart items", e);
      }
    }
  }, [items, isInitialized]);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // Check if item of same product or ampas listing already exists
      const existingIndex = prev.findIndex(
        (item) =>
          (newItem.kind === "product" &&
            item.kind === "product" &&
            item.productId === newItem.productId) ||
          (newItem.kind === "ampas-listing" &&
            item.kind === "ampas-listing" &&
            item.ampasListingId === newItem.ampasListingId)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }

      // Add as new item
      const id = `cart-${newItem.kind}-${Date.now()}`;
      return [...prev, { ...newItem, id } as CartItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((acc, item) => acc + (item.kind === "product" ? item.quantity : 1), 0);

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
