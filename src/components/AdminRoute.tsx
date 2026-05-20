import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function AdminRoute({
  children,
}: any) {
  const [loading, setLoading] =
    useState(true);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    // GET USER
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // BELUM LOGIN
    if (!user) {
      window.location.href =
        "/login";

      return;
    }

    // CHECK ROLE
    const { data } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    // BUKAN ADMIN
    if (!data) {
      window.location.href = "/";
      return;
    }

    setIsAdmin(true);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

        Loading...

      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return children;
}