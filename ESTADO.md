# ESTADO — EA Fiber Track
Última actualización: 2026-09-10 | Sesión actual: 3

⏸️ CHECKPOINT — Sesión 3 (2026-09-10): ajustes pedidos por el usuario, todo verificado (tsc ✓ build ✓ eslint ✓) y desplegado a https://juaoses.vercel.app:
  1. Planos: marcado con LÍNEAS RECTAS (arrastre) en vez de trazo libre.
  2. Tickets 811: campos número · ubicación · fecha de inicio · fecha de expiración EDITABLE (default inicio+21) · página del plano (`plan_page`, migración 0004). Botón "Renovar" abre el portal `https://ky.itic.occinc.com/`.
  3. Fotos: se pide LUGAR de texto tras tomar la foto (`photos.location`, migración 0005) + miniatura estampa nombre de empresa + fecha completa + hora.
  4. Landing + paywall: precio ÚNICO $30/mes (fundador/planes por cuadrilla archivados). Sección nueva "Qué hace por ti" + bloque de contacto (WhatsApp +16185142665 / SMS / correo eafibertrack@gmail.com).
  Migraciones 0004 y 0005 ya ejecutadas por el usuario en Supabase.
/ Siguiente acción sugerida: **parte diario** (`production_entries`) que alimente "El día de hoy" + racha (loop Regla 6). Luego servicios externos que faltan: Stripe → Resend → dominio → Google OAuth.

## Nombre
EA Fiber Track (confirmado por el usuario 2026-08-31). Verificar dominio/handles antes de la landing.

## Qué es esta app (3 líneas máximo)
App móvil para contratistas de construcción de fibra óptica subterránea / HDD en EE. UU. con cuadrillas hispanohablantes. Centraliza: fotos con GPS, planos (PDF o fotografía) con marcado de producción diaria encima, cuadrillas, y tickets 811 (empezando por Kentucky 811) conectados a la producción. Monetización: suscripción por empresa (no por trabajador). Modelo (hard paywall vs onboarding-first) se decide en Sesión 1 con la matriz A-F del 02C.

## Promesa central
"EA Fiber Track ayuda a los contratistas de fibra subterránea con cuadrillas hispanohablantes a demostrar qué se construyó, dónde, quién y bajo qué ticket 811 — sin rastrear entre WhatsApp, fotos sueltas y papeles."

## Constitución del Producto (B3 — APROBADA 2026-08-31)
- Primera victoria (bautizada): "La Prueba de Campo" — subir plano (PDF o foto) → tocar los dos extremos de un tramo construido → foto GPS → aparece una tarjeta-prueba (tramo · pies · cuadrilla · ticket 811 · fecha · foto · ubicación) lista para enviar al cliente/utility. Mecanismo memorable = "marcar sobre el plano y que quede probado".
- Funciones MVP (en orden):
  1. Planos con marcado de producción — subir plano **PDF o fotografía**, marcar encima tramos y puntos construidos (bore, zanja, tendido de fibra, handholes) con sus pies.
  2. Fotos con GPS — sello fecha/hora/coordenadas, pegada al tramo del plano + cuadrilla + (opcional) ticket 811.
  3. Tickets 811 (Kentucky primero) — número, ubicación, fecha de excavación, vencimiento 21 días, alertas pre-vencimiento, conectado a producción y fotos del tramo.
  4. Cuadrillas — foreman, trabajadores, equipo asignado, producción del día por cuadrilla.
  - Producción diaria NO es sección aparte: se registra al marcar sobre el plano y al cerrar el parte de la cuadrilla.
- "Regla nunca":
  - Nunca reemplaza la llamada al 811 ni declara un locate "aprobado"; solo evidencia + alertas; estado oficial se verifica con el 811.
  - Nunca publica/envía nada sin permiso del usuario.
  - Nunca inventa datos ni pies de producción.
  - No hace nómina, contabilidad, facturación, CRM, inventario, licitaciones, gestión de flota. No intenta ser Procore.

