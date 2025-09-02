# LAPORAN FRONTEND WEBSITE RENTAL MOBIL RINO

## RINGKASAN EKSEKUTIF

Website Rental Mobil Rino adalah aplikasi web modern yang dibangun menggunakan teknologi frontend terkini untuk memberikan pengalaman pengguna yang optimal. Aplikasi ini terdiri dari dua interface utama: **Customer Interface** untuk pelanggan dan **Admin Dashboard** untuk manajemen bisnis. Frontend dikembangkan dengan pendekatan modern menggunakan Next.js 15, TypeScript, Tailwind CSS, dan berbagai library UI yang powerful.

### Teknologi Utama yang Digunakan:
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Radix UI + Shadcn/ui
- **State Management**: React Hooks + SWR/TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React + React Icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod Validation

---

## 1. PENGERTIAN FRONTEND DAN TUGASNYA

### 1.1 Definisi Frontend
Frontend adalah bagian dari aplikasi web yang berinteraksi langsung dengan pengguna (user interface). Dalam konteks website rental mobil Rino, frontend bertanggung jawab untuk menampilkan informasi kendaraan, memproses pemesanan, dan memberikan pengalaman pengguna yang menarik dan mudah digunakan.

### 1.2 Tugas Frontend pada Proyek Rental Mobil Rino

#### A. Customer Interface (Interface Pelanggan)
1. **Landing Page yang Menarik**: Menampilkan hero section dengan call-to-action yang jelas
2. **Katalog Kendaraan**: Menampilkan daftar kendaraan dengan filter dan pencarian
3. **Detail Kendaraan**: Informasi lengkap tentang spesifikasi dan harga
4. **Galeri Foto**: Menampilkan foto-foto kendaraan dan aktivitas rental
5. **Halaman Kontak**: Informasi kontak dan form komunikasi
6. **Responsive Design**: Optimal di semua device (desktop, tablet, mobile)

#### B. Admin Dashboard
1. **Dashboard Analytics**: Grafik keuangan dan statistik bisnis
2. **Manajemen Katalog**: CRUD operasi untuk data kendaraan
3. **Sistem Order**: Tracking dan manajemen pesanan
4. **Laporan Keuangan**: Analisis pemasukan, pengeluaran, dan profit
5. **Pengeluaran Management**: Tracking biaya operasional

---

## 2. TEKNOLOGI YANG DIGUNAKAN

### 2.1 Framework Utama

#### Next.js 15 (App Router)
```typescript
// app/page.tsx - Contoh penggunaan App Router
'use client';
import React from 'react';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
// ... komponen lainnya
```

**Keunggulan Next.js 15:**
- Server-Side Rendering (SSR) untuk SEO optimal
- App Router untuk routing yang lebih fleksibel
- Built-in API routes
- Image optimization dengan Next.js Image
- Automatic code splitting

### 2.2 TypeScript
```typescript
// Contoh penggunaan TypeScript
interface FinanceSummary {
  month: string;
  pemasukan: number;
  pengeluaran: number;
  profit: number;
  order_selesai: number;
}
```

**Manfaat TypeScript:**
- Type safety untuk mengurangi bug
- Better IDE support dengan autocomplete
- Improved code maintainability
- Enhanced developer experience

### 2.3 Tailwind CSS
```css
/* tailwind.config.js */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ... custom colors
      }
    }
  }
}
```

**Fitur Tailwind CSS:**
- Utility-first CSS framework
- Responsive design classes
- Custom design system
- Dark mode support
- Animation utilities

### 2.4 Radix UI + Shadcn/ui
```typescript
// Contoh komponen UI
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
```

**Komponen yang Digunakan:**
- Button, Card, Badge
- Dialog, Popover, Tooltip
- Form components (Input, Select, Checkbox)
- Navigation components
- Toast notifications

### 2.5 Library Tambahan

#### Recharts (Data Visualization)
```typescript
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
```

