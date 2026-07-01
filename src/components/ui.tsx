"use client";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

/* ---------- Buttons ---------- */

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "h-[54px] rounded-2xl bg-primary text-white text-[17px] font-bold shadow-glow hover:bg-primary-hover hover:-translate-y-px hover:shadow-glow-hover active:translate-y-0",
  secondary:
    "h-[54px] rounded-2xl bg-terracotta-100 text-primary-hover text-[17px] font-bold hover:bg-[#F6CDB9]",
  outline:
    "h-[50px] rounded-2xl border-2 border-line-strong bg-transparent text-ink-label text-base font-bold hover:bg-surface",
  ghost: "h-[50px] rounded-2xl bg-transparent text-ink-muted text-[15px] font-bold hover:bg-fill",
  destructive:
    "h-[54px] rounded-2xl bg-danger text-white text-[17px] font-extrabold shadow-glow-danger hover:brightness-95",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`w-full cursor-pointer transition-all duration-[160ms] disabled:opacity-50 disabled:pointer-events-none ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function BackButton({ onClick, className = "" }: { onClick?: () => void; className?: string }) {
  const router = useRouter();
  return (
    <button
      aria-label="უკან"
      onClick={onClick ?? (() => router.back())}
      className={`flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-label transition-all duration-[160ms] hover:border-terracotta-200 hover:bg-terracotta-100 hover:text-primary-hover ${className}`}
    >
      <ChevronLeft size={20} strokeWidth={2.5} />
    </button>
  );
}

/* ---------- Form fields ---------- */

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-[7px] block text-[13px] font-bold text-ink-label">{children}</label>;
}

export function TextInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-[52px] w-full rounded-[14px] border-[1.5px] border-line-strong bg-surface px-4 text-base font-medium text-ink outline-none transition-colors duration-[160ms] focus:border-primary ${className}`}
      {...props}
    />
  );
}

/** Select-style row with a trailing affordance (›, emoji…). */
export function SelectRow({
  value,
  trailing,
  onClick,
  leading,
}: {
  value: ReactNode;
  trailing?: ReactNode;
  leading?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[52px] w-full cursor-pointer items-center justify-between rounded-[14px] border-[1.5px] border-line-strong bg-surface px-4 text-left transition-colors duration-[160ms] hover:border-terracotta-200"
    >
      <span className="flex items-center gap-2 text-base font-semibold text-ink">
        {leading}
        {value}
      </span>
      <span className="text-lg text-ink-faint">{trailing ?? <ChevronRight size={18} />}</span>
    </button>
  );
}

export function Toggle({
  on,
  onChange,
  small,
}: {
  on: boolean;
  onChange?: (v: boolean) => void;
  small?: boolean;
}) {
  const w = small ? "h-7 w-12" : "h-[30px] w-[50px]";
  const knob = small ? "h-[22px] w-[22px]" : "h-6 w-6";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange?.(!on)}
      className={`relative flex-none cursor-pointer rounded-full transition-colors duration-[220ms] ${w} ${on ? "bg-success" : "bg-line-strong"}`}
    >
      <span
        className={`absolute top-[3px] rounded-full bg-white transition-all duration-[220ms] ease-(--ease-spring) ${knob} ${on ? "right-[3px]" : "left-[3px]"}`}
      />
    </button>
  );
}

export function Checkbox({ checked, onChange }: { checked: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`mt-px flex h-[22px] w-[22px] flex-none cursor-pointer items-center justify-center rounded-[7px] transition-colors duration-[160ms] ${
        checked ? "bg-primary text-white" : "border-2 border-line-strong bg-surface"
      }`}
    >
      {checked && <Check size={14} strokeWidth={4} />}
    </button>
  );
}

/* ---------- Badges, chips, banners ---------- */

export function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <span
      title="ვერიფიცირებული"
      className="inline-flex flex-none items-center justify-center rounded-full bg-accent text-white"
      style={{ width: size, height: size }}
    >
      <Check size={size * 0.62} strokeWidth={4.5} />
    </span>
  );
}

export function Chip({
  tone = "green",
  children,
  className = "",
}: {
  tone?: "green" | "terracotta" | "gold" | "muted";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    green: "bg-chip-green text-chip-green-text",
    terracotta: "bg-terracotta-50 text-primary-hover",
    gold: "bg-chip-gold text-chip-gold-text",
    muted: "bg-fill text-ink-muted",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Over-photo info pill (white translucent). */
export function PhotoPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[5px] rounded-full bg-white/94 px-3 py-1.5 text-xs font-bold text-ink-label">
      {children}
    </span>
  );
}

export function Banner({
  icon,
  children,
  tone = "warm",
}: {
  icon: ReactNode;
  children: ReactNode;
  tone?: "warm";
}) {
  void tone;
  return (
    <div className="flex items-start gap-2 rounded-xl bg-banner-warm px-3.5 py-3">
      <span className="text-[15px] leading-5">{icon}</span>
      <span className="text-[13px] font-semibold leading-relaxed text-chip-gold-text">{children}</span>
    </div>
  );
}

export function SectionLabel({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "terracotta" }) {
  return (
    <div
      className={`mb-2.5 text-xs font-extrabold uppercase tracking-[0.06em] ${
        tone === "terracotta" ? "text-primary-hover" : "text-ink-faint"
      }`}
    >
      {children}
    </div>
  );
}

/* ---------- Wizard progress ---------- */

export function WizardProgress({ step, total }: { step: number; total: number }) {
  return (
    <>
      <div className="flex flex-1 gap-[5px]">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-line"}`}
          />
        ))}
      </div>
      <span className="flex-none font-mono text-xs font-bold text-ink-faint">
        {step}/{total}
      </span>
    </>
  );
}

/* ---------- Segmented control ---------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  height = 50,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  height?: number;
}) {
  return (
    <div className="flex gap-2.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{ height }}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[14px] text-[15px] font-bold transition-all duration-[160ms] ${
              active
                ? "border-2 border-primary bg-terracotta-50 text-primary-hover"
                : "border-[1.5px] border-line-strong bg-surface text-ink-label hover:border-terracotta-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Screen scaffold ---------- */

export function Screen({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`flex min-h-dvh flex-col ${padded ? "px-[26px] pb-11 pt-[calc(env(safe-area-inset-top)+28px)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
