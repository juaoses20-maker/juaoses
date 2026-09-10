"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  BarChart3,
  ShieldAlert,
  Languages,
  Check,
  ChevronRight,
  HardHat,
  Hexagon,
  Map as MapIcon,
  PencilRuler,
  MessageCircle,
  Smartphone,
  Mail,
} from "lucide-react";

const WA_NUMBER = "16185142665";
const CONTACT_EMAIL = "eafibertrack@gmail.com";
const CONTACT_MSG = "Hola, quiero más información de EA Fiber Track.";

/* ---------- primitives ---------- */

/** CSS-only scroll reveal — SSR-safe, no hydration mismatch.
 *  Starts visible; only hides + animates once JS marks the root with .js-reveal. */
function useRevealRoot() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("rv-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // safety net: never leave content hidden
    const t = window.setTimeout(() => els.forEach((el) => el.classList.add("rv-in")), 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);
}

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div data-rv className={className}>
      {children}
    </div>
  );
}

function Cta({
  children,
  href = "#planes",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const cls =
    "flex h-12 w-full items-center justify-center gap-2 rounded-btn px-5 font-body text-[15px] font-bold text-accent-ink " +
    "bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] " +
    "shadow-[0_8px_22px_color-mix(in_oklab,var(--accent)_34%,transparent),inset_0_1px_0_rgb(255_255_255/0.3)] " +
    "transition-transform active:scale-[0.98] " +
    className;
  if (href.startsWith("#")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-11 w-11 flex-none place-items-center rounded-[12px] border bg-[var(--chip)] [border-color:color-mix(in_oklab,var(--accent)_22%,transparent)] text-accent">
      {children}
    </span>
  );
}

function CheckMark() {
  return (
    <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_18%,transparent)]">
      <Check className="h-3 w-3 text-accent-2" strokeWidth={3.4} />
    </span>
  );
}

/* ---------- phone mockup (hero) ---------- */

function HeroPhone() {
  return (
    <div className="relative mx-auto mt-7 w-[300px] overflow-hidden rounded-[42px] border-[10px] border-[#0c0d10] bg-bg shadow-[0_30px_60px_-18px_rgb(52_40_26/0.4),inset_0_0_0_2px_#1d1f24]">
      <div className="absolute left-1/2 top-0 z-10 h-[22px] w-[110px] -translate-x-1/2 rounded-b-[14px] bg-[#0c0d10]" />
      <div className="px-[14px] pb-4 pt-[26px]">
        <div className="flex justify-between px-1.5 pb-2 font-mono text-[11px] font-semibold text-ink-2 tnum">
          <span>9:41</span>
          <span>··· ᯤ 100</span>
        </div>
        <div className="relative border-y-2 border-b [border-color:var(--ink)] pb-2 pt-1.5">
          <p className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.09em] text-ink-2">
            Fibra Louisville — Fase 2 · Hoy
          </p>
          <h4 className="mt-0.5 font-display text-[19px] font-semibold">El día de hoy</h4>
          <span className="absolute inset-x-0 -bottom-1 border-t [border-color:var(--ink)]" />
        </div>

        <div
          className="mt-3 overflow-hidden rounded-[14px] border bg-[linear-gradient(180deg,#fff,var(--surface))] shadow-[var(--shadow-1)]"
          style={{ clipPath: "polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)" }}
        >
          <div className="flex items-center gap-1.5 px-3 pt-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-accent">
            <Check className="h-2.5 w-2.5" strokeWidth={2.8} /> La Prueba de Campo · 9:41
          </div>
          <div className="mx-3 mt-2 overflow-hidden rounded-[10px] border bg-white">
            <svg viewBox="0 0 280 78" className="block w-full">
              <rect width="280" height="78" fill="#fff" />
              <g stroke="#ece4d7" strokeWidth="1">
                <path d="M0 28H280M0 54H280M70 0V78M160 0V78" />
              </g>
              <path d="M20 40H262" stroke="#cbb9a3" strokeWidth="2" strokeDasharray="6 4" />
              <path d="M20 40H150" stroke="#e8590c" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="20" cy="40" r="4" fill="#e8590c" />
              <circle cx="150" cy="40" r="4" fill="#e8590c" />
              <text x="20" y="30" fontFamily="monospace" fontSize="8.5" fill="#e8590c">
                STA 12+00 → 30+50
              </text>
            </svg>
          </div>
          <div className="flex items-center gap-2.5 px-3 pb-1 pt-2.5">
            <span className="h-11 w-11 flex-none rounded-[9px] border" style={{ background: "#b45a1e" }} />
            <div>
              <div className="relative pl-2 font-display text-[24px] font-bold leading-none tnum before:absolute before:left-0 before:top-0.5 before:bottom-0.5 before:w-0.5 before:rounded-sm before:bg-[linear-gradient(180deg,var(--accent),transparent)]">
                1 850 <span className="font-body text-[11px] font-semibold text-ink-2">pies · Bore HDD</span>
              </div>
              <div className="mt-1 text-[10px] text-ink-2">Cuadrilla A — Miguel Santos</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 px-3 pb-3 pt-0.5">
            <span className="rounded-full bg-surface-2 px-2 py-[3px] font-mono text-[9px] font-medium text-ink-2">
              38.2542, −85.7585
            </span>
            <span className="rounded-full bg-[color-mix(in_oklab,var(--warn)_15%,transparent)] px-2 py-[3px] font-mono text-[9px] font-medium text-warn">
              811 #2024-2210455 · vence 3 d
            </span>
            <span className="rounded-full bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)] px-2 py-[3px] font-mono text-[9px] font-medium text-accent-2">
              Foto GPS
            </span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t px-0.5 py-2.5 text-[11px] text-ink-2">
          <span>Pies hoy · 3 cuadrillas</span>
          <b className="font-mono text-[13px] text-ink">4 250 ft</b>
        </div>
      </div>
    </div>
  );
}