## Reporte de validación (Sesión 1)
- Veredicto: EXCELENTE OPORTUNIDAD (mercado probado + brecha clara en español + hueco de 811 conectado a producción)
- Apps de referencia:
  - FiberField (fiberfield.app) — competidor casi exacto: fiber contractors "2–10 field crews", markup en PDF prints, fotos GPS, as-builts, footage tracking, offline, QC, reportes IA, factura QuickBooks. Precios por asiento: Manager $149/mo, Foreman $129/mo, Crew $49/mo. 7 días trial, 60 días garantía. SOLO INGLÉS. NO tiene módulo 811. Huella de reseñas mínima (indie/nuevo).
  - CompanyCam — $63/mo (1 user) / $129 Crew / $199 Scale, mínimo 3 usuarios; fotos GPS auto-archivadas por obra; 95% reseñas positivas (n≈99). Quejas: caro al crecer el equipo, "solo fotos, no field service completo", líos para cancelar.
  - Maptraq Field (maptraq.com) — capturar producción en el campo en teléfono/tablet, GPS de rutas, reporte diario que sincroniza; close-out reports y as-builts. Pocas reseñas.
  - 811 (categoría madura): BOSS811, KorTerra, Irth, 811spotter. 811spotter: usuarios ilimitados, se paga por ticket nuevo/renovado. Ninguno conecta 811 con producción/planos/as-builts.
  - Fieldwire: comprado por Hilti por ~$300M (nov 2021) — prueba el valor económico del "field management" de construcción.
- Lo que los usuarios odian de la competencia (nuestra oportunidad):
  1. Precio por asiento que se dispara al sumar cuadrilla (FiberField $49/peón, CompanyCam +$29/user).
  2. Herramientas de fotos que NO conectan con producción, plano ni 811 (silos).
  3. Todo en inglés — las cuadrillas que cavan son mayormente hispanohablantes.
  4. Fricción de facturación/cancelación (CompanyCam).
- Brecha "LATAM" confirmada: es brecha de IDIOMA en EE. UU., no de país. Hispanos ≈ 32% de la fuerza laboral de construcción de EE. UU. (~3.7–3.8M trabajadores, 2023-2025); TX 61%, CA 55%, AZ 49%. Ninguna app del rubro ofrece experiencia de campo "español primero".
- Dato operativo de retención: ticket de Kentucky 811 válido 21 días calendario → renovación recurrente = gancho de hábito.
- Precio de referencia del mercado: $49–199/mes por asiento (FiberField, CompanyCam); 811 por ticket. Cuña = precio por EMPRESA/capacidad, no por trabajador.

## Posicionamiento recomendado
Ganar con: (1) español de campo primero, (2) plano + producción + ticket 811 + foto GPS en UN registro operacional, (3) precio por empresa, no por peón. Referencias: FiberField (flujo y funciones núcleo; su error: solo inglés, por asiento, sin 811), CompanyCam (la magia de la foto GPS auto-archivada; su error: solo fotos, caro al crecer), Maptraq Field (captura de producción en campo + reporte diario que sincroniza).

## Dirección de Arte (COSA JUZGADA — NO cambiar sin OK explícito del usuario)
- FICHA-ARTE.md: SÍ, creada y APROBADA 2026-08-31 ("me gusta así como me mostraste"). Ver `FICHA-ARTE.md` para el detalle completo.
- ¿Referencia visual del usuario?: NO. Nombró "FiberField" pero es oscuro+cian = look de IA → NO se replica; se fusionaron los líderes de categoría (Procore/Raken/Fieldwire/CompanyCam).
- Elección: **combinación A+B+C — "Cuaderno de obra"**. Comparativas: `docs/revisiones/direcciones-abc.html` + `direccion-combinada.html` (+ .png).
- Resumen: modo CLARO primario (papel cálido `#f5f1e8` / superficie `#fdfaf3` / tinta `#241d13`) + tema OSCURO "Turno noche" incluido (`#12100c`). Acento naranja de obra `#e8590c` (color APWA de fibra) SOLO en acción + dato + tramo marcado. 2ª nota oliva `#5f7248` = "verificado". Semánticos: por-vencer `#b26a00` / vencido `#b3261e`.
- Tipografía: **Fraunces** (titulares/número héroe) + **IBM Plex Sans** (cuerpo/UI) + **IBM Plex Mono** (todas las cifras — tratamiento, no 3ª familia). Radio 18/12px.
- Dispositivos ownable: (1) esquina superior derecha recortada en la tarjeta "La Prueba de Campo" (etiqueta de obra); (2) cifra clave colgando de una regla vertical de acento que se desvanece.
- Personalidad: Robusto · Directo · Respetuoso. Motion firme (cubic-bezier .32,.72,0,1), 200ms base, 1 spring reservado a "prueba compartida".
- REGISTRO ANTI-REPETICIÓN (veto para el próximo proyecto SO): modo claro primario + acento naranja cálido `#e8590c` + par Fraunces + IBM Plex Sans/Mono + dispositivos esquina recortada / regla de dato.

