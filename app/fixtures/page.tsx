import { Suspense } from "react";
import MatchRow from "@/components/MatchRow";
import TeamFilter from "@/components/TeamFilter";
import { getFixtures, getTeams } from "@/lib/fixtures";

async function Fixtures({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const { team } = await searchParams;
  const [teams, fixtures] = await Promise.all([
    getTeams(),
    getFixtures(false, team),
  ]);

  return (
    <>
      <TeamFilter teams={teams} base="/fixtures" active={team} />
      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]">
        {fixtures.length === 0 ? (
          <p className="p-6 text-center text-[var(--muted)]">
            All matches have been played.
          </p>
        ) : (
          fixtures.map((f) => <MatchRow key={f.id} f={f} />)
        )}
      </div>
    </>
  );
}

export default function FixturesPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  return (
    <main>
      <h1 className="mb-3 px-1 font-display text-4xl font-extrabold">Fixtures</h1>
      <Suspense fallback={<p className="px-2 text-[var(--muted)]">Loading...</p>}>
        <Fixtures searchParams={searchParams} />
      </Suspense>
    </main>
  );
}