"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/components/AdminProvider";
import Sheet from "@/components/Sheet";

type T = { id: number; team_name: string; player_name: string };
type Pending = { kind: "remove"; team: T } | { kind: "reset" } | null;

const field =
  "w-full rounded-lg border border-chalk/20 bg-black/30 px-3 py-2.5 outline-none focus:border-gold";

export default function AdminPage() {
  const { isAdmin, ready } = useAdmin();
  const router = useRouter();

  const [teams, setTeams] = useState<T[]>([]);
  const [name, setName] = useState("");
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("teams")
      .select("id, team_name, player_name")
      .order("id");
    setTeams(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (ready && !isAdmin) {
    return (
      <p className="px-1">
        Admins only.{" "}
        <Link href="/login" className="text-gold underline">
          Log in
        </Link>
      </p>
    );
  }

  async function addTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !player.trim()) {
      setMsg("Enter a team name and a player name.");
      return;
    }
    setBusy(true);
    setMsg("");
    const { error } = await supabase.rpc("add_team", {
      p_team_name: name,
      p_player_name: player,
      p_color: color,
    });
    setBusy(false);
    if (error) {
      setMsg(
        error.code === "23505" ? "That team name is already taken." : error.message
      );
      return;
    }
    setName("");
    setPlayer("");
    await load();
    router.refresh();
  }

  async function runPending() {
    if (!pending) return;
    setBusy(true);
    const { error } =
      pending.kind === "remove"
        ? await supabase.rpc("remove_team", { p_id: pending.team.id })
        : await supabase.rpc("reset_season");
    setBusy(false);
    setPending(null);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("");
    await load();
    router.refresh();
  }

  const total = teams.length * (teams.length - 1);

  return (
    <main className="mx-auto max-w-md">
      <h1 className="mb-1 px-1 font-display text-4xl font-extrabold">
        Manage league
      </h1>
      <p className="mb-5 px-1 text-sm text-chalk/60">
        {teams.length} teams, {total} matches.
      </p>

      <form
        onSubmit={addTeam}
        className="mb-6 flex flex-col gap-3 rounded-2xl border border-chalk/15 bg-black/25 p-4"
      >
        <h2 className="font-display text-xl font-bold">Add a team</h2>
        <input
          className={field}
          placeholder="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={field}
          placeholder="Player name"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
        />
        <label className="flex items-center gap-3 text-sm text-chalk/70">
          Team colour
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-14 cursor-pointer rounded border border-chalk/20 bg-transparent"
          />
        </label>
        <button
          disabled={busy}
          className="rounded-full bg-gold py-2.5 font-semibold text-black disabled:opacity-60"
        >
          {busy ? "Adding..." : "Add team"}
        </button>
        <p className="text-xs text-chalk/50">
          Its home and away matches against every other team are created
          automatically.
        </p>
      </form>

      {msg && <p className="mb-4 px-1 text-sm text-redcard">{msg}</p>}

      <div className="mb-6 rounded-2xl border border-chalk/15 bg-black/25">
        {teams.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between border-b border-chalk/15 px-4 py-3 last:border-0"
          >
            <div className="min-w-0">
              <div className="truncate font-semibold">{t.team_name}</div>
              <div className="text-xs text-chalk/60">{t.player_name}</div>
            </div>
            <button
              onClick={() => setPending({ kind: "remove", team: t })}
              className="text-sm text-redcard"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-redcard/40 p-4">
        <h2 className="font-display text-xl font-bold">New season</h2>
        <p className="mb-3 mt-1 text-sm text-chalk/60">
          Clears every score so all matches become unplayed. Teams stay.
        </p>
        <button
          onClick={() => setPending({ kind: "reset" })}
          className="rounded-full border border-redcard px-4 py-2 text-sm font-semibold text-redcard"
        >
          Start new season
        </button>
      </div>

      <Sheet
        open={pending !== null}
        onClose={() => setPending(null)}
        title={
          pending?.kind === "remove"
            ? `Remove ${pending.team.team_name}?`
            : "Start a new season?"
        }
      >
        <p className="text-sm text-chalk/70">
          {pending?.kind === "remove"
            ? "This also deletes all of their matches and results. It can't be undone."
            : "All scores are cleared and every match becomes unplayed. Screenshot the final table first. It can't be undone."}
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={runPending}
            disabled={busy}
            className="rounded-full bg-redcard px-5 py-2 font-semibold text-black disabled:opacity-60"
          >
            {busy
              ? "Working..."
              : pending?.kind === "remove"
              ? "Remove team"
              : "Clear all scores"}
          </button>
          <button
            onClick={() => setPending(null)}
            className="px-2 py-2 text-chalk/70"
          >
            Cancel
          </button>
        </div>
      </Sheet>
    </main>
  );
}