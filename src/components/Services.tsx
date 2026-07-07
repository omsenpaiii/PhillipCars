"use client";

import React from "react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "./Motion";

export default function Services() {
  const services = [
    {
      title: "car rental with driver",
      icon: "/images/icon-service-1.svg",
      desc: "Enhance your rental experience with additional options.",
    },
    {
      title: "business car rental",
      icon: "/images/icon-service-2.svg",
      desc: "Enhance your rental experience with additional options.",
    },
    {
      title: "airport transfer",
      icon: "/images/icon-service-3.svg",
      desc: "Enhance your rental experience with additional options.",
    },
    {
      title: "chauffeur services",
      icon: "/images/icon-service-4.svg",
      desc: "Enhance your rental experience with additional options.",
    },
  ];

  return (
    <div className="our-services bg-section" id="services">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            {/* Section Title Start */}
            <div className="section-title">
              <FadeIn>
                <h3 className="wow fadeInUp">our services</h3>
              </FadeIn>
              <FadeIn delay={0.15}>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Explore our wide range of rental services
                </h2>
              </FadeIn>
            </div>
            {/* Section Title End */}
          </div>
        </div>

        <FadeInStagger className="row">
          {services.map((srv, idx) => (
            <div key={idx} className="col-lg-3 col-md-6">
              {/* Service Item Start */}
              <FadeInStaggerItem className="service-item h-100">
                <div className="icon-box">
                  <img src={srv.icon} alt={srv.title} />
                </div>
                <div className="service-content">
                  <h3>{srv.title}</h3>
                  <p>{srv.desc}</p>
                </div>
                <div className="service-footer">
                  <a href="#" className="section-icon-btn">
                    <img src="/images/arrow-white.svg" alt="Arrow" />
                  </a>
                </div>
              </FadeInStaggerItem>
              {/* Service Item End */}
            </div>
          ))}

          <div className="col-lg-12">
            {/* Service Box Footer Start */}
            <FadeIn delay={0.4} className="services-box-footer wow fadeInUp">
              <p>
                Discover our range of car rental services designed to meet all your travel needs.
                From a diverse fleet of vehicles to flexible rental plans.
              </p>
              <a href="#" className="btn-default">
                view all service
              </a>
            </FadeIn>
            {/* Service Box Footer End */}
          </div>
        </FadeInStagger>
      </div>
    </div>
  );
}
