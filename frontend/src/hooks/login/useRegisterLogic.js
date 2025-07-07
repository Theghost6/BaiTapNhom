import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../page/function/AuthContext";
import { setCookie } from "../../helper/cookieHelper";
import { useNavigate } from "react-router-dom";

export function useRegisterLogic(apiUrl) {
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
    const { login } = useContext(AuthContext);

    const validate = () => {
        let newErrors = {};
        if (isRegistering) {
            if (!formData.username) newErrors.name = "Tên không được để trống";
            if (!formData.phone) newErrors.phone = "Số điện thoại không được để trống";
            else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
            if (!formData.email) newErrors.email = "Email không được để trống";
            else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email không hợp lệ";
            if (!formData.password) newErrors.password = "Mật khẩu không được để trống";
            else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        } else {
            if (!formData.loginIdentifier) newErrors.loginIdentifier = "Email hoặc số điện thoại không được để trống";
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
        let payload = { ...formData };
        if (!isRegistering) {
            delete payload.confirmPassword;
            delete payload.username;
            if (payload.loginIdentifier.includes("@")) {
                payload.email = payload.loginIdentifier;
                delete payload.phone;
            } else {
                payload.phone = payload.loginIdentifier;
                delete payload.email;
            }
            delete payload.loginIdentifier;
        } else {
            delete payload.loginIdentifier;
        }
        try {
            const response = await fetch(`${apiUrl}/register.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            setMessage(data.message || "Lỗi không xác định");
            if (response.ok && data.success) {
                if (!isRegistering) {
                    const userData = {
                        id: data.user.id,
                        username: data.user?.username || "Người dùng",
                        identifier: payload.email || payload.phone,
                        type: payload.email ? "email" : "phone",
                        role: data.user?.role || "user",
                    };
                    login(userData);
                    setCookie("user", JSON.stringify(userData));
                    navigate("/");
                } else {
                    setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
                    setIsRegistering(false);
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
        } catch (error) {
            setMessage("Không thể kết nối đến server!");
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

    return {
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
    };
}
