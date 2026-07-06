import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

/**
 * Demo mode lets the full funnel run without Stripe/Supabase credentials
 * (local development and product demos). Never enable in production.
 */
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

export const DEMO_SESSION_ID = "demo_session";
