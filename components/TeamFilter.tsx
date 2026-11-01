import Link from "next/link";

type Team = { id: number; team_name: string };

export default function TeamFilter({
  teams,
  base,
  active,
}: {
  teams: Team[];
  base: string;
  active?: string;
}) {
  const chip = (on: boolean) =>
    `whitespace-nowrap rounded-full border px-3 py-1 text-sm ${
      on
        ? "border-[var(--accent)] bg-[var(--accent)] font-semibold text-black"
        : "border-[var(--line)] text-[var(--muted)]"
    }`;

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto px-2 pb-1">
      <Link href={base} className={chip(!active)}>
        All
      </Link>
      {teams.map((t) => (
        <Link
          key={t.id}
          href={`${base}?team=${t.id}`}
          className={chip(active === String(t.id))}
        >
          {t.team_name}
        </Link>
      ))}
    </div>
  );
}