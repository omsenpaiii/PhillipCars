"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

export default function Testimonials() {
  const reviews = [
    {
      name: "floyd miles",
      role: "small business owner",
      image: "/images/author-1.jpg",
      rating: 5,
      comment: "I needed a clean, reliable sedan for client meetings across Melbourne, and PhillipCars made the whole process simple from booking to return.",
    },
    {
      name: "annette black",
      role: "frequent traveller",
      image: "/images/author-2.jpg",
      rating: 4,
      comment: "The airport pickup was smooth, the car matched the listing, and the support team was quick to answer my questions before arrival.",
    },
    {
      name: "leslie alexander",
      role: "vehicle host",
      image: "/images/author-3.jpg",
      rating: 3,
      comment: "Listing my car was easier than I expected. The onboarding flow was straightforward, and I liked being able to manage everything from one dashboard.",
    },
    {
      name: "alis white",
      role: "events coordinator",
      image: "/images/author-4.jpg",
      rating: 5,
      comment: "We booked a premium vehicle for an executive guest and the experience felt polished from start to finish. It was exactly what we needed.",
    },
  ];

  return (
    <div className="our-testimonial">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            {/* Section Title Start */}
            <div className="section-title">
              <h3 className="wow fadeInUp">testimonials</h3>
              <h2 className="text-anime-style-3" data-cursor="-opaque">
                What our customers are saying about us
              </h2>
            </div>
            {/* Section Title End */}
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            {/* Testimonial Slider Start */}
            <div className="testimonial-slider">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                navigation={{
                  prevEl: ".testimonial-button-prev",
                  nextEl: ".testimonial-button-next",
                }}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="swiper"
              >
                {reviews.map((rev, idx) => (
                  <SwiperSlide key={idx} className="swiper-slide">
                    <div className="testimonial-item">
                      <div className="testimonial-header">
                        <div className="testimonial-rating">
                          {Array.from({ length: 5 }).map((_, starIdx) => {
                            const isFilled = starIdx < rev.rating;
                            return (
                              <i
                                key={starIdx}
                                className={isFilled ? "fa-solid fa-star" : "fa-regular fa-star"}
                              ></i>
                            );
                          })}
                        </div>
                        <div className="testimonial-content">
                          <p>{rev.comment}</p>
                        </div>
                      </div>
                      <div className="testimonial-body">
                        <div className="author-image">
                          <figure className="image-anime">
                            <img src={rev.image} alt={rev.name} />
                          </figure>
                        </div>
                        <div className="author-content">
                          <h3>{rev.name}</h3>
                          <p>{rev.role}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="testimonial-btn" style={{ position: "relative", zIndex: 10 }}>
                <div className="testimonial-button-prev slick-arrow" style={{ cursor: "pointer" }}></div>
                <div className="testimonial-button-next slick-arrow" style={{ cursor: "pointer" }}></div>
              </div>
            </div>
            {/* Testimonial Slider End */}
          </div>
        </div>
      </div>
    </div>
  );
}
