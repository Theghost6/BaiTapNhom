import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, Upload, User } from "lucide-react";
import "../../style/profile.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const USER_KEY = "user";

useEffect(() => {
  const fetchUserProfile = async () => {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setAvatarPreview(parsedUser.avatar || "");
    setFormData({
      username: parsedUser.username || "",
      phone: parsedUser.type === "phone" ? parsedUser.identifier : "",
      email: parsedUser.type === "email" ? parsedUser.identifier : "",
      password: "",
      confirmPassword: "",
    });

    try {
      const response = await fetch(
        `http://localhost/BaiTapNhom/backend/get-profile.php?identifier=${encodeURIComponent(parsedUser.identifier)}&identifierType=${parsedUser.type}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${await response.text()}`);
      }

      const result = await response.json();
      if (result.success) {
        const newUserData = {
          ...parsedUser,
          username: result.data.user,
          identifier: parsedUser.type === "phone" ? result.data.phone : result.data.email,
          type: parsedUser.type,
          avatar: result.data.avatarUrl,
        };

        setUser(newUserData);
        setAvatarPreview(result.data.avatarUrl || "");
        setFormData({
          username: result.data.user || "",
          phone: result.data.phone || "",
          email: result.data.email || "",
          password: "",
          confirmPassword: "",
        });

        localStorage.setItem(USER_KEY, JSON.stringify(newUserData));
      } else {
        console.error("API error:", result.message);
        toast.error("Không thể tải thông tin người dùng: " + result.message);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Lỗi khi tải thông tin người dùng: " + error.message);
      // Fallback to localStorage data
    }
  };

  fetchUserProfile();
}, [navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validatePassword = () => {
    if (
      formData?.password &&
      formData?.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      toast.warning("Mật khẩu xác nhận không khớp!");
      return false;
    }

    return true;
  };
  
const handleSave = async () => {
  try {
    if (formData.password && !validatePassword()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    
    if (formData.password) {
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);
    }
    
    formDataToSend.append("currentIdentifier", user.identifier);
    formDataToSend.append("currentType", user.type);

    if (avatar) {
      formDataToSend.append("avatar", avatar);
    }
    
    console.log("Sending form data:", Object.fromEntries(formDataToSend));
    
    const response = await fetch(
      "http://localhost/BaiTapNhom/backend/update-profile.php",
      {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
    }

    const result = await response.json();
    console.log("Response from server:", result);

    if (result.success) {
      // Giữ avatar cũ nếu không có avatar mới từ server
      let newAvatarUrl = user.avatar; // Mặc định là avatar hiện tại
      
      if (result.avatarUrl) {
        newAvatarUrl = result.avatarUrl;
        setAvatarPreview(result.avatarUrl);
      } else {
        // Nếu không upload avatar mới, lấy avatar hiện tại từ server
        const avatarPattern = `http://localhost/BaiTapNhom/backend/uploads/avatars/avatar_${user.identifier}.*`;
        newAvatarUrl = newAvatarUrl || null; // Giữ null nếu không có avatar
      }
      
      // Tạo dữ liệu user mới
      const newUserData = {
        ...user,
        username: formData.username,
        identifier: user.type === "phone" ? formData.phone : formData.email,
        type: user.type,
        avatar: newAvatarUrl, // Cập nhật avatar
      };
      
      if (formData.password) {
        newUserData.password = formData.password;
      }

      console.log("Updating user data in localStorage:", newUserData);
      
      localStorage.setItem(USER_KEY, JSON.stringify(newUserData));
      setUser(newUserData);
      setIsEditing(false);
      
      toast.success("Cập nhật thông tin thành công!");
    } else {
      throw new Error(result.message || "Cập nhật thất bại");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    toast.error(
      "Cập nhật thông tin thất bại. Vui lòng thử lại! Chi tiết: " +
        error.message
    );
  }
};

  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="profile-container">
      <h1>Thông Tin Cá Nhân</h1>

      <div className="profile-info">
        <div className="profile-avatar-section">
<div className="avatar-container">
  {avatarPreview ? (
    <img src={avatarPreview} alt="Avatar" onError={() => setAvatarPreview("")} />
  ) : user.avatar ? (
    <img src={user.avatar} alt="Avatar" onError={() => setAvatarPreview("")} />
  ) : (
    <img src="/path/to/default-avatar.png" alt="Default Avatar" />
  )}
</div>
          {isEditing && (
            <div className="avatar-upload">
              <label htmlFor="avatar-upload">
                <Upload size={16} /> Chọn ảnh đại diện
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
<button
  type="button"
  className="remove-avatar-button"
  onClick={() => {
    setAvatar(null);
    setAvatarPreview("");
  }}
>
  Xóa ảnh đại diện
</button>

            </div>
          )}
        </div>

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
            <div className="form-group">
              <label>Mật khẩu mới:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="form-group">
              <label> Xác nhận mật khẩu:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu xác nhận"
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={handleSave}
                className="save-button"
              >
                <Save size={16} /> Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Bạn có chắc chắn muốn hủy chỉnh sửa?")) {
                    setIsEditing(false);
                    setAvatarPreview(user.avatar || ""); // Reset avatar preview
                  }
                }}
                className="cancel-button"
              >
                Hủy
              </button>
            </div>
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
      <ToastContainer />
    </div>
  );
};

export default Profile;
