"use client";

import React, { useState } from "react";
import { FadeIn, ScaleIn } from "./Motion";
import Link from "next/link";

export default function Hero() {
  const [carType, setCarType] = useState("");
  const [pickupLoc, setPickupLoc] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffLoc, setDropoffLoc] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ carType, pickupLoc, pickupDate, dropoffLoc, returnDate });
    // Redirect to cars listing with filters in query params
    const params = new URLSearchParams();
    if (carType) params.append("type", carType);
    if (pickupLoc) params.append("pickup", pickupLoc);
    window.location.href = `/cars?${params.toString()}`;
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
                    <h3 className="wow fadeInUp">welcome to car rent</h3>
                  </FadeIn>
                  <FadeIn delay={0.25}>
                    <h1 className="text-anime-style-3" data-cursor="-opaque">
                      Looking to save more on your rental car?
                    </h1>
                  </FadeIn>
                  <FadeIn delay={0.4}>
                    <p className="wow fadeInUp">
                      Whether you&apos;re planning a weekend getaway, a business trip, or just need a
                      reliable ride for the day, we offers a wide range of vehicles to suit your needs.
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
                          value={carType}
                          onChange={(e) => setCarType(e.target.value)}
                          style={{ background: "transparent", border: "none", color: "#616161", outline: "none" }}
                        >
                          <option value="" disabled>
                            Choose Car Type
                          </option>
                          <option value="sport">sport car</option>
                          <option value="convertible">convertible car</option>
                          <option value="sedan">sedan car</option>
                          <option value="luxury">luxury car</option>
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
                          value={pickupLoc}
                          onChange={(e) => setPickupLoc(e.target.value)}
                          style={{ background: "transparent", border: "none", color: "#616161", outline: "none" }}
                        >
                          <option value="" disabled>
                            Pick Up Location
                          </option>
                          <option value="abu_dhabi">abu dhabi</option>
                          <option value="alain">alain</option>
                          <option value="dubai">dubai</option>
                          <option value="sharjah">sharjah</option>
                        </select>
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      <div className="icon-box">
                        <img src="/images/icon-rent-details-3.svg" alt="Pickup Date" />
                      </div>
                      <div className="rent-details-content">
                        <h3>pickup date</h3>
                        <input
                          type="text"
                          name="date"
                          placeholder="mm/dd/yyyy"
                          className="rent-details-form"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                          required
                          style={{ background: "transparent", border: "none", color: "#616161", outline: "none", width: "100%" }}
                        />
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      <div className="icon-box">
                        <img src="/images/icon-rent-details-4.svg" alt="Dropoff Location" />
                      </div>
                      <div className="rent-details-content">
                        <h3>Dropoff location</h3>
                        <select
                          className="rent-details-form form-select"
                          value={dropoffLoc}
                          onChange={(e) => setDropoffLoc(e.target.value)}
                          style={{ background: "transparent", border: "none", color: "#616161", outline: "none" }}
                        >
                          <option value="" disabled>
                            Drop Off Location
                          </option>
                          <option value="abu_dhabi">abu dhabi</option>
                          <option value="alain">alain</option>
                          <option value="sharjah">sharjah</option>
                        </select>
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      <div className="icon-box">
                        <img src="/images/icon-rent-details-5.svg" alt="Return Date" />
                      </div>
                      <div className="rent-details-content">
                        <h3>Return Date</h3>
                        <input
                          type="text"
                          name="date"
                          placeholder="mm/dd/yyyy"
                          className="rent-details-form"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                          required
                          style={{ background: "transparent", border: "none", color: "#616161", outline: "none", width: "100%" }}
                        />
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    <button
                      type="submit"
                      className="rent-details-item rent-details-search"
                      style={{ border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      aria-label="Search"
                    >
                      <i className="fa-solid fa-magnifying-glass" style={{ color: "#fff" }}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* Filter Form End */}
        </div>
      </ScaleIn>
      {/* Rent Details Section End */}
    </div>
  );
}