#### Framer Motion (Animations)
```typescript
// Animasi untuk komponen
className="animate-fade-in"
```

#### React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
```

---

## 3. STRUKTUR FOLDER YANG RAPI DAN TERORGANISIR

```
app/
├── admin/                    # Admin Dashboard
│   ├── backend/             # Admin API handlers
│   ├── chart/               # Chart components
│   ├── components/          # Admin-specific components
│   ├── katalog/             # Katalog management
│   ├── laporan/             # Reports page
│   ├── order/               # Order management
│   ├── Pengeluaran/         # Expense management
│   ├── layout.tsx           # Admin layout
│   └── page.tsx             # Admin dashboard
├── api/                     # API routes
│   ├── auth/                # Authentication
│   ├── bookings/            # Booking management
│   ├── cars/                # Car management
│   ├── dashboard/           # Dashboard data
│   ├── expenses/            # Expense management
│   └── finance/             # Financial data
├── components/              # Shared components
│   ├── car-list/            # Car listing components
│   ├── home/                # Home page sections
│   ├── layout/              # Layout components
│   └── ui/                  # UI components
├── galeri/                  # Gallery page
├── kendaraan/               # Vehicle listing page
├── kontak/                  # Contact page
├── tentang/                 # About page
├── globals.css              # Global styles
├── layout.tsx               # Root layout
└── page.tsx                 # Home page
```

### 3.1 Penjelasan Struktur

#### A. App Directory (Next.js 15 App Router)
- **File-based routing**: Setiap folder mewakili route
- **Layout nesting**: Layout dapat di-nest untuk shared UI
- **Server/Client components**: Pemisahan yang jelas

#### B. Component Organization
- **Shared components**: Komponen yang digunakan di berbagai halaman
- **Page-specific components**: Komponen khusus untuk halaman tertentu
- **UI components**: Komponen dasar yang dapat digunakan ulang

#### C. API Routes
- **RESTful API**: Endpoint untuk operasi CRUD
- **Authentication**: JWT-based auth system
- **Data validation**: Input validation dan sanitization

---

## 4. KODE YANG MENAMPILKAN HALAMAN WEBSITE

### 4.1 Home Page (Landing Page)
```typescript
// app/page.tsx
'use client';
import React from 'react';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CTASection from "./components/home/CTASection";
import DisplaySection from "./components/home/DisplaySection";
import FasilitasSection from "./components/home/FasilitasSection";
import FiturSection from "./components/home/FiturSection";
import KendaraanSection from "./components/home/KendaraanSection";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      <Header />
      <main className="overflow-x-hidden">
        <DisplaySection />
        <FiturSection />
        <FasilitasSection />
        <KendaraanSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
