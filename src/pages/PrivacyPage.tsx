import { useState } from "react";
import { Link } from "react-router-dom";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { HEADER_SPACE, SiteHeader } from "@/components/layout/SiteHeader";
import { Bi } from "@/components/ui/Icons";
import { PHONES, WHATSAPP_LABEL } from "@/data/contact";
import { useLang } from "@/i18n";
import { usePagesUi } from "@/i18n/pages";
import { BRAND, LEGAL } from "@/seo/site";
import { analyticsEnabled, resetConsent } from "@/lib/analytics";
import { C } from "@/styles/tokens";

// Política de privacidad y tratamiento de datos personales DEL SITIO WEB
// (Ley 1581 de 2012, Decreto 1377 de 2013 compilado en el Decreto 1074 de 2015).
// Describe lo que el sitio realmente recoge. La política general de la empresa
// (clientes, empleados, documentos en custodia) es un documento aparte. Textos
// en src/i18n/pages.ts; la versión en inglés es una traducción de cortesía.
export function PrivacyPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const { privacy: u, common } = usePagesUi();
  const { lang, lp } = useLang();
  // Respuesta visible al botón de cookies (si no hay analítica configurada,
  // no hay aviso que mostrar: se explica en vez de no hacer nada).
  const [cookieMsg, setCookieMsg] = useState<"" | "banner" | "none">("");
  const changeCookies = () => { resetConsent(); setCookieMsg(analyticsEnabled ? "banner" : "none"); };
  const addr = `${BRAND.address.streetAddress}, ${BRAND.address.addressLocality}, Colombia`;
  const h2 = (t: string) => <h2 className="text-xl md:text-2xl font-bold mt-10 mb-3" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{t}</h2>;
  const link = { color: C.indigo, fontWeight: 600 } as const;
  const policies = lp("/politicas#proteccion-de-datos");
  return (
    <div className="min-h-full" style={{ background: C.cream, fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: HEADER_SPACE }} />
      <div className="px-4 py-10 md:py-14">
      {/* Documento sobre tarjeta blanca */}
      <main className="max-w-3xl mx-auto rounded-3xl bg-white px-6 py-10 md:px-12 md:py-12 text-[15px]" style={{ lineHeight: 1.75, boxShadow: "0 30px 60px -34px rgba(24,0,173,0.3)" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.muted, fontFamily: "Montserrat, sans-serif" }}>{u.kicker}</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>{u.title}</h1>
        <p className="text-sm mb-8" style={{ color: C.muted }}>{u.updated}: {lang === "es" ? LEGAL.updated : LEGAL.updatedEn}</p>
        {u.note && <p className="mb-6 rounded-xl px-4 py-3 text-sm" style={{ background: "#F7F8FF", color: C.muted }}>{u.note}</p>}

        <p>{u.intro(BRAND.legalName)}</p>

        {h2(u.h1)}
        <ul className="list-none space-y-1">
          <li><strong>{u.legalName}:</strong> {BRAND.legalName}{LEGAL.nit ? ` · NIT ${LEGAL.nit}` : ""}</li>
          <li><strong>{u.address}:</strong> {addr}</li>
          <li><strong>{u.email}:</strong> {LEGAL.privacyEmail} · <a href="#contacto" style={link}>{u.form}</a></li>
          <li><strong>{u.phones}:</strong> {PHONES.map(p => p.label).join(" · ")} · WhatsApp {WHATSAPP_LABEL}</li>
        </ul>

        {h2(u.h2)}
        <p className="mb-4">{u.noSensitive}</p>
        <div className="overflow-x-auto rounded-2xl" style={{ border: "1.5px solid #E4E6F7" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse", minWidth: 560, lineHeight: 1.5 }}>
            <thead><tr style={{ background: C.indigo, color: "#fff" }}>{u.head.map(h => <th key={h} className="text-left px-4 py-3 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>{h}</th>)}</tr></thead>
            <tbody>{u.rows.map((r, i) => <tr key={r[0]} style={{ background: i % 2 ? "#F7F8FF" : "#fff", borderTop: "1px solid #E4E6F7" }}>{r.map((c, j) => <td key={j} className="px-4 py-3 align-top" style={j === 0 ? { fontWeight: 700, color: C.indigo } : undefined}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>

        {h2(u.h3)}
        <ul className="list-disc pl-5 space-y-1.5">
          {u.storage(BRAND.legalName).map(t => <li key={t}>{t}</li>)}
        </ul>

        {h2(u.h4)}
        <p>{u.cookies}</p>
        <button type="button" onClick={changeCookies} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#fff", color: C.indigo, border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
          <Bi n="sliders" size={14} color={C.indigo} /> {u.changeCookies}
        </button>
        {cookieMsg && (
          <p role="status" className="mt-3 rounded-xl px-4 py-3 text-sm" style={{ background: cookieMsg === "banner" ? "#EAF7EE" : "#FFF6D6", color: cookieMsg === "banner" ? "#15803d" : "#8A6D00", lineHeight: 1.55 }}>
            <Bi n={cookieMsg === "banner" ? "check-circle-fill" : "info-circle-fill"} size={14} className="mr-1.5" />
            {cookieMsg === "banner" ? u.cookieBanner : u.cookieNone}
          </p>
        )}

        {h2(u.h5)}
        <p>{u.rightsIntro}</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          {u.rights.map(t => <li key={t}>{t}</li>)}
        </ul>

        {h2(u.h6)}
        <p>{u.exercise.a}<a href="#contacto?motivo=Datos+personales+%28Ley+1581%29" style={link}>{u.exercise.link}</a>{u.exercise.b}{LEGAL.privacyEmail}{u.exercise.c}<strong>{u.exercise.queries}</strong>{u.exercise.d}<strong>{u.exercise.claims}</strong>{u.exercise.e}<Link to={policies} style={link}>{u.exercise.policy}</Link>{u.exercise.f}</p>

        {h2(u.h7)}
        <p>{u.auth.a}{BRAND.legalName}{u.auth.b}<Link to={policies} style={link}>{u.auth.policy}</Link>{u.auth.c}</p>

        {h2(u.h8)}
        <p>{u.changes}</p>

        <div className="mt-12"><Link to={lp("/")} className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}><Bi n="arrow-left" size={14} color={C.indigo} /> {common.back}</Link></div>
      </main>
      </div>
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
