'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaCarSide, FaTruckPickup, FaShuttleVan, FaCaravan, FaCar, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';

interface CarSpecifications {
  transmisi: string;
  bahanBakar: string;
  pintu: string;
  airConditioner: string;
  seats: string;
}

interface CarFeatures {
  primary: string[];
  secondary: string[];
}

interface Car {
  id: number;
  name: string;
  type: string;
  price: string;
  period: string;
  mainImage: string;
  images: string[];
  specifications: CarSpecifications;
  features: CarFeatures;
  availability: boolean;
  description: string;
  status?: 'available' | 'rented' | 'maintenance';
}

interface CarsListProps {
  showStatus?: boolean;  
  limit?: number;
  hideFilter?: boolean;
  title?: string;
  cars?: Car[];
  fetchFromAPI?: boolean;
}

const typeIcons: Record<string, React.ReactNode> = {
  Semua: <FaCar className="inline-block mr-2" />,
  Sedan: <FaCarSide className="inline-block mr-2" />,
  Minivan: <FaShuttleVan className="inline-block mr-2" />,
  SUV: <FaCaravan className="inline-block mr-2" />,
  Pickup: <FaTruckPickup className="inline-block mr-2" />,
  Cabriolet: <FaCarSide className="inline-block mr-2" />,
  MPV: <FaShuttleVan className="inline-block mr-2" />,
  Hatchback: <FaCar className="inline-block mr-2" />,
};

const Cars: React.FC<CarsListProps> = ({ 
  limit, 
  hideFilter = false, 
  title = "Pilih Unit", 
  cars = [], 
  fetchFromAPI = true,
  showStatus = false 
}) => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [carList, setCarList] = useState<Car[]>(cars);
  const [loading, setLoading] = useState(fetchFromAPI);
  const [error, setError] = useState<string | null>(null);

  // Fetch cars from API if needed
  useEffect(() => {
    if (fetchFromAPI) {
      const fetchCars = async () => {
        try {
          setLoading(true);
          const response = await axios.get('/api/cars');
          setCarList(response.data);
        } catch (err) {
          console.error('Error fetching cars:', err);
          setError('Gagal memuat data mobil');
        } finally {
          setLoading(false);
        }
      };

      fetchCars();
    } else {
      setCarList(cars);
      setLoading(false);
    }
  }, [fetchFromAPI, cars]);

  const filteredCars = activeFilter === 'Semua'
    ? carList
    : carList.filter((car) => car.type === activeFilter);

  const displayedCars = limit ? filteredCars.slice(0, limit) : filteredCars;

  const getStatusText = (car: Car) => {
    if (car.status) {
      switch (car.status) {
        case 'available':
          return 'Tersedia';
        case 'rented':
          return 'Sedang Disewa';
        case 'maintenance':
          return 'Maintenance';
        default:
          return 'Unknown';
      }
    }
    return car.availability ? 'Tersedia' : 'Tidak Tersedia';
  };

  const getStatusColor = (car: Car) => {
    if (car.status) {
      switch (car.status) {
        case 'available':
          return 'bg-green-100 text-green-800';
        case 'rented':
          return 'bg-orange-100 text-orange-800';
        case 'maintenance':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    return car.availability 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const isCarAvailable = (car: Car) => {
    if (car.status) {
      return car.status === 'available';
    }
    return car.availability;
  };

  // Format harga ke Rupiah
  const formatCurrency = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data mobil...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{title}</h2>

          {!hideFilter && carList.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {['Semua', ...Array.from(new Set(carList.map(car => car.type)))].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`flex items-center px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                    activeFilter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {typeIcons[type] || <FaCar className="inline-block mr-2" />}{type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid Mobil */}
        {displayedCars.length === 0 ? (
          <div className="text-center py-12">
            <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada mobil yang tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCars.map((car) => (
              <div
                key={car.id}
                className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-40 mb-4 bg-white rounded-lg overflow-hidden">
                  {car.mainImage ? (
                    <Image
                      src={car.mainImage}
                      alt={car.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <FaCar className="text-4xl text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{car.name}</h3>
                      <p className="text-sm text-gray-500">{car.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(car.price)}</p>
                      <p className="text-xs text-gray-500">{car.period}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{car.specifications?.transmisi || 'Manual'}</span>
                    <span>{car.specifications?.bahanBakar || 'Bensin'}</span>
                    <span>{car.specifications?.seats || '5'} Seats</span>
                  </div>

                  {/* Status mobil */}
                  {showStatus && (
                    <div className="text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(car)}`}>
                        {getStatusText(car)}
                      </span>
                    </div>
                  )}

                  {/* Tombol View Details - disabled jika tidak tersedia */}
                  <div className="pt-3">
                    <Link 
                      href={`/detail/${car.id}`}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        isCarAvailable(car)
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        if (!isCarAvailable(car)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <FaEye className="mr-2" />
                      {isCarAvailable(car) ? 'Lihat Detail' : 'Tidak Tersedia'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Cars;