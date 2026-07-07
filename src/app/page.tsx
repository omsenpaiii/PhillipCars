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

  useEffect(() => {
    // Dismiss preloader after components mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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
