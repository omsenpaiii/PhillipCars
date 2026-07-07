"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserAction } from "../actions/auth";
import { listCarAction } from "../actions/cars";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, ScaleIn } from "@/components/Motion";
import Link from "next/link";

const CAR_TEMPLATES = [
  { id: "bmw", name: "BMW M2 Template", image: "/images/perfect-fleet-img-1.png" },
  { id: "audi", name: "Audi RS7 Template", image: "/images/perfect-fleet-img-2.png" },
  { id: "ferrari", name: "Ferrari F12 Template", image: "/images/perfect-fleet-img-3.png" },
  { id: "toyota", name: "Toyota Yaris Template", image: "/images/perfect-fleet-img-4.png" },
];

export default function ListCarPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("/images/perfect-fleet-img-1.png");
  const [features, setFeatures] = useState<string[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUserAction();
      if (!currentUser) {
        router.push("/auth?redirect=/list-car");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleFeatureToggle = (featureName: string) => {
    setFeatures((prev) =>
      prev.includes(featureName)
        ? prev.filter((f) => f !== featureName)
        : [...prev, featureName]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("image", selectedTemplate);
    formData.append("features", features.join(","));

    try {
      const res = await listCarAction(formData);
      if (!res.success) {
        setError(res.error || "Failed to submit listing.");
      } else {
        setSuccess("Car listed successfully! Redirecting to fleets...");
        setTimeout(() => {
          router.push("/cars");
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", backgroundColor: "var(--secondary-color)" }}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading list car form...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div
        className="bg-section"
        style={{
          margin: "120px auto 60px",
          padding: "60px 0",
          backgroundColor: "var(--secondary-color)",
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-10">
              <ScaleIn>
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.03)",
                    border: "1px solid var(--divider-color)",
                  }}
                >
                  <div className="text-center mb-4">
                    <h2 style={{ fontSize: "30px", fontWeight: 700, color: "var(--primary-color)" }}>
                      List Your Vehicle
                    </h2>
                    <p style={{ color: "var(--text-color)", fontSize: "14px" }}>
                      Earn money by sharing your car on the NovaRide platform
                    </p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" style={{ borderRadius: "12px", fontSize: "14px" }}>
                      <i className="fa-solid fa-triangle-exclamation me-2"></i>
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success" style={{ borderRadius: "12px", fontSize: "14px" }}>
                      <i className="fa-solid fa-circle-check me-2"></i>
                      {success}
                    </div>
                  )}

                  {/* Steps Progress Indicator */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "35px", position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "10%",
                        right: "10%",
                        height: "2px",
                        backgroundColor: "var(--divider-color)",
                        zIndex: 1,
                        transform: "translateY(-50%)",
                      }}
                    ></div>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "10%",
                        width: step === 1 ? "0%" : step === 2 ? "40%" : "80%",
                        height: "2px",
                        backgroundColor: "var(--accent-color)",
                        zIndex: 2,
                        transform: "translateY(-50%)",
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                    {[1, 2, 3].map((s) => (
                      <button
                        key={s}
                        onClick={() => s < step && setStep(s)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: s <= step ? "var(--accent-color)" : "#e5e7eb",
                          color: s <= step ? "#fff" : "var(--text-color)",
                          fontWeight: 700,
                          fontSize: "14px",
                          border: "none",
                          zIndex: 3,
                          cursor: s < step ? "pointer" : "default",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    {/* STEP 1: Basic Info */}
                    {step === 1 && (
                      <FadeIn>
                        <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Basic Information</h4>
                        <div className="form-group mb-3">
                          <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "6px" }}>
                            Vehicle Name / Model
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="e.g. BMW M4 Coupe 2021"
                            required
                            style={{ borderRadius: "10px", height: "48px" }}
                          />
                        </div>

                        <div className="form-group mb-4">
                          <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "6px" }}>
                            Car Category Class
                          </label>
                          <select
                            name="type"
                            className="form-select"
                            required
                            style={{ borderRadius: "10px", height: "48px" }}
                          >
                            <option value="luxury">Luxury Car</option>
                            <option value="sport">Sport Car</option>
                            <option value="sedan">Sedan Car</option>
                            <option value="convertible">Convertible Car</option>
                          </select>
                        </div>

                        <div className="text-end">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="btn-default btn-no-overflow"
                            style={{ width: "150px", height: "48px" }}
                          >
                            Next Step
                          </button>
                        </div>
                      </FadeIn>
                    )}

                    {/* STEP 2: Template / Image Choice */}
                    {step === 2 && (
                      <FadeIn>
                        <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px" }}>Select Car Template Styling</h4>
                        <p style={{ color: "var(--text-color)", fontSize: "13px", marginBottom: "20px" }}>
                          Choose a template style closest to your vehicle.
                        </p>

                        <div className="row mb-4">
                          {CAR_TEMPLATES.map((tmpl) => {
                            const isSelected = selectedTemplate === tmpl.image;
                            return (
                              <div key={tmpl.id} className="col-md-6 mb-3">
                                <div
                                  onClick={() => setSelectedTemplate(tmpl.image)}
                                  style={{
                                    border: isSelected ? "2px solid var(--accent-color)" : "1px solid var(--divider-color)",
                                    borderRadius: "14px",
                                    padding: "15px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    backgroundColor: isSelected ? "var(--secondary-color)" : "#fff",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  <img src={tmpl.image} alt={tmpl.name} style={{ maxHeight: "80px", margin: "0 auto 10px" }} />
                                  <span style={{ fontSize: "13px", fontWeight: 600, display: "block" }}>{tmpl.name}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="d-flex justify-content-between">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="btn-default btn-no-overflow btn-highlighted"
                            style={{ width: "150px", height: "48px" }}
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="btn-default btn-no-overflow"
                            style={{ width: "150px", height: "48px" }}
                          >
                            Next Step
                          </button>
                        </div>
                      </FadeIn>
                    )}

                    {/* STEP 3: Rates, Specs & Features */}
                    {step === 3 && (
                      <FadeIn>
                        <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Pricing, Specs & Features</h4>
                        
                        {/* Pricing inputs */}
                        <div className="row mb-3">
                          <div className="col-md-6 mb-3">
                            <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "6px" }}>
                              Daily Rental Rate ($)
                            </label>
                            <input
                              type="number"
                              name="price_per_day"
                              className="form-control"
                              placeholder="e.g. 250"
                              min="50"
                              max="1000"
                              required
                              style={{ borderRadius: "10px", height: "48px" }}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "6px" }}>
                              Monthly Rent-to-Own Rate ($)
                            </label>
                            <input
                              type="number"
                              name="rent_to_own_price"
                              className="form-control"
                              placeholder="e.g. 750"
                              min="100"
                              max="5000"
                              required
                              style={{ borderRadius: "10px", height: "48px" }}
                            />
                          </div>
                        </div>

                        {/* Specs inputs */}
                        <div className="row mb-4">
                          <div className="col-md-3 col-6 mb-3">
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "4px" }}>
                              Transmission
                            </label>
                            <select name="transmission" className="form-select" style={{ borderRadius: "10px" }}>
                              <option value="auto">Automatic</option>
                              <option value="manual">Manual</option>
                            </select>
                          </div>
                          <div className="col-md-3 col-6 mb-3">
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "4px" }}>
                              Doors
                            </label>
                            <select name="doors" className="form-select" style={{ borderRadius: "10px" }}>
                              <option value="2">2 Doors</option>
                              <option value="4">4 Doors</option>
                            </select>
                          </div>
                          <div className="col-md-3 col-6 mb-3">
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "4px" }}>
                              Passengers
                            </label>
                            <select name="passengers" className="form-select" style={{ borderRadius: "10px" }}>
                              <option value="2">2 Seats</option>
                              <option value="4">4 Seats</option>
                              <option value="5">5 Seats</option>
                            </select>
                          </div>
                          <div className="col-md-3 col-6 mb-3">
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "4px" }}>
                              Bags
                            </label>
                            <select name="bags" className="form-select" style={{ borderRadius: "10px" }}>
                              <option value="2">2 Bags</option>
                              <option value="3">3 Bags</option>
                              <option value="4">4 Bags</option>
                            </select>
                          </div>
                        </div>

                        {/* Features Checkbox */}
                        <div className="mb-4">
                          <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-color)", marginBottom: "10px", display: "block" }}>
                            Select Amenities / Features
                          </label>
                          <div className="row">
                            {["GPS Navigation", "Leather Seats", "Bluetooth Connection", "Sports Mode", "Rear Camera", "Heated Seats", "Climate Control"].map((feature) => {
                              const isChecked = features.includes(feature);
                              return (
                                <div key={feature} className="col-md-6 mb-2">
                                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "14px" }}>
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleFeatureToggle(feature)}
                                      style={{ marginRight: "8px", accentColor: "var(--accent-color)" }}
                                    />
                                    {feature}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="btn-default btn-no-overflow btn-highlighted"
                            style={{ width: "150px", height: "48px" }}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="btn-default btn-no-overflow"
                            style={{
                              width: "180px",
                              height: "48px",
                              backgroundColor: submitLoading ? "#ccc" : "var(--accent-color)",
                              cursor: submitLoading ? "not-allowed" : "pointer",
                            }}
                          >
                            {submitLoading ? "Submitting..." : "List Vehicle Now"}
                          </button>
                        </div>
                      </FadeIn>
                    )}
                  </form>
                </div>
              </ScaleIn>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
