# FICHA DE MERCADO — EA Fiber Track

## Alcance
- Nicho exacto: software móvil de operación de campo para **contratistas subcontratistas de construcción de fibra óptica subterránea / HDD / underground utility** en EE. UU. (2–10 cuadrillas).
- País donde se vende: Estados Unidos · Moneda: USD
- Fecha de investigación: 2026-08-31 · **Vence el: 2027-02-28** (revisar a los 6 meses)
- Pasarela elegida: **Stripe** (suscripción B2B; tarjeta + ACH). NO Hotmart — Hotmart es para infoproductos/cursos LATAM; el comprador aquí es una empresa de EE. UU. que compra software.

## 1. PRECIO — contra qué se compara
- **FiberField** (competidor casi exacto): por asiento — Manager $149/mo · Foreman $129/mo · Crew $49/mo. 7 días trial, 60 días garantía. | fuente: fiberfield.app | fecha: 2026-08-31
  - Costo real de FiberField para 1 cuadrilla de 4 personas ≈ $149 + $129 + $49×2 ≈ **$376/mo**.
- **CompanyCam**: Core $63/mo (1 usuario) · Crew $129/mo · Scale $199/mo; mínimo 3 usuarios; +$29/usuario extra anual. | fuente: scanmanifold / g2 | fecha: 2026-08-31
- **Raken**: ≈ $15 / $37 / $46 por usuario/mes (anual); precio no público, cotización; "subidas en el año 2". | fuente: contractortoolstack / buildbite | fecha: 2026-08-31
- **Fieldwire (Hilti)**: precio ya NO público, solo por vendedor; "subió mucho". | fuente: buildbite | fecha: 2026-08-31
- **811spotter**: usuarios ilimitados, se paga por ticket nuevo/renovado (precio exacto por volumen no publicado). | fuente: 811spotter.com/pricing | fecha: 2026-08-31
- Valor de la categoría: Hilti compró Fieldwire por **~$300M** (nov 2021). | fuente: ENR | fecha: 2021-11-16
- **Precio elegido (PROPUESTO — ajustable con /precios):**
  - **Cuadrilla** $129/mo — 1 cuadrilla, personas ilimitadas
  - **Contratista** $249/mo — hasta ~5 cuadrillas *(plan objetivo / señuelo: el sub típico tiene 2–5)*
  - **Multi-cuadrilla** $449/mo — hasta ~12 cuadrillas
  - **Empresa** — cotización
  - Anual: 2 meses gratis (se muestra como $/mes, nunca el total)
  - **Founding Customer:** primeras 20 empresas a **$99/mo** bloqueado de por vida (no hay clientes aún → esta es la palanca de lanzamiento)
- **Desvío vs referencia:** el plan "Contratista" $249 para 5 cuadrillas ≈ **$50/cuadrilla/mes** vs FiberField ~$376/cuadrilla. Desvío ≈ −85% por cuadrilla → **razón:** modelo por empresa, no por asiento; es la cuña central del posicionamiento (objeción #4 del avatar). El precio absoluto por empresa ($129–449) está DENTRO del rango de la categoría.

## 2. CICLO DE DECISIÓN
- ¿Se compra el mismo día o se piensa? **Se piensa** — compra B2B, el owner/PM evalúa, a veces prueba en un proyecto antes de comprar. | fuente: NO ENCONTRADO dato duro — criterio de venta B2B SaaS SMB | revisar 2027-02-28
- % de compras que arrancan >30 días después del primer contacto: **NO ENCONTRADO** — se decide por criterio; asumir ciclo 2–6 semanas.
- **Ventana mínima antes de declarar que una campaña fracasó: 45 días.**

## 3. CÓMO PAGA ESTE MERCADO
- Medio dominante B2B EE. UU.: **tarjeta de crédito de la empresa** (Amex/Visa/MC) y **ACH** para planes anuales. Stripe cubre ambos.
- Penetración de tarjeta de crédito entre empresas de construcción en EE. UU.: alta (default para SaaS). | fuente: criterio de mercado B2B US | fecha: 2026-08-31
- El modelo suscripción NO excluye a este mercado (a diferencia de LATAM consumo). PIX/boleto/OXXO: N/A (mercado EE. UU.).
- Consecuencia: sin barrera de pago relevante; la fricción real es *probar el valor antes de comprometer el presupuesto* → por eso onboarding-first con preview.

## 4. PRUEBA Y GARANTÍA
- Stripe permite trial de cualquier duración (7/14/30 días) sin tarjeta o con tarjeta. | verificado: doctrina Stripe subscriptions | fecha: 2026-08-31
- **Prueba elegida: 14 días** (sin tarjeta en el preview; tarjeta al iniciar trial completo). Suficiente para correr 1 semana real de producción + ver 1 ciclo de ticket 811.
- **Garantía elegida: 30 días de devolución** desde el primer cobro.
- Regla dura (18): garantía 30 > prueba 14 → **SÍ**, cobertura real positiva. Se puede publicar.
- El plazo de garantía cuenta desde el **primer cobro** (Stripe lo permite y es lo estándar B2B).

## 5. CONVERSIÓN ESPERABLE (para saber si un número es malo, NO para prometer)
- Conversión visita→registro/preview B2B SaaS de nicho: **NO ENCONTRADO** dato del sub-nicho — rango de referencia B2B SMB ~2–5% (criterio) | revisar 2027-02-28
- Conversión trial→pago B2B SaaS SMB con activación: **NO ENCONTRADO** para este nicho — referencia ~10–25% con buen onboarding (criterio) | revisar 2027-02-28
- Umbral de muestra antes de decidir: **≥ 300 visitas al preview** o **≥ 25 trials** iniciados.

## 6. ESTACIONALIDAD Y CONTEXTO
- Picos de demanda: **temporada de obra marzo–octubre** (clima); arranque de contratos grandes de broadband (BEAD/estatales). Bajón nov–feb en zonas frías.
- Intención de compra: dispara tras una **disputa de pago perdida** o un **damage claim**.
- Regulación: el ticket 811 tiene marco legal estatal (Kentucky 811 = **21 días calendario** de vigencia | fuente: kentucky811.org | fecha: 2026-08-31). La app NO puede presentarse como sustituto del 811 oficial → disclaimer obligatorio (ver 47 / FICHA-AVATAR objeción #7). Datos de fotos/ubicación de trabajadores → política de privacidad y consentimiento del empleador.
