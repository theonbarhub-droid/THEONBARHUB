"use client";

import { useEffect, useState } from "react";

// Shows "in N days", "today", or "passed" relative to the visitor's clock.
export default function Countdown({ iso, label }: { iso: string; label?: string }) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const target = new Date(`${iso}T00:00:00-05:00`).getTime();
    const now = Date.now();
    const days = Math.ceil((target - now) / 86_400_000);
    if (days > 1) setText(`in ${days} days`);
    else if (days === 1) setText("tomorrow");
    else if (days === 0) setText("today");
    else setText("passed");
  }, [iso]);

  if (!text) return null;
  const passed = text === "passed";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
        passed ? "bg-wash text-muted" : "bg-brand/10 text-brand"
      }`}
    >
      {label ? `${label} ` : ""}
      {text}
    </span>
  );
}
