"use client";

import React, { useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed email:", email);
    alert(`Thank you for subscribing, ${email}!`);
    setEmail("");
  };

  return (
    <footer className="main-footer bg-section" id="contact">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            {/* About Footer Start */}
            <div className="about-footer">
              {/* Footer Logo Start */}
              <div className="footer-logo">
                <BrandLogo variant="light" />
              </div>
              {/* Footer Logo End */}

              {/* About Footer Content Start */}
              <div className="about-footer-content">
                <p>Experience the ease and convenience of renting a car with PhillipCars.</p>
              </div>
              {/* About Footer Content End */}
            </div>
            {/* About Footer End */}
          </div>

          <div className="col-lg-3 col-md-4">
            {/* Footer Quick Links Start */}
            <div className="footer-links footer-quick-links">
              <h3>legal policy</h3>
              <ul>
                <li>
                  <button type="button" className="footer-text-button">term & condition</button>
                </li>
                <li>
                  <button type="button" className="footer-text-button">privacy policy</button>
                </li>
                <li>
                  <button type="button" className="footer-text-button">legal notice</button>
                </li>
                <li>
                  <button type="button" className="footer-text-button">accessibility</button>
                </li>
              </ul>
            </div>
            {/* Footer Quick Links End */}
          </div>

          <div className="col-lg-3 col-md-4">
            {/* Footer Menu Start */}
            <div className="footer-links footer-menu">
              <h3>quick links</h3>
              <ul>
                <li>
                  <Link href="/">home</Link>
                </li>
                <li>
                  <Link href="/#about">about us</Link>
                </li>
                <li>
                  <Link href="/cars">cars</Link>
                </li>
                <li>
                  <Link href="/#services">services</Link>
                </li>
                <li>
                  <Link href="/contact-us">contact us</Link>
                </li>
              </ul>
            </div>
            {/* Footer Menu End */}
          </div>

          <div className="col-lg-3 col-md-4">
            {/* Footer Newsletter Start */}
            <div className="footer-newsletter">
              <h3>Subscribe to our Newsletter</h3>
              {/* Footer Newsletter Form Start */}
              <div className="footer-newsletter-form">
                <form id="newslettersForm" onSubmit={handleSubscribe}>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="mail"
                      placeholder="Email ..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ paddingRight: "55px" }}
                    />
                    <button
                      type="submit"
                      className="section-icon-btn"
                      style={{
                        border: "none",
                        cursor: "pointer",
                      }}
                      aria-label="Subscribe"
                    >
                      <img src="/images/arrow-white.svg" alt="Arrow" />
                    </button>
                  </div>
                </form>
              </div>
              {/* Footer Newsletter Form End */}
            </div>
            {/* Footer Newsletter End */}
          </div>
        </div>

        {/* Footer Copyright Section Start */}
        <div className="footer-copyright">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-7">
              {/* Footer Copyright Start */}
              <div className="footer-copyright-text">
                <p>© 2026 PhillipCars. All rights reserved.</p>
              </div>
              {/* Footer Copyright End */}
            </div>

            <div className="col-lg-6 col-md-5">
              {/* Footer Social Link Start */}
              <div className="footer-social-links">
                <ul>
                  <li>
                    <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/" aria-label="Twitter" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                  </li>
                </ul>
              </div>
              {/* Footer Social Link End */}
            </div>
          </div>
        </div>
        {/* Footer Copyright Section End */}
      </div>
    </footer>
  );
}
