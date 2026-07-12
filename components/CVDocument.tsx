"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { TailoredCV } from "@/lib/cv-schema";
import type { Dict } from "@/lib/i18n";

export type TemplateId = "modern" | "classic" | "sidebar";

// Türkçe karakter desteği için Roboto (public/fonts altında)
Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.woff", fontWeight: 400 },
    { src: "/fonts/Roboto-Medium.woff", fontWeight: 500 },
    { src: "/fonts/Roboto-Bold.woff", fontWeight: 700 },
    // Klasik şablon italik kullanır — kayıtlı olmayan varyant render'ı patlatır
    { src: "/fonts/Roboto-Italic.woff", fontWeight: 400, fontStyle: "italic" },
  ],
});

const INK = "#1E1B2E";
const MUTED = "#5A5670";

interface TemplateProps {
  cv: TailoredCV;
  dict: Dict;
}

function contactLine(cv: TailoredCV): string[] {
  return [
    cv.contact.email,
    cv.contact.phone,
    cv.contact.location,
    cv.contact.linkedin,
    cv.contact.website,
  ].filter(Boolean);
}

/* ---------------------------------- MODERN ---------------------------------
   Tek kolon, mor vurgu, sol hizalı başlık. */

const ACCENT_MODERN = "#7C3AED";

// NOT: react-pdf satır yüksekliğini fontun doğal metriğiyle çarptığı için
// lineHeight hiç verilmez — Roboto doğal aralığı CV için ideal.
const m = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 9.5,
    color: INK,
    paddingVertical: 36,
    paddingHorizontal: 42,
  },
  name: { fontSize: 22, fontWeight: 700, letterSpacing: 0.3 },
  headline: {
    fontSize: 11,
    color: ACCENT_MODERN,
    fontWeight: 500,
    marginTop: 4,

  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 7,
    color: MUTED,
    fontSize: 8.5,

  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: ACCENT_MODERN,
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: ACCENT_MODERN,
    letterSpacing: 1,
    marginBottom: 5,
    marginTop: 10,

  },
  body: {},
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 7,
  },
  role: { fontWeight: 700, fontSize: 10.5 },
  company: { color: ACCENT_MODERN, fontWeight: 500 },
  dates: { color: MUTED, fontSize: 8.5 },
  bullet: { flexDirection: "row", marginTop: 2, paddingRight: 8 },
  bulletDot: { width: 10, color: ACCENT_MODERN, fontWeight: 700 },
  bulletText: { flex: 1 },
  skillRow: { flexDirection: "row", marginTop: 3 },
  skillCat: { width: 110, fontWeight: 700, fontSize: 9 },
  skillItems: { flex: 1, color: MUTED },
  eduRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  twoCol: { flexDirection: "row", gap: 24, marginTop: 2 },
  col: { flex: 1 },
});

