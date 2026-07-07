"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

export default function PerfectFleets() {
  const fleets = [
    {
      type: "luxury car",
      name: "BMW M2 Car 2017",
      image: "/images/perfect-fleet-img-1.png",
      price: "$280",
      specs: ["4 passenger", "4 door", "bags", "auto"],
    },
    {
      type: "luxury car",
      name: "Audi RS7 Car 2016",
      image: "/images/perfect-fleet-img-2.png",
      price: "$320",
      specs: ["4 passenger", "4 door", "bags", "auto"],
    },
    {
      type: "luxury car",
      name: "Ferrari F12 Car 2022",
      image: "/images/perfect-fleet-img-3.png",
      price: "$450",
      specs: ["4 passenger", "4 door", "bags", "auto"],
    },
    {
      type: "luxury car",
      name: "Toyota Yaris 2017",
      image: "/images/perfect-fleet-img-4.png",
      price: "$220",
      specs: ["4 passenger", "4 door", "bags", "auto"],
    },
  ];

  return (
    <div className="perfect-fleet bg-section" id="fleets">
      <div className="container-fluid">
        <div className="row section-row">
          <div className="col-lg-12">
            {/* Section Title Start */}
            <div className="section-title">
              <h3 className="wow fadeInUp">our fleets</h3>
              <h2 className="text-anime-style-3" data-cursor="-opaque">
                Explore our perfect and extensive fleet
              </h2>
            </div>
            {/* Section Title End */}
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            {/* Testimonial Slider Start */}
            <div className="car-details-slider">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                navigation={{
                  prevEl: ".car-button-prev",
                  nextEl: ".car-button-next",
                }}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                  1200: {
                    slidesPerView: 3,
                  },
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className="swiper"
              >
                {fleets.map((fleet, idx) => (
                  <SwiperSlide key={idx} className="swiper-slide">
                    {/* Perfect Fleets Item Start */}
                    <div className="perfect-fleet-item">
                      {/* Image Box Start */}
                      <div className="image-box">
                        <img src={fleet.image} alt={fleet.name} />
                      </div>
                      {/* Image Box End */}

                      {/* Perfect Fleets Content Start */}
                      <div className="perfect-fleet-content">
                        {/* Perfect Fleets Title Start */}
                        <div className="perfect-fleet-title">
                          <h3>{fleet.type}</h3>
                          <h2>{fleet.name}</h2>
                        </div>
                        {/* Perfect Fleets Content End */}

                        {/* Perfect Fleets Body Start */}
                        <div className="perfect-fleet-body">
                          <ul>
                            {fleet.specs.map((spec, specIdx) => (
                              <li key={specIdx}>
                                <img
                                  src={`/images/icon-fleet-list-${specIdx + 1}.svg`}
                                  alt=""
                                />
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Perfect Fleets Body End */}

                        {/* Perfect Fleets Footer Start */}
                        <div className="perfect-fleet-footer">
                          {/* Perfect Fleets Pricing Start */}
                          <div className="perfect-fleet-pricing">
                            <h2>
                              {fleet.price}
                              <span>/day</span>
                            </h2>
                          </div>
                          {/* Perfect Fleets Pricing End */}

                          {/* Perfect Fleets Btn Start */}
                          <div className="perfect-fleet-btn">
                            <a href="#" className="section-icon-btn">
                              <img src="/images/arrow-white.svg" alt="Details" />
                            </a>
                          </div>
                          {/* Perfect Fleets Btn End */}
                        </div>
                        {/* Perfect Fleets Footer End */}
                      </div>
                      {/* Perfect Fleets Content End */}
                    </div>
                    {/* Perfect Fleets Item End */}
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="car-details-btn" style={{ position: "relative", zIndex: 10 }}>
                <div className="car-button-prev slick-arrow" style={{ cursor: "pointer" }}></div>
                <div className="car-button-next slick-arrow" style={{ cursor: "pointer" }}></div>
              </div>
            </div>
            {/* Testimonial Slider End */}
          </div>
        </div>
      </div>
    </div>
  );
}
