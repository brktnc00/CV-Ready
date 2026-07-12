"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CONSENT_VERSION } from "@/lib/legal";
import type { TailoredCV } from "@/lib/cv-schema";

type PublishResult = { id: string } | { error: string };

// Aday CV'sini panele yayınlar. İletişim bilgisi ayrı korumalı tabloya yazılır.
export async function publishCV(cv: TailoredCV, kvkkAccepted: boolean): Promise<PublishResult> {
  if (!kvkkAccepted) return { error: "consent_required" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { contact, ...publicData } = cv;
  const skillsText = cv.skills.flatMap((s) => [s.category, ...s.items]).join(", ");

  const { data: inserted, error } = await supabase
    .from("published_cvs")
    .insert({
      candidate_id: user.id,
      status: "published",
      public_data: publicData,
      full_name: cv.fullName,
      headline: cv.headline,
      location: cv.contact.location,
      skills_text: skillsText,
      languages: cv.languages.map((l) => l.language),
      match_score: cv.match.score,
      kvkk_accepted: true,
      consent_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,
    })
    .select("id")
    .single();

  if (error || !inserted) return { error: "db_error" };

  const { error: contactErr } = await supabase.from("cv_contacts").insert({
    cv_id: inserted.id,
    candidate_id: user.id,
    contact,
  });

  // İletişim yazılamazsa yayını geri al ki maskesiz/eksik kayıt kalmasın.
  if (contactErr) {
    await supabase.from("published_cvs").delete().eq("id", inserted.id);
    return { error: "db_error" };
  }

  revalidatePath("/hesabim");
  return { id: inserted.id as string };
}

// Yayından kaldır (KVKK: geri çekme). Kayıt durur ama panelde görünmez.
export async function withdrawCV(id: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("published_cvs")
    .update({ status: "withdrawn", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: "db_error" };
  revalidatePath("/hesabim");
  return { ok: true };
}

// Tekrar yayınla.
export async function republishCV(id: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("published_cvs")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: "db_error" };
  revalidatePath("/hesabim");
  return { ok: true };
}

// Kalıcı sil (KVKK: silme hakkı). Cascade ile iletişim + talepler de silinir.
export async function deleteCV(id: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("published_cvs").delete().eq("id", id);
  if (error) return { error: "db_error" };
  revalidatePath("/hesabim");
  return { ok: true };
}
