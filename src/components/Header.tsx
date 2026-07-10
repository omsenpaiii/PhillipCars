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

  const isContactPage = pathname === "/contact-us";

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
                  <li className="nav-item submenu">
                    <Link className="nav-link" href="#" onClick={(e) => e.preventDefault()} style={pathname === "/list-car" ? { color: "var(--accent-color)" } : undefined}>
                      List Your Car
                    </Link>
                    <ul>
                      <li>
                        <Link href="/list-car">List Your Car</Link>
                      </li>
                      <li>
                        <Link href="/list-car?mode=sell">Sell Your Car</Link>
                      </li>
                      <li>
                        <Link href="/cars">Rent to Own</Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/#about">
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/#services">
                      Services
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/contact-us" style={isContactPage ? { color: "var(--accent-color)" } : undefined}>
                      Contact Us
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
            <ul className="slicknav_nav" role="menu" aria-hidden="false">
              <li>
                <Link href="/" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cars" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  Our Fleets
                </Link>
              </li>
              <li>
                <div style={{ padding: "10px 20px", fontWeight: 700, color: "var(--accent-color)" }}>List / Sell / RTO</div>
                <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
                  <li>
                    <Link href="/list-car" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                      List Your Car
                    </Link>
                  </li>
                  <li>
                    <Link href="/list-car?mode=sell" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                      Sell Your Car
                    </Link>
                  </li>
                  <li>
                    <Link href="/cars" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                      Rent to Own
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/#about" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#services" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact-us" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  Contact Us
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                      My Dashboard
                    </Link>
                  </li>
                  <li style={{ padding: "10px 20px" }}>
                    <button
                      onClick={handleLogout}
                      className="btn-default btn-highlighted btn-no-overflow"
                      style={{ display: "block", width: "100%", textAlign: "center", border: "none" }}
                    >
                      Log Out
                    </button>
                  </li>
                </>
              ) : (
                <li style={{ padding: "10px 20px" }}>
                  <Link
                    href="/auth"
                    className="btn-default btn-no-overflow"
                    style={{ display: "block", textAlign: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
