"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Ctx = { isAdmin: boolean; ready: boolean; signOut: () => Promise<void> };

const AdminCtx = createContext<Ctx>({
  isAdmin: false,
  ready: false,
  signOut: async () => {},
});

export const useAdmin = () => useContext(AdminCtx);

export default function AdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
      } else {
        const { data } = await supabase.rpc("is_admin");
        setIsAdmin(data === true);
      }
      setReady(true);
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setTimeout(check, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AdminCtx.Provider value={{ isAdmin, ready, signOut }}>
      {children}
    </AdminCtx.Provider>
  );
}