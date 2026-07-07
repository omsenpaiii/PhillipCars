"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOutAction, getCurrentUserAction } from "../actions/auth";
import { getUserBookingsAction, cancelBookingAction } from "../actions/booking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/Motion";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const currentUser = await getCurrentUserAction();
      if (!currentUser) {
        // Redirect if not logged in
        router.push("/auth?redirect=/dashboard");
        return;
      }
      setUser(currentUser);

      const bookingsRes = await getUserBookingsAction();
      if (bookingsRes.success && bookingsRes.bookings) {
        setBookings(bookingsRes.bookings);
      }
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await signOutAction();
    router.push("/auth");
    router.refresh();
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setActionLoading(bookingId);
    setError(null);

    const res = await cancelBookingAction(bookingId);
    if (!res.success) {
      setError(res.error || "Failed to cancel booking.");
    } else {
      // Refresh local list
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", backgroundColor: "var(--secondary-color)" }}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-section" style={{ marginTop: "120px", padding: "60px 0", minHeight: "75vh" }}>
        <div className="container">
          <div className="row">
            {/* Sidebar: Profile card */}
            <div className="col-lg-4 mb-4">
              <FadeIn>
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    padding: "30px",
                    border: "1px solid var(--divider-color)",
                    boxShadow: "0px 5px 20px rgba(0,0,0,0.02)",
                  }}
                >
                  <div className="text-center mb-4">
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "var(--accent-color)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        fontWeight: 700,
                        margin: "0 auto 15px",
                        textTransform: "uppercase",
                      }}
                    >
                      {user.full_name ? user.full_name[0] : user.email[0]}
                    </div>
                    <h3 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>
                      {user.full_name || "User Account"}
                    </h3>
                    <p style={{ color: "var(--text-color)", fontSize: "14px", margin: "5px 0 0" }}>
                      Customer Account
                    </p>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid var(--divider-color)",
                      paddingTop: "20px",
                      fontSize: "14px",
                    }}
                  >
                    <div className="mb-3">
                      <strong style={{ color: "var(--primary-color)", display: "block" }}>Email</strong>
                      <span style={{ color: "var(--text-color)" }}>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="mb-3">
                        <strong style={{ color: "var(--primary-color)", display: "block" }}>Phone</strong>
                        <span style={{ color: "var(--text-color)" }}>{user.phone}</span>
                      </div>
                    )}
                    <div className="mb-4">
                      <strong style={{ color: "var(--primary-color)", display: "block" }}>Member Since</strong>
                      <span style={{ color: "var(--text-color)" }}>
                        {new Date(user.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="btn-default w-100 btn-highlighted text-center"
                      style={{ marginRight: 0 }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Main Area: Bookings list */}
            <div className="col-lg-8">
              <FadeIn delay={0.15}>
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    padding: "40px",
                    border: "1px solid var(--divider-color)",
                    boxShadow: "0px 5px 20px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "30px",
                    }}
                  >
                    <h2 style={{ fontSize: "26px", fontWeight: 700, margin: 0 }}>My Reservations</h2>
                    <Link href="/cars" className="btn-default" style={{ padding: "12px 20px", fontSize: "14px", marginRight: 0 }}>
                      Browse Fleets
                    </Link>
                  </div>

                  {error && (
                    <div className="alert alert-danger" style={{ borderRadius: "10px", fontSize: "14px" }}>
                      {error}
                    </div>
                  )}

                  {bookings.length === 0 ? (
                    <div className="text-center" style={{ padding: "60px 0" }}>
                      <i className="fa-solid fa-receipt mb-3" style={{ fontSize: "48px", color: "#ccc" }}></i>
                      <h3>No Bookings Found</h3>
                      <p style={{ color: "var(--text-color)" }}>
                        You haven&apos;t reserved any cars yet. Search our fleets to start booking!
                      </p>
                    </div>
                  ) : (
                    <FadeInStagger style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {bookings.map((booking) => {
                        const isCancelled = booking.status === "cancelled";
                        return (
                          <FadeInStaggerItem
                            key={booking.id}
                            style={{
                              border: "1px solid var(--divider-color)",
                              borderRadius: "16px",
                              padding: "20px",
                              display: "flex",
                              gap: "20px",
                              flexWrap: "wrap",
                              alignItems: "center",
                              opacity: isCancelled ? 0.75 : 1,
                              backgroundColor: isCancelled ? "#fafafa" : "#fff",
                            }}
                          >
                            {/* Car Thumbnail */}
                            <div
                              style={{
                                width: "120px",
                                padding: "10px",
                                backgroundColor: "var(--secondary-color)",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img src={booking.car_image} alt="" style={{ maxWidth: "100%", height: "auto" }} />
                            </div>

                            {/* Details */}
                            <div style={{ flex: 1, minWidth: "220px" }}>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    padding: "3px 8px",
                                    borderRadius: "100px",
                                    backgroundColor:
                                      booking.type === "rent" ? "#e0f2fe" : "#fef3c7",
                                    color: booking.type === "rent" ? "#0369a1" : "#b45309",
                                  }}
                                >
                                  {booking.type === "rent" ? "Standard Rental" : "Rent to Own"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    padding: "3px 8px",
                                    borderRadius: "100px",
                                    backgroundColor: isCancelled
                                      ? "#fee2e2"
                                      : "#dcfce7",
                                    color: isCancelled ? "#b91c1c" : "#15803d",
                                  }}
                                >
                                  {booking.status}
                                </span>
                              </div>
                              <h4 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>
                                {booking.car_name}
                              </h4>
                              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-color)" }}>
                                <strong>Pickup:</strong> {booking.pickup_location} (
                                {new Date(booking.pickup_date).toLocaleDateString()})
                              </p>
                              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-color)" }}>
                                <strong>Return:</strong> {booking.return_location} (
                                {new Date(booking.return_date).toLocaleDateString()})
                              </p>
                            </div>

                            {/* Pricing & Cancel actions */}
                            <div className="text-md-end" style={{ minWidth: "120px" }}>
                              <p style={{ fontSize: "12px", color: "var(--text-color)", margin: "0 0 2px" }}>
                                Total Charged
                              </p>
                              <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 10px", color: "var(--primary-color)" }}>
                                ${parseFloat(booking.total_price).toFixed(2)}
                              </h3>

                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelBooking(booking.id)}
                                  disabled={actionLoading === booking.id}
                                  style={{
                                    fontSize: "13px",
                                    color: "var(--error-color)",
                                    border: "none",
                                    background: "none",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    padding: 0,
                                    textDecoration: "underline",
                                  }}
                                >
                                  {actionLoading === booking.id ? "Cancelling..." : "Cancel Trip"}
                                </button>
                              )}
                            </div>
                          </FadeInStaggerItem>
                        );
                      })}
                    </FadeInStagger>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
