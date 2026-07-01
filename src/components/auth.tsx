"use client";

import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { FieldLabel } from "./ui";

export function SocialRow() {
  return (
    <div className="flex gap-3">
      <button className="flex h-[52px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1.5px] border-line-strong bg-surface text-[15px] font-bold text-ink transition-all duration-[160ms] hover:bg-cream">
        <span className="text-[17px] font-extrabold text-[#4285F4]">G</span>Google
      </button>
      <button className="flex h-[52px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1.5px] border-line-strong bg-surface text-[15px] font-bold text-ink transition-all duration-[160ms] hover:bg-cream">
        <AppleMark />
        Apple
      </button>
    </div>
  );
}

function AppleMark() {
  return (
    <svg width="16" height="18" viewBox="0 0 384 512" fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-line-strong" />
      <span className="text-[13px] font-semibold text-ink-faint">ან</span>
      <span className="h-px flex-1 bg-line-strong" />
    </div>
  );
}

export function passwordScore(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-zა-ჰ]/i.test(pw) && /\d/.test(pw)) score++;
  if (/[A-Z]/.test(pw) || /[^a-z0-9ა-ჰ]/i.test(pw)) score++;
  return Math.min(4, Math.max(pw.length > 0 ? 1 : 0, score));
}

export function StrengthMeter({ password }: { password: string }) {
  const score = passwordScore(password);
  return (
    <div className="mt-[9px] flex gap-[5px]">
      {Array.from({ length: 4 }, (_, i) => {
        let color = "var(--color-line)";
        if (i < score) color = score >= i + 2 || score === 4 ? "var(--color-success)" : "var(--color-accent)";
        return <span key={i} className="h-[5px] flex-1 rounded-full" style={{ background: color }} />;
      })}
    </div>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  meter,
  confirmMatch,
  labelRight,
  autoFocusBorder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  meter?: boolean;
  /** show a green ✓ when it matches this value */
  confirmMatch?: string;
  labelRight?: React.ReactNode;
  autoFocusBorder?: boolean;
}) {
  const [show, setShow] = useState(false);
  const matches = confirmMatch !== undefined && value.length > 0 && value === confirmMatch;
  return (
    <div>
      {labelRight ? (
        <div className="mb-[7px] flex items-baseline justify-between">
          <label className="text-[13px] font-bold text-ink-label">{label}</label>
          {labelRight}
        </div>
      ) : (
        <FieldLabel>{label}</FieldLabel>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-[52px] w-full rounded-[14px] border-[1.5px] bg-surface pl-4 pr-12 text-base font-medium text-ink outline-none transition-colors duration-[160ms] focus:border-primary ${
            autoFocusBorder ? "border-primary" : "border-line-strong"
          }`}
        />
        {matches ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-success">
            <Check size={18} strokeWidth={4} />
          </span>
        ) : (
          <button
            type="button"
            aria-label={show ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-ink-faint"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {meter && <StrengthMeter password={value} />}
    </div>
  );
}
