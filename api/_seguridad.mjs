// Ayudantes de seguridad que comparten /api/contact y /api/ticket. El guion bajo
// inicial evita que el servidor (server/server.mjs) lo trate como una función más.

// IP del visitante para el límite de envíos: la que añade el proxy del hosting
// al final de X-Forwarded-For (las que escribe el cliente van a la izquierda y
// se ignoran). TRUSTED_PROXY_HOPS = cuántos proxies de confianza hay delante;
// con 0 (sin proxy) server/server.mjs pone aquí la IP real de la conexión.
export const clientIp = (req) => {
    const hops = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS) || 1);
    const parts = (req.headers.get("x-forwarded-for") ?? "").split(",").map((p) => p.trim()).filter(Boolean);
    return parts.at(-hops) ?? parts[0] ?? "desconocida";
};

// Dominio del sitio: el proxy del hosting lo pasa en X-Forwarded-Host (Host puede
// ser la dirección interna de la app).
export const siteHost = (req) => (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(",")[0].trim();

// Un Origin ilegible (p. ej. "null" de un iframe aislado) también es ajeno.
export const foreignOrigin = (req) => {
    const origin = req.headers.get("origin");
    const host = siteHost(req);
    if (!origin || !host)
        return false;
    try {
        return new URL(origin).host !== host;
    }
    catch {
        return true;
    }
};

// Respuesta JSON sin caché.
export const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

// Registros para los logs del hosting (GoDaddy → Logs): "✓" cuando se cumplió,
// "✗" cuando falló o se rechazó. Nunca datos del visitante ni claves.
export const logger = (area) => ({
    ok: (msg) => console.log(`[${area}] ✓ ${msg}`),
    fail: (msg, ...detail) => console.error(`[${area}] ✗ ${msg}`, ...detail),
    /** Rechaza la solicitud y deja el motivo en los logs */
    reject: (error, status, why) => {
        console.warn(`[${area}] ✗ Rechazada (${error}, HTTP ${status}): ${why}`);
        return json({ ok: false, error }, status);
    },
});

// Arranque común de un POST: solo desde el propio sitio, límite de envíos por IP
// y cuerpo JSON que sea un objeto. Devuelve { body } o { rechazo } (una Response).
export async function leerEnvio(req, limited, log) {
    if (foreignOrigin(req))
        return { rechazo: log.reject("origin", 403, `origen ${req.headers.get("origin")}, sitio ${siteHost(req)}`) };
    if (limited(clientIp(req)))
        return { rechazo: log.reject("rate", 429, "demasiados envíos desde la misma IP") };
    let body;
    try {
        body = await req.json();
    }
    catch {
        return { rechazo: log.reject("json", 400, "el cuerpo no es JSON") };
    }
    if (body === null || typeof body !== "object" || Array.isArray(body))
        return { rechazo: log.reject("json", 400, "el cuerpo no es un objeto") };
    return { body };
}
