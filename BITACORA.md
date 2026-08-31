# BITÁCORA — EA Fiber Track
> Registro en lenguaje simple de todo lo decidido y construido. Para retomar el proyecto o pasárselo a alguien.
> Última actualización: 2026-08-31 · Carpeta del proyecto: `C:\Users\12345\OneDrive\Desktop\APP` (respaldada en OneDrive + control de versiones Git — 12 puntos de guardado hasta hoy).

---

## Qué es EA Fiber Track (en una frase)
App móvil para contratistas de construcción de fibra óptica subterránea en EE. UU. con cuadrilla que habla español: junta el plano, la producción diaria, las fotos con GPS y los tickets 811 en un solo registro que se manda en 30 segundos.

**Mecanismo estrella:** “La Prueba de Campo” — marcas el tramo sobre el plano y queda probado con pies, cuadrilla, ticket 811, fecha y foto GPS.

---

## Lo que ya está decidido y guardado

### 1 · Idea validada
- Se investigó el mercado real. Competidor casi idéntico: **FiberField** (fiberfield.app) — pero está solo en inglés, cobra por asiento (~$376/mes por una sola cuadrilla) y no toca los tickets 811.
- Otros de referencia: CompanyCam (fotos, se encarece al crecer), Raken/Fieldwire (caros, opacos), 811spotter (solo tickets, no conecta con la producción).
- La brecha: **idioma**. ~32% de la fuerza laboral de construcción de EE. UU. es hispana, y ninguna app del rubro está pensada en español para el campo.
- Dato que valida el negocio: Hilti compró Fieldwire por ~$300 millones (2021).
- Detalle: `docs/copy/landing.md` cita las fuentes; el resumen está en `ESTADO.md`.

### 2 · Qué hace la app (Constitución del Producto — aprobada)
Cuatro funciones, en orden:
1. **Planos con marcado de producción** — subes el plano (PDF o foto) y marcas encima los tramos y puntos construidos.
2. **Fotos con GPS** — sello de fecha, hora y coordenadas, pegada al tramo y a la cuadrilla.
3. **Tickets 811 (Kentucky primero)** — vencimiento, alertas antes de vencer, conectado a la producción.
4. **Cuadrillas** — foreman, gente, equipo y la producción del día de cada una.

Lo que la app **nunca** hace: reemplazar la llamada al 811, publicar o enviar algo sin permiso, inventar datos, ni convertirse en Procore (nada de nómina, contabilidad, CRM, licitaciones).

### 3 · Cómo se ve (Dirección de arte — aprobada: “Cuaderno de obra”)
- Modo claro, fondo papel cálido. Tema oscuro “Turno noche” incluido para las cuadrillas de madrugada.
- Naranja de obra (`#e8590c`) solo en botones y datos clave. Verde oliva para “verificado”.
- Titulares en tipografía con carácter (Fraunces), texto en IBM Plex, números en monoespaciada.
- Ficha completa: `FICHA-ARTE.md` · comparativas visuales en `docs/revisiones/direcciones-abc.html` y `direccion-combinada.html`.

### 4 · A quién le vendemos y cómo se cobra (Bloque 1 — hecho)
- **Cliente ideal:** dueño / jefe de operaciones de una empresa chica de fibra subterránea / HDD (2–10 cuadrillas), salió del campo, cuadrilla hispanohablante. Su pesadilla: le reclaman un daño que no hizo y no puede probarlo. Retrato completo: `FICHA-AVATAR.md`.
- **Números del mercado:** `FICHA-MERCADO.md`.
- **Modelo:** el usuario prueba gratis **sin crear cuenta**, ve que funciona, y recién ahí ve el precio y se registra.
- **Cobro:** por **Stripe** (no Hotmart — Hotmart es para cursos de LATAM; Stripe es el estándar para software B2B en EE. UU.).
- **Precio (propuesto, ajustable):** Cuadrilla $129/mes · Contratista $249/mes (hasta 5 cuadrillas, el más común) · Multi-cuadrilla $449/mes.
- **Oferta de fundador:** primeras 20 empresas a **$99/mes bloqueado de por vida**.
- **Prueba gratis:** 14 días · **Garantía:** 30 días de devolución.

