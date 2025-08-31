# 🚗 Car Rental System - Setup Guide

## 📋 Prerequisites

Sebelum menjalankan sistem, pastikan Anda telah menginstall:

1. **Node.js** (versi 16 atau lebih baru)
2. **MySQL Server** (versi 8.0 atau lebih baru)
3. **Git** (untuk clone repository)

## 🗄️ Database Setup

### 1. Install MySQL Server
- **Windows**: Download dari [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
- **macOS**: `brew install mysql`
- **Linux**: `sudo apt install mysql-server`

### 2. Start MySQL Service
```bash
# Windows
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 3. Buat Database
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE car_rental;
USE car_rental;

# Exit MySQL
exit;
```

### 4. Import Database Schema
```bash
# Import file database_setup.sql
mysql -u root -p car_rental < database_setup.sql
```

**Atau melalui phpMyAdmin:**
1. Buka phpMyAdmin di browser
2. Pilih database `rental_rino_data`
3. Klik tab "Import"
4. Upload file `database_setup.sql`
5. Klik "Go"

## 🔧 Project Setup

### 1. Install Dependencies
```bash
# Install semua dependencies
npm install
```

### 2. Konfigurasi Database
Edit file `config/database.js` jika password MySQL Anda berbeda:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'YOUR_MYSQL_PASSWORD', // Ganti dengan password Anda
  database: 'rental_rino_data',
  // ... rest of config
};
```

### 3. Environment Variables (Opsional)
Buat file `.env` di root project:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rental_rino_data
```

## 🚀 Menjalankan Aplikasi

### Development Mode
```bash
# Jalankan backend dan frontend bersamaan
npm run dev:all

# Atau jalankan terpisah:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

### Production Mode
```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

## 🌐 Akses Aplikasi

- **Website**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3001/admin/login
- **Backend API**: http://localhost:3000

## 🔐 Login Admin

**Credentials:**
- **Username**: `admin`
- **Password**: `admin123`

## 📊 Fitur Dashboard Admin

### ✅ Yang Sudah Tersedia:
- ✅ Dashboard dengan grafik revenue
- ✅ Grafik status mobil (pie chart)
- ✅ Tabel booking terbaru
- ✅ Statistik real-time
- ✅ Manajemen mobil (CRUD)
- ✅ Manajemen booking
- ✅ Manajemen pengeluaran

### 📈 Grafik yang Tersedia:
1. **Revenue Chart** - Grafik pendapatan 6 bulan terakhir
2. **Car Status Chart** - Distribusi status mobil (tersedia/disewa/maintenance)
3. **Booking Statistics** - Statistik booking per status

## 🔧 Troubleshooting

### ❌ Database Connection Error
```bash
# Cek apakah MySQL berjalan
mysql -u root -p

# Jika error, restart MySQL:
# Windows
net stop mysql && net start mysql

# macOS
brew services restart mysql

# Linux
sudo systemctl restart mysql
```

### ❌ Port Already in Use
```bash
# Cek port yang digunakan
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill process jika perlu
taskkill /PID <PID_NUMBER> /F
```

### ❌ Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### ❌ Admin Login Gagal
1. Pastikan database sudah diimport dengan benar
2. Cek tabel `users` di database
3. Pastikan password di `config/database.js` benar

## 📁 Struktur Database

### Tabel `cars`
- `id` - Primary key
- `name` - Nama mobil
- `type` - Tipe mobil
- `price` - Harga per hari
- `status` - Status (available/rented/maintenance)
- `mainImage` - Gambar mobil (BLOB)

### Tabel `bookings`
- `id` - Primary key
- `customer_name` - Nama customer
- `unit` - Mobil yang disewa
- `order_id` - ID order unik
- `start_date` - Tanggal mulai
- `end_date` - Tanggal selesai
- `status` - Status booking

### Tabel `expenses`
- `id` - Primary key
- `description` - Deskripsi pengeluaran
- `amount` - Jumlah pengeluaran
- `category` - Kategori pengeluaran
- `date` - Tanggal pengeluaran

### Tabel `users`
- `id` - Primary key
- `username` - Username admin
- `password` - Password (hashed)
- `role` - Role user

## 🔄 Update Data

### Menambah Mobil Baru
1. Login ke admin dashboard
2. Klik "Kelola Mobil"
3. Klik "Tambah Mobil"
4. Isi form dan upload gambar
5. Klik "Simpan"

### Update Status Mobil
1. Di halaman "Kelola Mobil"
2. Pilih status dari dropdown
3. Status akan otomatis terupdate

### Menambah Booking
1. Klik "Kelola Order"
2. Klik "Tambah Order"
3. Isi data customer dan mobil
4. Klik "Simpan"

## 📞 Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Cek terminal untuk error backend
3. Pastikan semua service berjalan
4. Restart aplikasi jika perlu

---

**🎉 Selamat! Sistem car rental Anda sudah siap digunakan!** 