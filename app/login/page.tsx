"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const field =
  "w-full rounded-lg border border-chalk/20 bg-black/30 px-3 py-2.5 outline-none focus:border-gold";

// "677123456" -> "677123456@dls.app", real emails pass through
function toEmail(v: string) {
  const s = v.trim();
  return s.includes("@") ? s : `${s.replace(/\D/g, "")}@dls.app`;
}

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    const { error } = await supabase.auth.signInWithPassword({
      email: toEmail(id),
      password,
    });

    if (error) {
      setBusy(false);
      return setErr("Wrong number, email or password.");
    }

    const { data: admin } = await supabase.rpc("is_admin");
    if (admin !== true) {
      await supabase.auth.signOut();
      setBusy(false);
      return setErr("This account is not an admin.");
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-sm">
      <h1 className="mb-1 px-1 font-display text-4xl font-extrabold">
        Admin login
      </h1>
      <p className="mb-5 px-1 text-sm text-chalk/60">
        Only league admins can enter scores.
      </p>

      <form
        onSubmit={submit}
        className="flex flex-col gap-3 rounded-2xl border border-chalk/15 bg-black/25 p-4"
      >
        <label className="text-sm text-chalk/70">
          Phone number or email
          <input
            className={`${field} mt-1`}
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="text-sm text-chalk/70">
          Password
          <input
            className={`${field} mt-1`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {err && <p className="text-sm text-redcard">{err}</p>}

        <button
          disabled={busy}
          className="rounded-full bg-gold py-2.5 font-semibold text-black disabled:opacity-60"
        >
          {busy ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}