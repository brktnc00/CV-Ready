import type { CandidateCardData } from "@/components/CandidateCard";

// Panel tasarımını Supabase olmadan görebilmek için örnek adaylar (?demo=1).
const day = 86_400_000;
const ago = (d: number) => new Date(Date.now() - d * day).toISOString();

export const DEMO_CANDIDATES: CandidateCardData[] = [
  {
    id: "d1",
    full_name: "Ayşe Yılmaz",
    headline: "Kıdemli Frontend Geliştirici — React & TypeScript",
    location: "İstanbul, Türkiye",
    skills_text: "React, TypeScript, Next.js, Tailwind, Redux, Design System",
    languages: ["Türkçe", "İngilizce (C1)"],
    match_score: 87,
    created_at: ago(0),
    experience_count: 2,
  },
  {
    id: "d2",
    full_name: "Mehmet Demir",
    headline: "Ürün Yöneticisi — B2B SaaS",
    location: "Ankara, Türkiye",
    skills_text: "Product Strategy, Agile, Roadmap, Analytics, SQL, A/B Test",
    languages: ["Türkçe", "İngilizce (B2)"],
    match_score: 72,
    created_at: ago(1),
    experience_count: 3,
  },
  {
    id: "d3",
    full_name: "Zeynep Kaya",
    headline: "UX/UI Tasarımcı — Mobil & Web",
    location: "İzmir, Türkiye",
    skills_text: "Figma, Design System, Prototyping, User Research, Accessibility",
    languages: ["Türkçe", "İngilizce (C1)", "Almanca (A2)"],
    match_score: 91,
    created_at: ago(2),
    experience_count: 4,
  },
  {
    id: "d4",
    full_name: "Can Öztürk",
    headline: "Backend Geliştirici — Node.js & PostgreSQL",
    location: "İstanbul, Türkiye (Uzaktan)",
    skills_text: "Node.js, PostgreSQL, Docker, AWS, Redis, Microservices",
    languages: ["Türkçe", "İngilizce (B2)"],
    match_score: 68,
    created_at: ago(3),
    experience_count: 2,
  },
  {
    id: "d5",
    full_name: "Elif Şahin",
    headline: "Veri Analisti — Yeni Mezun",
    location: "Bursa, Türkiye",
    skills_text: "Python, SQL, Power BI, Excel, İstatistik, Pandas",
    languages: ["Türkçe", "İngilizce (B1)"],
    match_score: 54,
    created_at: ago(5),
    experience_count: 1,
  },
  {
    id: "d6",
    full_name: "Burak Aydın",
    headline: "DevOps Mühendisi — Kubernetes & CI/CD",
    location: "İstanbul, Türkiye",
    skills_text: "Kubernetes, Terraform, GitLab CI, AWS, Prometheus, Helm",
    languages: ["Türkçe", "İngilizce (C1)"],
    match_score: 79,
    created_at: ago(8),
    experience_count: 5,
  },
];
