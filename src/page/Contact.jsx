import React, { useState } from "react";
import "../style/contact.css"; // Import file CSS

const Contact = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Giả lập gửi dữ liệu
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-container">
      <h2>Liên hệ chúng tôi</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="email">Email của bạn:</label>
          <input
            id="email"
            type="email"
            placeholder="Nhập email của bạn..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          {email && (
            <>
              <label htmlFor="feedback">Phản hồi của bạn:</label>
              <textarea
                id="feedback"
                placeholder="Nhập phản hồi của bạn tại đây..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </>
          )}
          
          <button 
            type="submit" 
            disabled={!email || !feedback || isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi phản hồi"}
          </button>
        </form>
      ) : (
        <div className="success-message">
          <p>Cảm ơn bạn đã gửi phản hồi!</p>
          <p>Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
