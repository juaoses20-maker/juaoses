import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Btn({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "flex h-12 w-full items-center justify-center gap-2 rounded-btn px-5 font-body text-[15px] font-bold transition-transform active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 " +
    className;
  const styles =
    variant === "primary"
      ? "text-accent-ink bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] shadow-[0_8px_22px_color-mix(in_oklab,var(--accent)_34%,transparent),inset_0_1px_0_rgb(255_255_255/0.3)]"
      : "text-ink bg-surface border shadow-[var(--shadow-1)]";
  if (href) {
    return (
      <Link href={href} className={base + styles}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base + styles}>
      {children}
    </button>
  );
}

export function Progress({ pct }: { pct: number }) {
  return (
    <div className="h-1 overflow-hidden rounded-full bg-surface-2">
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function TopBar({ onClose, href }: { onClose?: () => void; href?: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-2.5">
      <span className="flex items-center gap-1.5 font-display text-[13px] font-bold">
        <span className="grid h-[18px] w-[18px] place-items-center rounded-[5px] bg-accent">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
            <path d="M4 20V10l8-6 8 6v10" />
            <path d="M4 20h16" />
          </svg>
        </span>
        EA Fiber Track
      </span>
      {href ? (
        <Link href={href} aria-label="Cerrar" className="ml-auto text-ink-3">
          <span className="text-[16px]">✕</span>
        </Link>
      ) : onClose ? (
        <button onClick={onClose} aria-label="Atrás" className="ml-auto text-ink-3">
          <span className="text-[16px]">←</span>
        </button>
      ) : null}
    </div>
  );
}

export { ArrowRight };
