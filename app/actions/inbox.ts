"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Aday, gelen İK temas talebini kabul eder ya da reddeder.
export async function respondToRequest(
  id: string,
  status: "accepted" | "declined",
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_requests").update({ status }).eq("id", id);
  if (error) return { error: "db_error" };
  revalidatePath("/hesabim");
  return { ok: true };
}
