"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import PerfectFleets from "@/components/PerfectFleets";
import LuxuryCollection from "@/components/LuxuryCollection";
import HowItWorks from "@/components/HowItWorks";
import IntroVideo from "@/components/IntroVideo";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQs from "@/components/FAQs";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Articles from "@/components/Articles";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Dismiss preloader after components mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Smooth cursor ball animation
  useEffect(() => {
    if (loading) return;
    
    let animationFrameId: number;
    const updateBall = () => {
      setBallPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(updateBall);
    };

    animationFrameId = requestAnimationFrame(updateBall);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos, loading]);

  return (
    <>
      {/* Preloader Start */}
      {loading && (
        <div className="preloader">
          <div className="loading-container">
            <div className="loading"></div>
            <div id="loading-icon">
              <img src="/images/loader.svg" alt="Loading Loader" />
            </div>
          </div>
        </div>
      )}
      {/* Preloader End */}

      {/* Main Layout */}
      {!loading && (
        <div className="relative min-h-screen">
          {/* Custom Magic Mouse Cursor */}
          <div id="magic-cursor">
            <div
              id="ball"
              style={{
                left: `${ballPos.x}px`,
                top: `${ballPos.y}px`,
                position: "fixed",
                zIndex: 999999,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            ></div>
          </div>

          <Header />
          <main>
            <Hero />
            <AboutUs />
            <Services />
            <PerfectFleets />
            <LuxuryCollection />
            <HowItWorks />
            <IntroVideo />
            <WhyChooseUs />
            <FAQs />
            <Testimonials />
            <CTA />
            <Articles />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
