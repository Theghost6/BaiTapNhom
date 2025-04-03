import { useState, useEffect } from "react";
import "../style/register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Theo dõi trạng thái

  const validate = () => {
    let newErrors = {};
    if (isRegistering) {
      if (!formData.username) newErrors.name = "Tên không được để trống";
      if (!formData.email.includes("@")) newErrors.email = "Email không hợp lệ";
      if (formData.password.length < 6)
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    } else {
      if (!formData.username) newErrors.name = "Tên đăng nhập không được để trống";
      if (!formData.password) newErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setMessage("");

    const url = isRegistering
      ? "http://localhost/backend/register.php"
      : "http://localhost/backend/account.php"; // Chọn file PHP phù hợp

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setMessage(data.success ? "Thành công!" : data.message || "Lỗi xảy ra!");
      } catch (jsonError) {
        console.error("Lỗi parse JSON:", jsonError);
        setMessage("Phản hồi không phải định dạng JSON hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setMessage("Lỗi kết nối đến server!");
    }
  };

  useEffect(() => {
    const container = document.querySelector(".container");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");

    if (registerBtn && loginBtn && container) {
      registerBtn.addEventListener("click", () => {
        container.classList.add("active");
        setIsRegistering(true); // Chuyển sang đăng ký
      });

      loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
        setIsRegistering(false); // Chuyển sang đăng nhập
      });

      return () => {
        registerBtn.removeEventListener("click", () => container.classList.add("active"));
        loginBtn.removeEventListener("click", () => container.classList.remove("active"));
      };
    }
  }, []);

  return (
    <div>
      <div className="container">
        {/* Form Đăng nhập */}
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Đăng nhập</h1>
            {message && <p className="message">{message}</p>}
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <i className="bx bxs-user" />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
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

        {/* Form Đăng ký */}
        <div className="form-box register">
          <form onSubmit={handleSubmit}>
            <h1>Đăng ký</h1>
            {message && <p className="message">{message}</p>}
            <div className="input-box">
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <i className="bx bxs-user" />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <i className="bx bxs-envelope" />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="bx bxs-lock-alt" />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="input-box">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <i className="bx bxs-lock-alt" />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="btn">
              Đăng ký
            </button>
          </form>
        </div>

        {/* Toggle chuyển đổi */}
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