```

### 4.2 Header Component
```typescript
// app/components/layout/Header.tsx
"use client";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Kendaraan', href: '/kendaraan' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Tentang Kami', href: '/tentang' },
    { name: 'Kontak', href: '/kontak' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
      {/* Navigation content */}
    </header>
  );
};
```

### 4.3 Display Section (Hero Section)
```typescript
// app/components/home/DisplaySection.tsx
import { Car, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from "../ui/button";

const DisplaySection = () => {
  const features = [
    'Mudah Di Akses',
    'Proses Cepat',
    'Harga Terjangkau'
  ];

  return (
    <section className="relative py-14 sm:py-10 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-cover bg-center"
             style={{ backgroundImage: `url(/images/mobil-display.png)` }}>
          {/* Hero content dengan gradient overlay */}
          <div className="relative z-10">
            <h1 className="text-4xl xl:text-6xl font-bold leading-tight text-white drop-shadow-lg">
              Nikmati Mudahnya
              <span className="block text-secondary">Sewa Kendaraan</span>
              <span className="block">di Sorong</span>
            </h1>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-white">
                <a href="https://wa.me/628123456789">Pesan Sekarang</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

## 5. TAMPILAN FRONTEND UNTUK CUSTOMER

### 5.1 Landing Page (Beranda)
**Fitur Utama:**
- **Hero Section**: Background image dengan overlay gradient
- **Call-to-Action**: Button "Pesan Sekarang" yang mengarah ke WhatsApp
- **Trust Indicators**: Statistik pelanggan, unit kendaraan, dan pengalaman
- **Feature Highlights**: Mudah diakses, proses cepat, harga terjangkau

**Design Elements:**
- Gradient overlay untuk readability
- Responsive typography (4xl-6xl untuk desktop)
- Smooth animations dengan Framer Motion
- Mobile-first responsive design

### 5.2 Halaman Kendaraan
```typescript
// app/kendaraan/page.tsx
const KendaraanPage: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);
  
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Daftar Kendaraan
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((mobil, index) => (
            <Card key={mobil.id} className="group card-hover border-border/50 overflow-hidden animate-fade-in">
              <div className="relative">
                <Image src={mobil.mainImage} alt={mobil.name} width={400} height={192} 
                       className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {mobil.status === 'available' && (
                    <Badge className="bg-green-500 text-white text-xs font-bold shadow">Tersedia</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-1">{mobil.name}</h3>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(mobil.price)}
                      <span className="text-sm font-normal text-muted-foreground">/hari</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                      {mobil.type}
                    </Badge>
                  </div>
                </div>
                {/* Specifications */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Settings className="w-4 h-4" />
                    <span>{mobil.transmisi}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{mobil.seats} orang</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Fuel className="w-4 h-4" />
                    <span>{mobil.bahanBakar}</span>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full btn-hero" asChild disabled={mobil.status !== 'available'}>
                    <a href={`https://wa.me/628123456789?text=Halo, saya tertarik untuk menyewa ${mobil.name} dengan harga ${formatCurrency(mobil.price)}/hari`}>
                      Pesan Sekarang
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`/detail/${mobil.id}`} className="flex items-center justify-center space-x-2">
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
```

**Fitur Halaman Kendaraan:**
- **Grid Layout**: Responsive grid untuk menampilkan kendaraan
- **Card Design**: Modern card dengan hover effects dan animasi fade-in
- **Status Badges**: Tersedia (hijau), Disewa (merah), Perbaikan (kuning) di pojok kiri atas
- **Type Badge**: Badge jenis tipe mobil di bagian kanan atas dalam area harga
- **Specification Display**: Transmisi, kapasitas, bahan bakar dengan icon
- **Dual Action Buttons**: "Pesan Sekarang" (WhatsApp) dan "Lihat Detail"
- **Direct WhatsApp Integration**: Button langsung ke WhatsApp dengan pre-filled message
- **Responsive Design**: Optimal di semua device dengan grid yang adaptif

### 5.3 Halaman Detail Kendaraan
- **Image Gallery**: Multiple images dengan carousel
- **Detailed Specifications**: Spesifikasi lengkap kendaraan
- **Pricing Information**: Harga per periode
- **Booking Form**: Form pemesanan terintegrasi
- **Related Cars**: Rekomendasi kendaraan serupa

### 5.4 Halaman Galeri
- **Photo Grid**: Layout masonry untuk foto-foto
- **Filter Categories**: Filter berdasarkan kategori
- **Lightbox**: Modal untuk melihat foto dalam ukuran besar
- **Responsive Design**: Optimal di semua device

---

## 6. TAMPILAN ADMIN DASHBOARD

### 6.1 Admin Layout
```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className="z-40 fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center h-20 px-6 border-b border-gray-200">
            <Image src="/logo-rino.svg" alt="Logo" width={40} height={40} />
            <div>
              <h1 className="text-lg font-bold text-[#1C3F94]">RINO</h1>
              <p className="text-xs text-gray-600">RENTAL MOBIL</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="mt-6 px-4 space-y-2">
            {menu.map(({ name, href, icon }) => (
              <Link key={name} href={href} className="flex items-center px-4 py-3 rounded-lg">
                <span className="mr-3 text-lg">{icon}</span> {name}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm h-16 px-6 flex items-center justify-between">
            {/* Topbar content */}
          </header>
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
```

### 6.2 Dashboard Analytics
```typescript
// app/admin/page.tsx
export default function AdminDashboardPage() {
  const [data, setData] = useState<FinanceSummary[]>([]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-6 px-2 md:px-6 lg:px-0">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-start justify-center border-b-4 border-blue-500">
            <span className="text-xs font-semibold text-gray-500 mb-1">Total Pemasukan</span>
            <span className="text-2xl font-bold text-blue-700 mb-1">{formatRupiah(totalPemasukan)}</span>
            <span className="text-xs text-gray-400">Akumulasi tahun berjalan</span>
          </div>
          {/* More stat cards */}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="font-bold text-lg mb-2 md:mb-4 text-blue-700">Grafik Keuangan</h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="6 6" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pemasukan" stroke="#2563eb" name="Pemasukan" />
                <Line type="monotone" dataKey="pengeluaran" stroke="#dc2626" name="Pengeluaran" />
                <Line type="monotone" dataKey="profit" stroke="#16a34a" name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="font-bold text-lg mb-2 md:mb-4 text-yellow-700">Order Selesai per Bulan</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="6 6" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="order_selesai" fill="#facc15" name="Order Selesai" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="font-bold text-lg mb-4 text-gray-700">Detail Data Keuangan Bulanan</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              {/* Table content */}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6.3 Fitur Admin Dashboard

#### A. Analytics Dashboard
- **Financial Charts**: Line chart untuk pemasukan, pengeluaran, profit
- **Order Statistics**: Bar chart untuk order selesai per bulan
- **Real-time Data**: Data yang diupdate secara real-time
- **Export Functionality**: Export data ke Excel/PDF

#### B. Katalog Management
- **CRUD Operations**: Create, Read, Update, Delete kendaraan
- **Image Upload**: Upload dan manage foto kendaraan
- **Status Management**: Update status kendaraan (tersedia/disewa/maintenance)
- **Bulk Operations**: Operasi massal untuk multiple kendaraan

#### C. Order Management
- **Order Tracking**: Track status pesanan
- **Payment Management**: Manage pembayaran
- **Customer Information**: Data pelanggan
- **Order History**: Riwayat pesanan

#### D. Financial Reports
- **Income Reports**: Laporan pemasukan
- **Expense Tracking**: Tracking pengeluaran
- **Profit Analysis**: Analisis profit
- **Monthly/Yearly Reports**: Laporan bulanan/tahunan

---

## 7. KESIMPULAN

Frontend website rental mobil Rino telah dikembangkan dengan pendekatan modern dan best practices yang menghasilkan aplikasi web yang:

### 7.1 Keunggulan Teknis
- **Performance**: Optimized dengan Next.js 15 dan image optimization
- **SEO**: Server-side rendering untuk SEO yang optimal
- **Accessibility**: Mengikuti WCAG guidelines
- **Responsive**: Mobile-first design yang optimal di semua device
- **Maintainable**: Clean code structure dengan TypeScript

### 7.2 User Experience
- **Intuitive Navigation**: Navigasi yang mudah dipahami
- **Fast Loading**: Optimized loading times
- **Modern UI**: Design yang modern dan menarik
- **Seamless Integration**: Integrasi WhatsApp untuk booking

### 7.3 Business Value
- **Lead Generation**: Call-to-action yang efektif
- **Customer Engagement**: Interactive elements yang engaging
- **Admin Efficiency**: Dashboard yang memudahkan manajemen
- **Scalability**: Architecture yang dapat dikembangkan lebih lanjut

Frontend website rental mobil Rino merupakan implementasi yang solid dari teknologi modern untuk bisnis rental mobil yang siap untuk berkembang dan memberikan pengalaman terbaik bagi pelanggan dan admin.
