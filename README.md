
# 📚 BaiTapNhom

## Hướng Dẫn Chạy Dự Án ReactJS Trên Windows, XAMPP hoặc Docker

---

## 📌 Bước 1: Cài đặt Node.js

1. Truy cập trang [https://nodejs.org/](https://nodejs.org/)
2. Tải phiên bản **LTS** phù hợp với Windows
3. Cài đặt như phần mềm thông thường (Next → Next → Finish)

**Kiểm tra cài đặt:**
```bash
node -v
npm -v
```
Nếu hai lệnh trả về phiên bản (ví dụ `v20.x.x`…), bạn đã cài thành công.

---

## 📌 Bước 2: Tải Dự Án Về

### ✅ Cách 1: Clone bằng Git
```bash
git clone https://github.com/Theghost6/BaiTapNhom.git
cd BaiTapNhom
```

### ✅ Cách 2: Tải file ZIP
1. Truy cập GitHub → bấm **Code** → chọn **Download ZIP**
2. Giải nén ra thư mục `BaiTapNhom`
3. Di chuyển vào thư mục đó:
```bash
cd BaiTapNhom
```

---

## 📌 Bước 3: Cài đặt thư viện với npm
```bash
cd C:\xampp\htdocs\BaiTapNhom\frontend
```
Chạy lệnh:
```bash
npm install
```
Lệnh này sẽ tự động tải tất cả các thư viện phụ thuộc từ file `package.json`.

---

## 📌 Bước 4: Chạy Dự Án React

Nếu dự án dùng Vite:
```bash
npm start
```

Mặc định chạy tại địa chỉ: [http://localhost:5173](http://localhost:5173)

---

## 📌 Bước 5: Đưa Dự Án Vào Thư Mục XAMPP (`htdocs`)

1. Mở thư mục cài đặt XAMPP (mặc định: `C:\xampp\htdocs`)
2. Di chuyển thư mục dự án `BaiTapNhom` vào `htdocs`
```bash
C:\xampp\htdocs\BaiTapNhom\
```
3. Sau khi di chuyển xong ta import file sql mới có đầy đủ chức năng (Nằm trong Backend)
---

## 📌 (Tùy chọn) Chạy Dự Án Bằng Docker

### 👉 Yêu cầu:
- Cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  
### Vào trong BaiTapNhom chạy

### 👉 Chạy Docker:
```bash
docker compose up --build
```
Hoặc:
```bash
docker-compose up --build
```
**Dự án sẽ chạy tại:** [http://localhost:3000](http://localhost:3000)

---
Khi chạy xamp hoặc docker hãy vào .env của frontdend và backend để chỉnh chính xác đường dẫn để có hoạt động tốt nhất :3
## 🎉 Hoàn Thành!

> By NTS 🎨
