/*
 * HeartCat — the ატეხილი logo, rebuilt as SVG from design/screens/HeartCat.dc.html.
 * The face is a heart (chin = the heart's point) with pointed notched ears;
 * mood="angry" adds slanted brows + narrowed eyes (brand), "calm" is the
 * success/celebration variant.
 */
export interface HeartCatProps {
  size?: number;
  bg?: string;
  fg?: string;
  ink?: string;
  mood?: "angry" | "calm";
  shadow?: boolean;
  className?: string;
}

export default function HeartCat({
  size = 120,
  bg = "#E2643B",
  fg = "#FFFFFF",
  ink,
  mood = "angry",
  shadow = true,
  className,
}: HeartCatProps) {
  const inkColor = ink ?? bg;
  const angry = mood === "angry";
  const radius = 120 * 0.28;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={shadow ? { filter: `drop-shadow(0 12px 26px ${bg}66)` } : undefined}
      role="img"
      aria-label="ატეხილი"
    >
      <rect width="120" height="120" rx={radius} fill={bg} />
      {/* heart lobes: rounded-top rects rotated to meet at a bottom point */}
      <path
        d="M0 22 A22 22 0 0 1 44 22 V70 H0 Z"
        fill={fg}
        transform="translate(60 26) rotate(-45 0 70)"
      />
      <path
        d="M0 22 A22 22 0 0 1 44 22 V70 H0 Z"
        fill={fg}
        transform="translate(16 26) rotate(45 44 70)"
      />
      {/* pointed ears over each hump */}
      <polygon points="15,0 30,34 0,34" fill={fg} transform="translate(22 2) rotate(-12 15 17)" />
      <polygon points="15,0 30,34 0,34" fill={fg} transform="translate(68 2) rotate(12 15 17)" />
      {/* ear notches */}
      <polygon points="6,0 12,16 0,16" fill={bg} transform="translate(31 12) rotate(-12 6 8)" />
      <polygon points="6,0 12,16 0,16" fill={bg} transform="translate(77 12) rotate(12 6 8)" />
      {/* angry brows */}
      {angry && (
        <>
          <rect x="40" y="51" width="19" height="6" rx="3" fill={inkColor} transform="rotate(20 49.5 54)" />
          <rect x="61" y="51" width="19" height="6" rx="3" fill={inkColor} transform="rotate(-20 70.5 54)" />
        </>
      )}
      {/* eyes */}
      <ellipse
        cx="49.5"
        cy={angry ? 65.5 : 66}
        rx="4.5"
        ry={angry ? 5.5 : 6}
        fill={inkColor}
        transform={angry ? "rotate(16 49.5 65.5)" : undefined}
      />
      <ellipse
        cx="70.5"
        cy={angry ? 65.5 : 66}
        rx="4.5"
        ry={angry ? 5.5 : 6}
        fill={inkColor}
        transform={angry ? "rotate(-16 70.5 65.5)" : undefined}
      />
      {/* nose */}
      <polygon points="54,75 66,75 60,83" fill={inkColor} />
    </svg>
  );
}