function ModernTemplate({ cv, dict }: TemplateProps) {
  const contacts = contactLine(cv);
  return (
    <Page size="A4" style={m.page}>
      <Text style={m.name}>{cv.fullName}</Text>
      <Text style={m.headline}>{cv.headline}</Text>
      <View style={m.contactRow}>
        {contacts.map((item, i) => (
          <Text key={i}>
            {item}
            {i < contacts.length - 1 ? "  •" : ""}
          </Text>
        ))}
      </View>
      <View style={m.divider} />

      {cv.summary ? (
        <>
          <Text style={m.sectionTitle}>{dict.summaryTitle}</Text>
          <Text style={m.body}>{cv.summary}</Text>
        </>
      ) : null}

      {cv.experience.length > 0 && (
        <>
          <Text style={m.sectionTitle}>{dict.experience}</Text>
          {cv.experience.map((exp, i) => (
            <View key={i} wrap={false}>
              <View style={m.expHeader}>
                <Text style={{ maxWidth: 340 }}>
                  <Text style={m.role}>{exp.role}</Text>
                  <Text style={m.company}>  |  {exp.company}</Text>
                </Text>
                <Text style={m.dates}>
                  {exp.startDate} – {exp.endDate}
                </Text>
              </View>
              {exp.bullets.map((b, j) => (
                <View key={j} style={m.bullet}>
                  <Text style={m.bulletDot}>›</Text>
                  <Text style={m.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </>
      )}

      {cv.skills.length > 0 && (
        <>
          <Text style={m.sectionTitle}>{dict.skills}</Text>
          {cv.skills.map((group, i) => (
            <View key={i} style={m.skillRow}>
              <Text style={m.skillCat}>{group.category}</Text>
              <Text style={m.skillItems}>{group.items.join("  •  ")}</Text>
            </View>
          ))}
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <Text style={m.sectionTitle}>{dict.education}</Text>
          {cv.education.map((edu, i) => (
            <View key={i} style={m.eduRow}>
              <Text style={m.body}>
                <Text style={{ fontWeight: 700 }}>{edu.degree}</Text>
                <Text style={{ color: MUTED }}>  |  {edu.institution}</Text>
              </Text>
              <Text style={m.dates}>{edu.dates}</Text>
            </View>
          ))}
        </>
      )}

      {(cv.languages.length > 0 || cv.certifications.length > 0) && (
        <View style={m.twoCol}>
          {cv.languages.length > 0 && (
            <View style={m.col}>
              <Text style={m.sectionTitle}>{dict.langs}</Text>
              {cv.languages.map((l, i) => (
                <Text key={i} style={[m.body, { marginTop: 2 }]}>
                  <Text style={{ fontWeight: 700 }}>{l.language}</Text>
                  <Text style={{ color: MUTED }}> — {l.level}</Text>
                </Text>
              ))}
            </View>
          )}
          {cv.certifications.length > 0 && (
            <View style={m.col}>
              <Text style={m.sectionTitle}>{dict.certs}</Text>
              {cv.certifications.map((c, i) => (
                <Text key={i} style={[m.body, { marginTop: 2 }]}>
                  {c}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </Page>
  );
}

/* --------------------------------- CLASSIC ---------------------------------
   Ortalanmış başlık, siyah-beyaz, ince çizgiler — ATS dostu, muhafazakâr. */

const c = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 9.5,
    color: "#111111",
    paddingVertical: 40,
    paddingHorizontal: 48,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: 2,

  },
  headline: {
    fontSize: 10.5,
    textAlign: "center",
    marginTop: 4,
    color: "#333333",

  },
  contact: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 8.5,
    color: "#555555",

  },
  rule: { borderBottomWidth: 1, borderBottomColor: "#111111", marginVertical: 12 },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 1.5,
    marginTop: 12,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.75,
    borderBottomColor: "#999999",

  },
  body: {},
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 6,
  },
  role: { fontWeight: 700, fontSize: 10 },
  dates: { color: "#555555", fontSize: 8.5, fontStyle: "italic" },
  company: { fontStyle: "italic", color: "#333333", fontSize: 9 },
  bullet: { flexDirection: "row", marginTop: 2, paddingRight: 8 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
  eduRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  inlineList: { marginTop: 2 },
});

function ClassicTemplate({ cv, dict }: TemplateProps) {
  return (
    <Page size="A4" style={c.page}>
      <Text style={c.name}>{cv.fullName.toLocaleUpperCase(dict.locale)}</Text>
      <Text style={c.headline}>{cv.headline}</Text>
      <Text style={c.contact}>{contactLine(cv).join("   |   ")}</Text>
      <View style={c.rule} />

      {cv.summary ? (
        <>
          <Text style={c.sectionTitle}>{dict.summaryTitle}</Text>
          <Text style={c.body}>{cv.summary}</Text>
        </>
      ) : null}

      {cv.experience.length > 0 && (
        <>
          <Text style={c.sectionTitle}>{dict.experience}</Text>
          {cv.experience.map((exp, i) => (
            <View key={i} wrap={false}>
              <View style={c.expHeader}>
                <Text style={c.role}>{exp.role}</Text>
                <Text style={c.dates}>
                  {exp.startDate} – {exp.endDate}
                </Text>
              </View>
              <Text style={c.company}>
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </Text>
              {exp.bullets.map((b, j) => (
                <View key={j} style={c.bullet}>
                  <Text style={c.bulletDot}>–</Text>
                  <Text style={c.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <Text style={c.sectionTitle}>{dict.education}</Text>
          {cv.education.map((edu, i) => (
            <View key={i} style={c.eduRow}>
              <Text style={c.body}>
                <Text style={{ fontWeight: 700 }}>{edu.degree}</Text>
                <Text style={{ color: "#555555" }}>, {edu.institution}</Text>
              </Text>
              <Text style={c.dates}>{edu.dates}</Text>
            </View>
          ))}
        </>
      )}

      {cv.skills.length > 0 && (
        <>
          <Text style={c.sectionTitle}>{dict.skills}</Text>
          {cv.skills.map((g, i) => (
            <Text key={i} style={c.inlineList}>
              <Text style={{ fontWeight: 700 }}>{g.category}: </Text>
              {g.items.join(", ")}
            </Text>
          ))}
        </>
      )}

      {cv.languages.length > 0 && (
        <>
          <Text style={c.sectionTitle}>{dict.langs}</Text>
          <Text style={c.inlineList}>
            {cv.languages.map((l) => `${l.language} (${l.level})`).join(",  ")}
          </Text>
        </>
      )}

      {cv.certifications.length > 0 && (
        <>
          <Text style={c.sectionTitle}>{dict.certs}</Text>
          {cv.certifications.map((cert, i) => (
            <Text key={i} style={c.inlineList}>
              – {cert}
            </Text>
          ))}
        </>
      )}
    </Page>
  );
}

/* --------------------------------- SIDEBAR ---------------------------------
   İki kolon: koyu sol panel (iletişim, yetenek, dil), sağda içerik. */

const SIDEBAR_BG = "#1E1B2E";
const ACCENT_SIDEBAR = "#2DD4A8";

const s = StyleSheet.create({
  page: { fontFamily: "Roboto", fontSize: 9.5, color: INK, flexDirection: "row" },
  side: {
    width: 175,
    backgroundColor: SIDEBAR_BG,
    color: "#FFFFFF",
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  main: { flex: 1, paddingVertical: 36, paddingHorizontal: 28 },
  name: { fontSize: 20, fontWeight: 700, color: "#FFFFFF" },
  headline: {
    fontSize: 9.5,
    color: ACCENT_SIDEBAR,
    fontWeight: 500,
    marginTop: 5,

  },
  sideSection: {
    fontSize: 9,
    fontWeight: 700,
    color: ACCENT_SIDEBAR,
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 5,

  },
  sideText: { fontSize: 8.5, color: "#D8D5E6" },
  sideItem: { fontSize: 8.5, color: "#D8D5E6", marginTop: 2 },
  skillCat: { fontSize: 9, fontWeight: 700, color: "#FFFFFF", marginTop: 6 },
  mainSection: {
    fontSize: 11,
    fontWeight: 700,
    color: SIDEBAR_BG,
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1.5,
    borderBottomColor: ACCENT_SIDEBAR,

  },
  body: {},
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 7,
  },
  role: { fontWeight: 700, fontSize: 10.5 },
  company: { color: MUTED, fontSize: 9 },
  dates: { color: MUTED, fontSize: 8 },
  bullet: { flexDirection: "row", marginTop: 2, paddingRight: 4 },
  bulletDot: { width: 9, color: ACCENT_SIDEBAR, fontWeight: 700 },
  bulletText: { flex: 1 },
});

function SidebarTemplate({ cv, dict }: TemplateProps) {
  return (
    <Page size="A4" style={s.page}>
      {/* Sol panel */}
      <View style={s.side}>
        <Text style={s.name}>{cv.fullName}</Text>
        <Text style={s.headline}>{cv.headline}</Text>

        <Text style={s.sideSection}>{dict.contactTitle}</Text>
        {contactLine(cv).map((item, i) => (
          <Text key={i} style={s.sideItem}>
            {item}
          </Text>
        ))}

        {cv.skills.length > 0 && (
          <>
            <Text style={s.sideSection}>{dict.skills}</Text>
            {cv.skills.map((g, i) => (
              <View key={i}>
                <Text style={s.skillCat}>{g.category}</Text>
                <Text style={s.sideText}>{g.items.join("  •  ")}</Text>
              </View>
            ))}
          </>
        )}

        {cv.languages.length > 0 && (
          <>
            <Text style={s.sideSection}>{dict.langs}</Text>
            {cv.languages.map((l, i) => (
              <Text key={i} style={s.sideItem}>
                {l.language} — {l.level}
              </Text>
            ))}
          </>
        )}

        {cv.certifications.length > 0 && (
          <>
            <Text style={s.sideSection}>{dict.certs}</Text>
            {cv.certifications.map((cert, i) => (
              <Text key={i} style={s.sideItem}>
                {cert}
              </Text>
            ))}
          </>
        )}
      </View>

      {/* Ana içerik */}
      <View style={s.main}>
        {cv.summary ? (
          <>
            <Text style={s.mainSection}>{dict.summaryTitle}</Text>
            <Text style={s.body}>{cv.summary}</Text>
          </>
        ) : null}

        {cv.experience.length > 0 && (
          <>
            <Text style={s.mainSection}>{dict.experience}</Text>
            {cv.experience.map((exp, i) => (
              <View key={i} wrap={false}>
                <View style={s.expHeader}>
                  <Text style={s.role}>{exp.role}</Text>
                  <Text style={s.dates}>
                    {exp.startDate} – {exp.endDate}
                  </Text>
                </View>
                <Text style={s.company}>
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </Text>
                {exp.bullets.map((b, j) => (
                  <View key={j} style={s.bullet}>
                    <Text style={s.bulletDot}>›</Text>
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {cv.education.length > 0 && (
          <>
            <Text style={s.mainSection}>{dict.education}</Text>
            {cv.education.map((edu, i) => (
              <View key={i} style={{ marginTop: 4 }}>
                <Text style={s.body}>
                  <Text style={{ fontWeight: 700 }}>{edu.degree}</Text>
                </Text>
                <Text style={s.company}>
                  {edu.institution} — {edu.dates}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </Page>
  );
}

/* -------------------------------------------------------------------------- */

const TEMPLATES: Record<TemplateId, (p: TemplateProps) => React.ReactElement> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  sidebar: SidebarTemplate,
};

export default function CVDocument({
  cv,
  dict,
  template = "modern",
}: TemplateProps & { template?: TemplateId }) {
  const Template = TEMPLATES[template];
  // Bölüm başlıkları büyük harfe locale kurallarıyla çevrilir —
  // CSS/textTransform "i"yi Türkçede yanlış (I) büyütür, doğrusu İ.
  const up = (s: string) => s.toLocaleUpperCase(dict.locale);
  const dictUpper: Dict = {
    ...dict,
    summaryTitle: up(dict.summaryTitle),
    experience: up(dict.experience),
    education: up(dict.education),
    skills: up(dict.skills),
    langs: up(dict.langs),
    certs: up(dict.certs),
    contactTitle: up(dict.contactTitle),
  };
  return (
    <Document title={`${cv.fullName} - CV`} author="CV Ready">
      <Template cv={cv} dict={dictUpper} />
    </Document>
  );
}
