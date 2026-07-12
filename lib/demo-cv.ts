import type { TailoredCV } from "./cv-schema";

// ?demo=1 ile açılan demo modu için örnek çıktı — API harcamadan
// animasyonu ve sonuç ekranını göstermek (satış demoları) için kullanılır.
export const DEMO_CV: TailoredCV = {
  fullName: "Ayşe Yılmaz",
  headline: "Kıdemli Frontend Geliştirici — React & TypeScript Uzmanı",
  summary:
    "6+ yıllık deneyime sahip, React ve TypeScript ile ölçeklenebilir web uygulamaları geliştiren frontend uzmanı. E-ticaret platformlarında sayfa yükleme sürelerini %45 azaltan performans optimizasyonları gerçekleştirdi. Tasarım sistemleri kurma ve genç geliştiricilere mentorluk yapma konusunda kanıtlanmış başarı.",
  contact: {
    email: "ayse.yilmaz@ornek.com",
    phone: "+90 555 123 45 67",
    location: "İstanbul, Türkiye",
    linkedin: "linkedin.com/in/ayseyilmaz",
    website: "",
  },
  skills: [
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux"] },
    { category: "Araçlar", items: ["Git", "Webpack", "Vite", "Jest", "Cypress"] },
    { category: "Yöntemler", items: ["Agile/Scrum", "CI/CD", "Code Review", "TDD"] },
  ],
  experience: [
    {
      company: "TeknoMarket",
      role: "Kıdemli Frontend Geliştirici",
      startDate: "2021",
      endDate: "Devam ediyor",
      location: "İstanbul",
      bullets: [
        "React ve TypeScript ile aylık 2M+ ziyaretçili e-ticaret platformunu yeniden yapılandırarak sayfa yükleme süresini %45 azalttı",
        "12 kişilik ekip için ortak bileşen kütüphanesi (design system) kurarak geliştirme hızını %30 artırdı",
        "3 genç geliştiriciye mentorluk yaparak ekibin kod kalitesi metriklerini iyileştirdi",
      ],
    },
    {
      company: "Yazılım A.Ş.",
      role: "Frontend Geliştirici",
      startDate: "2018",
      endDate: "2021",
      location: "Ankara",
      bullets: [
        "SaaS ürününün arayüzünü React ile sıfırdan geliştirdi, kullanıcı memnuniyeti skorunu 3.8'den 4.6'ya taşıdı",
        "REST API entegrasyonları ve state yönetimi mimarisini kurdu",
      ],
    },
  ],
  education: [
    {
      institution: "Orta Doğu Teknik Üniversitesi",
      degree: "Bilgisayar Mühendisliği, Lisans",
      dates: "2014 – 2018",
    },
  ],
  languages: [
    { language: "Türkçe", level: "Ana dil" },
    { language: "İngilizce", level: "C1 — İleri" },
  ],
  certifications: ["AWS Certified Cloud Practitioner"],
  match: {
    score: 87,
    matchedKeywords: [
      "React",
      "TypeScript",
      "Next.js",
      "Design System",
      "Performans Optimizasyonu",
      "Mentorluk",
      "Agile",
      "CI/CD",
    ],
    improvements: [
      "İlanda geçen GraphQL deneyimini güçlendirmek için küçük bir proje ekleyin",
      "React Native bilgisi ilanda 'artı' olarak geçiyor — temel seviyede öğrenmeye değer",
      "Liderlik deneyiminizi LinkedIn profilinizde daha görünür yapın",
    ],
  },
};
