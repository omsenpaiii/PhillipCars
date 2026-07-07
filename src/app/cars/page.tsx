"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCarsAction, CarFilters } from "../actions/cars";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/Motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function CarSkeleton() {
  return (
    <div 
      className="perfect-fleet-item" 
      style={{ 
        height: "100%", 
        border: "1px solid var(--divider-color)", 
        borderRadius: "18px", 
        overflow: "hidden",
        backgroundColor: "#fff",
        pointerEvents: "none"
      }}
    >
      {/* Image box placeholder */}
      <div className="skeleton-shimmer" style={{ height: "200px", width: "100%" }}></div>
      
      {/* Content placeholder */}
      <div className="perfect-fleet-content" style={{ padding: "30px" }}>
        <div className="skeleton-shimmer" style={{ height: "12px", width: "25%", borderRadius: "4px", marginBottom: "12px" }}></div>
        <div className="skeleton-shimmer" style={{ height: "24px", width: "65%", borderRadius: "6px", marginBottom: "25px" }}></div>
        
        {/* Specs placeholder */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
          <div className="skeleton-shimmer" style={{ height: "16px", flex: 1, borderRadius: "4px" }}></div>
          <div className="skeleton-shimmer" style={{ height: "16px", flex: 1, borderRadius: "4px" }}></div>
          <div className="skeleton-shimmer" style={{ height: "16px", flex: 1, borderRadius: "4px" }}></div>
        </div>
        
        {/* Footer placeholder */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ width: "45%" }}>
            <div className="skeleton-shimmer" style={{ height: "24px", width: "80%", borderRadius: "6px", marginBottom: "6px" }}></div>
            <div className="skeleton-shimmer" style={{ height: "10px", width: "60%", borderRadius: "3px" }}></div>
          </div>
          <div className="skeleton-shimmer" style={{ height: "44px", width: "44px", borderRadius: "50%" }}></div>
        </div>
      </div>
    </div>
  );
}

interface Car {
  id: string;
  name: string;
  type: string;
  image: string;
  price_per_day: string;
  rent_to_own_price: string;
  doors: number;
  passengers: number;
  bags: number;
  transmission: string;
  status: string;
  features?: string[];
  host_id?: string;
}

