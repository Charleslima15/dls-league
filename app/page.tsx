import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import StandingsBoard, { type Row } from "@/components/StandingsBoard";
import Champion from "@/components/Champion";

async function Board() {
  const [standings, results] = await Promise.all([
    supabase.from("standings").select("*"),
    supabase
      .from("team_results")
      .select("team_id, result, played_at")
      .order("played_at", { ascending: false }),
  ]);

  if (standings.error || !standings.data) {
    return <p className="p-4 text-redcard">Could not load the table.</p>;
  }

  const rows = standings.data as Row[];

  const form: Record<number, string[]> = {};
  for (const r of results.data ?? []) {
    const list = (form[r.team_id] ??= []);
    if (list.length < 5) list.push(r.result);
  }

  const played = Math.round(rows.reduce((s, t) => s + t.p, 0) / 2);
  const total = rows.length * (rows.length - 1);
  const pct = total ? Math.round((played / total) * 100) : 0;

  const finished = total > 0 && played === total;
  const [first, second] = rows;
  const tied =
    !!second &&
    first.pts === second.pts &&
    first.gd === second.gd &&
    first.gf === second.gf;

  return (
    <>
      {finished && !tied && (
        <Champion
          team={first.team_name}
          player={first.player_name}
          color={first.color}
          pts={first.pts}
          p={first.p}
          gd={first.gd}
        />
      )}

      {finished && tied && (
        <p className="mb-5 px-1 text-sm text-gold">
          All matches are played, but the top two teams are level on points,
          goal difference and goals scored.
        </p>
      )}

      {!finished && (
        <div className="mb-5 px-1">
          <div className="mb-1.5 flex justify-between text-sm text-chalk/70">
            <span>
              {played} of {total} matches played
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-chalk/15">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <StandingsBoard rows={rows} form={form} />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <h1 className="mb-3 px-1 font-display text-4xl font-extrabold">
        Standings
      </h1>
      <Suspense
        fallback={<p className="px-1 text-chalk/60">Loading table...</p>}
      >
        <Board />
      </Suspense>
    </main>
  );
}