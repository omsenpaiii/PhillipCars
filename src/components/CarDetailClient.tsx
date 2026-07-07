"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/app/actions/booking";
import { FadeIn, SlideIn } from "./Motion";
import Link from "next/link";
import type { FleetCar } from "@/lib/fleet-data";
import type { SessionUser } from "@/lib/auth";

interface CarDetailClientProps {
  car: FleetCar;
  user: SessionUser | null;
}

function getDefaultBookingDates() {
  const today = new Date();
  const returnDate = new Date();
  returnDate.setDate(today.getDate() + 2);

  return {
    pickup: today.toISOString().split("T")[0],
    returnDate: returnDate.toISOString().split("T")[0],
  };
}

export default function CarDetailClient({ car, user }: CarDetailClientProps) {
  const defaultDates = useMemo(() => getDefaultBookingDates(), []);
  const [bookingType, setBookingType] = useState<"rent" | "rent_to_own">("rent");
  const [pickupLoc, setPickupLoc] = useState("dubai");
  const [returnLoc, setReturnLoc] = useState("dubai");
  const [pickupDate, setPickupDate] = useState(defaultDates.pickup);
  const [returnDate, setReturnDate] = useState(defaultDates.returnDate);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();

  const { days, totalPrice } = useMemo(() => {
    if (!pickupDate || !returnDate) return { days: 0, totalPrice: 0 };

    const pick = new Date(pickupDate);
    const ret = new Date(returnDate);

    if (ret <= pick) {
      return { days: 0, totalPrice: 0 };
    }

    const diffTime = Math.abs(ret.getTime() - pick.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    if (bookingType === "rent") {
      return { days: diffDays, totalPrice: diffDays * parseFloat(car.price_per_day) };
    }

    // Rent-to-Own: proportional daily cost based on monthly rate
    const dailyRate = parseFloat(car.rent_to_own_price) / 30;
    return { days: diffDays, totalPrice: diffDays * dailyRate };
  }, [pickupDate, returnDate, bookingType, car.price_per_day, car.rent_to_own_price]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (days <= 0) {
      setError("Return date must be after pickup date.");
      setLoading(false);
      return;
    }

    try {
      const res = await createBookingAction({
        carId: car.id,
        pickupLocation: pickupLoc,
        pickupDate,
        returnLocation: returnLoc,
        returnDate,
        type: bookingType,
      });

      if (!res.success) {
        setError(res.error || "An error occurred.");
      } else {
        setSuccess("Booking confirmed! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch {
      setError("Failed to complete booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 15px" }}>
      <div className="row">
        {/* Left Side: Car Details */}
        <div className="col-lg-7">
          <SlideIn direction="left">
            <h1 style={{ fontSize: "40px", fontWeight: 700, color: "var(--primary-color)" }}>
              {car.name}
            </h1>
            <p style={{ textTransform: "uppercase", fontWeight: 700, color: "var(--accent-color)", letterSpacing: "1px" }}>
              {car.type} Class Fleet
            </p>
            
            {/* Big Car Image */}
            <div 
              style={{
                backgroundColor: "var(--secondary-color)",
                borderRadius: "24px",
                padding: "30px",
                textAlign: "center",
                margin: "30px 0",
                border: "1px solid var(--divider-color)"
              }}
            >
              <img src={car.image} alt={car.name} style={{ maxWidth: "100%", height: "auto" }} />
            </div>

            {/* Specifications Details */}
            <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Key Specifications</h3>
            <div className="row mb-5">
              <div className="col-md-3 col-6 mb-3">
                <div style={{ padding: "15px", border: "1px solid var(--divider-color)", borderRadius: "12px", textAlign: "center" }}>
                  <img src="/images/icon-fleet-list-1.svg" alt="" style={{ height: "20px", marginBottom: "8px" }} />
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-color)" }}>Passengers</p>
                  <strong style={{ fontSize: "16px", color: "var(--primary-color)" }}>{car.passengers} Seats</strong>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div style={{ padding: "15px", border: "1px solid var(--divider-color)", borderRadius: "12px", textAlign: "center" }}>
                  <img src="/images/icon-fleet-list-2.svg" alt="" style={{ height: "20px", marginBottom: "8px" }} />
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-color)" }}>Doors</p>
                  <strong style={{ fontSize: "16px", color: "var(--primary-color)" }}>{car.doors} Doors</strong>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div style={{ padding: "15px", border: "1px solid var(--divider-color)", borderRadius: "12px", textAlign: "center" }}>
                  <img src="/images/icon-fleet-list-3.svg" alt="" style={{ height: "20px", marginBottom: "8px" }} />
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-color)" }}>Bags</p>
                  <strong style={{ fontSize: "16px", color: "var(--primary-color)" }}>{car.bags} Luggage</strong>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div style={{ padding: "15px", border: "1px solid var(--divider-color)", borderRadius: "12px", textAlign: "center" }}>
                  <img src="/images/icon-fleet-list-4.svg" alt="" style={{ height: "20px", marginBottom: "8px" }} />
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-color)" }}>Gearbox</p>
                  <strong style={{ fontSize: "16px", color: "var(--primary-color)", textTransform: "capitalize" }}>{car.transmission}</strong>
                </div>
              </div>
            </div>

            {/* Rent-to-Own program details */}
            <div 
              style={{
                backgroundColor: "var(--primary-color)",
                color: "#fff",
                borderRadius: "18px",
                padding: "30px",
                marginBottom: "40px"
              }}
            >
              <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                Interested in owning this car?
              </h3>
              <p style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.6" }}>
                Our exclusive <strong>Rent-to-Own</strong> program lets you build equity with every monthly payment. 
                Instead of simple renting, you accumulate credit towards the purchase of this vehicle. 
                Enjoy flexible lease periods, inclusive maintenance plans, and easy ownership transfers!
              </p>
              <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
                <span style={{ fontSize: "14px", color: "var(--accent-color)", fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check me-1"></i> No Credit Check Required
                </span>
                <span style={{ fontSize: "14px", color: "var(--accent-color)", fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check me-1"></i> Full Comprehensive Insurance
                </span>
              </div>
            </div>

            {/* Features List */}
            <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "15px" }}>Premium Features Included</h3>
            <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: 0, listStyle: "none" }}>
              {car.features && car.features.map((feature: string, idx: number) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", color: "var(--text-color)", fontSize: "15px" }}>
                  <i className="fa-solid fa-check text-success me-2"></i>
                  {feature}
                </li>
              ))}
            </ul>
          </SlideIn>
        </div>

        {/* Right Side: Checkout Booking Widget */}
        <div className="col-lg-5">
          <FadeIn>
            <div 
              style={{
                backgroundColor: "#fff",
                borderRadius: "24px",
                padding: "35px",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.04)",
                border: "1px solid var(--divider-color)",
                position: "sticky",
                top: "140px"
              }}
            >
              <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "25px" }}>Book Rental</h3>
              
              {/* Toggle Rent vs Rent-to-Own */}
              <div 
                style={{
                  display: "flex",
                  backgroundColor: "var(--secondary-color)",
                  borderRadius: "100px",
                  padding: "6px",
                  marginBottom: "25px"
                }}
              >
                <button
                  type="button"
                  onClick={() => setBookingType("rent")}
                  style={{
                    flex: 1,
                    borderRadius: "100px",
                    border: "none",
                    padding: "10px",
                    fontWeight: 700,
                    fontSize: "14px",
                    backgroundColor: bookingType === "rent" ? "var(--accent-color)" : "transparent",
                    color: bookingType === "rent" ? "#fff" : "var(--primary-color)",
                    transition: "all 0.3s"
                  }}
                >
                  Standard Rent
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType("rent_to_own")}
                  style={{
                    flex: 1,
                    borderRadius: "100px",
                    border: "none",
                    padding: "10px",
                    fontWeight: 700,
                    fontSize: "14px",
                    backgroundColor: bookingType === "rent_to_own" ? "var(--accent-color)" : "transparent",
                    color: bookingType === "rent_to_own" ? "#fff" : "var(--primary-color)",
                    transition: "all 0.3s"
                  }}
                >
                  Rent-to-Own
                </button>
              </div>

              {/* Pricing breakdown header */}
              <div className="mb-4 text-center">
                {bookingType === "rent" ? (
                  <h2>
                    ${parseFloat(car.price_per_day).toFixed(0)}
                    <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-color)" }}>/day</span>
                  </h2>
                ) : (
                  <h2>
                    ${parseFloat(car.rent_to_own_price).toFixed(0)}
                    <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-color)" }}>/month</span>
                  </h2>
                )}
              </div>

              {/* Booking Message Alerts */}
              {error && (
                <div className="alert alert-danger" style={{ borderRadius: "10px", fontSize: "14px" }}>
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" style={{ borderRadius: "10px", fontSize: "14px" }}>
                  {success}
                </div>
              )}

              {/* Booking Form */}
              {!user ? (
                <div className="text-center pt-2">
                  <p style={{ color: "var(--text-color)", fontSize: "14px" }}>
                    Sign in to check out and reserve this vehicle instantly.
                  </p>
                  <Link href={`/auth?redirect=/cars/${car.id}`} className="btn-default btn-no-overflow w-100 text-center">
                    Sign In to Book
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBook}>
                  {/* Pickup location */}
                  <div className="mb-3">
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "4px" }}>
                      Pickup Location
                    </label>
                    <select 
                      className="form-select"
                      value={pickupLoc}
                      onChange={(e) => setPickupLoc(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    >
                      <option value="dubai">Dubai International Airport</option>
                      <option value="abu_dhabi">Abu Dhabi Mall</option>
                      <option value="alain">Al Ain City Center</option>
                      <option value="sharjah">Sharjah Airport</option>
                    </select>
                  </div>

                  {/* Return location */}
                  <div className="mb-3">
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "4px" }}>
                      Return Location
                    </label>
                    <select 
                      className="form-select"
                      value={returnLoc}
                      onChange={(e) => setReturnLoc(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    >
                      <option value="dubai">Dubai International Airport</option>
                      <option value="abu_dhabi">Abu Dhabi Mall</option>
                      <option value="alain">Al Ain City Center</option>
                      <option value="sharjah">Sharjah Airport</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="row mb-3">
                    <div className="col-6">
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "4px" }}>
                        Pickup Date
                      </label>
                      <input 
                        type="date"
                        className="form-control"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "4px" }}>
                        Return Date
                      </label>
                      <input 
                        type="date"
                        className="form-control"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                    </div>
                  </div>

                  {/* Summary Pricing List */}
                  {days > 0 && (
                    <div 
                      style={{
                        margin: "25px 0",
                        padding: "15px 0",
                        borderTop: "1px dashed var(--divider-color)",
                        borderBottom: "1px dashed var(--divider-color)",
                        fontSize: "14px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span>
                          {bookingType === "rent" ? "Daily rate" : "Rent-to-Own daily rate"} x {days} days
                        </span>
                        <span>
                          ${(totalPrice).toFixed(2)}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span>Taxes & Fees (10%)</span>
                        <span>${(totalPrice * 0.1).toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "16px", marginTop: "12px", color: "var(--primary-color)" }}>
                        <span>Total Price</span>
                        <span>${(totalPrice * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-default btn-no-overflow w-100" 
                    style={{
                      height: "50px",
                      borderRadius: "100px",
                      marginRight: 0,
                      backgroundColor: loading ? "#ccc" : "var(--accent-color)",
                      cursor: loading ? "not-allowed" : "pointer"
                    }}
                  >
                    {loading ? "Processing..." : "Confirm & Book Now"}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
