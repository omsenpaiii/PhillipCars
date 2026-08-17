"use client";

import React, { useMemo, useState } from "react";
import { FadeIn, ScaleIn } from "./Motion";
import Link from "next/link";
import { MELBOURNE_LOCATIONS } from "@/lib/australia";
import { getDefaultVehicleSearch, serializeVehicleSearch, validateVehicleSearch } from "@/lib/vehicle-search";

export default function Hero() {
  const defaults = useMemo(() => getDefaultVehicleSearch(), []);
  const [carType, setCarType] = useState("all");
  const [pickupLoc, setPickupLoc] = useState(defaults.pickup);
  const [pickupDate, setPickupDate] = useState(defaults.pickupDate);
  const [dropoffLoc, setDropoffLoc] = useState(defaults.dropoff);
  const [returnDate, setReturnDate] = useState(defaults.returnDate);
  const [sameLocation, setSameLocation] = useState(true);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria = { ...defaults, type: carType, pickup: pickupLoc, pickupDate, dropoff: sameLocation ? pickupLoc : dropoffLoc, returnDate };
    const validation = validateVehicleSearch(criteria);
    if (validation) { setError(validation); return; }
    window.location.href = `/cars?${serializeVehicleSearch(criteria).toString()}`;
  };

  return (
    <div className="hero">
      <div className="hero-section bg-section parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Hero Content Start */}
              <div className="hero-content">
                <div className="section-title">
                  <FadeIn delay={0.1}>
                    <h3 className="wow fadeInUp">Melbourne car hire, elevated</h3>
                  </FadeIn>
                  <FadeIn delay={0.25}>
                    <h1 className="text-anime-style-3" data-cursor="-opaque">
                      Your next Melbourne journey starts here
                    </h1>
                  </FadeIn>
                  <FadeIn delay={0.4}>
                    <p className="wow fadeInUp">
                      Discover quality vehicles for city days, airport transfers, coastal escapes, and business travel across Melbourne and Victoria.
                    </p>
                  </FadeIn>
                </div>

                <FadeIn delay={0.55} className="hero-content-body wow fadeInUp">
                  <Link href="/cars" className="btn-default">
                    book a rental
                  </Link>
                  <Link href="/#about" className="btn-default btn-highlighted">
                    learn more
                  </Link>
                </FadeIn>
              </div>
              {/* Hero Content End */}
            </div>
          </div>
        </div>
      </div>

      {/* Rent Details Section Start */}
      <ScaleIn delay={0.7} duration={0.7} className="rent-details wow fadeInUp">
        <div className="container">
          {/* Filter Form Start */}
          <form onSubmit={handleSearch}>
            <div className="row no-gutters align-items-center">
              <div className="col-md-12">
                <div className="rent-details-box">
                  <div className="rent-details-form">
                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      <div className="icon-box">
                        <img src="/images/icon-rent-details-1.svg" alt="Car Type" />
                      </div>
                      <div className="rent-details-content">
                        <h3>car type</h3>
                        <select
                          className="rent-details-form form-select"
                          aria-label="Vehicle type"
                          value={carType}
                          onChange={(e) => setCarType(e.target.value)}
                          style={{ background: "transparent", border: "none", color: "#616161", outline: "none" }}
                        >
                          <option value="all">All vehicle types</option>
                          <option value="sport">Performance</option>
                          <option value="convertible">Convertible</option>
                          <option value="sedan">Sedan</option>
                          <option value="luxury">Luxury</option>
                          <option value="caravan">Caravan Hire</option>
                        </select>
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      <div className="icon-box">
                        <img src="/images/icon-rent-details-2.svg" alt="Pickup Location" />
                      </div>
                      <div className="rent-details-content">
                        <h3>pickup location</h3>
                        <select
                          className="rent-details-form form-select"
                          aria-label="Pickup location"
                          value={pickupLoc}
                          onChange={(e) => setPickupLoc(e.target.value)}
                          style={{ background: "transparent", border: "none", color: "#616161", outline: "none" }}
                        >
                          {MELBOURNE_LOCATIONS.map((location) => (
                            <option key={location.value} value={location.value}>{location.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item" style={{ position: "relative" }}>
                      <div className="icon-box">
                        <img src="/images/icon-rent-details-3.svg" alt="Pickup Date" />
                      </div>
                      <div className="rent-details-content" style={{ width: "100%" }}>
                        <h3>pickup date</h3>
                        <input
                          type="date"
                          name="date"
                          className="rent-details-form date-input-field"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          required
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#616161",
                            outline: "none",
                            width: "100%",
                            cursor: "pointer",
                            minHeight: "24px"
                          }}
                        />
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    {!sameLocation && <div className="rent-details-item">
                      <div className="icon-box">
                        <img src="/images/icon-rent-details-4.svg" alt="Dropoff Location" />
                      </div>
                      <div className="rent-details-content">
                        <h3>Dropoff location</h3>
                        <select
                          className="rent-details-form form-select"
                          aria-label="Drop-off location"
                          value={dropoffLoc}
                          onChange={(e) => setDropoffLoc(e.target.value)}
                          style={{ background: "transparent", border: "none", color: "#616161", outline: "none" }}
                        >
                          {MELBOURNE_LOCATIONS.map((location) => (
                            <option key={location.value} value={location.value}>{location.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>}
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item" style={{ position: "relative" }}>
                      <div className="icon-box">
                        <img src="/images/icon-rent-details-5.svg" alt="Return Date" />
                      </div>
                      <div className="rent-details-content" style={{ width: "100%" }}>
                        <h3>Return Date</h3>
                        <input
                          type="date"
                          name="date"
                          className="rent-details-form date-input-field"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          required
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#616161",
                            outline: "none",
                            width: "100%",
                            cursor: "pointer",
                            minHeight: "24px"
                          }}
                        />
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    <div className="rent-details-item rent-details-search" style={{ border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <button
                        type="submit"
                        style={{
                          background: "var(--accent-color)",
                          border: "none",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                          margin: "0 auto",
                          outline: "none",
                          padding: 0
                        }}
                        className="search-btn-hero"
                        aria-label="Search cars"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--primary-color)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--accent-color)";
                        }}
                      >
                        <i className="fa-solid fa-magnifying-glass" style={{ color: "#fff", fontSize: "20px" }}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="journey-options">
            <label><input type="checkbox" checked={sameLocation} onChange={(event) => setSameLocation(event.target.checked)} /> Return to the same location</label>
            {error && <p role="alert">{error}</p>}
          </div>
          {/* Filter Form End */}
        </div>
      </ScaleIn>
      {/* Rent Details Section End */}
    </div>
  );
}
