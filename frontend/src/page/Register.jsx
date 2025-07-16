import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/register.css";
import { AuthContext } from "./function/AuthContext";
import { useRegisterLogic } from "../hooks/login/useRegisterLogic";

export default function Register() {
  const apiUrl = import.meta.env.VITE_HOST;
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    message,
    setMessage,
    isRegistering,
    setIsRegistering,
    handleChange,
    handleSubmit,
  } = useRegisterLogic(apiUrl);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Sử dụng cả login và isAuthenticated

  useEffect(() => {
    const container = document.querySelector(".container");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");

    if (registerBtn && loginBtn && container) {
      const handleRegisterClick = () => {
        container.classList.add("active");
        setIsRegistering(true);
        setErrors({});
        setMessage("");
      };

      const handleLoginClick = () => {
        container.classList.remove("active");
        setIsRegistering(false);
        setErrors({});
        setMessage("");
      };

      registerBtn.addEventListener("click", handleRegisterClick);
      loginBtn.addEventListener("click", handleLoginClick);

      return () => {
        registerBtn.removeEventListener("click", handleRegisterClick);
        loginBtn.removeEventListener("click", handleLoginClick);
      };
    }
  }, []);

  // Auto switch to login after successful registration
  useEffect(() => {
    if (message === "Đăng ký thành công! Vui lòng đăng nhập." && !isRegistering) {
      const container = document.querySelector(".container");
      if (container) {
        container.classList.remove("active");
      }
    }
  }, [message, isRegistering]);

  return (
    <div className="register-body">
      <div className="container">
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Đăng nhập</h1>
            {message && (
              <p
                className={
                  message.includes("thành công")
                    ? "message success"
                    : "message error"
                }
              >
                {message}
              </p>
            )}
            <div className="input-box">
              <input
                type="text"
                name="loginIdentifier"
                placeholder="Email hoặc Số điện thoại"
                value={formData.loginIdentifier}
                onChange={handleChange}
              />
              <i className="bx bxs-user" />
              {errors.loginIdentifier && (
                <p className="error">{errors.loginIdentifier}</p>
              )}
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Mật Khẩu"
                value={formData.password}
                onChange={handleChange}
              />
              <i className="bx bxs-lock-alt" />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="forgot-link">
              <a href="#">Quên mật khẩu?</a>
            </div>
            <button type="submit" className="btn">
              Đăng nhập
            </button>
          </form>
        </div>

        <div className="form-box register">
          <form onSubmit={handleSubmit}>
            <h1>Đăng ký</h1>
            {message && (
              <p
                className={
                  message.includes("thành công")
                    ? "message success"
                    : "message error"
                }
              >
                {message}
              </p>
            )}
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Họ và Tên"
                value={formData.username}
                onChange={handleChange}
              />
              <i className="bx bxs-user" />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="input-box">
              <input
                type="text"
                name="phone"
                placeholder="Số Điện Thoại"
                value={formData.phone}
                onChange={handleChange}
              />
              <i className="bx bxs-phone" />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <i className="bx bxs-envelope" />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Mật Khẩu"
                value={formData.password}
                onChange={handleChange}
              />
              <i className="bx bxs-lock-alt" />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="input-box">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác Thực Mật Khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <i className="bx bxs-lock-alt" />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>
            <button type="submit" className="btn">
              Đăng ký
            </button>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Không có tài khoản?</p>
            <button className="btn register-btn">Đăng ký</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Đã có tài khoản?</p>
            <button className="btn login-btn">Đăng nhập</button>
          </div>
        </div>
      </div>
    </div>
  );
}
