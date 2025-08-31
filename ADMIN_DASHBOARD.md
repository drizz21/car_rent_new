# Admin Dashboard - Rental Mobil

## Overview
Sistem admin dashboard untuk mengelola rental mobil dengan fitur CRUD mobil, status ketersediaan, dan manajemen stok.

## Fitur Utama

### 1. Dashboard Overview
- **Statistik Real-time**: Total mobil, tersedia, sedang disewa, maintenance
- **Pendapatan Bulanan**: Tracking pendapatan rental
- **Rental Terbaru**: Daftar rental aktif dan selesai
- **Quick Actions**: Akses cepat ke fitur utama

### 2. Kelola Mobil (CRUD)
- **Create**: Tambah mobil baru dengan foto dan spesifikasi
- **Read**: Lihat daftar semua mobil dengan status
- **Update**: Edit informasi mobil dan status ketersediaan
- **Delete**: Hapus mobil dari sistem

### 3. Status Ketersediaan
- **Available**: Mobil tersedia untuk disewa
- **Rented**: Mobil sedang disewa (overlay hitam di website)
- **Maintenance**: Mobil sedang dalam perbaikan

### 4. Search & Filter
- **Search**: Cari mobil berdasarkan nama atau tipe
- **Filter**: Filter berdasarkan status ketersediaan
- **Sort**: Urutkan berdasarkan harga, nama, status

## Struktur File

```
rental-app/
├── admin/                    # Admin Dashboard
│   ├── layout.tsx           # Layout admin dengan sidebar
│   ├── page.tsx             # Dashboard utama
│   ├── cars/page.tsx        # Kelola mobil
│   └── login/page.tsx       # Halaman login admin
├── data/
│   ├── cars.tsx             # Data mobil original
│   └── carsWithStatus.ts    # Data mobil dengan status
├── app/
│   ├── components/
│   │   └── car-list/
│   │       └── carsList.tsx # Komponen tampilan mobil
│   └── vehicles/page.tsx    # Halaman vehicles
└── middleware.ts            # Proteksi route admin
```

## Cara Kerja Sistem

### 1. Data Management
```typescript
// data/carsWithStatus.ts
export interface CarWithStatus {
  id: number;
  name: string;
  // ... other properties
  status: 'available' | 'rented' | 'maintenance';
  lastUpdated: string;
}
```

### 2. Status Display di Website
- **Available**: Tampil normal dengan tombol "View Details"
- **Rented/Maintenance**: Overlay hitam + "Sedang Disewa" / "Maintenance"
- **Button**: Disabled untuk mobil tidak tersedia

### 3. Admin Control
- **Status Change**: Admin bisa ubah status via dropdown
- **Real-time Update**: Perubahan langsung terlihat di website
- **Manual Management**: Tidak ada payment gateway, admin atur manual

## Akses Admin

### Login
- **URL**: `/admin/login`
- **Credentials**: 
  - Username: `admin`
  - Password: `admin123`

### Routes
- **Dashboard**: `/admin`
- **Kelola Mobil**: `/admin/cars`
- **Login**: `/admin/login`

## Implementasi Status di Website

### 1. Car List Component
```typescript
// Tampilan dengan overlay untuk mobil tidak tersedia
{car.status !== 'available' && (
  <div className="absolute inset-0 bg-black bg-opacity-70">
    <div className="text-white text-center">
      <div className="text-lg font-bold">{getStatusText(car.status)}</div>
    </div>
  </div>
)}
```

### 2. Button State
```typescript
// Button disabled untuk mobil tidak tersedia
<Link 
  href={car.status === 'available' ? `/detail/${car.id}` : '#'} 
  className={car.status === 'available' ? 'enabled' : 'disabled'}
>
  {car.status === 'available' ? 'View Details' : 'Tidak Tersedia'}
</Link>
```

## Keuntungan Sistem Ini

### ✅ Pros:
1. **Simple & Manual**: Tidak perlu payment gateway kompleks
2. **Real-time Status**: Update status langsung terlihat di website
3. **Visual Feedback**: Overlay hitam jelas menunjukkan status
4. **Admin Control**: Full control atas stok mobil
5. **Responsive**: Works di mobile dan desktop

### ⚠️ Considerations:
1. **Manual Process**: Admin harus update status manual
2. **No Automation**: Tidak ada sistem booking otomatis
3. **Single Admin**: Belum ada multi-user admin
4. **Local Storage**: Data masih di local storage

## Pengembangan Selanjutnya

### 1. Backend Integration
```typescript
// API endpoints yang bisa ditambahkan
POST /api/admin/cars          // Create car
GET /api/admin/cars           // Get all cars
PUT /api/admin/cars/:id       // Update car
DELETE /api/admin/cars/:id    // Delete car
PUT /api/admin/cars/:id/status // Update status
```

### 2. Database
```sql
-- Schema untuk database
CREATE TABLE cars (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  type VARCHAR(50),
  price DECIMAL(10,2),
  status ENUM('available', 'rented', 'maintenance'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 3. Advanced Features
- **Booking System**: Sistem booking otomatis
- **Payment Integration**: Payment gateway
- **Multi Admin**: Multiple admin users
- **Notifications**: Notifikasi status perubahan
- **Reports**: Laporan detail rental

## Cara Menjalankan

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development**
```bash
npm run dev
```

3. **Access Admin**
- Website: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Security Notes

- **Demo Credentials**: Hanya untuk development
- **Production**: Implement proper authentication
- **HTTPS**: Use HTTPS in production
- **Environment Variables**: Store sensitive data in env vars

## Troubleshooting

### Common Issues:
1. **Status tidak update**: Refresh halaman website
2. **Login gagal**: Cek credentials admin/admin123
3. **Image tidak load**: Pastikan path image benar
4. **Middleware error**: Restart development server

### Debug Tips:
- Check browser console untuk errors
- Verify data di `data/carsWithStatus.ts`
- Test admin login di `/admin/login`
- Check network tab untuk API calls 