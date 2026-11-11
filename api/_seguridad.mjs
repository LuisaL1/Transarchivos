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
