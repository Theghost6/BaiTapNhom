import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save } from "lucide-react";
import "../../style/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "", // Tương ứng với "user" trong DB
    phone: "", // Tương ứng với "phone" trong DB
    email: "", // Tương ứng với "email" trong DB
  });
  const navigate = useNavigate();

  const USER_KEY = "user";

  // Lấy thông tin người dùng từ localStorage khi component mount
  useEffect(() => {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Ánh xạ dữ liệu từ API sang formData
      setFormData({
        username: parsedUser.username || "", // Từ API là "username", trong DB là "user"
        phone: parsedUser.identifier === "phone" ? parsedUser.identifier : "", // Nếu type là "phone"
        email: parsedUser.type === "email" ? parsedUser.identifier : "", // Nếu type là "email"
      });
    } else {
      navigate("/"); // Nếu không có thông tin, quay lại trang chủ
    }
  }, [navigate]);

  // Xử lý thay đổi trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu thông tin đã chỉnh sửa
  const handleSave = async () => {
    try {
      const updatedUser = {
        user: formData.username,
        phone: formData.phone,
        email: formData.email,
        currentIdentifier: user.identifier,
        currentType: user.type,
      };

      console.log("Dữ liệu gửi đi:", updatedUser);

      const response = await fetch(
        "http://localhost/backend/update-profile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
          credentials: "include",
        },
      );

      if (!response.ok) {
        const text = await response.text(); // Lấy toàn bộ response text để debug
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${text}`,
        );
      }

      const result = await response.json();

      console.log("Dữ liệu nhận về từ backend:", result);

      if (result.success) {
        const newUserData = {
          username: updatedUser.user,
          identifier:
            updatedUser.currentType === "phone"
              ? updatedUser.phone
              : updatedUser.email,
          type: updatedUser.currentType,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(newUserData));
        setUser(newUserData);
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      } else {
        throw new Error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      alert(
        "Cập nhật thông tin thất bại. Vui lòng thử lại! Chi tiết: " +
          error.message,
      );
    }
  };
  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="profile-container">
      <h1>Thông Tin Cá Nhân</h1>

      <div className="profile-info">
        {isEditing ? (
          <form className="profile-form">
            <div className="form-group">
              <label>Tên người dùng:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>

            <button type="button" onClick={handleSave} className="save-button">
              <Save size={16} /> Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-button"
            >
              Hủy
            </button>
          </form>
        ) : (
          <div className="profile-details">
            <p>
              <strong>Tên người dùng:</strong>{" "}
              {user.username || "Chưa cập nhật"}
            </p>
            <p>
              <strong>
                {user.type === "phone" ? "Số điện thoại:" : "Email:"}
              </strong>{" "}
              {user.identifier || "Chưa cập nhật"}
            </p>
            <button onClick={() => setIsEditing(true)} className="edit-button">
              <Edit size={16} /> Chỉnh sửa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
