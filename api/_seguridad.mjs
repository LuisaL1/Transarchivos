// Ayudantes de seguridad que comparten /api/contact y /api/ticket. El guion bajo
// inicial evita que la plataforma lo trate como una función (endpoint) más.

// IP del visitante para el límite de envíos: la que añade el proxy de la plataforma
// al final de X-Forwarded-For (las que escribe el cliente van a la izquierda y
// se ignoran). TRUSTED_PROXY_HOPS = cuántos proxies de confianza hay delante.
export const clientIp = (req) => {
    const hops = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS) || 1);
    const parts = (req.headers.get("x-forwarded-for") ?? "").split(",").map((p) => p.trim()).filter(Boolean);
    return parts.at(-hops) ?? parts[0] ?? "desconocida";
};

// Un Origin ilegible (p. ej. "null" de un iframe aislado) también es ajeno.
export const foreignOrigin = (req) => {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
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

// Arranque común de un POST: solo desde el propio sitio, límite de envíos por IP
// y cuerpo JSON que sea un objeto. Devuelve { body } o { rechazo } (una Response).
export async function leerEnvio(req, limited) {
    if (foreignOrigin(req))
        return { rechazo: json({ ok: false, error: "origin" }, 403) };
    if (limited(clientIp(req)))
        return { rechazo: json({ ok: false, error: "rate" }, 429) };
    let body;
    try {
        body = await req.json();
    }
    catch {
        return { rechazo: json({ ok: false, error: "json" }, 400) };
    }
    if (body === null || typeof body !== "object" || Array.isArray(body))
        return { rechazo: json({ ok: false, error: "json" }, 400) };
    return { body };
}
