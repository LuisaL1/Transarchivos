# Análisis de calidad con SonarQube

El proyecto se puede analizar con **SonarQube Community** (bugs, vulnerabilidades,
puntos de seguridad, código difícil de mantener, duplicación y cobertura de
pruebas). La configuración está en `sonar-project.properties`.

## Cómo correrlo en un computador (Docker)

1. Servidor (primera vez tarda unos minutos en arrancar; queda en
   http://localhost:9000, usuario `admin` / clave `admin`, que pide cambiar):

   ```bash
   docker run -d --name sonarqube-ta -p 9000:9000 \
     -v sq-ta-data:/opt/sonarqube/data -v sq-ta-ext:/opt/sonarqube/extensions \
     sonarqube:community
   ```

2. En SonarQube: *My Account → Security → Generate Tokens* (tipo *Global
   Analysis Token*). Guardar el token; **no se sube al repositorio**.
3. Cobertura de pruebas y análisis:

   ```bash
   pnpm build && pnpm test:coverage:all
   docker run --rm -e SONAR_HOST_URL="http://host.docker.internal:9000" \
     -e SONAR_TOKEN="<su token>" -v "$(pwd):/usr/src" \
     sonarsource/sonar-scanner-cli:latest
   ```

4. Resultados en http://localhost:9000/dashboard?id=transarchivos-web. Conviene
   analizar con los cambios ya en un commit: sin eso, SonarQube avisa de que
   faltan datos de autoría (*blame*).

La extensión **SonarQube for IDE** de VS Code marca los mismos problemas
mientras se edita, sin servidor.

## Qué se analiza

- Se analizan `src/`, `api/`, `scripts/` y `server.mjs`; las pruebas van como
  código de prueba. No entran `dist/`, `public/` ni las imágenes.
- **Cobertura:** `pnpm test:coverage:all` corre las pruebas unitarias y, sobre
  `dist/`, las del servidor y el HTML generado (`tests/seo/`); SonarQube une los
  dos informes. Los recorridos de navegador (Playwright) no se instrumentan, así
  que la cobertura que muestra es la de las pruebas unitarias y de servidor,
  inferior a la real. `src/main.tsx` y `src/entry-server.tsx` (arranque, sin
  lógica) se excluyen de la cobertura.
- **Duplicación:** los archivos de contenido (`src/data`, `src/i18n`) repiten a
  propósito la misma estructura en español e inglés, por lo que no se cuentan
  como código duplicado (`sonar.cpd.exclusions`).
- El análisis de dependencias lo hace `pnpm test:deps` (`pnpm audit`).

## Primer análisis y correcciones

El primer análisis (código del 11 de noviembre de 2026) encontró 11 problemas y
0 vulnerabilidades ni puntos críticos de seguridad. Todos se corrigieron:

| Regla | Dónde | Qué era | Corrección |
| --- | --- | --- | --- |
| S8786 (retroceso de expresiones regulares) | `server.mjs`, `src/main.tsx`, `src/seo/meta.ts`, `src/i18n/index.ts` | `/\/+$/` y `[,;:.\s]+$` tardan tiempo cuadrático con entradas largas | Función `trimTrailingSlashes` y recorte con un ciclo, sin expresión regular |
| S8786 | `api/contact.mjs`, `api/ticket.mjs` | Validación de correo con expresión cuadrática: una dirección larga con muchos puntos tardaba unos 280 ms por cada 20 000 caracteres | Dominio dividido por puntos, de tiempo lineal |
| S8786 | `src/i18n/index.ts`, `ServiceFaqs.tsx` | Tramos que se solapaban (`[^?#]*(.*)`, `\s+(.*)`) | Búsqueda del primer `?`/`#` y `\s+(\S.*)` |
| S9383 (bug) | `SiteHeader.tsx` | Promesa sin manejar | Marcada con `void` |
| S7773 | `server.mjs` | `NaN` global | `Number.NaN` |

Pruebas que lo protegen: `tests/unit/rutas-y-correo.test.ts` (casos límite y de
rendimiento de las funciones cambiadas).

## Control de calidad

Se usa el control por defecto de SonarQube ("Sonar way") sobre el código
nuevo: sin problemas nuevos, duplicación menor al 3 % y cobertura del código
nuevo de al menos 80 %.
