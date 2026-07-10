import React from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <div className="cta-box bg-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-7">
            {/* Cta Box Content Start */}
            <div className="cta-box-content">
              {/* Section Title Start */}
              <div className="section-title">
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Ready to hit the road? Book your car today !
                </h2>
                <p className="wow fadeInUp">
                  Our friendly customer service team is here to help. Contact us anytime for support and inquiries.
                </p>
              </div>
              {/* Section Title End */}

              {/* Cta Box Btn Start */}
              <div className="cta-box-btn wow fadeInUp" data-wow-delay="0.5s">
                <Link href="/contact-us" className="btn-default">
                  contact us
                </Link>
              </div>
              {/* Cta Box Btn End */}
            </div>
            {/* Cta Box Content End */}
          </div>

          <div className="col-lg-6 col-md-5">
            {/* Cta Box Image Start */}
            <div className="cat-box-image">
              <figure>
                <img src="/images/cta-car-img.png" alt="CTA Car" />
              </figure>
            </div>
            {/* Cta Box Image End */}
          </div>
        </div>
      </div>
    </div>
  );
}
