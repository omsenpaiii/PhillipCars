interface BrandLogoProps {
  variant?: "light" | "dark";
  size?: "md" | "lg";
}

export default function BrandLogo({ variant = "dark", size = "md" }: BrandLogoProps) {
  const fontSize = size === "lg" ? 30 : 28;
  const darkColor = variant === "light" ? "#ffffff" : "var(--primary-color)";

  return (
    <span
      className={`brand-logo brand-logo-${size}`}
      aria-label="Zoomli"
      style={{
        "--brand-base-size": `${fontSize}px`,
        "--brand-dark-color": darkColor,
      } as React.CSSProperties}
    >
      <span className="brand-logo-initial" aria-hidden="true">Z</span>
      <span className="brand-logo-accent" aria-hidden="true">OOM</span>
      <span className="brand-logo-dark" aria-hidden="true">L</span>
      <span className="brand-logo-i" aria-hidden="true">i</span>
    </span>
  );
}
