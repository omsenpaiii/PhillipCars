"use client";

import React, { useState } from "react";

export default function FAQs() {
  const [activeKey, setActiveKey] = useState("1");

  const toggleAccordion = (key: string) => {
    setActiveKey(activeKey === key ? "" : key);
  };

  const faqItems = [
    {
      key: "1",
      question: "What do I need to rent a car?",
      answer: "Explore our diverse selection of high-end vehicles, choose your preferred pickup and return dates, and select a location that best fits your needs.",
    },
    {
      key: "2",
      question: "How old do I need to be to rent a car?",
      answer: "Explore our diverse selection of high-end vehicles, choose your preferred pickup and return dates, and select a location that best fits your needs.",
    },
    {
      key: "3",
      question: "Can I rent a car with a debit card?",
      answer: "Explore our diverse selection of high-end vehicles, choose your preferred pickup and return dates, and select a location that best fits your needs.",
    },
  ];

  return (
    <div className="our-faqs bg-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 order-lg-1 order-md-2 order-2">
            {/* Our Faqs Image Start */}
            <div className="our-faqs-image">
              <div className="faqs-img-1">
                <figure className="image-anime">
                  <img src="/images/our-faqs-img-1.jpg" alt="Faq Image 1" />
                </figure>
              </div>

              <div className="faqs-img-2">
                <figure className="image-anime">
                  <img src="/images/our-faqs-img-2.jpg" alt="Faq Image 2" />
                </figure>
              </div>
            </div>
            {/* Our Faqs Image End */}
          </div>

          <div className="col-lg-6 order-lg-2 order-md-1 order-1">
            {/* Our Faqs Content Start */}
            <div className="our-faqs-content">
              {/* Section Title Start */}
              <div className="section-title">
                <h3 className="wow fadeInUp">frequently asked questions</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Everything you need to know about our services
                </h2>
              </div>
              {/* Section Title End */}

              {/* Our Faqs Accordion Start */}
              <div className="our-faqs-accordion" id="faqsaccordion">
                {faqItems.map((item) => {
                  const isOpen = activeKey === item.key;
                  return (
                    <div key={item.key} className="accordion-item wow fadeInUp">
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                          type="button"
                          onClick={() => toggleAccordion(item.key)}
                          aria-expanded={isOpen}
                        >
                          {item.question}
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
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Our Faqs Accordion End */}
            </div>
            {/* Our Faqs Content End */}
          </div>
        </div>
      </div>
    </div>
  );
}
