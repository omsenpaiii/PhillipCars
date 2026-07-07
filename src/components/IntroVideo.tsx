"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

export default function IntroVideo() {
  const [videoOpen, setVideoOpen] = useState(false);

  const logos = [
    "/images/client-logo-1.svg",
    "/images/client-logo-2.svg",
    "/images/client-logo-3.svg",
    "/images/client-logo-4.svg",
    "/images/client-logo-5.svg",
    "/images/client-logo-6.svg",
  ];

  return (
    <>
      <div className="intro-video bg-section parallaxie">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title">
                <h3 className="wow fadeInUp">watch full video</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Discover the ease and convenience of renting with Us
                </h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              {/* Intro Video Box Start */}
              <div className="intro-video-box">
                {/* Video Play Button Start */}
                <div className="video-play-button">
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="popup-video"
                    data-cursor-text="Play"
                    style={{ border: "none", background: "none", cursor: "pointer" }}
                    aria-label="Play video"
                  >
                    <i className="fa-solid fa-play"></i>
                  </button>
                </div>
                {/* Video Play Button End */}

                {/* Client Slider Start */}
                <div className="client-slider">
                  <Swiper
                    modules={[Autoplay]}
                    spaceBetween={40}
                    slidesPerView={2}
                    loop={true}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    breakpoints={{
                      576: { slidesPerView: 3 },
                      768: { slidesPerView: 4 },
                      992: { slidesPerView: 5 },
                      1200: { slidesPerView: 6 },
                    }}
                    className="swiper client_logo_slider"
                  >
                    {logos.concat(logos).map((logo, idx) => (
                      <SwiperSlide key={idx} className="swiper-slide">
                        <div className="company-logo">
                          <img src={logo} alt={`Client logo ${idx + 1}`} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                {/* Client Slider End */}
              </div>
              {/* Intro Video Box End */}
            </div>
          </div>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {videoOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setVideoOpen(false)}
        >
          <div
            style={{
              position: "relative",
              width: "90%",
              maxWidth: "854px",
              aspectRatio: "16/9",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0px",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                cursor: "pointer",
              }}
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Y-x0efG1seA?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
