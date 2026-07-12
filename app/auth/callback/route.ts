import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// E-posta bağlantısı / kod değişimi callback'i (ör. HR e-posta doğrulaması).
// Aday yayınlama akışı in-page OTP koduyla çalışır ve buraya uğramaz.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Açık bir hedef verilmişse ona git; yoksa role göre yönlendir.
      if (next) return NextResponse.redirect(`${origin}${next}`);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      let dest = "/hesabim";
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        dest = profile?.role === "recruiter" ? "/panel" : "/hesabim";
      }
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/isverenler?error=auth`);
}
