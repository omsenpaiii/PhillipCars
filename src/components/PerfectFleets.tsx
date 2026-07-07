"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { getCarsAction } from "@/app/actions/cars";
import Link from "next/link";

export default function PerfectFleets() {
  const [fleets, setFleets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFleets() {
      const res = await getCarsAction();
      if (res.success && res.cars && res.cars.length > 0) {
        setFleets(res.cars);
      } else {
        // Fallback to static items if DB is empty or fails
        setFleets([
          {
            id: "db2897bf-7d3a-4ffe-832d-81e2e9f45ecf",
            type: "luxury",
            name: "BMW M2 Car 2017",
            image: "/images/perfect-fleet-img-1.png",
            price_per_day: "280",
            passengers: 4,
            doors: 4,
            bags: 3,
            transmission: "auto"
          },
          {
            id: "6ef37e12-2bff-4bee-9189-5cdbf18311e4",
            type: "luxury",
            name: "Audi RS7 Car 2016",
            image: "/images/perfect-fleet-img-2.png",
            price_per_day: "320",
            passengers: 4,
            doors: 4,
            bags: 4,
            transmission: "auto"
          },
          {
            id: "eff51c2e-e8e7-4707-a81e-2e8c2525e41b",
            type: "sport",
            name: "Ferrari F12 Car 2022",
            image: "/images/perfect-fleet-img-3.png",
            price_per_day: "450",
            passengers: 2,
            doors: 2,
            bags: 2,
            transmission: "auto"
          },
          {
            id: "87f4818c-233c-46af-b15d-6d9899c9c321",
            type: "sedan",
            name: "Toyota Yaris 2017",
            image: "/images/perfect-fleet-img-4.png",
            price_per_day: "220",
            passengers: 4,
            doors: 4,
            bags: 2,
            transmission: "auto"
          }
        ]);
      }
      setLoading(false);
    }
    loadFleets();
  }, []);

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
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading fleets...</span>
                  </div>
                </div>
              ) : (
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  loop={fleets.length > 3}
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
                    <SwiperSlide key={fleet.id || idx} className="swiper-slide">
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
                            <h3 style={{ textTransform: "capitalize" }}>{fleet.type} car</h3>
                            <h2>{fleet.name}</h2>
                          </div>
                          {/* Perfect Fleets Content End */}

                          {/* Perfect Fleets Body Start */}
                          <div className="perfect-fleet-body">
                            <ul>
                              <li>
                                <img src="/images/icon-fleet-list-1.svg" alt="" />
                                {fleet.passengers} passenger
                              </li>
                              <li>
                                <img src="/images/icon-fleet-list-2.svg" alt="" />
                                {fleet.doors} door
                              </li>
                              <li>
                                <img src="/images/icon-fleet-list-3.svg" alt="" />
                                {fleet.bags} bags
                              </li>
                              <li>
                                <img src="/images/icon-fleet-list-4.svg" alt="" />
                                {fleet.transmission}
                              </li>
                            </ul>
                          </div>
                          {/* Perfect Fleets Body End */}

                          {/* Perfect Fleets Footer Start */}
                          <div className="perfect-fleet-footer">
                            {/* Perfect Fleets Pricing Start */}
                            <div className="perfect-fleet-pricing">
                              <h2>
                                ${parseFloat(fleet.price_per_day || fleet.price).toFixed(0)}
                                <span>/day</span>
                              </h2>
                            </div>
                            {/* Perfect Fleets Pricing End */}

                            {/* Perfect Fleets Btn Start */}
                            <div className="perfect-fleet-btn">
                              <Link href={fleet.id ? `/cars/${fleet.id}` : "/cars"} className="section-icon-btn">
                                <img src="/images/arrow-white.svg" alt="Details" />
                              </Link>
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
              )}
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
