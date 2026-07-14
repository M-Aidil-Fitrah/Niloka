"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  label: string;
  flag: string;
  fractionDigits: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  IDR: { code: "IDR", symbol: "Rp", locale: "id-ID", label: "Indonesia", flag: "🇮🇩", fractionDigits: 0 },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG", label: "Singapore", flag: "🇸🇬", fractionDigits: 2 },
  MYR: { code: "MYR", symbol: "RM", locale: "ms-MY", label: "Malaysia", flag: "🇲🇾", fractionDigits: 2 },
  THB: { code: "THB", symbol: "฿", locale: "th-TH", label: "Thailand", flag: "🇹🇭", fractionDigits: 2 },
  PHP: { code: "PHP", symbol: "₱", locale: "en-PH", label: "Philippines", flag: "🇵🇭", fractionDigits: 2 },
  VND: { code: "VND", symbol: "₫", locale: "vi-VN", label: "Vietnam", flag: "🇻🇳", fractionDigits: 0 },
  MMK: { code: "MMK", symbol: "K", locale: "my-MM", label: "Myanmar", flag: "🇲🇲", fractionDigits: 0 },
  KHR: { code: "KHR", symbol: "៛", locale: "km-KH", label: "Cambodia", flag: "🇰🇭", fractionDigits: 0 },
  LAK: { code: "LAK", symbol: "₭", locale: "lo-LA", label: "Laos", flag: "🇱🇦", fractionDigits: 0 },
  BND: { code: "BND", symbol: "B$", locale: "ms-BN", label: "Brunei", flag: "🇧🇳", fractionDigits: 2 },
  USD: { code: "USD", symbol: "$", locale: "en-US", label: "United States", flag: "🇺🇸", fractionDigits: 2 },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE", label: "Eurozone", flag: "🇪🇺", fractionDigits: 2 },
  JPY: { code: "JPY", symbol: "¥", locale: "ja-JP", label: "Japan", flag: "🇯🇵", fractionDigits: 0 },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", label: "United Kingdom", flag: "🇬🇧", fractionDigits: 2 },
  AUD: { code: "AUD", symbol: "A$", locale: "en-AU", label: "Australia", flag: "🇦🇺", fractionDigits: 2 },
  CNY: { code: "CNY", symbol: "¥", locale: "zh-CN", label: "China", flag: "🇨🇳", fractionDigits: 2 },
  KRW: { code: "KRW", symbol: "₩", locale: "ko-KR", label: "South Korea", flag: "🇰🇷", fractionDigits: 0 },
  CHF: { code: "CHF", symbol: "CHF", locale: "fr-CH", label: "Switzerland", flag: "🇨🇭", fractionDigits: 2 },
  INR: { code: "INR", symbol: "₹", locale: "en-IN", label: "India", flag: "🇮🇳", fractionDigits: 2 },
};

// Initial default rates (approximate fallback)
const DEFAULT_RATES: Record<string, number> = {
  IDR: 1.0,
  USD: 0.000062,
  EUR: 0.000057,
  SGD: 0.000084,
  MYR: 0.00029,
  THB: 0.0022,
  PHP: 0.0036,
  VND: 1.58,
  MMK: 0.13,
  KHR: 0.25,
  LAK: 1.34,
  BND: 0.000084,
  JPY: 0.0097,
  GBP: 0.000049,
  AUD: 0.000093,
  CNY: 0.00045,
  KRW: 0.086,
  CHF: 0.000055,
  INR: 0.0052,
};

interface CurrencyContextType {
  currentCurrency: string;
  setCurrency: (code: string) => void;
  rates: Record<string, number>;
  config: CurrencyConfig;
  formatPrice: (amountInIDR: number) => string;
  convertPrice: (amountInIDR: number) => { amount: number; formatted: string };
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrencyState] = useState<string>("IDR");
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load selected currency on client side
  useEffect(() => {
    const savedCurrency = localStorage.getItem("niloka_currency");
    if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
      setCurrentCurrencyState(savedCurrency);
      document.cookie = `niloka_currency=${savedCurrency}; path=/; max-age=31536000; SameSite=Lax`;
    }

    const fetchRates = async () => {
      try {
        const res = await fetch("/api/currency/rates");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.rates) {
            setRates(data.rates);
          }
        }
      } catch (error) {
        console.error("Failed to load currency rates dynamically:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  const setCurrency = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrentCurrencyState(code);
      localStorage.setItem("niloka_currency", code);
      // Set cookie so Server Components can read the preferred currency if needed
      document.cookie = `niloka_currency=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const activeConfig = SUPPORTED_CURRENCIES[currentCurrency] || SUPPORTED_CURRENCIES.IDR;

  const convertPrice = (amountInIDR: number) => {
    const rate = rates[currentCurrency] ?? DEFAULT_RATES[currentCurrency] ?? 1;
    const converted = amountInIDR * rate;
    
    // Custom rounding/formatting
    let rounded = converted;
    if (activeConfig.fractionDigits === 0) {
      rounded = Math.round(converted);
    } else {
      rounded = Math.round(converted * 100) / 100;
    }

    const formatter = new Intl.NumberFormat(activeConfig.locale, {
      style: "currency",
      currency: activeConfig.code,
      maximumFractionDigits: activeConfig.fractionDigits,
      minimumFractionDigits: activeConfig.fractionDigits,
    });

    return {
      amount: rounded,
      formatted: formatter.format(rounded),
    };
  };

  const formatPrice = (amountInIDR: number): string => {
    return convertPrice(amountInIDR).formatted;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        rates,
        config: activeConfig,
        formatPrice,
        convertPrice,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