## Avatar y venta (Sesión 1 — COSA JUZGADA)
- FICHA-AVATAR.md: SÍ, creada 2026-08-31. Estado **APROBADA (base)** con marca bilingüe (VoC en inglés — revalidar vocabulario español con primeros clientes). Ver `FICHA-AVATAR.md`.
- FICHA-MERCADO.md: SÍ, creada 2026-08-31. Ver `FICHA-MERCADO.md`.
- Avatar: owner/ops/PM de sub-contratista de fibra subterránea/HDD en EE. UU., 2–10 cuadrillas, cuadrilla hispanohablante, salió del campo. Dolor #1: lo culpan de daños que no hizo y no puede probar lo contrario (AGC survey: ~2/3 recibieron un claim por daño que no causaron). Deseo #1: "La Prueba de Campo" — tocar el tramo en el plano y ver pies+cuadrilla+811+foto+GPS listo para mandar. Consciencia: nivel 3–4. Sofisticación: etapa 3–4 (global/inglés) → hero por MECANISMO + IDENTIFICACIÓN.
- Inventario de prueba día-1: SIN testimonios (no hay clientes). Landing usa demo real + datos de industria con fuente + oferta Founding Customer. PROHIBIDO prueba social inventada.

## Estrategia de monetización (Sesión 1 — COSA JUZGADA)
- **Modelo: onboarding-first anónimo** (landing → preview donde sube un plano + marca un tramo + ve "La Prueba de Campo" SIN cuenta → paywall → registro/login). Justificación: el "aha" se demuestra en <2 min sin datos ni cuenta; herramienta B2B de "resultado" (no hábito de consumo → freemium/gamificación descartado); con checkout web la fricción baja si el valor ya se vio (02C).
- **Pasarela: Stripe** (tarjeta + ACH), NO Hotmart — comprador = empresa de EE. UU. que compra software; Hotmart es infoproductos LATAM.
- **Precio VIGENTE (decidido por el usuario 2026-09-10):** **precio único de $30/mo para toda la empresa** — cuadrillas y personas ilimitadas, cancela cuando quieras. "Por ahora" (arranque). Landing (`/`) y paywall (`/planes`) ya actualizados: encabezado "Un precio. Sin letra chica.", chip "Toda la empresa", 14 días gratis, sin tarjeta para probar.
- **ARCHIVADO para retomar con /precios:** planes por cuadrillas (Cuadrilla $129 / Contratista $249 / Multi-cuadrilla $449 / Empresa cotización), anual 2 meses gratis, y la oferta Founding Customer (20 empresas a $99/mo). El copy viejo quedó descrito en historial de `docs/copy/landing.md`.
- **Cuña:** cobro por EMPRESA, no por asiento (FiberField ≈ $376/mo por 1 cuadrilla de 4; nosotros ~$50/cuadrilla en el plan Contratista). Objeción #4 del avatar resuelta por diseño.
- **Trial: 14 días** · **Garantía: 30 días desde el primer cobro** (30 > 14 ✓, regla dura del 18).

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: NADA de código construido todavía. Identidad + fichas listas.
- Ruta aprobada: `/` (landing) → `/probar` (preview anónimo: sube plano → marca tramo → ve "La Prueba de Campo") → `/planes` (paywall) → `/entrar` (login/registro) → `/app`
- Landing: **copy + render aprobables** (Bloque 2) — `docs/copy/landing.md` + `docs/revisiones/landing.html`. Título: "Todo tu avance de obra de fibra, en un toque." Mecanismo: "La Prueba de Campo". Precio (2026-09-10): **único $30/mes toda la empresa** (fundador/planes por cuadrilla archivados). Sección nueva 4B "Qué hace por ti" con 2 servicios (marcación de planos+811 · respuesta a reclamos con evidencia) + bloque "Solicitar más información" con botones WhatsApp `+16185142665` / SMS / correo `eafibertrack@gmail.com` (enlaces directos, sin backend). Screenshots: `docs/revisiones/landing-planes-375.png` · `landing-servicios-375.png` · `landing-contacto-375.png`.
- Preview/onboarding + Paywall + Login: **diseño aprobable** (Bloque 3) — `docs/revisiones/funnel.html`. Preview = 3 pasos + primera victoria (marca un tramo real). Paywall = 3 páginas (recap / calendario del trial / precio). Login = Google + magic-link, al final.
- App interna: **diseño aprobable** (Bloque 4) — `docs/revisiones/app.html`. 5 secciones, 1 protagonista c/u, nav abajo, estado vacío incluido.
- Servicios externos (Supabase/Stripe/Vercel/dominio): pendiente (Bloque 5)
- ⚠️ Bloque 5 = primer bloque que necesita al usuario: cuentas Supabase/Vercel/Stripe/Resend + dominio + 3-4 claves (guiado clic por clic).
- ⚠️ Pendientes de la landing antes de "terminada" (SO): (1) construirla sobre el kit React del SO en el proyecto Next.js — el HTML de revisiones es la especificación; (2) revisor-visual /40·/20·/20 (pantalla del dinero); (3) 4 páginas legales redactadas con el archivo 47; (4) reemplazar los marcos placeholder del carrusel por capturas reales cuando exista la app (Bloque 4); (5) contador de fundador real contra la base de datos.

