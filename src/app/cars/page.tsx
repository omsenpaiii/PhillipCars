"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCarsAction, CarFilters } from "../actions/cars";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/Motion";
import FleetCard from "@/components/FleetCard";
import type { FleetCar } from "@/lib/fleet-data";
import { useSearchParams } from "next/navigation";
import BrandedLoader from "@/components/BrandedLoader";

function CarsContent() {
  const [mounted, setMounted] = useState(false);
  const [cars, setCars] = useState<FleetCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [maxPrice, setMaxPrice] = useState(500);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const filters: CarFilters = {
      type,
      transmission,
      maxPrice,
      search: searchQuery || undefined,
    };
    const res = await getCarsAction(filters);
    if (res.success && res.cars) {
      setCars(res.cars);
    } else {
      setCars([]);
    }
    setLoading(false);
    setHasFetched(true);
  }, [type, transmission, maxPrice, searchQuery]);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const timer = setTimeout(() => {
      setMounted(true);
      setType(typeParam || "all");
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
    setSearchQuery(search);
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
            <BrandedLoader label="Loading available cars..." fullScreen={false} />
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
                  <FadeInStaggerItem style={{ height: "100%" }}>
                    <FleetCard car={car} showRentToOwn />
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
        className="page-header bg-section fleet-page-header" 
        style={{
          padding: "54px 0",
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
            <BrandedLoader label="Loading available cars..." fullScreen={false} />
          </div>
        }
      >
        <CarsContent />
      </Suspense>

      <Footer />
    </>
  );
}
