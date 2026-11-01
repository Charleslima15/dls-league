"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig, motion } from "motion/react";

const links = [
  { href: "/", label: "Table" },
  { href: "/results", label: "Results" },
  { href: "/fixtures", label: "Fixtures" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <MotionConfig reducedMotion="user">
      <nav className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-chalk/20 bg-black/55 p-1 backdrop-blur-md">
        {links.map((l) => {
          const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                active ? "text-black" : "text-chalk/70"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </MotionConfig>
  );
}