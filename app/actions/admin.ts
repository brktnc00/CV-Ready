"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin";

// CV'yi yayından kaldır (moderasyon — veri durur, panelde görünmez).
export async function adminWithdrawCV(id: string) {
  const { admin } = await assertAdmin();
  await admin.from("published_cvs").update({ status: "withdrawn" }).eq("id", id);
  revalidatePath("/admin/cvler");
}

// CV'yi tekrar yayına al.
export async function adminRepublishCV(id: string) {
  const { admin } = await assertAdmin();
  await admin.from("published_cvs").update({ status: "published" }).eq("id", id);
  revalidatePath("/admin/cvler");
}

// CV'yi kalıcı sil (cv_contacts + contact_requests FK cascade ile gider).
export async function adminDeleteCV(id: string) {
  const { admin } = await assertAdmin();
  await admin.from("published_cvs").delete().eq("id", id);
  revalidatePath("/admin/cvler");
}

// Kullanıcıyı kalıcı sil (auth.users → profiles/CV'ler cascade ile gider).
// Kendini silmeyi engelle.
export async function adminDeleteUser(userId: string) {
  const { admin, userId: me } = await assertAdmin();
  if (userId === me) throw new Error("Kendi hesabını silemezsin.");
  await admin.auth.admin.deleteUser(userId);
  revalidatePath("/admin/kullanicilar");
}
