import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public values. The publishable key is designed to be exposed in the browser;
// data is protected by Row Level Security in the database, not by hiding it.
// Env vars override these if set (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://jhmqtjkvipubhiucplgb.supabase.co";
const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_mnuCrZYg8B8PDf2uGtPF_Q_HQ7KzlA4";

export const supabaseConfigured = Boolean(url && anon);

let client: SupabaseClient | null = null;

/** Returns the browser Supabase client, or null until it is configured. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (!client) {
    client = createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}
