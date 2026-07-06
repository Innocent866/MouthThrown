import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for server routes (webhooks, cron). Never import from
 * client components. Returns null when not configured (demo mode).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
