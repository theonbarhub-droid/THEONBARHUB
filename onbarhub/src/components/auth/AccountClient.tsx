"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import AuthForm from "./AuthForm";
import { getSupabase } from "@/lib/supabase";
import { formatClock, type AnswerChange } from "@/lib/exam";
import { getMock } from "@/data/mocks";
import AttemptAnalysis from "@/components/exam/AttemptAnalysis";

interface AttemptDetail {
  answers?: Record<string, number>;
  times?: Record<string, number>;
  flags?: Record<string, boolean>;
  changes?: AnswerChange[];
}

interface AttemptRow {
  id: string;
  mock_id: string | null;
  mock_title: string | null;
  pct: number | null;
  total_time_sec: number | null;
  created_at: string;
  detail: AttemptDetail | null;
}

export default function AccountClient() {
  const { user, loading, signOut } = useAuth();
  const [rows, setRows] = useState<AttemptRow[]>([]);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    setRowsLoading(true);
    sb.from("attempts")
      .select("id,mock_id,mock_title,pct,total_time_sec,created_at,detail")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setRows((data as AttemptRow[]) ?? []);
        setRowsLoading(false);
      });
  }, [user]);

  const progress = useMemo(() => {
    const scored = [...rows]
      .filter((r) => r.pct != null)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    if (scored.length < 2) return null;
    const pts = scored.map((r) => r.pct as number);
    const best = Math.max(...pts);
    const first = pts[0];
    const latest = pts[pts.length - 1];
    return { pts, best, first, latest, change: latest - first };
  }, [rows]);

  if (loading) return <p className="text-muted">Loading...</p>;

  if (!user) {
    return (
      <div>
        <p className="text-muted mb-6 max-w-md">
          Create a free account to save your practice attempts and track your progress across every device.
        </p>
        <AuthForm />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-muted">
          Signed in as <strong className="text-ink">{user.email}</strong>
        </p>
        <button onClick={signOut} className="rounded-md border border-line px-4 py-2 text-sm font-semibold">
          Sign out
        </button>
      </div>

      {progress && (
        <section className="mt-8 rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Your progress</h2>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <Sparkline points={progress.pts} />
            <dl className="grid grid-cols-3 gap-5 text-center sm:text-right">
              <div>
                <dt className="text-xs text-muted">Latest</dt>
                <dd className="font-serif text-2xl font-semibold tabular-nums">{progress.latest}%</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Best</dt>
                <dd className="font-serif text-2xl font-semibold tabular-nums">{progress.best}%</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Change</dt>
                <dd className={`font-serif text-2xl font-semibold tabular-nums ${progress.change >= 0 ? "text-brand" : "text-accent"}`}>
                  {progress.change >= 0 ? "+" : ""}
                  {progress.change}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-lg font-semibold">Your attempts</h2>
          <Link href="/tools/practice-exam" className="text-sm">
            New practice
          </Link>
        </div>
        {rowsLoading ? (
          <p className="text-muted mt-3">Loading your attempts...</p>
        ) : rows.length === 0 ? (
          <p className="text-muted mt-3">
            No attempts yet. <Link href="/tools/practice-exam">Take a practice exam</Link> and it will show up here.
          </p>
        ) : (
          <div className="mt-3 grid gap-2">
            {rows.map((r) => {
              const open = openId === r.id;
              const mock = r.mock_id ? getMock(r.mock_id) : undefined;
              const canOpen = Boolean(mock && r.detail?.answers);
              return (
                <div key={r.id} className="rounded-lg border border-line overflow-hidden">
                  <button
                    onClick={() => canOpen && setOpenId(open ? null : r.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left ${canOpen ? "hover:bg-wash" : "cursor-default"}`}
                  >
                    <span className="truncate flex items-center gap-2">
                      {canOpen && <span className="text-muted">{open ? "▾" : "▸"}</span>}
                      {r.mock_title ?? "Practice"}
                    </span>
                    <span className="flex items-center gap-4 shrink-0">
                      <span className="text-muted">{new Date(r.created_at).toLocaleDateString()}</span>
                      {r.total_time_sec != null && <span className="text-muted">{formatClock(r.total_time_sec)}</span>}
                      <span className="font-bold tabular-nums">{r.pct ?? 0}%</span>
                    </span>
                  </button>
                  {open && mock && r.detail?.answers && (
                    <div className="border-t border-line p-4 bg-paper">
                      <AttemptAnalysis
                        mock={mock}
                        answers={r.detail.answers}
                        times={r.detail.times ?? {}}
                        changes={r.detail.changes ?? []}
                        flags={r.detail.flags ?? {}}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const W = 300;
  const H = 64;
  const n = points.length;
  const coords = points.map((p, i) => {
    const x = n === 1 ? W / 2 : (i / (n - 1)) * (W - 8) + 4;
    const y = H - 6 - (Math.max(0, Math.min(100, p)) / 100) * (H - 12);
    return [x, y] as const;
  });
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none" role="img" aria-label="Score over time">
      <line x1="4" y1={H - 6} x2={W - 4} y2={H - 6} stroke="var(--line)" strokeWidth="1" />
      <path d={path} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--brand)" />
      ))}
    </svg>
  );
}
