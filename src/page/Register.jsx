import React, { useState } from 'react';

const Register = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      console.log('Đang gửi request đến:', 'http://localhost/backend/register.php');
      console.log('Dữ liệu gửi đi:', JSON.stringify(credentials));
      
      const response = await fetch('http://localhost/backend/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      console.log('Mã trạng thái phản hồi:', response.status);
      console.log('Headers phản hồi:', response.headers);
      
      const text = await response.text();
      console.log('Phản hồi dạng text:', text);
      
      try {
        const data = JSON.parse(text);
        console.log('Dữ liệu JSON:', data);
        setMessage(data.success ? 'Đăng ký thành công!' : data.message || 'Đăng ký thất bại!');
      } catch (jsonError) {
        console.error('Lỗi parse JSON:', jsonError);
        setMessage('Phản hồi không phải định dạng JSON hợp lệ');
      }
    } catch (error) {
      console.error('Chi tiết lỗi kết nối:', error);
      setMessage('Lỗi kết nối đến server!');
    } 
  };


  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng Ký</h2>
        {message && <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input type="text" id="username" name="username" value={credentials.username} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={credentials.email} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required />
        </div>
        
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;