/* ---------- FAQ ---------- */

const FAQ_ITEMS = [
  {
    q: "Ya lo hacemos con Excel y WhatsApp.",
    a: "Eso no es un sistema — es una búsqueda del tesoro cuando llega el reclamo. Cronometra lo que tardas hoy contra 30 segundos.",
  },
  {
    q: "Mi gente no va a llenar otra app.",
    a: "Por eso está en español y es una foto más dos toques, no un formulario. El foreman cierra el parte del día en un minuto.",
  },
  {
    q: "Ya usamos la plataforma del general contractor.",
    a: "Esa es del GC y te la quitan al terminar el contrato. EA Fiber Track es tu registro: te lo llevas a todos tus proyectos.",
  },
  {
    q: "No quiero pagar por cada trabajador.",
    a: "No cobramos por trabajador. Es un solo precio por empresa: $30 al mes, con personas y cuadrillas ilimitadas.",
  },
  {
    q: "En muchas zonas no tengo buena señal.",
    a: "La captura de fotos y marcas funciona sin señal. Sube sola cuando vuelve la conexión.",
  },
  {
    q: "¿Esto reemplaza la llamada al 811?",
    a: "No. EA Fiber Track guarda la evidencia y te avisa del vencimiento. El estado oficial del locate se verifica siempre con el 811 de tu estado.",
  },
];

/* ---------- sticky CTA ---------- */

