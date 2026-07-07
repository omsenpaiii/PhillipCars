"use client";

import React, { useState } from "react";

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
                <div style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: "15px" }}>
                  <span style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "28px", color: "var(--accent-color)", textTransform: "uppercase", letterSpacing: "-1px" }}>Phillip</span>
                  <span style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "28px", color: "#ffffff", textTransform: "uppercase", letterSpacing: "-1px" }}>Cars</span>
                </div>
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
                  <a href="#">term & condition</a>
                </li>
                <li>
                  <a href="#">privacy policy</a>
                </li>
                <li>
                  <a href="#">legal notice</a>
                </li>
                <li>
                  <a href="#">accessibility</a>
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
                  <a href="#">home</a>
                </li>
                <li>
                  <a href="#about">about us</a>
                </li>
                <li>
                  <a href="#fleets">cars</a>
                </li>
                <li>
                  <a href="#services">services</a>
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
                    <a href="#" aria-label="YouTube">
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" aria-label="Facebook">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" aria-label="Twitter">
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" aria-label="Instagram">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" aria-label="LinkedIn">
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
