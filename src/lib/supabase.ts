import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zlpnaezqapxtxhrawazb.supabase.co";

const supabaseAnonKey = "sb_publishable_NETRNFWA9iL7yT-_cgIKdA_lxR93KTD";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);