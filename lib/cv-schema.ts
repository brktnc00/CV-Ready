// Claude'un üreteceği yapılandırılmış CV verisi — hem TS tipleri hem JSON şeması
// tek yerden yönetilir ki API ve arayüz senkron kalsın.

export interface TailoredCV {
  fullName: string;
  headline: string; // İlana göre uyarlanmış unvan/başlık
  summary: string; // İlana göre yazılmış profesyonel özet
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  skills: { category: string; items: string[] }[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location: string;
    bullets: string[]; // İlanın anahtar kelimelerine göre yeniden yazılmış maddeler
  }[];
  education: {
    institution: string;
    degree: string;
    dates: string;
  }[];
  languages: { language: string; level: string }[];
  certifications: string[];
  match: {
    score: number; // 0-100 arası ATS eşleşme skoru
    matchedKeywords: string[]; // İlanla eşleşen anahtar kelimeler
    improvements: string[]; // Adaya kısa tavsiyeler
  };
}

// output_config.format için JSON şeması (structured outputs kuralları:
// her nesnede additionalProperties: false + required zorunlu)
export const CV_JSON_SCHEMA = {
  type: "object",
  properties: {
    fullName: { type: "string" },
    headline: { type: "string" },
    summary: { type: "string" },
    contact: {
      type: "object",
      properties: {
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" },
        website: { type: "string" },
      },
      required: ["email", "phone", "location", "linkedin", "website"],
      additionalProperties: false,
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["category", "items"],
        additionalProperties: false,
      },
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          location: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["company", "role", "startDate", "endDate", "location", "bullets"],
        additionalProperties: false,
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          dates: { type: "string" },
        },
        required: ["institution", "degree", "dates"],
        additionalProperties: false,
      },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          language: { type: "string" },
          level: { type: "string" },
        },
        required: ["language", "level"],
        additionalProperties: false,
      },
    },
    certifications: { type: "array", items: { type: "string" } },
    match: {
      type: "object",
      properties: {
        score: { type: "integer" },
        matchedKeywords: { type: "array", items: { type: "string" } },
        improvements: { type: "array", items: { type: "string" } },
      },
      required: ["score", "matchedKeywords", "improvements"],
      additionalProperties: false,
    },
  },
  required: [
    "fullName",
    "headline",
    "summary",
    "contact",
    "skills",
    "experience",
    "education",
    "languages",
    "certifications",
    "match",
  ],
  additionalProperties: false,
} as const;