function CarsContent() {
  const [mounted, setMounted] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [maxPrice, setMaxPrice] = useState(500);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const filters: CarFilters = {
      type,
      transmission,
      maxPrice,
      search: search || undefined,
    };
    const res = await getCarsAction(filters);
    if (res.success && res.cars) {
      setCars(res.cars as Car[]);
    }
    setLoading(false);
    setHasFetched(true);
  }, [type, transmission, maxPrice, search]);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const timer = setTimeout(() => {
      setMounted(true);
      if (typeParam) {
        setType(typeParam);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        fetchCars();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [mounted, fetchCars]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCars();
  };

  return (
    <div className="container" style={{ padding: "60px 15px" }}>
      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 mb-5">
          <FadeIn>
            <div 
              style={{
                backgroundColor: "#fff",
                borderRadius: "18px",
                padding: "25px",
                border: "1px solid var(--divider-color)",
                boxShadow: "0px 5px 15px rgba(0,0,0,0.02)"
              }}
            >
              <h3 style={{ fontSize: "20px", marginBottom: "20px", fontWeight: 700 }}>Filters</h3>
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="form-group" style={{ position: "relative" }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ borderRadius: "10px", paddingRight: "40px", border: "1px solid var(--divider-color)" }}
                  />
                  <button 
                    type="submit" 
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer"
                    }}
                    aria-label="Search"
                  >
                    <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--text-color)" }}></i>
                  </button>
                </div>
              </form>

              {/* Car Type */}
              <div className="mb-4">
                <h4 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px" }}>Car Type</h4>
                <select 
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ borderRadius: "10px", border: "1px solid var(--divider-color)" }}
                >
                  <option value="all">All Types</option>
                  <option value="sport">Sport Car</option>
                  <option value="convertible">Convertible</option>
                  <option value="sedan">Sedan Car</option>
                  <option value="luxury">Luxury Car</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-4">
                <h4 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px" }}>Transmission</h4>
                <select 
                  className="form-select"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  style={{ borderRadius: "10px", border: "1px solid var(--divider-color)" }}
                >
                  <option value="all">All Transmissions</option>
                  <option value="auto">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Max Daily Price */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: 600, margin: 0 }}>Max Daily Rate</h4>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-color)" }}>${maxPrice}</span>
                </div>
                <input 
                  type="range" 
                  className="form-range" 
                  min="100" 
                  max="500" 
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  style={{ accentColor: "var(--accent-color)" }}
                />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Cars Grid */}
        <div className="col-lg-9">
          {(!mounted || loading) ? (
            <div className="row">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="col-md-6 mb-4">
                  <CarSkeleton />
                </div>
              ))}
            </div>
          ) : (cars.length === 0 && hasFetched) ? (
            <div className="text-center" style={{ padding: "100px 0" }}>
              <i className="fa-solid fa-car-rear mb-3" style={{ fontSize: "48px", color: "#ccc" }}></i>
              <h3>No Cars Found</h3>
              <p style={{ color: "var(--text-color)" }}>Try adjusting your filters to find available vehicles.</p>
            </div>
          ) : (
            <FadeInStagger className="row">
              {cars.map((car) => (
                <div key={car.id} className="col-md-6 mb-4">
                  <FadeInStaggerItem className="perfect-fleet-item" style={{ height: "100%" }}>
                    {/* Image Box */}
                    <div className="image-box">
                      <img src={car.image} alt={car.name} style={{ width: "100%", height: "auto" }} />
                    </div>

                    {/* Content */}
                    <div className="perfect-fleet-content">
                      <div className="perfect-fleet-title">
                        <h3 style={{ textTransform: "capitalize" }}>{car.type} car</h3>
                        <h2>{car.name}</h2>
                      </div>

                      {/* Specs */}
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

                      {/* Footer / Booking Actions */}
                      <div className="perfect-fleet-footer">
                        <div className="perfect-fleet-pricing">
                          <h2>
                            ${parseFloat(car.price_per_day).toFixed(0)}
                            <span>/day</span>
                          </h2>
                          <p style={{ fontSize: "12px", color: "var(--text-color)", margin: 0 }}>
                            Rent-to-Own: ${parseFloat(car.rent_to_own_price).toFixed(0)}/mo
                          </p>
                        </div>

                        <div className="perfect-fleet-btn">
                          <Link href={`/cars/${car.id}`} className="section-icon-btn">
                            <img src="/images/arrow-white.svg" alt="Rent now" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </FadeInStaggerItem>
                </div>
              ))}
            </FadeInStagger>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div 
        className="page-header bg-section" 
        style={{
          marginTop: "120px",
          padding: "60px 0",
          backgroundImage: "url('/images/page-header-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center"
        }}
      >
        <div className="container">
          <h1 style={{ color: "#fff", fontSize: "48px", fontWeight: 700 }}>Our Fleets</h1>
          <p style={{ color: "#eee", fontSize: "16px", marginTop: "10px" }}>
            Explore our extensive fleet and find the perfect car for your next journey
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="container" style={{ padding: "60px 15px" }}>
            <div className="row">
              <div className="col-lg-3">
                <div style={{ height: "300px", backgroundColor: "#fff", borderRadius: "18px", border: "1px solid var(--divider-color)" }} className="skeleton-shimmer"></div>
              </div>
              <div className="col-lg-9">
                <div className="row">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="col-md-6 mb-4">
                      <div style={{ height: "450px", backgroundColor: "#fff", borderRadius: "18px", border: "1px solid var(--divider-color)" }} className="skeleton-shimmer"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <CarsContent />
      </Suspense>

      <Footer />
    </>
  );
}