## Decisiones técnicas (implementación pura — decididas 2026-08-31, NO se presentan al usuario)
- **Framework:** Next.js App Router (landing + SEO + API routes + webhook Stripe + app interna) sobre el scaffold pineado del 51.
- Stack: React + TS + Tailwind v4 + shadcn/ui + Lucide + Motion + Supabase (Postgres + Auth + Storage) + Vercel.
- **Auth (26):** Supabase Auth — magic-link por email + Google OAuth. Titulares de cuenta = owner/PM/foreman. Los trabajadores de cuadrilla son NOMBRES en `crew_members`, no usuarios, en v1.
- **Modelo de datos (25) — RLS por pertenencia a empresa:** `companies` · `memberships`(user,company,role) · `projects` · `crews` · `crew_members` · `plans`(archivo en Storage + w/h + raster de página) · `plan_marks`(kind seg/pt, geometría 0..1, activity, qty, unit, crew_id, prod_id) · `photos`(Storage, lat/lng/taken_at, crew_id, activity, ticket_id) · `production_entries`(project,crew,activity,qty,unit,sta_from/to,ticket,plan_mark_id,at,date) · `tickets811`(number,location,dig_start,expiration,life_days,status_manual,project) · `ticket_attachments`. RLS en TODA tabla: `company_id IN (select company_id from memberships where user_id = (select auth.uid()))`, columna `company_id` indexada.
- **Storage:** buckets `plans` (PDF/img, ≤2MB) y `photos` (comprimidas en el dispositivo ≤1600px/~200KB antes de subir). URLs firmadas. Es el principal driver de costo → compresión cliente obligatoria.
- **Planos PDF:** pdfjs-dist en el cliente rasteriza la página a canvas; se marca encima con overlay SVG (coords normalizadas 0..1). Planos-foto van directos como imagen.
- **IA (30):** solo texto — genera resumen de as-built / close-out y "resumen del día". Modelo en env `AI_MODEL`, `max_tokens` acotado, cache de resultados idénticos, circuit-breaker de costo. NO es la primera victoria (esa es la tarjeta manual) → V1 opcional / V1.1.
- **Offline:** captura de foto/marca encola en IndexedDB y sincroniza al volver la señal (best-effort en v1; offline completo = V2).
- **Idioma UI:** BILINGÜE es/en (usuario 2026-09-10). `next-intl` v4 SIN rutas por idioma: locale desde cookie `eaft_lang` (fallback `Accept-Language`, default `es`). `i18n/request.ts` + `createNextIntlPlugin` en `next.config.ts`. `<NextIntlClientProvider>` en `app/layout.tsx` (`<html lang>` dinámico). `components/LanguageSwitcher.tsx` (chip ES/EN) + `lib/i18n-actions.ts` `setLanguage` (cookie + `user_metadata.lang` si hay sesión). Textos en `web/messages/{es,en}.json`.
  - ETAPA 1 ✅ 2026-09-10: motor + selector en header de `/app` + marco de `/app`, "Hoy", `NoProject`.
  - ETAPA 2 ✅ 2026-09-10: `/app/planos` `/app/planos/[id]` `/app/fotos` `/app/811` `/app/cuadrillas` `/app/proyectos` `/bienvenido`. `ticketStatus` se traduce en la UI (`t('status.'+status)`), no en el helper. Fechas de Fotos con `intlLocale`.
  - ETAPA 3-4 ✅ 2026-09-10: `components/site/Landing.tsx` (con `t.rich` + `RICH` tags accent/b), selector ES/EN en el header de la portada, `/probar` `/entrar` `/legal/[slug]` `components/site/ui.tsx` (TopBar). Namespaces `landing/probar/entrar/legal/ui`. Verificado a 375px ES y EN, toggle persiste (`docs/revisiones/landing-{es,en}-375.png`). **CONFIRMADO por el usuario en producción: "aprobado, quedó en inglés" (2026-09-10).**
  - PENDIENTE menor: `app/layout.tsx` `metadata` (title/description/OG) sigue hardcoded en español — traducir con `generateMetadata` + `getTranslations` si importa el SEO en inglés.
  - ⚠️ Al leer cookie en `getRequestConfig`, TODAS las rutas son dinámicas (`/ /entrar /planes /probar` ya no estáticas). Si el LCP de la landing sufre, evaluar locale por cliente solo en la landing para recuperar SSG.
  - `messages/es.json` es la fuente; `en.json` debe mantener las MISMAS claves. `CONTACT_MSG` (prefill de WhatsApp en Landing) quedó en español a propósito.
  - ⚠️ Sync entre dispositivos: la cookie manda; si un usuario entra en otro teléfono, `user_metadata.lang` no re-aplica solo (hay que tocar el selector una vez). Mejora futura: leer metadata en `proxy.ts` y setear cookie.
