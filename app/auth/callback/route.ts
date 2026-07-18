import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// E-posta bağlantısı / kod değişimi callback'i.
// Supabase iki farklı biçimde geri dönebilir:
//   - PKCE akışı        → ?code=...
//   - E-posta şablonları → ?token_hash=...&type=magiclink|signup|email|recovery
// İkisini de karşılamazsak bağlantılar sessizce hata sayfasına düşer.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (code || (tokenHash && type)) {
    const supabase = await createClient();

    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: type! });

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

    return NextResponse.redirect(
      `${origin}${errorDestination(type, next)}?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}${errorDestination(type, next)}?error=missing_token`);
}

// Aday bağlantısı işveren giriş sayfasına düşmesin.
function errorDestination(type: EmailOtpType | null, next: string | null) {
  if (next?.startsWith("/panel") || type === "signup") return "/isverenler";
  return "/olustur";
}
