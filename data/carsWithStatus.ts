// data/carsWithStatus.ts
// File ini akan menyimpan data mobil dengan status ketersediaan
// Bisa diupdate melalui admin dashboard

export interface CarWithStatus {
  id: number;
  name: string;
  type: string;
  price: string;
  period: string;
  mainImage: string;
  images: string[];
  specifications: {
    transmisi: string;
    bahanBakar: string;
    pintu: string;
    airConditioner: string;
    seats: string;
    konsumsBBM: string;
  };
  features: {
    primary: string[];
    secondary: string[];
  };
  description: string;
  status: 'available' | 'rented' | 'maintenance';
  lastUpdated: string;
}

// Data awal dengan status default 'available'
export const carsWithStatus: CarWithStatus[] = [
  {
    id: 1,
    name: "Avanza",
    type: "Minivan",
    price: "Rp.350.000",
    period: "per day",
    mainImage: "/images/car-list/avanza-gray.png",
    images: [
      "/images/car-list/avanza-gray.png",
      "/images/detail-car/detail-dashboard.png",
      "/images/detail-car/detail-kursi.png",
      "/images/detail-car/detail-setir.png"
    ],
    specifications: {
      transmisi: "Matic",
      bahanBakar: "Gasoline",
      pintu: "5",
      airConditioner: "Yes",
      seats: "7",
      konsumsBBM: "13 Km/Liter"
    },
    features: {
      primary: ["ABS", "Air Bags", "Cruise Control"],
      secondary: ["Air Bags", "Air Conditioner"]
    },
    description: "Toyota Avanza adalah kendaraan keluarga yang sempurna dengan kapasitas 7 penumpang. Dilengkapi dengan fitur keselamatan terdepan dan kenyamanan berkendara yang optimal untuk perjalanan jauh maupun dalam kota.",
    status: "available",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    name: "Vios",
    type: "Sedan",
    price: "Rp.400.000",
    period: "per day",
    mainImage: "/images/car-list/vios-silver.png",
    images: [
      "/images/car-list/vios-silver.png",
      "/images/detail-car/detail-dashboard.png",
      "/images/detail-car/detail-kursi.png",
      "/images/detail-car/detail-setir.png"
    ],
    specifications: {
      transmisi: "Matic",
      bahanBakar: "Gasoline",
      pintu: "4",
      airConditioner: "Yes",
      seats: "5",
      konsumsBBM: "15 Km/Liter"
    },
    features: {
      primary: ["ABS", "Air Bags", "Cruise Control"],
      secondary: ["Air Bags", "Air Conditioner"]
    },
    description: "Toyota Vios menawarkan kenyamanan berkendara dengan desain sedan yang elegan. Cocok untuk perjalanan bisnis maupun keluarga dengan efisiensi bahan bakar yang baik.",
    status: "available",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    name: "Civic",
    type: "Sedan",
    price: "Rp.550.000",
    period: "per day",
    mainImage: "/images/car-list/civic-white.png",
    images: [
      "/images/car-list/civic-white.png",
      "/images/detail-car/detail-dashboard.png",
      "/images/detail-car/detail-kursi.png",
      "/images/detail-car/detail-setir.png"
    ],
    specifications: {
      transmisi: "Matic",
      bahanBakar: "Gasoline",
      pintu: "4",
      airConditioner: "Yes",
      seats: "5",
      konsumsBBM: "14 Km/Liter"
    },
    features: {
      primary: ["ABS", "Air Bags", "Cruise Control"],
      secondary: ["Air Bags", "Air Conditioner"]
    },
    description: "Honda Civic menghadirkan performa dan gaya yang memukau. Dengan teknologi terdepan dan desain sporty, cocok untuk Anda yang menginginkan pengalaman berkendara yang dinamis.",
    status: "rented", // Contoh mobil yang sedang disewa
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    name: "Innova",
    type: "MPV",
    price: "Rp.600.000",
    period: "per day",
    mainImage: "/images/car-list/innova-white.jpeg",
    images: [
      "/images/car-list/innova-white.jpeg",
      "/images/detail-car/detail-dashboard.png",
      "/images/detail-car/detail-kursi.png",
      "/images/detail-car/detail-setir.png"
    ],
    specifications: {
      transmisi: "Matic",
      bahanBakar: "Diesel",
      pintu: "5",
      airConditioner: "Yes",
      seats: "7",
      konsumsBBM: "12 Km/Liter"
    },
    features: {
      primary: ["ABS", "Air Bags", "Cruise Control"],
      secondary: ["Air Bags", "Air Conditioner"]
    },
    description: "Toyota Innova cocok untuk perjalanan keluarga besar dengan kabin luas dan kenyamanan maksimal.",
    status: "available",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 5,
    name: "Fortuner",
    type: "SUV",
    price: "Rp.900.000",
    period: "per day",
    mainImage: "/images/car-list/fortuner-white.jpg",
    images: [
      "/images/car-list/fortuner-white.jpg",
      "/images/detail-car/detail-dashboard.png",
      "/images/detail-car/detail-kursi.png",
      "/images/detail-car/detail-setir.png"
    ],
    specifications: {
      transmisi: "Matic",
      bahanBakar: "Diesel",
      pintu: "5",
      airConditioner: "Yes",
      seats: "7",
      konsumsBBM: "10 Km/Liter"
    },
    features: {
      primary: ["ABS", "Air Bags", "Cruise Control"],
      secondary: ["Air Bags", "Air Conditioner"]
    },
    description: "Toyota Fortuner menawarkan performa tangguh dan tampilan gagah untuk segala medan.",
    status: "maintenance", // Contoh mobil yang sedang maintenance
    lastUpdated: new Date().toISOString()
  }
];

// Fungsi untuk update status mobil
export const updateCarStatus = (carId: number, newStatus: 'available' | 'rented' | 'maintenance') => {
  const carIndex = carsWithStatus.findIndex(car => car.id === carId);
  if (carIndex !== -1) {
    carsWithStatus[carIndex].status = newStatus;
    carsWithStatus[carIndex].lastUpdated = new Date().toISOString();
  }
};

// Fungsi untuk mendapatkan mobil berdasarkan status
export const getCarsByStatus = (status: 'available' | 'rented' | 'maintenance' | 'all') => {
  if (status === 'all') {
    return carsWithStatus;
  }
  return carsWithStatus.filter(car => car.status === status);
};

// Fungsi untuk mendapatkan mobil yang tersedia untuk ditampilkan di website
export const getAvailableCars = () => {
  return carsWithStatus.filter(car => car.status === 'available');
}; 