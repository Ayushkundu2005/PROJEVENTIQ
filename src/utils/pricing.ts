/**
 * EventIQ Pricing & Currency Utilities (India-First)
 */

export interface TicketTier {
  id: string;
  name: string;
  priceInr: number;
  availableQuantity: number;
  soldQuantity: number;
  phase: 'early_bird' | 'phase_1' | 'phase_2' | 'vip' | 'at_gate';
  gstIncluded?: boolean;
}

/**
 * Standard Indian GST rate for entertainment events (18%)
 */
export const GST_RATE = 0.18;

/**
 * Format an amount in INR (Indian Rupee, ₹) according to Indian numbering system (e.g., ₹1,50,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate base price, 18% GST, and total payable amount
 */
export function calculateTicketPriceWithGst(basePriceInr: number): {
  basePrice: number;
  gstAmount: number;
  totalPrice: number;
} {
  const base = Math.max(0, basePriceInr);
  const gstAmount = Math.round(base * GST_RATE);
  const totalPrice = base + gstAmount;
  return {
    basePrice: base,
    gstAmount,
    totalPrice,
  };
}

/**
 * Calculate dynamic price surge for a ticket tier based on sales velocity and days left
 */
export function calculateSurgeMultiplier(soldRatio: number, daysUntilEvent: number): number {
  if (soldRatio >= 0.95) return 1.5; // Final 5% tickets surge by 50%
  if (soldRatio >= 0.8) return 1.35; // 80%+ sold surge by 35%
  if (soldRatio >= 0.6 && daysUntilEvent <= 7) return 1.25; // 60%+ within final week surge 25%
  if (daysUntilEvent <= 2) return 1.2; // Last 48 hours surge 20%
  return 1.0;
}

/**
 * Calculate projected total revenue across ticket tiers
 */
export function calculateProjectedRevenue(tiers: TicketTier[]): {
  totalGrossInr: number;
  totalGstInr: number;
  totalNetInr: number;
  totalTicketsSold: number;
  totalCapacity: number;
  occupancyPercent: number;
} {
  let totalGrossInr = 0;
  let totalTicketsSold = 0;
  let totalCapacity = 0;

  for (const tier of tiers) {
    const gross = tier.soldQuantity * tier.priceInr;
    totalGrossInr += gross;
    totalTicketsSold += tier.soldQuantity;
    totalCapacity += (tier.soldQuantity + tier.availableQuantity);
  }

  const { gstAmount, basePrice } = calculateTicketPriceWithGst(totalGrossInr);
  const occupancyPercent = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;

  return {
    totalGrossInr,
    totalGstInr: gstAmount,
    totalNetInr: basePrice,
    totalTicketsSold,
    totalCapacity,
    occupancyPercent,
  };
}
