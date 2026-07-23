import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product, Profile } from '@/types/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserPrice(product: Partial<Product>, profile: Profile | null): number {
  if (!product) return 0;
  
  if (profile?.role === 'distributor' && product.distributor_price && product.distributor_price > 0) {
    return product.distributor_price;
  }
  
  if (profile?.role === 'dealer' && profile.dealer_status === 'approved' && product.dealer_price && product.dealer_price > 0) {
    return product.dealer_price;
  }
  
  return product.price || 0;
}

export function hasUserDiscount(product: Partial<Product>, profile: Profile | null): boolean {
  const currentPrice = getUserPrice(product, profile);
  return currentPrice < (product.price || 0);
}

export type Params = Partial<
  Record<keyof URLSearchParams, string | number | null | undefined>
>;

export function createQueryString(
  params: Params,
  searchParams: URLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}
