"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "./AdminProvider";
import Sheet from "./Sheet";
import type { Fixture } from "@/lib/fixtures";

const input =
  "w-full rounded-lg border border-chalk/20 bg-black/30 py-2 text-center font-display text-4xl font-extrabold outline-none focus:border-gold";

export default function ScoreEditor({ f }: { f: Fixture }) {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const played = f.home_goals !== null;

  const [open, setOpen] = useState(false);
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!isAdmin) return null;

  function openSheet() {
    setHome(f.home_goals?.toString() ?? "");
    setAway(f.away_goals?.toString() ?? "");
    setErr("");
    setOpen(true);
  }

  async function save(clear = false) {
    const h = clear ? null : parseInt(home, 10);
    const a = clear ? null : parseInt(away, 10);

    if (!clear && (!Number.isInteger(h) || !Number.isInteger(a) || h! < 0 || a! < 0)) {
      setErr("Enter both scores as whole numbers.");
      return;
    }

    setBusy(true);
    setErr("");
    const { data, error } = await supabase
      .from("fixtures")
      .update({ home_goals: h, away_goals: a })
      .eq("id", f.id)
      .select();
    setBusy(false);

    if (error) return setErr(error.message);
    if (!data?.length) return setErr("Not allowed. Log in again as admin.");

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={openSheet}
        className="mt-1 rounded-full border border-gold/60 px-2.5 py-0.5 text-xs font-semibold text-gold"
      >
        {played ? "Edit" : "Add score"}
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={`${f.home.team_name} vs ${f.away.team_name}`}
      >
        <div className="grid grid-cols-2 gap-3">
          <label className="min-w-0 text-sm text-chalk/70">
            <span className="mb-1 block truncate">{f.home.team_name}</span>
            <input
              className={input}
              type="number"
              min={0}
              inputMode="numeric"
              value={home}
              onChange={(e) => setHome(e.target.value)}
              autoFocus
            />
          </label>
          <label className="min-w-0 text-sm text-chalk/70">
            <span className="mb-1 block truncate">{f.away.team_name}</span>
            <input
              className={input}
              type="number"
              min={0}
              inputMode="numeric"
              value={away}
              onChange={(e) => setAway(e.target.value)}
            />
          </label>
        </div>

        {err && <p className="mt-3 text-sm text-redcard">{err}</p>}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => save()}
            disabled={busy}
            className="rounded-full bg-gold px-5 py-2 font-semibold text-black disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save score"}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="px-2 py-2 text-chalk/70"
          >
            Cancel
          </button>
          {played && (
            <button
              onClick={() => save(true)}
              disabled={busy}
              className="ml-auto px-2 py-2 text-sm text-redcard"
            >
              Reset to unplayed
            </button>
          )}
        </div>
      </Sheet>
    </>
  );
}