- Features del MVP (B3, en orden): 1) Planos PDF/foto + marcado de producción, 2) Fotos GPS, 3) Tickets 811 (Kentucky primero) conectados a producción, 4) Cuadrillas.

## Sesiones completadas ✅
- Idea + Validación — 2026-08-31 — mercado confirmado, competencia mapeada
- Constitución del Producto — 2026-08-31 — nombre EA Fiber Track, 4 funciones, primera victoria "La Prueba de Campo", regla nunca
- Identidad visual — 2026-08-31 — dirección "Cuaderno de obra" (combinación A+B+C) APROBADA · FICHA-ARTE.md
- Bloque 1 — Cliente y dinero — 2026-08-31 — FICHA-AVATAR.md + FICHA-MERCADO.md · monetización onboarding-first + Stripe · precio propuesto · arquitectura/datos/auth decididos
- Bloque 2 — Página de ventas — 2026-08-31 — `docs/copy/landing.md` + `docs/revisiones/landing.html` (10 secciones canónicas) · APROBADA por el usuario sin cambios · título "Todo tu avance de obra de fibra, en un toque"
- Bloque 3 — Primeros minutos — 2026-08-31 — `docs/revisiones/funnel.html` (/probar → /planes → /entrar) · APROBADO
- Bloque 4 — App interna (diseño) — 2026-08-31 — `docs/revisiones/app.html` · APROBADO por el usuario
- Bloque 5 — Código (5 etapas de producto COMPLETAS) — 2026-09-08 — `web/` (Next 16 scaffold + tokens + fuentes). Verificado tsc/build/eslint/dev, rutas 200:
  - landing `/` (`components/site/Landing.tsx` — reveal CSS+IO, no motion)
  - funnel: `/probar` (wizard 3 pasos + primera victoria, marcado interactivo sobre SVG) · `/planes` (paywall 3 páginas con estado) · `/entrar` (Google + magic-link, UI) · `/legal/[slug]` (stubs — se redactan con 47)
  - app interna: `/app` (Hoy — tiles+mapa+racha+actividad) · `/app/planos` (plano con marcas + estado vacío `EmptyPlanos` en código) · `/app/fotos` (grilla+filtros) · `/app/811` (tickets por color + renovar) · `/app/cuadrillas`. Shell en `app/app/layout.tsx` + `components/app/BottomNav.tsx` (usePathname). Datos: `lib/seed.ts` (proyecto Louisville KY).
