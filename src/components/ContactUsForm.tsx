"use client";

import React, { useState } from "react";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactUsForm() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setForm(initialState);
  };

  return (
    <div className="contact-us-form">
      <div className="section-title">
        <h3>contact form</h3>
        <h2>Tell us what you need and we&apos;ll point you in the right direction</h2>
        <p>
          Questions about rentals, rent-to-own, or listing your own car are all welcome here.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-4">
              <label htmlFor="contact-name">full name</label>
              <input
                id="contact-name"
                type="text"
                className="form-control"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-4">
              <label htmlFor="contact-email">email address</label>
              <input
                id="contact-email"
                type="email"
                className="form-control"
                placeholder="Your email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-4">
              <label htmlFor="contact-phone">phone number</label>
              <input
                id="contact-phone"
                type="tel"
                className="form-control"
                placeholder="Your phone"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-4">
              <label htmlFor="contact-subject">subject</label>
              <input
                id="contact-subject"
                type="text"
                className="form-control"
                placeholder="How can we help?"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-12">
            <div className="form-group mb-4">
              <label htmlFor="contact-message">message</label>
              <textarea
                id="contact-message"
                className="form-control"
                placeholder="Tell us more about what you need"
                rows={5}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn-default">
              send message
            </button>
          </div>
        </div>
      </form>

      {submitted && (
        <p style={{ marginTop: "20px", color: "var(--accent-color)", fontWeight: 600 }}>
          Thanks for reaching out. Our team will review your message and follow up soon.
        </p>
      )}
    </div>
  );
}
