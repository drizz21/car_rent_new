# Konfigurasi Port - Car Rental System

## 📋 Daftar Port yang Digunakan

### 🖥️ Frontend (Next.js)
- **Port**: 3000 (default) atau 3003 (jika 3000 sudah digunakan)
- **URL**: `http://localhost:3000` atau `http://localhost:3003`
- **Fungsi**: Website utama, admin dashboard, UI aplikasi

### 🔧 Backend (Express.js)
- **Port**: 5000
- **URL**: `http://localhost:5000`
- **Fungsi**: API server, database operations, file upload

### 🗄️ Database (MySQL/XAMPP)
- **Port**: 3306 (default MySQL)
- **URL**: `http://localhost/phpmyadmin`
- **Fungsi**: Database management, data storage

## 🚀 Cara Menjalankan

### 1. Jalankan Backend Server
```bash
npm run server
# atau
node server.js
```
Backend akan berjalan di: `http://localhost:5000`

### 2. Jalankan Frontend
```bash
npm run dev
```
Frontend akan berjalan di: `http://localhost:3000` (atau 3003 jika 3000 sudah digunakan)

### 3. Akses Website
- **Website Utama**: `http://localhost:3000` (atau 3003)
- **Admin Login**: `http://localhost:3000/admin/login` (atau 3003)
- **Admin Dashboard**: `http://localhost:3000/admin` (setelah login)
- **Database**: `http://localhost/phpmyadmin`

## 🔧 Troubleshooting Port

### Jika Port 3000 Sudah Digunakan:
- Frontend akan otomatis pindah ke port 3003
- Backend tetap di port 5000
- CORS sudah dikonfigurasi untuk menerima kedua port

### Jika Port 5000 Sudah Digunakan:
- Ubah port di `server.js` baris 9: `const port = 5001;`
- Update CORS origin di `server.js` baris 12-16

## 📱 Akses dari Perangkat Lain
- **Frontend**: `http://[IP_ADDRESS]:3000` (atau 3003)
- **Backend**: `http://[IP_ADDRESS]:5000`
- **Database**: `http://[IP_ADDRESS]/phpmyadmin`

## ✅ Verifikasi Server Berjalan
```bash
# Cek port 3000/3003 (Frontend)
netstat -an | findstr :3000
netstat -an | findstr :3003

# Cek port 5000 (Backend)
netstat -an | findstr :5000

# Cek port 3306 (MySQL)
netstat -an | findstr :3306
``` 