- Componentes compartidos: `components/site/ui.tsx` (Btn/Progress/TopBar).

## Decisiones técnicas del código (web/)
- App en subcarpeta `web/` del repo (los docs del SO quedan en la raíz). Next 16.3.4, React 19.2.8, Tailwind v4 CSS-first (tokens en `web/app/globals.css`, `@theme inline`).
- Deps instaladas: @supabase/ssr 0.5.2 · @supabase/supabase-js 2.116 · zod 3.25 · motion 11.18 · lucide-react 0.454. (motion se dejó de usar en la landing por hydration mismatch con Next 16 → reveal por CSS + IntersectionObserver, patrón `.js-reveal [data-rv].rv-in` en globals.css; motion queda disponible para la app.)
- Layout raíz: `lang="es"`, `min-h-dvh`, fuentes `Fraunces` + `IBM_Plex_Sans` + `IBM_Plex_Mono` vía next/font (variables `--font-fraunces` etc.).
- `LayoutProps<"/">` (tipo generado de Next 16) reemplazado por tipo explícito para que `tsc` standalone pase.
- ⚠️ Pendientes de la landing en código: (1) rutas `/probar` y `/entrar` no existen aún → los CTA apuntan ahí (Next dev marca "1 Issue" por link interno roto — se resuelve al construir esas rutas y cambiar a `next/link`); (2) 4 páginas legales (`/legal/*`) con el archivo 47; (3) veredicto revisor-visual /40·/20·/20 (pantalla del dinero); (4) contador de fundador real; (5) instrumentar `landing_vista`.
- Loop de retención (Regla 6) DEFINIDO: gatillo = aviso 6 p.m. "cierra el parte" / 811 por vencer → acción = foreman marca la producción sobre el plano + cierra el parte → recompensa = "El día de hoy" se actualiza (el owner ve el avance sin llamar) + racha de días con parte → inversión = cada tramo se acumula en el plano + crece el historial de pruebas. Test "borrar historial": la app de mañana NO es idéntica ✓.

## Sesión en progreso 🔧
- (ninguna — esperando OK del usuario para Bloque 2)

## Próximas sesiones 📋
- **Bloque 2 — Página de ventas:** landing con la estructura canónica de 10 secciones del 19, copy 100% derivado de FICHA-AVATAR.md, kit de landing del SO (`plantillas-codigo/landing/`), tokens de FICHA-ARTE. Carrusel de "la app por dentro" con placeholders hasta que exista.
- Bloque 3 — Preview anónimo + paywall + login
- Bloque 4 — App interna (Planos/Fotos/811/Cuadrillas)
- Bloque 5 — Supabase + Stripe + Vercel + dominio + Resend (aquí entran los pendientes del usuario)
- Bloque 6 — Testing + pulido + rigor de entrega
- Bloque 7 — Lanzamiento + adquisición + backoffice

## Problemas conocidos ⚠️
- FICHA-AVATAR marcada "VoC sin validar en español" — el vocabulario de campo en español se revalida con los primeros clientes (regla bilingüe del 57).
- **veredicto:landing POSPUESTO** — la landing (`components/site/Landing.tsx`) fue APROBADA por el usuario en Bloque 2 (2026-08-31). Los cambios de las sesiones 3-4 (precio único $30, sección "Qué hace por ti", contacto, i18n es/en) NO alteraron composición/jerarquía/paleta — solo copy y una sección de cards con el mismo sistema. NO se corrió el subagente `revisor-visual` (operación de ~80-90k tokens; el usuario no lo pidió y la regla de la sesión dice no lanzar subagentes salvo petición explícita). Screenshots de evidencia visual sí existen: `docs/revisiones/landing-es-375.png` y `landing-en-375.png` (375px, ambos idiomas). PENDIENTE antes de "listo para vender": correr `revisor-visual` sobre la landing (screenshot 375 + ruta del código + FICHA-ARTE + FICHA-AVATAR) y guardar `docs/revisiones/landing-veredicto.md` (≥36/40 usabilidad · ≥16/20 craft · +20 copy). Igual para onboarding/`/probar`, paywall/`/planes` y pantalla principal/`/app` cuando se cierre el Bloque 6 (testing + pulido + rigor de entrega).

