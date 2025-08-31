// Mock data untuk website Rino Rental Sorong

export interface Mobil {
  id: string;
  nama: string;
  kategori: 'Sedan' | 'SUV' | 'MPV' | 'Hatchback' | 'Minivan' | 'Pickup';
  harga: number;
  gambar: string;
  spesifikasi: {
    transmisi: string;
    bahan_bakar: string;
    kapasitas: number;
    tahun: number;
  };
  tersedia: boolean;
}

export interface Review {
  id: string;
  nama: string;
  rating: number;
  komentar: string;
  avatar: string;
  tanggal: string;
}

export interface GambarGaleri {
  id: string;
  url: string;
  alt: string;
  kategori: string;
}

export interface StatistikAdmin {
  totalBooking: number;
  pendapatanBulan: number;
  mobilTersedia: number;
  customerAktif: number;
}

// Data mobil rental
export const daftarMobil: Mobil[] = [
  {
    id: '1', nama: 'Alprad Cream', kategori: 'SUV', harga: 600000, gambar: '/images/car-list/alprad-cream.jpg', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Bensin', kapasitas: 7, tahun: 2022 }, tersedia: true },
  { id: '2', nama: 'Avanza Gray', kategori: 'MPV', harga: 350000, gambar: '/images/car-list/avanza-gray.png', spesifikasi: { transmisi: 'Manual', bahan_bakar: 'Bensin', kapasitas: 7, tahun: 2021 }, tersedia: true },
  { id: '3', nama: 'Brio White', kategori: 'Hatchback', harga: 250000, gambar: '/images/car-list/brio-white.jpg', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Bensin', kapasitas: 5, tahun: 2023 }, tersedia: true },
  { id: '4', nama: 'Camey Gray', kategori: 'Sedan', harga: 300000, gambar: '/images/car-list/camey-gray.jpg', spesifikasi: { transmisi: 'Manual', bahan_bakar: 'Bensin', kapasitas: 5, tahun: 2020 }, tersedia: true },
  { id: '5', nama: 'Civic White', kategori: 'Sedan', harga: 350000, gambar: '/images/car-list/civic-white.png', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Bensin', kapasitas: 5, tahun: 2022 }, tersedia: true },
  { id: '6', nama: 'Ertiga White', kategori: 'MPV', harga: 320000, gambar: '/images/car-list/ertiga-white.jpg', spesifikasi: { transmisi: 'Manual', bahan_bakar: 'Bensin', kapasitas: 7, tahun: 2021 }, tersedia: true },
  { id: '7', nama: 'Fortuner White', kategori: 'SUV', harga: 650000, gambar: '/images/car-list/fortuner-white.jpg', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Diesel', kapasitas: 7, tahun: 2023 }, tersedia: true },
  { id: '8', nama: 'Hiace White', kategori: 'Minivan', harga: 700000, gambar: '/images/car-list/hiace-white.jpg', spesifikasi: { transmisi: 'Manual', bahan_bakar: 'Diesel', kapasitas: 12, tahun: 2022 }, tersedia: true },
  { id: '9', nama: 'Hilux Gray', kategori: 'Pickup', harga: 400000, gambar: '/images/car-list/hilux-gray.jpg', spesifikasi: { transmisi: 'Manual', bahan_bakar: 'Diesel', kapasitas: 2, tahun: 2021 }, tersedia: true },
  { id: '10', nama: 'Innova White', kategori: 'MPV', harga: 450000, gambar: '/images/car-list/innova-white.jpeg', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Bensin', kapasitas: 7, tahun: 2023 }, tersedia: true },
  { id: '11', nama: 'Jazz Red', kategori: 'Hatchback', harga: 270000, gambar: '/images/car-list/jazz-red.jpg', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Bensin', kapasitas: 5, tahun: 2022 }, tersedia: true },
  { id: '12', nama: 'Pajero Black', kategori: 'SUV', harga: 700000, gambar: '/images/car-list/pajero-black.jpg', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Diesel', kapasitas: 7, tahun: 2023 }, tersedia: true },
  { id: '13', nama: 'Pajero Gray', kategori: 'SUV', harga: 700000, gambar: '/images/car-list/pajero-gray.jpg', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Diesel', kapasitas: 7, tahun: 2022 }, tersedia: true },
  { id: '14', nama: 'Rush White', kategori: 'SUV', harga: 400000, gambar: '/images/car-list/rush-white.jpg', spesifikasi: { transmisi: 'Manual', bahan_bakar: 'Bensin', kapasitas: 7, tahun: 2021 }, tersedia: true },
  { id: '15', nama: 'Vios Silver', kategori: 'Sedan', harga: 320000, gambar: '/images/car-list/vios-silver.png', spesifikasi: { transmisi: 'Automatic', bahan_bakar: 'Bensin', kapasitas: 5, tahun: 2023 }, tersedia: true },
];

// Data review pelanggan
export const reviewPelanggan: Review[] = [
  {
    id: '1', nama: 'Budi Santoso', rating: 5, komentar: 'Pelayanan sangat memuaskan! Mobil dalam kondisi prima dan staff sangat ramah. Definitely akan rental lagi.', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg', tanggal: '2024-01-15' },
  { id: '2', nama: 'Sari Dewi', rating: 5, komentar: 'Mobil bersih, proses booking mudah, dan admin sangat membantu. Sangat recommended!', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', tanggal: '2024-01-10' },
  { id: '3', nama: 'Ahmad Rahman', rating: 5, komentar: 'Sudah beberapa kali rental di Rino Rental. Selalu puas dengan pelayanan dan kualitas kendaraannya. Top!', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg', tanggal: '2024-01-05' },
  { id: '4', nama: 'Dewi Lestari', rating: 5, komentar: 'Review Google: Pelayanan ramah, mobil nyaman, dan harga terjangkau. Proses pengambilan dan pengembalian sangat mudah.', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', tanggal: '2024-01-03' },
  { id: '5', nama: 'Rizky Pratama', rating: 5, komentar: 'Review Google: Sewa mobil di sini sangat memuaskan, unit banyak pilihan dan semua dalam kondisi baik.', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', tanggal: '2024-01-02' },
  { id: '6', nama: 'Siti Aminah', rating: 5, komentar: 'Review Google: Admin fast response, mobil bersih, AC dingin, perjalanan jadi nyaman. Terima kasih Rino Rental!', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', tanggal: '2024-01-01' },
];

// Data galeri
export const galeriImages: GambarGaleri[] = [
  {
    id: '1',
    url: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
    alt: 'Fleet Mobil Rino Rental',
    kategori: 'Fleet'
  },
  {
    id: '2',
    url: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg',
    alt: 'Kantor Rino Rental Sorong',
    kategori: 'Kantor'
  },
  {
    id: '3',
    url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    alt: 'Mobil Sedan Premium',
    kategori: 'Fleet'
  },
  {
    id: '4',
    url: 'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg',
    alt: 'SUV Keluarga',
    kategori: 'Fleet'
  },
  {
    id: '5',
    url: 'https://images.pexels.com/photos/3729876/pexels-photo-3729876.jpeg',
    alt: 'Tim Customer Service',
    kategori: 'Tim'
  },
  {
    id: '6',
    url: 'https://images.pexels.com/photos/1719647/pexels-photo-1719647.jpeg',
    alt: 'MPV Ekonomis',
    kategori: 'Fleet'
  }
];

// Data statistik untuk admin dashboard
export const statistikAdmin: StatistikAdmin = {
  totalBooking: 156,
  pendapatanBulan: 45750000,
  mobilTersedia: 24,
  customerAktif: 89
};

// Data booking terbaru untuk dashboard admin
export const bookingTerbaru = [
  {
    id: 'BK001',
    customer: 'John Doe',
    mobil: 'Toyota Avanza',
    tanggalMulai: '2024-01-20',
    tanggalSelesai: '2024-01-22',
    status: 'Aktif',
    total: 600000
  },
  {
    id: 'BK002',
    customer: 'Jane Smith',
    mobil: 'Honda Civic',
    tanggalMulai: '2024-01-21',
    tanggalSelesai: '2024-01-25',
    status: 'Pending',
    total: 1800000
  },
  {
    id: 'BK003',
    customer: 'Ahmad Ali',
    mobil: 'Toyota Fortuner',
    tanggalMulai: '2024-01-18',
    tanggalSelesai: '2024-01-20',
    status: 'Selesai',
    total: 1200000
  }
];
