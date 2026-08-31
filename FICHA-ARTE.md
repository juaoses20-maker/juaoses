# FICHA DE DIRECCIÓN DE ARTE — EA Fiber Track

## Referencia del usuario (CONTRATO — ver 16)
- ¿Hay imagen(es) de referencia del usuario?: NO. El usuario nombró "FiberField", pero FiberField
  es oscuro + cian + sans geométrica (= "look de IA" que el SO evita). NO se replica.
- Prohibiciones anti-IA que la referencia LEVANTA: ninguna. Se mantienen todas (sin neón, sin #000,
  sin glass, sin glow regado, modo NO asumido oscuro).

## Identidad derivada — FUSIÓN de líderes de categoría (16 PASO 0.2bis)
- TABLA DE LÍDERES:
  - Procore → naranja de obra como lógica de acento; datos densos pero escaneables
  - Raken → estructura de "parte diario"; lista de cards
  - Fieldwire → el PLANO es el protagonista y la fuente de verdad
  - CompanyCam → foto con GPS como evidencia auto-organizada
  - (FiberField → NO se copia: su oscuro+cian es el genérico que evitamos)
- Combinación tipográfica: serif display (fila "Editorial/contenido" del 29: Fraunces) + body sans
  neutra técnica (IBM Plex Sans) + mono para cifras (IBM Plex Mono, cuenta como tratamiento).
  Validada contra líderes: los líderes usan grotescas planas; el titular serif Fraunces es nuestra
  divergencia deliberada (concepto "cuaderno de obra"), no un invento aleatorio.
- Arquetipo: el Sabio-Cuidador (da certeza, protege del reclamo) · Mundo del sujeto: zanja, bore,
  planos de OSP con estaciones (0+00), pintura de locate APWA (naranja = comunicaciones/fibra),
  ropa hi-vis, cuaderno de obra, cabina de perforadora al amanecer.
- Dirección del banco 54 para el DISPOSITIVO OWNABLE: "Retro-deportiva" (esquina recortada tipo
  dorsal/etiqueta) + "Fintech de bolsillo" (regla vertical de dato). Paleta del acento tomada TAL
  CUAL de "Retro-deportiva" (#E8590C).

## Personalidad compilada
- 3 adjetivos: Robusto · Directo · Respetuoso (habla español, no presiona con culpa)
- Compilación (11): spring 1 reservado (solo "prueba compartida") · duración base 200ms ·
  exclamaciones máx 1/pantalla · celebración nivel BAJO-MEDIO · radio tendencial 16-18px

## Brand kit final (va a globals.css / @theme)
### Tema claro (primario)
- Fondo `#f5f1e8` · Superficie `#fdfaf3` · Hundido `#ece4d5` · Texto 1º/2º `#241d13` / `#615746` · Texto 3º `#8d8271` · Línea `#e4dccb`
- Acento `#e8590c` (SOLO en: acción primaria + dato/número clave + tramo marcado en el plano)
- 2ª nota `#5f7248` oliva (porqué: estado "verificado / al día" — nunca decorativo)
- Semánticos: éxito `#5f7248` · aviso/por-vencer `#b26a00` · error/vencido `#b3261e`
### Tema oscuro ("Turno noche" — MISMA app, tokens invertidos)
- Fondo `#12100c` · Superficie `#1b1813` · Hundido `#211d16` · Texto 1º/2º `#f2ede2` / `#b3ab96` · Texto 3º `#7e7660` · Línea `#2c281f`
- Acento `#f26a1f` (aclarado para AA sobre oscuro) · 2ª nota `#7bb37e` · aviso `#e0a93a` · error `#e5766b`
### Tipografía
- Display: **Fraunces** (opsz variable; pesos 500/600/700) — titulares, masthead, número héroe
- Body: **IBM Plex Sans** (400/500/600/700) — cuerpo, botones, navegación
- Datos: **IBM Plex Mono** (500/600) — pies, estación (12+00), coordenadas, días de vencimiento, ticket #
- Escala: display 27 / title 20 / body 15 / label 11px · tabular-nums en toda cifra
### Forma y espacio
- Radio: 18px cards · 12px botones/chips · 10-11px plano embebido
- Profundidad: 3 niveles + sombra tintada (rgb 52·40·26 en claro) — no negro puro; textura de puntos sutil en el fondo
- Espaciado base: escala 4·8·12·16·24·32·48·64
### Dispositivo ownable
1. Esquina superior derecha recortada en la tarjeta "La Prueba de Campo" (etiqueta de obra):
   `clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)`
2. Cifra clave colgando de una regla vertical de acento que se desvanece:
   `::before { width:2px; background:linear-gradient(180deg, var(--accent), transparent) }`
### Motion signature
- Easing `cubic-bezier(0.32, 0.72, 0, 1)` (firme) · stagger 50ms · tap 120ms scale .97
- Firma: al "Compartir prueba" con éxito → 1 spring (damping medio) en la tarjeta + check oliva

## Trazabilidad y vetos
- Protocolo A/B/C: opción elegida = **combinación A+B+C** ("Cuaderno de obra").
  - Descartadas: A pura (grotesca Archivo, solo claro), B pura (todo editorial/serif), C pura (solo oscuro, sin calidez)
  - Página comparativa: `docs/revisiones/direcciones-abc.html` + `docs/revisiones/direccion-combinada.html`
  - Screenshots: `docs/revisiones/direcciones-abc-375.png` · `docs/revisiones/direccion-combinada.png`
- Paleta derivada de: banco 54 "Retro-deportiva" (acento `#E8590C` tal cual) + papel cálido fusión de "Terracota mediterránea"
- Dispositivo ownable elegido: esquina recortada + regla de dato
- Registro anti-repetición (a ESTADO.md → vetado para el próximo proyecto SO):
  modo claro primario + oscuro incluido · acento naranja cálido `#e8590c` · par Fraunces + IBM Plex Sans (+ Plex Mono) · dispositivos esquina recortada + regla de dato
- Modo DERIVADO por: el trabajo se hace de día en campo (claro = papel, día, evidencia visible) y
  hay turnos de HDD de madrugada (oscuro incluido como tema, no como default).

## Idioma UI: español (es-US, neutro de campo; términos de oficio en inglés: bore, trench, handhole, foreman, ticket 811)
## Fecha de cierre de la ficha: 2026-08-31 · Aprobada por el usuario: SÍ ("me gusta así como me mostraste")
