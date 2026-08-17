import Link from "next/link";
import { MELBOURNE_LOCATIONS } from "@/lib/australia";

export default function MelbourneCoverage() {
  return (
    <section className="melbourne-coverage" aria-labelledby="melbourne-coverage-title">
      <div className="container">
        <div className="melbourne-coverage-shell">
          <div className="melbourne-coverage-content">
            <div className="section-title">
              <h3>Melbourne service area</h3>
              <h2 id="melbourne-coverage-title">Premium car access across Melbourne and Victoria</h2>
              <p>
                Arrange pickup or return across key Melbourne neighbourhoods, major airports, and Geelong—with local support throughout your journey.
              </p>
            </div>

            <div className="coverage-locations" aria-label="Popular Zoomli locations">
              {MELBOURNE_LOCATIONS.slice(0, 6).map((location) => (
                <span key={location.value}>
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  {location.label}
                </span>
              ))}
            </div>

            <Link href="/cars" className="btn-default">
              Explore vehicles
            </Link>
          </div>

          <div className="melbourne-coverage-map">
            <iframe
              title="Zoomli Melbourne and Victoria service area"
              src="https://www.google.com/maps?q=Melbourne%20Victoria%20Australia&z=9&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="coverage-map-badge">
              <span>Local coverage</span>
              <strong>Melbourne · Victoria</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
