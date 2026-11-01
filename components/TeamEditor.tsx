"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "./AdminProvider";
import Sheet from "./Sheet";

type T = { id: number; team_name: string; player_name: string; color: string };

const field =
  "w-full rounded-lg border border-chalk/20 bg-black/30 px-3 py-2 outline-none focus:border-gold";

export default function TeamEditor({ team }: { team: T }) {
  const { isAdmin } = useAdmin();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!isAdmin) return null;

  function openSheet() {
    setName(team.team_name);
    setPlayer(team.player_name);
    setColor(team.color);
    setErr("");
    setOpen(true);
  }

  async function save() {
    if (!name.trim() || !player.trim()) {
      setErr("Team name and player name can't be empty.");
      return;
    }
    setBusy(true);
    setErr("");
    const { data, error } = await supabase
      .from("teams")
      .update({
        team_name: name.trim(),
        player_name: player.trim(),
        color,
      })
      .eq("id", team.id)
      .select();
    setBusy(false);

    if (error) {
      return setErr(
        error.code === "23505" ? "That team name is already taken." : error.message
      );
    }
    if (!data?.length) return setErr("Not allowed. Log in again as admin.");

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={openSheet}
        aria-label={`Edit ${team.team_name}`}
        className="shrink-0 text-chalk/50 hover:text-gold"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Edit team">
        <div className="flex flex-col gap-3">
          <label className="text-sm text-chalk/70">
            Team name
            <input className={`${field} mt-1`} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="text-sm text-chalk/70">
            Player name
            <input className={`${field} mt-1`} value={player} onChange={(e) => setPlayer(e.target.value)} />
          </label>
          <label className="flex items-center gap-3 text-sm text-chalk/70">
            Team colour
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-14 cursor-pointer rounded border border-chalk/20 bg-transparent"
            />
          </label>
        </div>

        {err && <p className="mt-3 text-sm text-redcard">{err}</p>}

        <div className="mt-5 flex gap-3">
          <button
            onClick={save}
            disabled={busy}
            className="rounded-full bg-gold px-5 py-2 font-semibold text-black disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save team"}
          </button>
          <button onClick={() => setOpen(false)} className="px-2 py-2 text-chalk/70">
            Cancel
          </button>
        </div>
      </Sheet>
    </>
  );
}