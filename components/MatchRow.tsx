import type { Fixture } from "@/lib/fixtures";
import ScoreEditor from "./ScoreEditor";

export default function MatchRow({ f }: { f: Fixture }) {
  const hg = f.home_goals;
  const ag = f.away_goals;
  const played = hg !== null && ag !== null;
  const homeWon = played && hg > ag;
  const awayWon = played && ag > hg;

  const dim = "font-medium text-chalk/55";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-chalk/15 px-3 py-3 last:border-0">
      <div
        className={`flex min-w-0 items-center justify-end gap-2 ${
          awayWon ? dim : "font-bold"
        }`}
      >
        <span className="truncate">{f.home.team_name}</span>
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: f.home.color }}
        />
      </div>

      <div className="flex min-w-[4.5rem] flex-col items-center text-center">
        {played ? (
          <div className="rounded-lg bg-black/40 px-2 py-1 font-display text-2xl font-extrabold leading-none text-gold">
            {hg}
            <span className="mx-1 text-chalk/40">-</span>
            {ag}
          </div>
        ) : (
          <div className="text-sm text-chalk/50">vs</div>
        )}
        <div className="mt-0.5 text-[11px] text-chalk/45">Leg {f.leg}</div>
        <ScoreEditor f={f} />
      </div>

      <div
        className={`flex min-w-0 items-center gap-2 ${
          homeWon ? dim : "font-bold"
        }`}
      >
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: f.away.color }}
        />
        <span className="truncate">{f.away.team_name}</span>
      </div>
    </div>
  );
}