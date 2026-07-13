// KVKK metinleri — aydınlatma + açık rıza. consent_version her metin
// değişikliğinde artırılır; published_cvs.consent_version'a yazılır ki
// hangi adayın hangi sürüme rıza verdiği kanıtlanabilsin.
import type { Lang } from "./i18n";

export const CONSENT_VERSION = "2026-07-10";

interface LegalDict {
  publishTitle: string;
  publishIntro: string;
  clarificationTitle: string;
  clarification: string[];
  consentLabel: string;
  rightsNote: string;
  // Yayınlama akışı UI metinleri
  continueBtn: string;
  cancelBtn: string;
  emailLabel: string;
  emailPlaceholder: string;
  sendCodeBtn: string;
  codeSentNote: string;
  codeLabel: string;
  codePlaceholder: string;
  verifyPublishBtn: string;
  publishingLabel: string;
  successTitle: string;
  successBody: string;
  goToAccountBtn: string;
  errConsent: string;
  errAuth: string;
  errCode: string;
  errGeneric: string;
}

export const legal: Record<Lang, LegalDict> = {
  tr: {
    publishTitle: "CV'ni panelde yayınla",
    publishIntro:
      "CV'n, kayıtlı işe alım uzmanlarının (İK) arayıp inceleyebileceği aday panelinde yayınlanır. İletişim bilgilerin (e-posta, telefon) panelde GÖRÜNMEZ; İK yalnızca platform üzerinden sana ulaşma talebi gönderebilir.",
    clarificationTitle: "KVKK Aydınlatma Metni",
    clarification: [
      "Veri sorumlusu: CV-Ready. İşlenen veriler: CV'nde yer alan ad-soyad, unvan, özet, iş deneyimi, eğitim, yetenekler, diller ve sertifikalar.",
      "İşleme amacı: yayınladığın CV'yi kayıtlı işe alım uzmanlarına aday havuzunda göstermek ve seninle platform üzerinden iletişim kurmalarını sağlamak.",
      "İletişim bilgilerin (e-posta/telefon/link) panelde yayınlanmaz; ayrı ve korumalı biçimde yalnızca senin erişimine tutulur.",
      "Verilerin, sen geri çekene kadar yayında kalır. İstediğin an CV'ni yayından kaldırabilir veya hesabından kalıcı olarak silebilirsin.",
      "KVKK m.11 kapsamında; verilerine erişme, düzeltme, silme ve işlemeye itiraz etme haklarına sahipsin.",
    ],
    consentLabel:
      "Aydınlatma metnini okudum ve CV'min yukarıda açıklanan şekilde aday panelinde yayınlanmasına açık rıza veriyorum.",
    rightsNote:
      "Bu rızayı istediğin an geri alabilirsin: “Hesabım” sayfasından CV'ni yayından kaldır ya da kalıcı olarak sil.",
    continueBtn: "Devam et",
    cancelBtn: "Vazgeç",
    emailLabel: "E-posta adresin",
    emailPlaceholder: "ornek@eposta.com",
    sendCodeBtn: "Doğrulama kodu gönder",
    codeSentNote:
      "E-postana bir doğrulama gönderdik. Maildeki bağlantıya tıkla — bu pencere otomatik olarak devam edecek. Mailde 6 haneli kod varsa aşağıya da girebilirsin.",
    codeLabel: "Doğrulama kodu",
    codePlaceholder: "6 haneli kod",
    verifyPublishBtn: "Doğrula ve yayınla",
    publishingLabel: "Yayınlanıyor...",
    successTitle: "CV'n yayında! 🎉",
    successBody:
      "Artık kayıtlı işe alım uzmanları CV'ni aday panelinde görebilir. İletişim bilgilerin gizli kalır.",
    goToAccountBtn: "Hesabıma git",
    errConsent: "Devam etmek için açık rıza kutusunu işaretle.",
    errAuth: "Kod gönderilemedi. E-postanı kontrol edip tekrar dene.",
    errCode: "Kod doğrulanamadı. Kodu kontrol edip tekrar dene.",
    errGeneric: "Bir şeyler ters gitti. Lütfen tekrar dene.",
  },
  en: {
    publishTitle: "Publish your CV to the panel",
    publishIntro:
      "Your CV will be published in a candidate panel where registered recruiters can search and review it. Your contact details (email, phone) are NOT shown on the panel; recruiters can only send you a contact request through the platform.",
    clarificationTitle: "Data Processing Notice (KVKK)",
    clarification: [
      "Data controller: CV-Ready. Processed data: name, title, summary, work experience, education, skills, languages and certifications on your CV.",
      "Purpose: to display your published CV to registered recruiters in a candidate pool and let them contact you through the platform.",
      "Your contact details (email/phone/links) are never published on the panel; they are stored separately and protected, accessible only to you.",
      "Your data stays published until you withdraw it. You can unpublish your CV or permanently delete it from your account at any time.",
      "Under KVKK art. 11 you have the right to access, rectify, delete your data and object to its processing.",
    ],
    consentLabel:
      "I have read the notice and give my explicit consent for my CV to be published in the candidate panel as described above.",
    rightsNote:
      "You can withdraw this consent anytime: unpublish or permanently delete your CV from the “My Account” page.",
    continueBtn: "Continue",
    cancelBtn: "Cancel",
    emailLabel: "Your email address",
    emailPlaceholder: "you@example.com",
    sendCodeBtn: "Send verification code",
    codeSentNote:
      "We sent a verification email. Click the link in it — this window will continue automatically. If the email contains a 6-digit code, you can also enter it below.",
    codeLabel: "Verification code",
    codePlaceholder: "6-digit code",
    verifyPublishBtn: "Verify & publish",
    publishingLabel: "Publishing...",
    successTitle: "Your CV is live! 🎉",
    successBody:
      "Registered recruiters can now find your CV in the candidate panel. Your contact details stay private.",
    goToAccountBtn: "Go to my account",
    errConsent: "Please tick the explicit-consent box to continue.",
    errAuth: "Couldn't send the code. Check your email and try again.",
    errCode: "Couldn't verify the code. Check it and try again.",
    errGeneric: "Something went wrong. Please try again.",
  },
};