### 5 · Página de ventas (Bloque 2 — APROBADA por el usuario, sin cambios)
- Texto: `docs/copy/landing.md` (cada frase sacada del retrato del cliente).
- Página renderizada: `docs/revisiones/landing.html` (+ captura `landing-375.png`).
- Título elegido: **“Todo tu avance de obra de fibra, en un toque.”**
- 10 secciones: portada · problema · lo que te cuesta · la solución · la app por dentro · oferta · garantía · preguntas · cierre · pie legal.

### 6 · Los primeros minutos del usuario (Bloque 3 — APROBADO)
- 8 pantallas: `docs/revisiones/funnel.html` (+ captura `funnel.png`).
- `/probar` (sin cuenta): sube plano → marca tramo → describe el trabajo → ve “La Prueba de Campo”.
- `/planes`: paywall de 3 pantallas (recap → calendario de la prueba → precio de fundador).
- `/entrar`: registro al final, con Google o enlace por correo.

### 7 · La app por dentro (Bloque 4 — pendiente de OK)
- 5 pantallas + estado vacío: `docs/revisiones/app.html` (+ captura `app.png`).
- **Hoy**: pies por cuadrilla, 811 por vencer, mapa de tramos probados, racha de partes.
- **Planos**: subir plano y marcar producción encima (aquí vive “La Prueba de Campo”).
- **Fotos**: galería con GPS y filtros.
- **811**: lista por color (verde al día / ámbar por vencer / rojo vencido) + botón Renovar.
- **Cuadrillas**: foreman, gente, equipo, producción del día.
- El bucle que la hace hábito: el foreman cierra el parte → “Hoy” se actualiza → los tramos y la racha se acumulan.

---

## Detalles técnicos (para quien programe — no hace falta entenderlos para decidir)
- Next.js (App Router) + React + Tailwind + Supabase (base de datos, cuentas, archivos) + Vercel (publicación) + Stripe (cobro).
- Cuentas: las tienen owner/PM/foreman. Los trabajadores de cuadrilla son nombres, no usuarios (v1).
- Planos PDF: se rasterizan en el navegador (pdfjs) para marcar encima. Fotos: se comprimen en el teléfono antes de subir.
- IA (opcional, más adelante): solo texto — genera el resumen del as-built.
- Todo el detalle en `ESTADO.md` → sección “Decisiones técnicas”.

---

## Qué falta

**Siguiente:** Bloque 5 — convertir todo lo diseñado (página de ventas + primeros minutos + app) en un sitio web y una app de verdad, en código, y conectar el cobro. **Aquí el usuario tiene que crear cuentas** (Supabase = base de datos, Vercel = publicación, Stripe = cobro, Resend = correos), comprar el dominio (~$12/año) y pegar 3–4 claves. Se avisa y se guía clic por clic.

**Después:**
- Bloque 6 — pruebas, pulido y revisión de calidad.
- Bloque 7 — lanzamiento y conseguir los primeros clientes.

**Pendientes anotados de la landing** (se resuelven en su bloque): las 4 páginas legales, cambiar los marcos de ejemplo del carrusel por capturas reales, y el contador de fundador conectado a la base de datos de verdad.

**Nota del usuario:** aún no tiene clientes — por eso la landing no lleva testimonios y usa la oferta de fundador como palanca de lanzamiento.

---

## Mapa de archivos
```
ESTADO.md            → memoria del proyecto (fase, decisiones, pendientes)
BITACORA.md          → este archivo (registro en lenguaje simple)
FICHA-ARTE.md        → dirección visual (cosa juzgada)
FICHA-AVATAR.md      → cliente ideal (cosa juzgada)
FICHA-MERCADO.md     → números del mercado
docs/copy/landing.md → texto de la página de ventas
docs/revisiones/     → páginas y capturas para aprobar:
   direcciones-abc.html / direccion-combinada.html  → opciones de estilo
   landing.html / landing-375.png                   → página de ventas
   funnel.html / funnel.png                         → primeros minutos del usuario
CLAUDE.md, docs/sistema/, plantillas-codigo/, scripts/ → el Sistema Operativo (no se toca)
```
