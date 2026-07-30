import { useId } from "react";

type ParenaMarkProps = {
  size?: number;
  className?: string;
};

/** PARENA arena logosu — altın yaylar ve merkez nokta. */
export function ParenaMark({ size = 44, className }: ParenaMarkProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      role="img"
      aria-label="PARENA"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#13294B" />
          <stop offset="1" stopColor="#0C1D38" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="21" fill={`url(#${gradientId})`} />
      <path
        d="M22 6 A16 16 0 0 1 38 22"
        fill="none"
        stroke="#E0B54E"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M22 38 A16 16 0 0 1 6 22"
        fill="none"
        stroke="#E0B54E"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity=".55"
      />
      <path
        d="M22 11.5 A10.5 10.5 0 0 1 32.5 22"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity=".85"
      />
      <path
        d="M22 32.5 A10.5 10.5 0 0 1 11.5 22"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity=".4"
      />
      <circle cx="22" cy="22" r="5" fill="#E0B54E" />
      <circle cx="22" cy="22" r="2" fill="#FFF" opacity=".9" />
    </svg>
  );
}
