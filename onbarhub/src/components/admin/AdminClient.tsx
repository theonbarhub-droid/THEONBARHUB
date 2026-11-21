"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin";

interface EventRow {
  kind: string;
  path: string | null;
  anon_id: string | null;
  user_id: string | null;
  created_at: string;
  meta: Record<string, unknown> | null;
}
interface AttemptRow {
  pct: number | null;
  mock_title: string | null;
  created_at: string;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-serif text-3xl font-semibold mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-sm text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminClient() {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [now, setNow] = useState(0);
  useEffect(() => setNow(Date.now()), []);

  const admin = isAdminEmail(user?.email);

  useEffect(() => {
    if (!admin) return;
    const sb = getSupabase();
    if (!sb) return;
    setDataLoading(true);
    Promise.all([
      sb.from("events").select("kind,path,anon_id,user_id,created_at,meta").order("created_at", { ascending: false }).limit(5000),
      sb.from("attempts").select("pct,mock_title,created_at").order("created_at", { ascending: false }).limit(2000),
    ]).then(([ev, at]) => {
      setEvents((ev.data as EventRow[]) ?? []);
      setAttempts((at.data as AttemptRow[]) ?? []);
      setDataLoading(false);
    });
  }, [admin]);

  const m = useMemo(() => {
    const since7 = now - 7 * 24 * 3600 * 1000;
    const pageViews = events.filter((e) => e.kind === "page_view");
    const pv7 = pageViews.filter((e) => new Date(e.created_at).getTime() >= since7);
    const visitors = new Set(events.map((e) => e.user_id ?? e.anon_id).filter(Boolean));
    const starts = events.filter((e) => e.kind === "exam_start").length;
    const finishes = events.filter((e) => e.kind === "exam_finish").length;
    const completion = starts ? Math.round((finishes / starts) * 100) : 0;
    const scored = attempts.filter((a) => a.pct != null);
    const avgScore = scored.length ? Math.round(scored.reduce((s, a) => s + (a.pct ?? 0), 0) / scored.length) : 0;

    const pageCounts = new Map<string, number>();
    for (const e of pageViews) {
      const p = e.path ?? "unknown";
      pageCounts.set(p, (pageCounts.get(p) ?? 0) + 1);
    }
    const topPages = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

    return { pageViews: pageViews.length, pv7: pv7.length, visitors: visitors.size, starts, finishes, completion, avgScore, attempts: attempts.length, topPages };
  }, [events, attempts, now]);

  if (loading) return <p className="text-muted">Loading...</p>;
  if (!user) return <p className="text-muted">Sign in with the admin account to view this page.</p>;
  if (!admin) return <p className="text-muted">This page is for the site owner.</p>;

  return (
    <div>
      {dataLoading && <p className="text-muted mb-4">Loading data...</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Page views" value={String(m.pageViews)} sub={`${m.pv7} in the last 7 days`} />
        <Stat label="Unique visitors" value={String(m.visitors)} />
        <Stat label="Practice attempts" value={String(m.attempts)} sub={`${m.avgScore}% average score`} />
        <Stat label="Exams started" value={String(m.starts)} />
        <Stat label="Exams finished" value={String(m.finishes)} />
        <Stat label="Completion rate" value={`${m.completion}%`} sub="finished vs started" />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Most visited pages</h2>
        {m.topPages.length === 0 ? (
          <p className="text-muted">No page views yet.</p>
        ) : (
          <div className="divide-y divide-line border-y border-line">
            {m.topPages.map(([path, n]) => (
              <div key={path} className="flex justify-between py-2.5 text-sm">
                <span className="truncate">{path}</span>
                <span className="font-semibold tabular-nums">{n}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent activity</h2>
        <div className="divide-y divide-line border-y border-line">
          {events.slice(0, 25).map((e, i) => (
            <div key={i} className="flex justify-between gap-3 py-2.5 text-sm">
              <span className="truncate">
                <span className="font-semibold">{e.kind}</span>{" "}
                <span className="text-muted">{e.path ?? ""}</span>
                {e.meta?.pct != null && <span className="text-muted"> ({String(e.meta.pct)}%)</span>}
              </span>
              <span className="text-muted shrink-0">{new Date(e.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
