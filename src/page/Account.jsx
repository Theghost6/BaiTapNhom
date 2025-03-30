import React, { useState } from "react";
// import "./LoginForm.css"; // Import file CSS thuần

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    console.log("Đăng nhập với:", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Đăng Nhập</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button type="submit" className="submit-button">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
