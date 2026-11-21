"use client";

import { useEffect, useState } from "react";
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

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold text-lg">Your attempts</h2>
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
