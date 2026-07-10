import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactUsForm from "@/components/ContactUsForm";

export const metadata: Metadata = {
  title: "Contact Us | PhillipCars",
  description: "Get in touch with PhillipCars for rental support, rent-to-own questions, or help listing your vehicle.",
};

const contactDetails = [
  {
    icon: "fa-solid fa-phone-volume",
    title: "call us",
    value: "+61 3 9000 0142",
  },
  {
    icon: "fa-solid fa-envelope",
    title: "email us",
    value: "support@phillipcars.com",
  },
  {
    icon: "fa-solid fa-location-dot",
    title: "visit us",
    value: "Melbourne, Victoria, Australia",
  },
];

export default function ContactUsPage() {
  return (
    <>
      <Header />

      <div
        className="page-header bg-section"
        style={{
          padding: "54px 0",
          backgroundImage: "url('/images/page-header-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div className="page-header-box">
            <h1 style={{ color: "#fff" }}>Contact Us</h1>
            <p style={{ color: "#eee", maxWidth: "640px", margin: "12px auto 0" }}>
              Reach the PhillipCars team in Melbourne for bookings, host support, and help finding the right next step.
            </p>
          </div>
        </div>
      </div>

      <div className="page-contact-us">
        <div className="container">
          <div className="contact-info-form">
            <div className="row g-4 align-items-stretch">
              <div className="col-lg-5">
                <div className="contact-information h-100">
                  <div className="section-title">
                    <h3>get in touch</h3>
                    <h2>We&apos;re here to help with every part of the journey</h2>
                    <p>
                      From Melbourne renters to Australian vehicle owners listing a car, we&apos;ll help you move faster.
                    </p>
                  </div>

                  <div className="contact-info-list">
                    {contactDetails.map((item) => (
                      <div className="contact-info-item" key={item.title}>
                        <div
                          className="icon-box"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                          }}
                        >
                          <i className={item.icon} aria-hidden="true"></i>
                        </div>
                        <div className="contact-info-content">
                          <p style={{ opacity: 0.72, textTransform: "capitalize" }}>{item.title}</p>
                          <p style={{ fontWeight: 700 }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="contact-info-social">
                    <ul>
                      <li>
                        <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer">
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer">
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://x.com/" aria-label="Twitter" target="_blank" rel="noreferrer">
                          <i className="fa-brands fa-x-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <ContactUsForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="google-map">
        <div className="container">
          <div className="section-title">
            <h3>find us</h3>
            <h2>Serving drivers and vehicle owners across Melbourne and Australia</h2>
          </div>

          <div className="google-map-iframe">
            <iframe
              title="PhillipCars location map"
              src="https://www.google.com/maps?q=Melbourne%20Victoria%20Australia&z=11&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
