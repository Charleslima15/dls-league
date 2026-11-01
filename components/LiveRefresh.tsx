"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("league-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fixtures" },
        () => router.refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}