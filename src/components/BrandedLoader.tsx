import Image from "next/image";

interface BrandedLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export default function BrandedLoader({
  label = "Loading...",
  fullScreen = true,
}: BrandedLoaderProps) {
  return (
    <div
      className={fullScreen ? "preloader" : "branded-loader-inline"}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="loading-container">
        <div className="loading" aria-hidden="true" />
        <div className="loading-icon">
          <Image src="/images/loader.svg" alt="" width={66} height={66} priority={fullScreen} />
        </div>
      </div>
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
