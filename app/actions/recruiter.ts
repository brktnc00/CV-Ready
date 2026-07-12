"use server";

import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { error: string };

// HR, bir adaya platform üzerinden temas talebi gönderir.
// Adayın iletişim bilgisi HR'a hiçbir zaman gösterilmez; HR yalnızca kendi
// dönüş bilgisini bırakır ve aday gelen kutusundan görür.
export async function sendContactRequest(
  cvId: string,
  message: string,
  recruiterContact: string,
): Promise<Result> {
  if (!message.trim() || !recruiterContact.trim()) return { error: "missing_fields" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_name")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "recruiter") return { error: "forbidden" };

  const { data: cv } = await supabase
    .from("published_cvs")
    .select("candidate_id, status")
    .eq("id", cvId)
    .single();
  if (!cv || cv.status !== "published") return { error: "not_found" };

  const { error } = await supabase.from("contact_requests").insert({
    cv_id: cvId,
    candidate_id: cv.candidate_id,
    recruiter_id: user.id,
    recruiter_company: profile.company_name,
    recruiter_contact: recruiterContact.trim(),
    message: message.trim(),
  });
  if (error) return { error: "db_error" };

  return { ok: true };
}
