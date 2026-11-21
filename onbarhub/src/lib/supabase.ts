import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public values. Safe to ship in client code; access is controlled by Row Level
// Security in the database, not by hiding these. Set them in Vercel as:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the two env vars are set, so UI can show auth or a "coming soon" state. */
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
