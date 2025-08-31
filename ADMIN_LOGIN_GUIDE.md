# Admin Login Guide - Rental Mobil Sorong

## Cara Login Admin

### 1. Akses Halaman Login
- Buka browser dan kunjungi: `http://localhost:3000/admin/login`
- Atau klik tombol "Admin Login" di website utama
- npm run dev
- node server.js
- npx nodemon server.js

### 2. Credentials Login
```
Username: admin
Password: admin123
```

### 3. Proses Login
1. Masukkan username dan password
2. Klik tombol "Masuk"
3. Sistem akan memverifikasi credentials
4. Jika berhasil, akan redirect ke dashboard admin

## Fitur Dashboard Admin

### 1. Statistik Overview
- **Total Pemasukan**: Total pendapatan dari rental
- **Unit Tersedia**: Jumlah mobil yang tersedia
- **Unit Disewa**: Jumlah mobil yang sedang disewa
- **Total Booking**: Total pesanan yang masuk

### 2. Manajemen Mobil
- **Tambah Mobil**: Menambah data mobil baru
- **Edit Mobil**: Mengubah informasi mobil
- **Hapus Mobil**: Menghapus data mobil
- **Lihat Daftar**: Melihat semua data mobil

### 3. Keamanan
- **Session Management**: Token-based authentication
- **Auto Logout**: Session expired setelah 1 jam
- **Route Protection**: Middleware melindungi route admin

## Troubleshooting

### Masalah Login
1. **Password Salah**: Pastikan username `admin` dan password `admin123`
2. **Halaman Tidak Load**: Refresh browser atau clear cache
3. **Redirect Loop**: Clear localStorage dan cookies

### Cara Clear Data
```javascript
// Di browser console
localStorage.clear();
document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
```

### Reset Password (Development)
Untuk development, password hardcoded di `app/admin/login/page.tsx`:
```typescript
if (username === 'admin' && password === 'admin123') {
  // Login berhasil
}
```

## Struktur File

```
app/admin/
├── login/
│   ├── page.tsx          # Halaman login
│   └── layout.tsx        # Layout login
├── components/
│   └── AdminGuard.tsx    # Komponen proteksi route
├── page.tsx              # Dashboard utama
└── layout.tsx            # Layout admin
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin (belum diimplementasi)
- `POST /api/auth/logout` - Logout admin (belum diimplementasi)

### Cars Management
- `GET /api/cars` - Ambil semua data mobil
- `POST /api/cars` - Tambah mobil baru
- `PUT /api/cars/:id` - Update data mobil
- `DELETE /api/cars/:id` - Hapus mobil

### Bookings
- `GET /api/bookings` - Ambil data booking

## Security Notes

### Development
- Credentials hardcoded untuk kemudahan development
- Token disimpan di localStorage dan cookies
- Session expired 1 jam

### Production
- Implement proper authentication dengan backend
- Gunakan HTTPS
- Hash password dengan bcrypt
- Implement rate limiting
- Gunakan JWT tokens

## Next Steps

1. **Backend Integration**: Hubungkan dengan API backend
2. **Database**: Implement database untuk menyimpan data
3. **User Management**: Multi-user admin system
4. **Role-based Access**: Different admin roles
5. **Audit Log**: Track admin activities 