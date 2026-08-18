"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUserAction, signOutAction } from "@/app/actions/auth";
import BrandLogo from "@/components/BrandLogo";
import type { SessionUser } from "@/lib/auth";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    async function checkUser() {
      const currentUser = await getCurrentUserAction();
      setUser(currentUser);
    }
    checkUser();

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOutAction();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="main-header">
      <div className={`header-sticky ${isSticky ? "active" : ""}`}>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            {/* Logo Start */}
            <Link className="navbar-brand" href="/">
              <BrandLogo />
            </Link>
            {/* Logo End */}

            {/* Main Menu Start */}
            <div className="collapse navbar-collapse main-menu d-none d-lg-block">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  <li className="nav-item">
                    <Link className="nav-link" href="/" style={pathname === "/" ? { color: "var(--accent-color)" } : undefined}>
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/cars" style={pathname === "/cars" ? { color: "var(--accent-color)" } : undefined}>
                      Our Fleets
                    </Link>
                  </li>
                  <li className="nav-item nav-solution-item">
                    <Link className="nav-link" href="/list-car" style={pathname === "/list-car" ? { color: "var(--accent-color)" } : undefined}>
                      List Your Car
                    </Link>
                  </li>
                  <li className="nav-item nav-solution-item">
                    <Link className="nav-link" href="/list-car?mode=sell">
                      Sell Your Car
                    </Link>
                  </li>
                  <li className="nav-item nav-solution-item">
                    <Link className="nav-link" href="/cars">
                      Rent to Own
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/#services">
                      Services
                    </Link>
                  </li>
                  {user && (
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard" style={pathname === "/dashboard" ? { color: "var(--accent-color)" } : undefined}>
                        My Dashboard
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Auth / Booking Button */}
              <div className="header-btn d-inline-flex align-items-center" style={{ gap: "15px", marginRight: "48px" }}>
                {user ? (
                  <>
                    <span style={{ fontSize: "14px", color: "var(--primary-color)", fontWeight: 600, whiteSpace: "nowrap" }}>
                      Hi, {user.full_name ? user.full_name.split(" ")[0] : "Driver"}
                    </span>
                    <button 
                      onClick={handleLogout} 
                      className="btn-default btn-highlighted btn-no-overflow"
                      style={{ padding: "10px 20px", border: "none" }}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link href="/auth" className="btn-default btn-no-overflow">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
            {/* Main Menu End */}

            {/* Mobile Menu Toggle Button */}
            <div className="navbar-toggle d-block d-lg-none">
              <button
                className={`slicknav_btn ${mobileMenuOpen ? "slicknav_open" : ""}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ border: "none", cursor: "pointer" }}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <span className="slicknav_icon">
                  <span className="slicknav_icon-bar"></span>
                  <span className="slicknav_icon-bar"></span>
                  <span className="slicknav_icon-bar"></span>
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="slicknav_menu d-block d-lg-none">
            <div id="mobile-navigation" className="slicknav_nav" role="menu" aria-hidden="false">
              <div className="mobile-nav-section">
                <p className="mobile-nav-label">Explore</p>
                <Link className={pathname === "/" ? "is-active" : ""} href="/" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  <span>Home</span>
                  <i className="fa-solid fa-arrow-right mobile-nav-arrow" aria-hidden="true" />
                </Link>
                <Link className={pathname === "/cars" ? "is-active" : ""} href="/cars" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  <span>Browse the Fleet</span>
                  <i className="fa-solid fa-arrow-right mobile-nav-arrow" aria-hidden="true" />
                </Link>
                <Link href="/#services" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  <span>Premium Services</span>
                  <i className="fa-solid fa-arrow-right mobile-nav-arrow" aria-hidden="true" />
                </Link>
              </div>

              <div className="mobile-nav-section">
                <p className="mobile-nav-label">Vehicle solutions</p>
                <Link className={pathname === "/list-car" ? "is-active" : ""} href="/list-car" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  <span>List Your Car</span>
                  <i className="fa-solid fa-arrow-right mobile-nav-arrow" aria-hidden="true" />
                </Link>
                <Link href="/list-car?mode=sell" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  <span>Sell Your Car</span>
                  <i className="fa-solid fa-arrow-right mobile-nav-arrow" aria-hidden="true" />
                </Link>
                <Link href="/cars" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  <span>Rent to Own</span>
                  <i className="fa-solid fa-arrow-right mobile-nav-arrow" aria-hidden="true" />
                </Link>
              </div>

              <div className="mobile-nav-account">
              {user ? (
                <>
                    <Link className="mobile-nav-account-link" href="/dashboard" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                      My Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mobile-nav-cta"
                    >
                      <span>Log Out</span>
                      <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                    </button>
                </>
              ) : (
                  <Link
                    href="/auth"
                    className="mobile-nav-cta"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Sign In</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                  </Link>
              )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
