import React, { useState } from "react";
import "../style/contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-wrapper">
      <div className="form-section">
        <p className="contact-subtitle">Contact form</p>
        <h2 className="contact-title">Drop Us a Line</h2>
        <p className="contact-description">
          Your email address will not be published. Required fields are marked <span className="required">*</span>
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <textarea
              name="message"
              placeholder="Message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button className="contact-wrapper-button" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send message"}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <p>Thanks for your message!</p>
            <p>We will get back to you as soon as possible.</p>
          </div>
        )}
      </div>

      <div className="image-section">
        <img src="/photos/contact.jpg" alt="Contact" />
      </div>
    </div>
  );
};

export default Contact;
