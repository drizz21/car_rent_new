'use client';

import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Cars from '../components/car-list/CarList';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

interface Car {
  id: number;
  name: string;
  type: string;
  price: number;
  transmisi: string;
  bahanBakar: string;
  pintu: number;
  airConditioner: string;
  seats: number;
  konsumsBBM: number;
  description: string;
  status: 'available' | 'rented' | 'maintenance';
  mainImage: string | null;
}

const VehiclesPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'rented' | 'maintenance'>('all');
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  // Ambil data mobil dari backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Update filter berdasarkan status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter(car => car.status === statusFilter));
    }
  }, [statusFilter, cars]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data mobil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Spacer after Navbar */}
        <div className="h-8" />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Sewa Mobil di Sorong</h1>
              <p className="text-xl mb-10">Temukan mobil yang sesuai dengan kebutuhan Anda</p>
            </div>
          </div>
        </div>

        {/* Filter Status Mobil */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Pilih Unit</h2>
      <div className="flex flex-wrap gap-3 justify-center mb-2">
        {/* Tombol Semua */}
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Semua
        </button>

        {/* Tombol Tersedia */}
        <button
          onClick={() => setStatusFilter('available')}
          className={`flex items-center px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            statusFilter === 'available'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <FaCheckCircle className="mr-2 text-green-600" /> Tersedia
        </button>

        {/* Tombol Disewa */}
        <button
          onClick={() => setStatusFilter('rented')}
          className={`flex items-center px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            statusFilter === 'rented'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <FaExclamationCircle className="mr-2 text-orange-500" /> Disewa
        </button>

        {/* Tombol Perbaikan */}
        <button
          onClick={() => setStatusFilter('maintenance')}
          className={`flex items-center px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            statusFilter === 'maintenance'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <FaTimesCircle className="mr-2 text-red-600" /> Perbaikan
        </button>
      </div>
    </div>
  </div>
</div>


        {/* Hasil Filter */}
        <div className="mt-8">
          <Cars
            hideFilter
            limit={undefined}
            title="Daftar Mobil"
            cars={filteredCars}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default VehiclesPage;
