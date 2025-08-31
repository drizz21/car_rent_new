'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaCar, 
  FaGasPump, 
  FaDoorOpen, 
  FaSnowflake, 
  FaUsers, 
  FaEye,
  FaCog,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
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

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const carId = params?.id as string;

  useEffect(() => {
    const fetchCarDetail = async () => {
      if (!carId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/cars/${carId}`);
        const carData = response.data;
        setCar(carData);
        setSelectedImage(carData.mainImage || '');
      } catch (err) {
        console.error('Error fetching car detail:', err);
        setError('Gagal memuat detail mobil');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetail();
  }, [carId]);

  const formatCurrency = (price: string) => {
  // Pastikan harga selalu integer dan format ribuan
  const numPrice = parseInt(price.replace(/\D/g, ''));
  return 'Rp' + numPrice.toLocaleString('id-ID');
  };

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
          return 'text-green-600 bg-green-100';
        case 'rented':
          return 'text-orange-600 bg-orange-100';
        case 'maintenance':
          return 'text-red-600 bg-red-100';
        default:
          return 'text-gray-600 bg-gray-100';
      }
    }
    return car.availability 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const isCarAvailable = (car: Car) => {
    if (car.status) {
      return car.status === 'available';
    }
    return car.availability;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail mobil...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">
            <FaCar />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Mobil Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">{error || 'Detail mobil tidak tersedia'}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const specifications = [
    { icon: <FaCog />, label: 'Transmisi', value: car.specifications?.transmisi || 'Manual' },
    { icon: <FaGasPump />, label: 'Bahan Bakar', value: car.specifications?.bahanBakar || 'Bensin' },
    { icon: <FaDoorOpen />, label: 'Pintu', value: car.specifications?.pintu || '4' },
    { icon: <FaSnowflake />, label: 'AC', value: car.specifications?.airConditioner || 'Ya' },
    { icon: <FaUsers />, label: 'Kapasitas', value: car.specifications?.seats ? `${car.specifications.seats} Orang` : '5 Orang' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Kembali
            </button>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(car)}`}>
                {getStatusText(car)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12 bg-white rounded-2xl overflow-hidden shadow-sm">
              {selectedImage ? (
                <Image
                  src={
                    selectedImage && selectedImage !== ''
                      ? selectedImage.startsWith('data:image')
                        ? selectedImage
                        : selectedImage.startsWith('http')
                          ? selectedImage
                          : `/images/${selectedImage}`
                      : '/images/mobil-display.png'
                  }
                  alt={car.name}
                  width={600}
                  height={400}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { e.currentTarget.src = '/images/mobil-display.png'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <FaCar className="text-6xl text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {car.images && car.images.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {car.mainImage && (
                  <button
                    onClick={() => setSelectedImage(car.mainImage)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === car.mainImage ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={
                        car.mainImage && car.mainImage !== ''
                          ? car.mainImage.startsWith('data:image')
                            ? car.mainImage
                            : car.mainImage.startsWith('http')
                              ? car.mainImage
                              : `/images/${car.mainImage}`
                          : '/images/mobil-display.png'
                      }
                      alt="Main"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain bg-white p-1"
                      onError={(e) => { e.currentTarget.src = '/images/mobil-display.png'; }}
                    />
                  </button>
                )}
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === image ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={
                        image && image !== ''
                          ? image.startsWith('data:image')
                            ? image
                            : image.startsWith('http')
                              ? image
                              : `/images/${image}`
                          : '/images/mobil-display.png'
                      }
                      alt={`${car.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain bg-white p-1"
                      onError={(e) => { e.currentTarget.src = '/images/mobil-display.png'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{car.name}</h1>
                  <p className="text-lg text-gray-600">{car.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(car.price)}</p>
                  <p className="text-sm text-gray-500">{car.period}</p>
                </div>
              </div>

              {car.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="flex space-x-4">
                <button
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200 ${
                    isCarAvailable(car)
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isCarAvailable(car)}
                  onClick={() => {
                    if (isCarAvailable(car)) {
                      // Redirect to booking page or show booking modal
                      router.push(`/booking/${car.id}`);
                    }
                  }}
                >
                  {isCarAvailable(car) ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Spesifikasi</h3>
              <div className="grid grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-blue-600 text-lg">{spec.icon}</div>
                    <div>
                      <p className="text-sm text-gray-500">{spec.label}</p>
                      <p className="font-medium text-gray-800">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {(car.features?.primary?.length > 0 || car.features?.secondary?.length > 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Fitur</h3>
                
                {car.features.primary && car.features.primary.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Fitur Utama</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {car.features.primary.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <FaCheck className="text-green-600 text-sm" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {car.features.secondary && car.features.secondary.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Fitur Tambahan</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {car.features.secondary.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <FaCheck className="text-blue-600 text-sm" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}