import Link from "next/link";
import type { FleetCar } from "@/lib/fleet-data";

interface FleetCardProps {
  car: FleetCar;
  showRentToOwn?: boolean;
  searchParams?: string;
}

function formatMoney(value: string) {
  return Number.parseFloat(value || "0").toFixed(0);
}

export default function FleetCard({ car, showRentToOwn = false, searchParams }: FleetCardProps) {
  const href = `/cars/${car.id}${searchParams ? `?${searchParams}` : ""}`;
  return (
    <div className="perfect-fleet-item fleet-card">
      <Link href={href} className="image-box fleet-card-image-link" data-cursor-text="View">
        <img src={car.image} alt={car.name} />
      </Link>

      <div className="perfect-fleet-content">
        <div className="perfect-fleet-title">
          <h3>{car.type} car</h3>
          <h2>{car.name}</h2>
        </div>

        <div className="perfect-fleet-body">
          <ul>
            <li>
              <img src="/images/icon-fleet-list-1.svg" alt="" />
              {car.passengers} passenger
            </li>
            <li>
              <img src="/images/icon-fleet-list-2.svg" alt="" />
              {car.doors} door
            </li>
            <li>
              <img src="/images/icon-fleet-list-3.svg" alt="" />
              {car.bags} bags
            </li>
            <li>
              <img src="/images/icon-fleet-list-4.svg" alt="" />
              {car.transmission}
            </li>
          </ul>
        </div>

        <div className="perfect-fleet-footer">
          <div className="perfect-fleet-pricing">
            <h2>
              ${formatMoney(car.price_per_day)}
              <span>/day</span>
            </h2>
            {showRentToOwn && (
              <p>
                Rent-to-Own: ${formatMoney(car.rent_to_own_price)}
                <span>/mo</span>
              </p>
            )}
          </div>

          <div className="perfect-fleet-btn">
            <Link href={href} className="section-icon-btn" data-cursor-text="Rent">
              <img src="/images/arrow-white.svg" alt="Rent now" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
