"use client";

import { useCallback, useRef } from "react";

function useTrackDrag(onRatio: (r: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const handle = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      onRatio(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
    },
    [onRatio],
  );
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    handle(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons > 0) handle(e.clientX);
  };
  return { ref, onPointerDown, onPointerMove };
}

function Thumb({ left }: { left: string }) {
  return (
    <div
      className="absolute top-1/2 h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white shadow-[0_3px_8px_-2px_rgba(82,31,18,0.3)]"
      style={{ left }}
    />
  );
}

export function Slider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const drag = useTrackDrag((r) => onChange(Math.round(min + r * (max - min))));
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div
      {...drag}
      className="relative h-8 cursor-pointer touch-none"
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-line">
        <div className="absolute left-0 top-0 h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <Thumb left={`${pct}%`} />
    </div>
  );
}

export function DualSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const drag = useTrackDrag((r) => {
    const v = Math.round(min + r * (max - min));
    // move whichever handle is nearer
    if (Math.abs(v - lo) <= Math.abs(v - hi)) onChange([Math.min(v, hi), hi]);
    else onChange([lo, Math.max(v, lo)]);
  });
  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;
  return (
    <div
      {...drag}
      className="relative h-8 cursor-pointer touch-none"
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={lo}
      aria-valuetext={`${lo}–${hi}`}
    >
      <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-line">
        <div
          className="absolute top-0 h-2 rounded-full bg-primary"
          style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }}
        />
      </div>
      <Thumb left={`${loPct}%`} />
      <Thumb left={`${hiPct}%`} />
    </div>
  );
}
