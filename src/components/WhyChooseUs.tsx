import React from "react";

export default function WhyChooseUs() {
  return (
    <div className="why-choose-us">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            {/* Section Title Start */}
            <div className="section-title">
              <h3 className="wow fadeInUp">why choose us</h3>
              <h2 className="text-anime-style-3" data-cursor="-opaque">
                Unmatched quality and service for your needs
              </h2>
            </div>
            {/* Section Title End */}
          </div>
        </div>

        <div className="row align-items-center">
          {/* Left Column */}
          <div className="col-lg-4 col-md-6 order-lg-1 order-md-1 order-1">
            {/* Why Choose Item Start */}
            <div className="why-choose-item wow fadeInUp">
              <div className="icon-box">
                <img src="/images/icon-why-choose-1.svg" alt="Fleet Options" />
              </div>
              <div className="why-choose-content">
                <h3>extensive fleet options</h3>
                <p>Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa</p>
              </div>
            </div>
            {/* Why Choose Item End */}

            {/* Why Choose Item Start */}
            <div className="why-choose-item wow fadeInUp" data-wow-delay="0.25s">
              <div className="icon-box">
                <img src="/images/icon-why-choose-2.svg" alt="Customer Service" />
              </div>
              <div className="why-choose-content">
                <h3>exceptional customer service</h3>
                <p>Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa</p>
              </div>
            </div>
            {/* Why Choose Item End */}
          </div>

          {/* Middle Column */}
          <div className="col-lg-4 col-md-12 order-lg-2 order-md-3 order-2">
            <div className="why-choose-image">
              <figure className="reveal" style={{ visibility: "visible" }}>
                <img src="/images/why-choose-img.jpg" alt="Why Choose Us Car" />
              </figure>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4 col-md-6 order-lg-3 order-md-2 order-3">
            {/* Why Choose Item Start */}
            <div className="why-choose-item wow fadeInUp">
              <div className="icon-box">
                <img src="/images/icon-why-choose-3.svg" alt="Locations" />
              </div>
              <div className="why-choose-content">
                <h3>convenient locations</h3>
                <p>Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa</p>
              </div>
            </div>
            {/* Why Choose Item End */}

            {/* Why Choose Item Start */}
            <div className="why-choose-item wow fadeInUp" data-wow-delay="0.25s">
              <div className="icon-box">
                <img src="/images/icon-why-choose-4.svg" alt="Safety" />
              </div>
              <div className="why-choose-content">
                <h3>reliability and safety</h3>
                <p>Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa</p>
              </div>
            </div>
            {/* Why Choose Item End */}
          </div>
        </div>
      </div>
    </div>
  );
}
