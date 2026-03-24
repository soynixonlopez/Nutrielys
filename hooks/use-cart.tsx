"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import type { CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, orderUnit: CartItem["orderUnit"]) => void;
  updateQuantity: (productId: string, orderUnit: CartItem["orderUnit"], quantity: number) => void;
  updateOrderUnit: (productId: string, fromUnit: CartItem["orderUnit"], toUnit: CartItem["orderUnit"]) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "nutrielys-cart";

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<CartItem>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.productId === "string" && typeof item.name === "string")
      .map((item) => ({
        productId: item.productId!,
        name: item.name!,
        price: Number(item.price ?? 0),
        quantity: Math.max(1, Number(item.quantity ?? 1)),
        orderUnit: item.orderUnit === "kilo" || item.orderUnit === "libra" ? item.orderUnit : "cantidad",
        imageUrl: item.imageUrl ?? null,
        slug: typeof item.slug === "string" ? item.slug : "",
      }));
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCartFromStorage());
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = Math.max(1, item.quantity ?? 1);
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId && i.orderUnit === item.orderUnit);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.productId === item.productId && i.orderUnit === item.orderUnit
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        } else {
          next = [...prev, { ...item, quantity: qty }];
        }
        saveCartToStorage(next);
        return next;
      });
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, orderUnit: CartItem["orderUnit"]) => {
      setItems((prev) => {
        const next = prev.filter((i) => !(i.productId === productId && i.orderUnit === orderUnit));
        saveCartToStorage(next);
        return next;
      });
    },
    []
  );

  const updateQuantity = useCallback((productId: string, orderUnit: CartItem["orderUnit"], quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => {
        const next = prev.filter((i) => !(i.productId === productId && i.orderUnit === orderUnit));
        saveCartToStorage(next);
        return next;
      });
      return;
    }
    setItems((prev) => {
      const next = prev.map((i) =>
        i.productId === productId && i.orderUnit === orderUnit ? { ...i, quantity } : i
      );
      saveCartToStorage(next);
      return next;
    });
  }, []);

  const updateOrderUnit = useCallback(
    (productId: string, fromUnit: CartItem["orderUnit"], toUnit: CartItem["orderUnit"]) => {
      if (fromUnit === toUnit) return;
      setItems((prev) => {
        const source = prev.find((i) => i.productId === productId && i.orderUnit === fromUnit);
        if (!source) return prev;
        const duplicate = prev.find((i) => i.productId === productId && i.orderUnit === toUnit);
        let next = prev.filter((i) => !(i.productId === productId && i.orderUnit === fromUnit));
        if (duplicate) {
          next = next.map((i) =>
            i.productId === productId && i.orderUnit === toUnit ? { ...i, quantity: i.quantity + source.quantity } : i
          );
        } else {
          next = [...next, { ...source, orderUnit: toUnit }];
        }
        saveCartToStorage(next);
        return next;
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    saveCartToStorage([]);
  }, []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateOrderUnit,
      clearCart,
      totalItems,
      totalAmount,
    }),
    [items, addItem, removeItem, updateQuantity, updateOrderUnit, clearCart, totalItems, totalAmount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
