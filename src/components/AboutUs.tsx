"use client";

import React from "react";
import { FadeIn, SlideIn } from "./Motion";

export default function AboutUs() {
  return (
    <div className="about-us" id="about">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            {/* About Us Image Start */}
            <SlideIn direction="left" className="about-image">
              {/* About Image Start */}
              <div className="about-img-1">
                <figure className="reveal" style={{ visibility: "visible" }}>
                  <img src="/images/about-img-1.jpg" alt="About Us 1" />
                </figure>
              </div>
              {/* About Image End */}

              {/* About Image Start */}
              <div className="about-img-2">
                <figure className="reveal" style={{ visibility: "visible" }}>
                  <img src="/images/about-img-2.jpg" alt="About Us 2" />
                </figure>
              </div>
              {/* About Image End */}
            </SlideIn>
            {/* About Us Image End */}
          </div>

          <div className="col-lg-6">
            {/* About Us Content Start */}
            <div className="about-content">
              {/* Section Title Start */}
              <div className="section-title">
                <FadeIn delay={0.1}>
                  <h3 className="wow fadeInUp">about us</h3>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    Your trusted partner in reliable car rental
                  </h2>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <p className="wow fadeInUp">
                    Aqestic Optio Amet A Ququam Saepe Aliquid Voluate Dicta Fuga Dolor Saerror Sed Earum
                    A Magni Soluta Quam Minus Dolor Dolor
                  </p>
                </FadeIn>
              </div>
              {/* Section Title End */}

              {/* About Content Body Start */}
              <div className="about-content-body">
                {/* About Trusted Booking Start */}
                <FadeIn delay={0.4} className="about-trusted-booking wow fadeInUp">
                  <div className="icon-box">
                    <img src="/images/icon-about-trusted-1.svg" alt="Easy Booking" />
                  </div>
                  <div className="trusted-booking-content">
                    <h3>easy booking process</h3>
                    <p>
                      We Have Optimized The Booking Process So That Our Clients Can Experience The
                      Easiest And The Safest Service
                    </p>
                  </div>
                </FadeIn>
                {/* About Trusted Booking End */}

                {/* About Trusted Booking Start */}
                <FadeIn delay={0.5} className="about-trusted-booking wow fadeInUp">
                  <div className="icon-box">
                    <img src="/images/icon-about-trusted-2.svg" alt="Pickup and Return" />
                  </div>
                  <div className="trusted-booking-content">
                    <h3>convenient pick-up & return process</h3>
                    <p>
                      We Have Optimized The Booking Process So That Our Clients Can Experience The
                      Easiest And The Safest Service
                    </p>
                  </div>
                </FadeIn>
                {/* About Trusted Booking End */}
              </div>
              {/* About Content Body End */}

              {/* About Content Footer Start */}
              <FadeIn delay={0.6} className="about-content-footer wow fadeInUp">
                <a href="#contact" className="btn-default">
                  contact us
                </a>
              </FadeIn>
              {/* About Content Footer End */}
            </div>
            {/* About Us Content End */}
          </div>
        </div>
      </div>
    </div>
  );
}
