"use client";

import { MotionConfig, motion } from "motion/react";

type Props = {
  team: string;
  player: string;
  color: string;
  pts: number;
  p: number;
  gd: number;
};

const PIECES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 10) / 10,
  dur: 2.4 + ((i * 7) % 10) / 6,
  rot: ((i * 53) % 360) - 180,
  size: 6 + (i % 3) * 3,
  tone: i % 4,
}));
const TONES = ["#ffc531", "#f1efe7", "#ef5b4b", "var(--tone)"];

const draw = (delay: number) => ({
  initial: { pathLength: 0, fillOpacity: 0 },
  animate: { pathLength: 1, fillOpacity: 1 },
  transition: {
    pathLength: { delay, duration: 0.7, ease: "easeInOut" as const },
    fillOpacity: { delay: delay + 0.6, duration: 0.5 },
  },
});

export default function Champion({ team, player, color, pts, p, gd }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <section
        className="relative mb-6 overflow-hidden rounded-2xl border border-gold/70 bg-gold/10 px-5 py-8 text-center"
        style={{ ["--tone" as string]: color }}
      >
        {PIECES.map((c, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute top-0 block rounded-[2px]"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 1.6,
              background: TONES[c.tone],
            }}
            initial={{ y: -30, opacity: 0, rotate: 0 }}
            animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: c.rot }}
            transition={{ delay: 1.1 + c.delay, duration: c.dur, ease: "easeIn" }}
          />
        ))}

        <svg
          viewBox="0 0 64 64"
          width="104"
          height="104"
          className="mx-auto text-gold"
          fill="#ffc531"
          stroke="#ffc531"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <motion.path d="M20 8h24v13a12 12 0 0 1-24 0V8z" {...draw(0)} />
          <motion.path d="M20 12h-7v4a7 7 0 0 0 7 7" fill="none" {...draw(0.2)} />
          <motion.path d="M44 12h7v4a7 7 0 0 1-7 7" fill="none" {...draw(0.2)} />
          <motion.path d="M32 33v9" fill="none" {...draw(0.5)} />
          <motion.path d="M24 42h16l2 8H22l2-8z" {...draw(0.6)} />
          <motion.path d="M19 55h26" fill="none" {...draw(0.8)} />
        </svg>

        <motion.p
          className="mt-3 text-sm text-chalk/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          League champion
        </motion.p>

        <motion.h2
          className="font-display text-6xl font-extrabold leading-none text-gold"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 260, damping: 16 }}
        >
          {team}
        </motion.h2>

        <motion.div
          className="mx-auto mt-3 h-1 w-24 rounded-full"
          style={{ background: color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.7, duration: 0.5 }}
        />

        <motion.p
          className="mt-3 text-xl font-semibold"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          {player}
        </motion.p>

        <motion.p
          className="mt-1 text-sm text-chalk/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {pts} points from {p} matches, goal difference {gd > 0 ? `+${gd}` : gd}
        </motion.p>
      </section>
    </MotionConfig>
  );
}