## Servicios externos — progreso
- [x] **GitHub** — repo `https://github.com/juaoses20-maker/juaoses` (privado). Remote `origin` configurado, `main` = HEAD local. Credenciales cacheadas en esta máquina → el agente puede `git push` directo (el usuario NO necesita GitHub Desktop). Identidad de commits: `EA Fiber Track <dev@eafibertrack.com>`. ⚠️ El usuario NO debe usar "Add file" en la web de GitHub (creó un archivo basura que ya se quitó).
- [~] **Supabase** — proyecto creado (`nzgynojypmnhuwtaplym`, región East US). `web/.env.local` con URL + PUBLISHABLE key configuradas y CONEXIÓN VERIFICADA (auth health 200, la app puede autenticar y leer/escribir con RLS).
      ⚠️ `SUPABASE_SECRET_KEY` PENDIENTE — el usuario tuvo mucha fricción de copiar/pegar (3 secret keys se filtraron al chat y hay que rotarlas). Decisión: NO bloquear en esto — la secret solo hace falta para el webhook de Stripe y scripts admin. Se retoma en el bloque de Stripe con un método mejor. `lib/env.ts` ya la trata como opcional (`serverEnv()` solo lanza si se usa).
      ⚠️ ROTAR en Supabase cuando se retome: `sb_secret_Nhzpo…`, `sb_secret_bc1kQ…` (y la publishable `sb_publishable_URqG…` opcionalmente — es pública por diseño).
      Helper local para guardar la secret sin chat: `web/_guardar-clave-script.ps1` (lee de `Escritorio\clave.txt` → escribe `.env.local`).
- [x] **Esquema BD + RLS** — `web/supabase/migrations/0001_init.sql` ejecutado en el SQL Editor de Supabase 2026-09-08 ("Success. No rows returned"). 10 tablas + `memberships` con RLS por pertenencia a empresa (`company_id in (select company_id from memberships where user_id = (select auth.uid()))`), columnas de política indexadas, triggers `updated_at`, RPC `create_company()` (SECURITY DEFINER, evita el huevo-y-gallina del INSERT), buckets Storage privados `plans`/`photos` con RLS por primer segmento del path = company_id.
- [x] **Login real (magic-link)** — 2026-09-08. `/entrar` usa `signInWithOtp` (enlace por correo) → `/auth/callback` canjea el `code` por sesión → `/app`. `/auth/signout` cierra sesión (botón en el header de la app). `/app/*` gateado en `app/app/layout.tsx` (sin sesión → `/entrar`). Botón Google llama `signInWithOAuth` best-effort (muestra "se activa pronto" si el proveedor no está configurado en Supabase).
      ⚠️ Correo del magic link: SMTP por defecto de Supabase (rate-limit ~2/hora, solo para probar). Al desplegar hay que: (a) añadir el dominio real en Supabase → Authentication → URL Configuration (Site URL + Redirect URLs con `/auth/callback`), (b) SMTP propio vía Resend.
      ⚠️ Google OAuth: pendiente configurar el proveedor en Supabase (necesita cuenta Google Cloud → OAuth client). Se hace junto con el bloque de dominio.
