"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { getCarsAction } from "@/app/actions/cars";
import FleetCard from "@/components/FleetCard";
import { SEED_FLEET, type FleetCar } from "@/lib/fleet-data";
import BrandedLoader from "@/components/BrandedLoader";

export default function PerfectFleets() {
  const [fleets, setFleets] = useState<FleetCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFleets() {
      const res = await getCarsAction();
      if (res.success && res.cars && res.cars.length > 0) {
        setFleets(res.cars);
      } else {
        setFleets(SEED_FLEET);
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
                <BrandedLoader label="Loading fleets..." fullScreen={false} />
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
                      <FleetCard car={fleet} />
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
