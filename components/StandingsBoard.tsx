"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import TeamEditor from "./TeamEditor";

export type Row = {
  id: number;
  team_name: string;
  player_name: string;
  color: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
};

const GRID =
  "grid items-center gap-x-1 grid-cols-[2.25rem_1fr_2rem_2.75rem_3rem] sm:grid-cols-[2.25rem_1fr_repeat(6,2rem)_2.75rem_3rem]";

const FORM: Record<string, string> = {
  W: "bg-emerald-400",
  D: "bg-chalk/60",
  L: "bg-redcard",
};

// a number that rolls in when it changes (not on first load)
function Roll({ value, className }: { value: number; className?: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`inline-block ${className ?? ""}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function StandingsBoard({
  rows,
  form,
}: {
  rows: Row[];
  form: Record<number, string[]>;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`${GRID} px-3 pb-2 text-center text-xs text-chalk/60`}>
        <span />
        <span className="text-left">Team</span>
        <span>P</span>
        <span className="hidden sm:block">W</span>
        <span className="hidden sm:block">D</span>
        <span className="hidden sm:block">L</span>
        <span className="hidden sm:block">GF</span>
        <span className="hidden sm:block">GA</span>
        <span>GD</span>
        <span>Pts</span>
      </div>

      <ol className="flex flex-col gap-2">
        {rows.map((t, i) => {
          const lead = i === 0 && t.p > 0;
          return (
            <motion.li
              key={t.id}
              layout="position"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                duration: 0.4,
                layout: { type: "spring", stiffness: 380, damping: 36 },
              }}
              className={`${GRID} rounded-xl border px-3 py-2.5 text-center tabular-nums ${
                lead
                  ? "border-gold/70 bg-gold/10"
                  : "border-chalk/15 bg-black/25"
              }`}
              style={{ boxShadow: `inset 4px 0 0 ${t.color}` }}
            >
              <span
                className={`text-left font-display text-3xl font-extrabold leading-none ${
                  lead ? "text-gold" : "text-chalk/50"
                }`}
              >
                {i + 1}
              </span>

              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-semibold">{t.team_name}</span>
                  <TeamEditor team={t} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs text-chalk/60">
                    {t.player_name}
                  </span>
                  <span className="flex gap-0.5">
                    {[...(form[t.id] ?? [])].reverse().map((r, k) => (
                      <span
                        key={k}
                        className={`grid h-3.5 w-3.5 place-items-center rounded-[3px] text-[9px] font-bold text-black ${FORM[r]}`}
                      >
                        {r}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              <span>{t.p}</span>
              <span className="hidden sm:block">{t.w}</span>
              <span className="hidden sm:block">{t.d}</span>
              <span className="hidden sm:block">{t.l}</span>
              <span className="hidden sm:block">{t.gf}</span>
              <span className="hidden sm:block">{t.ga}</span>
              <span>{t.gd > 0 ? `+${t.gd}` : t.gd}</span>
              <Roll
                value={t.pts}
                className="font-display text-3xl font-extrabold text-gold"
              />
            </motion.li>
          );
        })}
      </ol>
    </MotionConfig>
  );
}