import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Her istekte Supabase oturumunu tazeler (çerezleri döndürür).
// Supabase yapılandırılmamışsa (anahtar yoksa) hiçbir şey yapmadan geçer,
// böylece mevcut CV builder anahtarsız da çalışmaya devam eder.
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() oturumu doğrular ve gerekirse token'ı yeniler.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Statik dosyalar ve görseller hariç tüm rotalar.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};
