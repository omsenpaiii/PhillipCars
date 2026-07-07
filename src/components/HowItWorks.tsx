"use client";

import React, { useState } from "react";

export default function HowItWorks() {
  const [activeKey, setActiveKey] = useState("1");

  const toggleAccordion = (key: string) => {
    setActiveKey(activeKey === key ? "" : key);
  };

  const steps = [
    {
      key: "1",
      title: "browse and select",
      icon: "/images/icon-how-it-work-1.svg",
      desc: "Explore our diverse selection of high-end vehicles, choose your preferred pickup and return dates, and select a location that best fits your needs.",
    },
    {
      key: "2",
      title: "book and confirm",
      icon: "/images/icon-how-it-work-2.svg",
      desc: "Explore our diverse selection of high-end vehicles, choose your preferred pickup and return dates, and select a location that best fits your needs.",
    },
    {
      key: "3",
      title: "book and enjoy",
      icon: "/images/icon-how-it-work-3.svg",
      desc: "Explore our diverse selection of high-end vehicles, choose your preferred pickup and return dates, and select a location that best fits your needs.",
    },
  ];

  return (
    <div className="how-it-work">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            {/* How Work Content Start */}
            <div className="how-work-content">
              {/* Section Title Start */}
              <div className="section-title">
                <h3 className="wow fadeInUp">how it work</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Streamlined processes for a hassle-free experience
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.25s">
                  Our streamlined process ensures a seamless car rental experience from start to finish.
                  With easy online booking, flexible pick-up and drop-off options.
                </p>
              </div>
              {/* Section Title End */}

              {/* How Work Accordion Start */}
              <div className="how-work-accordion" id="workaccordion">
                {steps.map((step) => {
                  const isOpen = activeKey === step.key;
                  return (
                    <div key={step.key} className="accordion-item wow fadeInUp">
                      <div className="icon-box">
                        <img src={step.icon} alt="" />
                      </div>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                          type="button"
                          onClick={() => toggleAccordion(step.key)}
                          aria-expanded={isOpen}
                        >
                          {step.title}
                        </button>
                      </h2>
                      <div
                        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                        style={{
                          transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
                          maxHeight: isOpen ? "200px" : "0px",
                          overflow: "hidden",
                        }}
                      >
                        <div className="accordion-body">
                          <p>{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* How Work Accordion End */}
            </div>
            {/* How Work Content End */}
          </div>

          <div className="col-lg-6">
            {/* How Work Image Start */}
            <div className="how-work-image">
              {/* How Work Image Start */}
              <div className="how-work-img">
                <figure className="reveal" style={{ visibility: "visible" }}>
                  <img src="/images/about-img-1.jpg" alt="How it works" />
                </figure>
              </div>
              {/* How Work Image End */}

              {/* Trusted Client Start */}
              <div className="trusted-client">
                <div className="trusted-client-content">
                  <h3>
                    <span className="counter">5</span>m+ Trusted world wide global clients
                  </h3>
                </div>
                <div className="trusted-client--image">
                  <img src="/images/trusted-client-img.png" alt="Trusted Clients Stack" />
                </div>
              </div>
              {/* Trusted Client End */}
            </div>
            {/* How It Work Image End */}
          </div>
        </div>
      </div>
    </div>
  );
}
