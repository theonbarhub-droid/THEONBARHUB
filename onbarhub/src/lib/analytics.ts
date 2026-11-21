import { getSupabase } from "./supabase";

/** A stable per-browser id for anonymous visitors. */
function anonId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem("onbar_anon");
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem("onbar_anon", id);
    }
    return id;
  } catch {
    return "";
  }
}

/**
 * Record a product event. Fire-and-forget: never throws, never blocks the UI.
 * kind examples: "page_view", "exam_start", "exam_finish".
 */
export async function track(kind: string, meta?: Record<string, unknown>) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { data } = await sb.auth.getSession();
    await sb.from("events").insert({
      user_id: data.session?.user.id ?? null,
      anon_id: anonId(),
      kind,
      path: typeof window !== "undefined" ? window.location.pathname : null,
      meta: meta ?? null,
    });
  } catch {
    /* analytics must never affect the user */
  }
}
