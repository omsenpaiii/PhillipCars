interface BrandLogoProps {
  variant?: "light" | "dark";
  size?: "md" | "lg";
}

export default function BrandLogo({ variant = "dark", size = "md" }: BrandLogoProps) {
  const fontSize = size === "lg" ? 30 : 28;
  const darkColor = variant === "light" ? "#ffffff" : "var(--primary-color)";

  return (
    <span className="brand-logo" aria-label="Zoomli">
      <span
        style={{
          color: "var(--accent-color)",
          fontSize,
        }}
      >
        ZOOM
      </span>
      <span style={{ color: darkColor, fontSize }}>
        LI
      </span>
    </span>
  );
}
