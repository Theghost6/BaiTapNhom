import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../style/register.css";
import { AuthContext } from "./funtion/AuthContext"; // Sửa đường dẫn nếu cần

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    loginIdentifier: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext); // Sử dụng cả login và isAuthenticated

  const validate = () => {
    let newErrors = {};

    if (isRegistering) {
      if (!formData.username) newErrors.name = "Tên không được để trống";
      if (!formData.phone)
        newErrors.phone = "Số điện thoại không được để trống";
      else if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Số điện thoại không hợp lệ";
      if (!formData.email) newErrors.email = "Email không được để trống";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) // Sử dụng regex tốt hơn
        newErrors.email = "Email không hợp lệ";
      if (!formData.password)
        newErrors.password = "Mật khẩu không được để trống";
      else if (formData.password.length < 6)
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    } else {
      if (!formData.loginIdentifier)
        newErrors.loginIdentifier = "Email hoặc số điện thoại không được để trống";
      if (!formData.password)
        newErrors.password = "Mật khẩu không được để trống";
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
    let payload = { ...formData };

    if (!isRegistering) {
      delete payload.confirmPassword;
      delete payload.username;

      if (/^\d{10}$/.test(payload.loginIdentifier)) {
        payload.phone = payload.loginIdentifier;
        delete payload.email;
      } else if (/^\S+@\S+\.\S+$/.test(payload.loginIdentifier)) {
        payload.email = payload.loginIdentifier;
        delete payload.phone;
      } else {
        setErrors({
          ...errors,
          loginIdentifier: "Email hoặc số điện thoại không hợp lệ",
        });
        return;
      }

      delete payload.loginIdentifier;
    } else {
      delete payload.loginIdentifier;
    }

    try {
      const response = await fetch("http://localhost/backend/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lỗi từ server: " + response.status);
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setMessage(data.success ? data.message : data.message || "Lỗi xảy ra!");

        if (data.success) {
          if (!isRegistering) {
            const userData = {

              id: data.user.id,
              username: data.username || data.user?.username || "Người dùng",
              identifier: payload.email || payload.phone,
              type: payload.email ? "email" : "phone",
                role: data.user?.role || "user", // Lấy role từ backend
            };

            // Cập nhật AuthContext
            login(userData);

            // Lưu vào localStorage (dù đã có trong AuthContext)
            localStorage.setItem("user", JSON.stringify(userData));

            // Chuyển hướng về trang chủ
            navigate("/");
          } else {
            setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
            setIsRegistering(false); // Chuyển sang form đăng nhập sau khi đăng ký
          }

          setFormData({
            username: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
            loginIdentifier: "",
          });
        }
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

  return (
    <div>
      <div className="container">
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Đăng nhập</h1>
            {message && (
              <p className={message.includes("thành công") ? "message success" : "message error"}>
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
              {errors.loginIdentifier && <p className="error">{errors.loginIdentifier}</p>}
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
              <p className={message.includes("thành công") ? "message success" : "message error"}>
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
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
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
