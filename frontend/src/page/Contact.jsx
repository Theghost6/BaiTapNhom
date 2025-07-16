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
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_HOST;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/lien_he.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text(); // Get raw response text

      const result = JSON.parse(text); // Attempt to parse as JSON

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(result.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError("Không thể gửi biểu mẫu: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="contact-wrapper">
      <div className="form-section">
        <p className="contact-subtitle"> Liên hệ</p>
        <h2 className="contact-title">Drop Us a Line</h2>
        <p className="contact-description">
          Địa chỉ của bạn chúng tôi sẽ không công khai
          <span className="required">*</span>
        </p>
        {!submitted ? (
          <>
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
              <button
                className="contact-wrapper-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send message"}
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </>
        ) : (
          <div className="success-message">
            <p> Cảm ơn bạn đã gửi</p>
            <p>Chúng tôi sẽ phản hồi cho bạn sớm nhất</p>
            <div style={{ marginTop: 16, padding: 12, border: '1px solid #0D92F4', background: '#fffbe7', color: '#c62e2e', fontWeight: 600 }}>
              <span>Nội dung bạn vừa gửi:</span>
              <div
                style={{
                  marginTop: 8,
                  minHeight: 40,
                  fontSize: 18,
                  lineHeight: 1.5,
                  wordBreak: "break-word"
                }}
                dangerouslySetInnerHTML={{ __html: formData.message }}
              />
            </div>
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
