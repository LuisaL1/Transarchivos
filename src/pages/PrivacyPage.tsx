import { useState } from "react";
import { Link } from "react-router-dom";
import { ChatBot } from "@/components/chat/ChatBot";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Bi } from "@/components/ui/Icons";
import { PHONES, WHATSAPP_LABEL } from "@/data/contact";
import { BRAND, LEGAL } from "@/seo/site";
import { resetConsent } from "@/lib/analytics";

// Política de privacidad y tratamiento de datos personales DEL SITIO WEB
// (Ley 1581 de 2012, Decreto 1377 de 2013 compilado en el Decreto 1074 de 2015).
// Describe lo que el sitio realmente recoge. La política general de la empresa
// (clientes, empleados, documentos en custodia) es un documento aparte.
export function PrivacyPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const addr = `${BRAND.address.streetAddress}, ${BRAND.address.addressLocality}, Colombia`;
  const h2 = (t: string) => <h2 className="text-xl md:text-2xl font-bold mt-10 mb-3" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{t}</h2>;
  const rows: [string, string, string][] = [
    ["Cotizador del sitio", "Nombre, cargo, empresa, sector económico, correo electrónico, teléfono y la información de su archivo (volumen, ubicación, urgencia, requerimientos)", "Preparar y enviar la cotización, contactarle para aclarar el alcance y hacer seguimiento comercial a su solicitud"],
    ["Chat con Joel (asesor virtual)", "Nombre, empresa y lo que usted escriba en el chat", "Orientarle y armar la solicitud de cotización que usted decida enviar"],
    ["WhatsApp, llamadas y correo", "Número de teléfono, correo y el contenido de su mensaje", "Atender su consulta o solicitud"],
    ["Suscripción al blog", "Correo electrónico", "Enviarle novedades y contenido sobre gestión documental; puede cancelar cuando quiera"],
    ["Google Analytics (solo si acepta las cookies)", "Datos de navegación: páginas visitadas, tiempo, dispositivo, ciudad aproximada e identificadores de cookies", "Medir y mejorar el sitio. No se usa con fines publicitarios"],
  ];
  return (
    <div className="min-h-full" style={{ background: "#FBFBF8", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: 60 }} />
      <main className="max-w-3xl mx-auto px-6 py-14 text-[15px]" style={{ lineHeight: 1.75 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#6B6B6B", fontFamily: "Montserrat, sans-serif" }}>Protección de datos personales</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>Política de privacidad y tratamiento de datos del sitio web</h1>
        <p className="text-sm mb-8" style={{ color: "#6B6B6B" }}>Última actualización: {LEGAL.updated}</p>

        <p>Esta política explica qué datos personales recoge el sitio web de {BRAND.legalName}, para qué los usa y cómo puede ejercer sus derechos, conforme a la Ley 1581 de 2012 y sus decretos reglamentarios.</p>

        {h2("1. Responsable del tratamiento")}
        <ul className="list-none space-y-1">
          <li><strong>Razón social:</strong> {BRAND.legalName}{LEGAL.nit ? ` · NIT ${LEGAL.nit}` : ""}</li>
          <li><strong>Dirección:</strong> {addr}</li>
          <li><strong>Correo:</strong> <a href={`mailto:${LEGAL.privacyEmail}`} style={{ color: "#1800AD" }}>{LEGAL.privacyEmail}</a></li>
          <li><strong>Teléfonos:</strong> {PHONES.map(p => p.label).join(" · ")} · WhatsApp {WHATSAPP_LABEL}</li>
        </ul>

        {h2("2. Datos que recogemos y para qué")}
        <p className="mb-4">El sitio no solicita datos sensibles (salud, origen étnico, orientación política, religiosa o sexual, datos biométricos) ni datos de menores de edad.</p>
        <div className="overflow-x-auto rounded-2xl" style={{ border: "1.5px solid #E4E6F7" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse", minWidth: 560, lineHeight: 1.5 }}>
            <thead><tr style={{ background: "#272B7C", color: "#fff" }}>{["Dónde", "Datos", "Finalidad"].map(h => <th key={h} className="text-left px-4 py-3 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => <tr key={r[0]} style={{ background: i % 2 ? "#F7F8FF" : "#fff", borderTop: "1px solid #E4E6F7" }}>{r.map((c, j) => <td key={j} className="px-4 py-3 align-top" style={j === 0 ? { fontWeight: 700, color: "#272B7C" } : undefined}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>

        {h2("3. Cómo se transmiten y guardan")}
        <ul className="list-disc pl-5 space-y-1.5">
          <li>El cotizador y el chat no guardan sus datos en un servidor del sitio: preparan un correo que usted revisa y envía desde su propia cuenta a {LEGAL.privacyEmail}.</li>
          <li>Los mensajes por WhatsApp se rigen además por las condiciones de WhatsApp (Meta).</li>
          <li>El asesor virtual Joel guarda en su navegador (almacenamiento local) un perfil de los temas que consultó, para personalizar el saludo. Ese perfil no sale de su equipo y puede borrarlo limpiando los datos del sitio en su navegador.</li>
          <li>Conservamos los datos de las solicitudes mientras dure la relación comercial y el tiempo que exijan las normas contables y legales; después se eliminan de forma segura.</li>
        </ul>

        {h2("4. Cookies y analítica")}
        <p>El sitio usa cookies de Google Analytics 4 únicamente si usted las acepta en el aviso de cookies. Mientras no acepte, no se guardan cookies analíticas. No usamos cookies publicitarias ni compartimos datos con fines de publicidad. Google actúa como encargado del tratamiento y puede procesar los datos fuera de Colombia, con garantías de protección adecuadas.</p>
        <button type="button" onClick={resetConsent} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
          <Bi n="sliders" size={14} color="#272B7C" /> Cambiar mi decisión sobre cookies
        </button>

        {h2("5. Sus derechos")}
        <p>Como titular de los datos, usted puede en cualquier momento:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Conocer, actualizar y rectificar sus datos personales.</li>
          <li>Solicitar prueba de la autorización que otorgó.</li>
          <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
          <li>Revocar la autorización o solicitar la supresión de sus datos, cuando no exista un deber legal o contractual de conservarlos.</li>
          <li>Acceder gratuitamente a sus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.</li>
        </ul>

        {h2("6. Cómo ejercerlos")}
        <p>Escriba a <a href={`mailto:${LEGAL.privacyEmail}`} style={{ color: "#1800AD" }}>{LEGAL.privacyEmail}</a> con el asunto «Datos personales», indicando su nombre, documento de identidad, la solicitud y un medio de contacto. Responderemos las <strong>consultas</strong> en máximo 10 días hábiles y los <strong>reclamos</strong> (corrección, actualización, supresión o revocatoria) en máximo 15 días hábiles, según la Ley 1581 de 2012.</p>

        {h2("7. Autorización")}
        <p>Al marcar la casilla de autorización en el cotizador o en la suscripción, o al escribirnos por nuestros canales, usted autoriza a {BRAND.legalName} a tratar sus datos para las finalidades descritas. Esta política hace parte de la política general de tratamiento de datos personales de la empresa, que puede solicitar al mismo correo.</p>

        {h2("8. Cambios")}
        <p>Podemos actualizar esta política. Publicaremos los cambios en esta página con su fecha de actualización.</p>

        <div className="mt-12"><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}><Bi n="arrow-left" size={14} color="#272B7C" /> Volver al inicio</Link></div>
      </main>
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