- [x] **Onboarding de empresa** — 2026-09-08. `lib/supabase/context.ts` `getUserContext()` → `user + companyId + role`. `/bienvenido` (form nombre + zona) llama RPC `create_company` → owner + `/app`. `/app` redirige a `/bienvenido` si el usuario no tiene membresía. Header de `/app` muestra el nombre real de la empresa. Form pre-rellenado con "Advanced Solutions" (primera empresa del usuario, editable).
- [x] **App interna conectada a datos reales** — 2026-09-08. `lib/data/`: `types.ts` (compartido), `queries.ts` (server-only), `actions.ts` (Server Actions). `lib/plan-upload.ts` + `lib/photo-upload.ts` (subida cliente con compresión + geolocalización).
  - **Proyectos** `/app/proyectos`: crear/renombrar/elegir activo (cookie `eaft_project`). Header de `/app` muestra el proyecto activo.
  - **Cuadrillas** `/app/cuadrillas`: alta/edición/borrado por proyecto.
  - **Tickets 811** `/app/811`: alta/edición/borrado + renovar +21d + cerrar; estado activo/por-vencer/vencido derivado de la fecha (`ticketStatus()`), banner de riesgo. El botón "Renovar" abre el portal `https://ky.itic.occinc.com/` en pestaña nueva (renovación real); la fecha de expiración se ajusta a mano desde editar (`renewTicket` queda en `actions.ts` sin uso en UI). Campos (2026-09-10): número · ubicación · fecha de inicio · **fecha de expiración editable** (default inicio+21, ajustable para otros estados) · **página del plano** (texto libre). Migración `0004_ticket_plan_page.sql` (columna `plan_page`) ejecutada en Supabase 2026-09-10.
  - **Fotos GPS** `/app/fotos`: cámara → Storage privado `photos/<company>/<project>/<uuid>.jpg` (comprimida 1600px) + lat/lng; agrupadas por día; URLs firmadas 1h. (2026-09-10) tras tomar la foto se pide **lugar** de texto (calle/cruce, opcional → columna `photos.location`, migración `0005_photo_location.sql` ejecutada en Supabase); la miniatura estampa **nombre de la empresa** (`companies.name`) arriba + **fecha completa + hora** abajo + lugar (o coords si no hay lugar). `savePhoto` devuelve `nonce` para limpiar el form de lugar.
  - **Planos** `/app/planos` + `/app/planos/[id]`: subir PDF o foto a `plans/…`. Editor estilo FiberField (ref del usuario 2026-09-09): **líneas rectas** (2026-09-10 — herramienta "Línea": toca un extremo y arrastra al otro = un segmento recto; se encadenan varias en una ruta → barra "N líneas" → un solo formulario: actividad + pies totales + cuadrilla → marca `{t:strokes}` con `pts` de 2 puntos por línea), **zoom +/−/ajustar**, **pan**, **marcadores con etiqueta** (M/L/T), **notas** sobre el plano. `geom` `{t:strokes|path|seg|pt|text}` compatible con filas viejas (el trazo libre anterior sigue renderizando). `pointer capture` en el lienzo. PDF: se guarda y se abre; dibujo encima requiere subirlo como foto. Pendiente: rasterizar páginas PDF (pdfjs) + rotar.
  - **Hoy** `/app`: ft marcados + 811 por vencer + cuadrillas reales + marcas/fotos recientes; estados vacíos.
  - `lib/seed.ts` y `DemoBadge` eliminados — cero datos de ejemplo en la app.
- [x] **Vercel** — 2026-09-08/09. Repo importado, Root Directory `web`, env `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Producción: **https://juaoses.vercel.app** (auto-deploy en cada push a `main`). URL de despliegue con hash está detrás de Vercel SSO — usar siempre el dominio estable.
- [x] **Supabase Auth URL** — el usuario configuró Site URL `https://juaoses.vercel.app` + Redirect `…/**` (2026-09-09) → magic link funciona en producción.
- Falta: (1) **PDF**: rasterizar páginas con pdfjs-dist + navegación `< 1/N >` + rotar (el editor actual dibuja sobre foto); (2) parte diario / `production_entries` que alimente "El día de hoy" + racha (loop Regla 6); (3) `crew_members`; (4) Google OAuth (proveedor en Supabase); (5) revisor-visual de las pantallas nuevas; (6) verificar en Supabase → Storage que existan los buckets `plans` y `photos` (los crea la migración; si fallaron, subir planos/fotos dará error).
- [ ] **Stripe** (cobro) — requiere datos de la empresa
- [ ] **Vercel** (publicación) — conecta el repo de GitHub
- [ ] **Resend** (correos)
- [ ] **Dominio** (~$12/año)

## Notas para la próxima sesión
- El usuario NO tiene clientes aún (confirmado 2026-08-31) → landing sin testimonios, con oferta Founding Customer (20 empresas a $99/mo).
- "FiberField" NO se replica visualmente (es oscuro+cian = look de IA); su valor fue de PATRONES de función, ya absorbidos.
- Nombre EA Fiber Track confirmado por el usuario. Verificar dominio disponible antes de la landing (eafibertrack.com / .app / getea…).
- Existe un prototipo HTML de alcance de una sesión previa (fuera del SO) — solo referencia visual/funcional, NO es código de este proyecto.
