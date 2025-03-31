import React, { useState } from 'react';

const Account = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost/backend/account.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      setMessage(data.success ? 'Đăng nhập thành công!' : data.message || 'Đăng nhập thất bại!');
    } catch (error) {
      setMessage('Lỗi kết nối đến server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập</h2>
        {message && <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input type="text" id="username" name="username" value={credentials.username} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required />
        </div>
        
        <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng Nhập'}</button>
      </form>
    </div>
  );
};

export default Account;

