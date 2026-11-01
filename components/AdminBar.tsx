"use client";

import Link from "next/link";
import { useAdmin } from "./AdminProvider";

export default function AdminBar() {
  const { isAdmin, ready, signOut } = useAdmin();
  if (!ready) return null;

  return isAdmin ? (
    <p className="text-xs text-chalk/60">
      Logged in as admin.{" "}
      <Link href="/admin" className="underline">
        Manage league
      </Link>{" "}
      <button onClick={signOut} className="ml-2 underline">
        Log out
      </button>
    </p>
  ) : (
    <Link href="/login" className="text-xs text-chalk/35 underline">
      Admin
    </Link>
  );
}