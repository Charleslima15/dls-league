import { supabase } from "./supabase";

type TeamRef = { id: number; team_name: string; color: string };

export type Fixture = {
  id: number;
  leg: number;
  home_goals: number | null;
  away_goals: number | null;
  played_at: string | null;
  home: TeamRef;
  away: TeamRef;
};

export async function getTeams() {
  const { data } = await supabase
    .from("teams")
    .select("id, team_name, color")
    .order("team_name");
  return data ?? [];
}

export async function getFixtures(played: boolean, team?: string) {
  let q = supabase
    .from("fixtures")
    .select(
      "id, leg, home_goals, away_goals, played_at, home:teams!fixtures_home_id_fkey(id, team_name, color), away:teams!fixtures_away_id_fkey(id, team_name, color)"
    );

  q = played
    ? q.not("home_goals", "is", null).order("played_at", { ascending: false })
    : q.is("home_goals", null).order("id");

  const id = Number(team);
  if (team && Number.isInteger(id)) {
    q = q.or(`home_id.eq.${id},away_id.eq.${id}`);
  }

  const { data } = await q;
  return (data ?? []) as unknown as Fixture[];
}