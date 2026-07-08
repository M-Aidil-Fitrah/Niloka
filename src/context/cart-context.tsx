"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, AmpasListing, Money } from "@/lib/contracts";
import {
  cartItems as defaultCartItems,
  products as defaultProducts,
  ampasListings as defaultAmpasListings,
  sellers as defaultSellers,
  promos as defaultPromos,
  nilamPassports as defaultPassports,
} from "@/lib/mock-data";
import { getAmpasListingById } from "@/lib/mock-queries";

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const resolveAmpasUnitPrice = (ampasListingId: string | null, quantity: number, defaultPrice: Money) => {
  if (!ampasListingId) return defaultPrice;
  let listing: AmpasListing | null = null;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("niloka_ampas_listings");
    if (stored) {
      const listings = JSON.parse(stored) as AmpasListing[];
      listing = listings.find((l) => l.id === ampasListingId) || null;
    }
  }
  if (!listing) {
    listing = getAmpasListingById(ampasListingId);
  }
  if (listing && listing.wholesaleEnabled && listing.wholesaleMinQtyKg && listing.wholesalePricePerKg) {
    if (quantity >= listing.wholesaleMinQtyKg) {
      return listing.wholesalePricePerKg;
    } else {
      return listing.pricePerKg;
    }
  }
  return listing ? listing.pricePerKg : defaultPrice;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (!localStorage.getItem("niloka_products")) {
          localStorage.setItem("niloka_products", JSON.stringify(defaultProducts));
        }
        if (!localStorage.getItem("niloka_ampas_listings")) {
          localStorage.setItem("niloka_ampas_listings", JSON.stringify(defaultAmpasListings));
        }
        if (!localStorage.getItem("niloka_sellers")) {
          localStorage.setItem("niloka_sellers", JSON.stringify(defaultSellers));
        }
        if (!localStorage.getItem("niloka_promos")) {
          localStorage.setItem("niloka_promos", JSON.stringify(defaultPromos));
        }
        if (!localStorage.getItem("niloka_passports")) {
          localStorage.setItem("niloka_passports", JSON.stringify(defaultPassports));
        }
      }
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
        const newQty = updated[existingIndex].quantity + newItem.quantity;
        updated[existingIndex].quantity = newQty;
        if (newItem.kind === "ampas-listing") {
          updated[existingIndex].unitPrice = resolveAmpasUnitPrice(
            newItem.ampasListingId,
            newQty,
            newItem.unitPrice
          );
        }
        return updated;
      }

      // Add as new item
      const id = `cart-${newItem.kind}-${Date.now()}`;
      let finalPrice = newItem.unitPrice;
      if (newItem.kind === "ampas-listing") {
        finalPrice = resolveAmpasUnitPrice(newItem.ampasListingId, newItem.quantity, newItem.unitPrice);
      }
      return [...prev, { ...newItem, id, unitPrice: finalPrice } as CartItem];
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
      prev.map((item) => {
        if (item.id === id) {
          let unitPrice = item.unitPrice;
          if (item.kind === "ampas-listing") {
            unitPrice = resolveAmpasUnitPrice(item.ampasListingId, quantity, item.unitPrice);
          }
          return { ...item, quantity, unitPrice };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
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
