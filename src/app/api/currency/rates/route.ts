import { NextResponse } from "next/server";

// Fallback rates relative to 1 IDR in case the API is down
const FALLBACK_RATES: Record<string, number> = {
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

export async function GET() {
  try {
    // Fetch rates from public ExchangeRate-API with revalidate cache of 12 hours (43200 seconds)
    const res = await fetch("https://open.er-api.com/v6/latest/IDR", {
      next: { revalidate: 43200 },
    });

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data = await res.json();
    if (data.result !== "success" || !data.rates) {
      throw new Error("Invalid API response format");
    }

    // Filter only supported currencies
    const supportedKeys = Object.keys(FALLBACK_RATES);
    const filteredRates: Record<string, number> = {};

    for (const key of supportedKeys) {
      if (data.rates[key] !== undefined) {
        filteredRates[key] = data.rates[key];
      } else {
        filteredRates[key] = FALLBACK_RATES[key];
      }
    }

    return NextResponse.json({
      success: true,
      base: "IDR",
      rates: filteredRates,
      updatedAt: data.time_last_update_utc || new Date().toUTCString(),
      provider: "ExchangeRate-API",
    });
  } catch (error) {
    console.error("Failed to fetch exchange rates, using fallback:", error);
    return NextResponse.json({
      success: true,
      base: "IDR",
      rates: FALLBACK_RATES,
      updatedAt: new Date().toUTCString(),
      provider: "Fallback Local System",
    });
  }
}