function StickyCta() {
  const [show, setShow] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    heroRef.current = document.getElementById("hero");
    if (!heroRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => setShow(!e.isIntersecting),
      { threshold: 0 },
    );
    io.observe(heroRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={
        "fixed inset-x-0 bottom-0 z-40 border-t bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur transition-transform duration-300 " +
        (show ? "translate-y-0" : "translate-y-[120%]")
      }
    >
      <div className="mx-auto max-w-[460px]">
        <Cta>Probar gratis con mi plano</Cta>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function Landing() {
  useRevealRoot();
  return (
    <div className="bg-bg text-ink">
      {/* header */}
      <header className="sticky top-0 z-30 border-b bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-[460px] items-center gap-2.5 px-5 py-2.5">
          <span className="flex items-center gap-2 font-display text-[16px] font-bold">
            <span className="grid h-[22px] w-[22px] place-items-center rounded-[6px] bg-accent">
              <HardHat className="h-[13px] w-[13px] text-white" strokeWidth={2.4} />
            </span>
            EA Fiber Track
          </span>
          <Link href="/entrar" className="ml-auto text-[13px] font-medium text-ink-2">
            Entrar
          </Link>
        </div>
      </header>

      {/* 1 · HERO */}
      <section
        id="hero"
        className="relative overflow-hidden [background:radial-gradient(420px_300px_at_78%_4%,color-mix(in_oklab,var(--accent)_13%,transparent),transparent_70%),radial-gradient(360px_260px_at_6%_30%,color-mix(in_oklab,var(--accent-2)_10%,transparent),transparent_70%)]"
      >
        <div className="mx-auto max-w-[460px] px-5 pb-11 pt-8">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
              Para contratistas de fibra subterránea con cuadrilla que habla español
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.08]">
              Todo tu avance de obra de fibra,{" "}
              <span className="text-accent">en un toque</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3.5 max-w-[34ch] text-[15px] text-ink-2">
              Pies de hoy, cada cuadrilla y los 811 por vencer —{" "}
              <strong className="font-semibold text-ink">sin llamar a nadie</strong>.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-5">
              <Cta>
                Probar gratis con mi plano <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Cta>
              <p className="mt-2.5 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-ink-3">
                <Check className="h-3 w-3 text-accent-2" strokeWidth={3} />
                Míralo funcionando aquí abajo · 14 días gratis, sin tarjeta
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <HeroPhone />
          </Reveal>
        </div>
      </section>

      {/* 2 · PROBLEMA + 3 · AGITACIÓN */}
      <section className="border-y bg-surface">
        <div className="mx-auto max-w-[460px] px-5 py-11">
          <Reveal>
            <p className="mx-0.5 mb-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
              Si esto te suena…
            </p>
          </Reveal>
          <div className="mt-3 flex flex-col gap-3">
            {[
              { icon: <Search className="h-5 w-5" strokeWidth={2} />, t: "¿Buscas la foto de un tramo entre WhatsApp y tres celulares?" },
              { icon: <BarChart3 className="h-5 w-5" strokeWidth={2} />, t: "¿Terminas el día sin saber cuántos pies hizo cada cuadrilla?" },
              { icon: <ShieldAlert className="h-5 w-5" strokeWidth={2} />, t: "¿Te reclaman un daño a una línea que tu gente no tocó?" },
              { icon: <Languages className="h-5 w-5" strokeWidth={2} />, t: "¿Tu cuadrilla no llena la app porque está en inglés?" },
            ].map((q) => (
              <Reveal key={q.t}>
                <div className="flex items-start gap-3.5 rounded-[14px] border bg-bg p-3.5 shadow-[var(--shadow-1)]">
                  <IconChip>{q.icon}</IconChip>
                  <p className="text-[14.5px] font-medium">{q.t}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mx-0.5 mb-2 mt-9 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
              Y mientras tanto…
            </p>
          </Reveal>
          <div className="mt-3 flex flex-col gap-3.5">
            {[
              <>Cada semana pierdes horas <b className="font-semibold">reconstruyendo lo que ya hiciste</b> — y a veces la factura igual no entra.</>,
              <><b className="font-semibold">Dos de cada tres contratistas</b> ya recibieron un reclamo por un daño que no causaron.</>,
              <>Seis meses así y sigues igual — con <b className="font-semibold">seis meses menos de pruebas</b> guardadas.</>,
            ].map((line, i) => (
              <Reveal key={i}>
                <div className="flex items-start gap-2.5 text-[14.5px]">
                  <span className="w-[3px] flex-none self-stretch rounded-sm bg-[linear-gradient(180deg,var(--accent),transparent)]" />
                  <span>{line}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-3.5 text-[11px] text-ink-3">
              Fuente: encuesta a contratistas de excavación, Associated General Contractors of America.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4 · SOLUCIÓN */}
      <section className="mx-auto max-w-[460px] px-5 py-11">
        <Reveal>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
            La solución
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-2 text-[24px] font-semibold">
            No es que trabajes mal. La prueba de tu obra vive en cinco lugares a la vez.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-1.5 max-w-[38ch] text-[16px] text-ink-2">
            <span className="font-semibold text-accent">La Prueba de Campo</span> la junta en uno solo.
          </p>
        </Reveal>
        <div className="mt-5 flex flex-col gap-3.5">
          {[
            "Subes el plano en PDF o foto y tocas el tramo construido.",
            "Le sumas la foto con GPS y el número de ticket 811.",
            "Queda una prueba lista para mandar: pies, cuadrilla, fecha, ubicación.",
          ].map((s, i) => (
            <Reveal key={i}>
              <div className="flex items-start gap-3.5">
                <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] border bg-[var(--chip)] [border-color:color-mix(in_oklab,var(--accent)_22%,transparent)] font-display text-[16px] font-bold text-accent">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-[14.5px]">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-[12px] border bg-bg p-3 shadow-[var(--shadow-1)]">
              <div className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">Antes</div>
              <div className="mt-1.5 text-[13px] font-semibold">Media hora buscando en WhatsApp</div>
            </div>
            <div className="rounded-[12px] border [border-color:color-mix(in_oklab,var(--accent)_30%,transparent)] bg-bg p-3 shadow-[var(--shadow-1)]">
              <div className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">Después</div>
              <div className="mt-1.5 text-[13px] font-semibold text-accent">30 segundos y enviado</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4B · QUÉ HACE POR TI */}
      <section id="servicios" className="border-t bg-bg">
        <div className="mx-auto max-w-[460px] px-5 py-11">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
              Qué hace por ti
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-2 text-[24px] font-semibold">Lo que resuelve.</h2>
          </Reveal>

          <div className="mt-5 flex flex-col gap-3">
            {[
              {
                Icon: PencilRuler,
                t: "Marcación de planos y tickets 811",
                d: "Marcas la producción del día sobre el plano —PDF o foto— y llevas los tickets 811 conectados a cada tramo, con aviso antes de que venzan.",
              },
              {
                Icon: ShieldAlert,
                t: "Respuesta a reclamos por daños, con evidencia",
                d: "Cuando llega un claim, sacas la Prueba de Campo del tramo: plano marcado, foto con GPS, fecha, cuadrilla y número de 811. En segundos, listo para responder.",
              },
            ].map(({ Icon, t, d }, i) => (
              <Reveal key={i}>
                <div className="flex items-start gap-3.5 rounded-card border bg-surface p-4 shadow-[var(--shadow-1)]">
                  <IconChip>
                    <Icon className="h-[20px] w-[20px]" strokeWidth={2} />
                  </IconChip>
                  <div>
                    <h3 className="text-[15px] font-semibold">{t}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-4 rounded-card border bg-surface p-4 shadow-[var(--shadow-1)]">
              <h3 className="text-[15px] font-semibold">Solicitar más información</h3>
              <p className="mt-1 text-[13px] text-ink-2">
                Te contestamos personalmente. Sin llamadas de venta.
              </p>
              <div className="mt-3 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(CONTACT_MSG)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-btn bg-accent px-4 text-[14px] font-bold text-accent-ink transition-transform active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2.4} /> Escribir por WhatsApp
                </a>
                <a
                  href={`sms:+${WA_NUMBER}?body=${encodeURIComponent(CONTACT_MSG)}`}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-btn border [border-color:color-mix(in_oklab,var(--accent)_30%,transparent)] px-4 text-[14px] font-semibold text-accent transition-transform active:scale-[0.98]"
                >
                  <Smartphone className="h-4 w-4" strokeWidth={2.4} /> Enviar un mensaje de texto
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Más información de EA Fiber Track")}&body=${encodeURIComponent(CONTACT_MSG)}`}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-btn border [border-color:color-mix(in_oklab,var(--accent)_30%,transparent)] px-4 text-[14px] font-semibold text-accent transition-transform active:scale-[0.98]"
                >
                  <Mail className="h-4 w-4" strokeWidth={2.4} /> Escribir un correo
                </a>
              </div>
              <p className="mt-2.5 font-mono text-[10.5px] text-ink-3">{CONTACT_EMAIL}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 · LA APP POR DENTRO */}
      <section className="border-y bg-surface">
        <div className="mx-auto max-w-[460px] px-5 py-11">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
              La app por dentro
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-2 text-[22px] font-semibold">Cuatro pantallas, una misión cada una.</h2>
          </Reveal>
          <div className="mt-5 flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { icon: <MapIcon className="h-8 w-8" strokeWidth={1.6} />, t: "La Prueba de Campo", cap: "El tramo, probado" },
              { icon: <BarChart3 className="h-8 w-8" strokeWidth={1.6} />, t: "El día de hoy", cap: "Pies por cuadrilla, sin llamar" },
              { icon: <Hexagon className="h-8 w-8" strokeWidth={1.6} />, t: "Tickets 811", cap: "Cuáles vencen esta semana" },
              { icon: <PencilRuler className="h-8 w-8" strokeWidth={1.6} />, t: "Planos", cap: "Marca la producción encima" },
            ].map((s) => (
              <div key={s.t} className="w-[200px] flex-none snap-center">
                <div className="grid aspect-[9/17] place-items-center rounded-[26px] border-[8px] border-[#0c0d10] bg-surface-2 p-3.5 text-center text-ink-3">
                  <div>
                    <div className="mx-auto mb-2 w-fit">{s.icon}</div>
                    <span className="text-[11px] font-semibold">{s.t}</span>
                  </div>
                </div>
                <div className="mt-2 text-center text-[12px] font-semibold text-ink-2">{s.cap}</div>
              </div>
            ))}
          </div>
          <div className="mt-0.5 flex justify-center gap-1.5">
            <span className="h-1.5 w-4 rounded-full bg-accent" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
          </div>
          <Reveal>
            <p className="mt-3 text-center text-[11px] text-ink-3">
              Marcos de referencia — las capturas reales se montan cuando la app esté lista.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 6 · OFERTA */}
      <section id="planes" className="mx-auto max-w-[460px] px-5 py-11">
        <Reveal>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">La oferta</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-2 text-[24px] font-semibold">
            Un precio. <span className="text-accent">Sin letra chica.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="mt-5 rounded-card border-[1.5px] border-transparent p-4 shadow-[var(--shadow-2)]"
            style={{
              background:
                "linear-gradient(var(--bg),var(--bg)) padding-box, linear-gradient(135deg, color-mix(in oklab,var(--accent) 55%,transparent), transparent 62%) border-box",
            }}
          >
            <span className="inline-flex rounded-full bg-[var(--chip)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-accent">
              Toda la empresa
            </span>
            <div className="mt-2.5 font-display text-[38px] font-bold leading-none tnum">
              $30<span className="font-body text-[14px] font-semibold text-ink-2"> /mes</span>
            </div>
            <p className="mt-1 text-[12px] text-ink-2">
              Un solo plan. <strong className="font-semibold">Cuadrillas y personas ilimitadas.</strong> Cancela cuando quieras.
            </p>
            <div className="mt-3.5 flex flex-col gap-2.5">
              {[
                <>EA Fiber Track completo — planos, fotos GPS, 811 y cuadrillas, <strong className="font-semibold">personas ilimitadas</strong></>,
                <>Sin cobro por trabajador ni por cuadrilla</>,
                <>Alertas de vencimiento de 811 por correo y en la app</>,
                <>Tu registro te acompaña de un proyecto al siguiente</>,
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px]">
                  <CheckMark />
                  <span className="flex flex-1 flex-wrap gap-x-1">{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Cta href="/probar">
                Probar gratis con mi plano <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Cta>
            </div>
            <p className="mt-2.5 text-center font-mono text-[10.5px] text-ink-3">
              14 días gratis · sin tarjeta para probar · pago por Stripe
            </p>
          </div>
        </Reveal>
      </section>

      {/* 7 · GARANTÍA */}
      <section className="border-y bg-surface">
        <div className="mx-auto max-w-[460px] px-5 py-11">
          <Reveal>
            <div
              className="flex items-start gap-3.5 rounded-card border-[1.5px] border-transparent p-4 shadow-[var(--shadow-1)]"
              style={{
                background:
                  "linear-gradient(var(--bg),var(--bg)) padding-box, linear-gradient(135deg, color-mix(in oklab,var(--accent-2) 45%,transparent), transparent 62%) border-box",
              }}
            >
              <span className="grid h-12 w-12 flex-none place-items-center rounded-[12px] border bg-[var(--chip)] text-accent">
                <ShieldAlert className="h-[22px] w-[22px]" strokeWidth={2} />
              </span>
              <div>
                <h3 className="text-[17px]">La Garantía de la Primera Prueba</h3>
                <p className="mt-1.5 text-[13px] text-ink-2">
                  Si en 14 días no armaste tu primera Prueba de Campo con tu propio plano, escribes un correo y te devolvemos todo. Sin formulario, sin preguntas.
                </p>
                <p className="mt-2 font-mono text-[11px] text-ink-3">Más 30 días de devolución desde el primer cobro.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8 · FAQ */}
      <section className="mx-auto max-w-[460px] px-5 py-11">
        <Reveal>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
            Preguntas frecuentes
          </p>
        </Reveal>
        <div className="mt-4 border-t">
          {FAQ_ITEMS.map((it) => (
            <details key={it.q} className="group border-b">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 py-3.5 text-[14px] font-semibold [&::-webkit-details-marker]:hidden">
                {it.q}
                <ChevronRight className="ml-auto h-4 w-4 flex-none text-ink-3 transition-transform group-open:rotate-90" />
              </summary>
              <p className="pb-4 text-[13.5px] leading-relaxed text-ink-2">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 9 · CTA FINAL (turno noche) */}
      <section data-theme="dark" className="border-t [background:linear-gradient(180deg,#1a1712,#12100c)] text-ink">
        <div className="mx-auto max-w-[460px] px-5 py-11">
          <Reveal>
            <h2 className="text-[26px] font-bold text-ink">Que la obra te la cuente la app.</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-2">
              Es viernes, 6 p.m. Abres EA Fiber Track: pies por cuadrilla, los 811 al día, cada tramo probado. Cierras el teléfono.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-5">
              <Cta href="/probar">
                Probar gratis con mi plano <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Cta>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 border-t pt-4 text-[12.5px] leading-relaxed text-ink-2">
              <b className="font-mono font-semibold text-ink">PS:</b> EA Fiber Track te muestra toda tu obra de fibra en un toque, con La Prueba de Campo detrás de cada tramo. Un solo precio: $30/mes para toda la empresa, 14 días gratis y la Garantía de la Primera Prueba.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 10 · FOOTER */}
      <footer className="border-t bg-bg px-5 pb-24 pt-7">
        <div className="mx-auto max-w-[460px]">
          <span className="flex items-center gap-2 font-display text-[14px] font-bold">
            <span className="grid h-[18px] w-[18px] place-items-center rounded-[5px] bg-accent">
              <HardHat className="h-[11px] w-[11px] text-white" strokeWidth={2.4} />
            </span>
            EA Fiber Track
          </span>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-3 text-[12.5px] text-ink-2 [&_a]:underline [&_a]:underline-offset-2">
            <Link href="/legal/terminos">Términos y Condiciones</Link>
            <Link href="/legal/privacidad">Política de Privacidad</Link>
            <Link href="/legal/reembolso">Política de Reembolso</Link>
            <a href={`mailto:${CONTACT_EMAIL}`}>Contacto</a>
          </div>
          <p className="mt-4 rounded-[10px] border border-dashed bg-surface px-3 py-2.5 text-[11px] leading-relaxed text-ink-3">
            EA Fiber Track no reemplaza la llamada al 811 ni confirma el estado oficial de un locate. Verifica siempre con el centro 811 de tu estado antes de excavar.
          </p>
          <p className="mt-3.5 font-mono text-[10.5px] text-ink-3">© 2026 EA Fiber Track · Pagos por Stripe</p>
        </div>
      </footer>

      <StickyCta />
    </div>
  );
}
