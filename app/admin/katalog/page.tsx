'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaSearch,
  FaCar,
  FaEdit,
  FaTrash,
  FaFilter,
  FaPlus,
  FaEye,
  FaSpinner
} from 'react-icons/fa';
import TambahMobil from '../backend/TambahMobil';
import EditMobil from '../backend/EditMobil';

// Type from AddCar/EditCar (CarData)
type CarData = {
  id?: number;
  name: string;
  type: string;
  price: number;
  transmisi?: string;
  bahanBakar?: string;
  pintu?: number;
  airConditioner?: string;
  seats?: number;
  description?: string;
  status?: 'available' | 'rented' | 'maintenance';
  mainImage?: File | string | null;
};

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
  description: string;
  status: 'available' | 'rented' | 'maintenance';
  mainImage: string | null; // Base64 string
}

const CarsManagement = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'rented' | 'maintenance'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<number | null>(null); // State baru untuk edit

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cars');
        
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Handle adding new car (refresh from backend after add)
    // Handle adding new car (support File or string for mainImage)
    const handleAddCar = async (carData: CarData) => {
      try {
        // Kirim data sebagai FormData agar sesuai dengan API Next.js dan backend
        const formData = new FormData();
        formData.append('name', carData.name || '');
        formData.append('type', carData.type || '');
        formData.append('price', carData.price ? carData.price.toString() : '0');
        formData.append('transmisi', carData.transmisi || '');
        formData.append('bahanBakar', carData.bahanBakar || '');
        formData.append('pintu', carData.pintu ? carData.pintu.toString() : '0');
        formData.append('airConditioner', carData.airConditioner || '');
        formData.append('seats', carData.seats ? carData.seats.toString() : '0');
        formData.append('description', carData.description || '');
        formData.append('status', carData.status || 'available');
        // Gambar utama
        if (carData.mainImage) {
          formData.append('mainImage', carData.mainImage);
        }
        // Kirim ke API Next.js
        const response = await fetch('/api/cars', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Gagal menambah mobil');
        const carsRes = await fetch('/api/cars');
        const carsData = await carsRes.json();
        setCars(Array.isArray(carsData) ? carsData : (carsData.data || []));
      } catch (err) {
        alert('Gagal menambah mobil');
        console.error(err);
      }
    };

  // Fungsi untuk menangani pembaruan mobil
  const handleCarUpdated = (updatedCar: CarData) => {
    setCars(cars.map(car => {
      if (car.id === updatedCar.id) {
        // Ensure mainImage is string or null
        let mainImage: string | null = car.mainImage;
        if (updatedCar.mainImage) {
          if (typeof updatedCar.mainImage === 'string') {
            mainImage = updatedCar.mainImage;
          } else if (updatedCar.mainImage instanceof File) {
            // Convert File to base64 string synchronously is not possible here, so fallback to previous image
            mainImage = car.mainImage;
          }
        }
        return {
          ...car,
          ...updatedCar,
          mainImage,
        };
      }
      return car;
    }));
  };

  // Filter cars based on search and status
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || car.status === filterStatus;
    const matchesType = filterType === 'all' || car.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Tersedia</span>;
      case 'rented':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Disewa</span>;
      case 'maintenance':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Maintenance</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const formatCurrency = (value: number): string => {
  // Format ribuan tanpa desimal, misal: 500000 => 500.000
  return value ? value.toLocaleString('id-ID') : '0';
  };

  const handleDelete = async (carId: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus mobil ini?')) {
      try {
        // Send delete request to backend
        const response = await fetch(`/api/cars/${carId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Update UI after successful deletion
          setCars(cars.filter(car => car.id !== carId));
        } else {
          alert('Gagal menghapus mobil');
        }
      } catch (err) {
        console.error('Error deleting car:', err);
        alert('Terjadi kesalahan saat menghapus mobil');
      }
    }
  };

  // Statistics for the header cards
  const stats = [
    {
      title: 'Total Unit',
      value: cars.length.toString(),
      icon: <FaCar className="text-blue-600" />,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Unit Tersedia',
      value: cars.filter(car => car.status === 'available').length.toString(),
      icon: <FaCar className="text-green-600" />,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Unit Disewa',
      value: cars.filter(car => car.status === 'rented').length.toString(),
      icon: <FaCar className="text-orange-600" />,
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
    },
    {
      title: 'Unit Maintenance',
      value: cars.filter(car => car.status === 'maintenance').length.toString(),
      icon: <FaCar className="text-red-600" />,
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <span className="ml-3 text-lg">Memuat data mobil...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-red-500 text-lg font-medium mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} w-12 h-12 rounded-full flex items-center justify-center`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
          <button 
            onClick={() => setIsAddCarOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <FaPlus />
            Tambah Unit
          </button>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-64 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau tipe mobil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium shadow-sm placeholder-gray-500"
              style={{ backgroundColor: '#ffffff', color: '#111827' }}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium shadow-sm"
              style={{ backgroundColor: '#ffffff', color: '#111827' }}
            >
              <option value="all" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Semua Status</option>
              <option value="available" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Tersedia</option>
              <option value="rented" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Disewa</option>
              <option value="maintenance" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Maintenance</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium shadow-sm"
            style={{ backgroundColor: '#ffffff', color: '#111827' }}
          >
            <option value="all" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Semua Tipe</option>
            <option value="SUV" style={{ backgroundColor: '#ffffff', color: '#111827' }}>SUV</option>
            <option value="MPV" style={{ backgroundColor: '#ffffff', color: '#111827' }}>MPV</option>
            <option value="Sedan" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Sedan</option>
            <option value="Hatchback" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Hatchback</option>
          </select>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Kendaraan</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Menampilkan {filteredCars.length} dari {cars.length} unit
            </span>
          </div>
        </div>
        
        {filteredCars.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kendaraan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spesifikasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {car.mainImage ? (
                            <img
                              src={
                                car.mainImage.startsWith('data:image')
                                  ? car.mainImage
                                  : car.mainImage.startsWith('http')
                                    ? car.mainImage
                                    : `/images/${car.mainImage}`
                              }
                              alt={car.name}
                              className="w-full h-full object-contain"
                              onError={e => { e.currentTarget.src = '/images/mobil-display.png'; }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaCar className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{car.name}</div>
                          <div className="text-sm text-gray-500">ID: {car.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{car.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rp{formatCurrency(car.price)}
                      </div>
                      <div className="text-sm text-gray-500">/hari</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Transmisi: {car.transmisi}</div>
                      <div className="text-sm text-gray-900">Bahan Bakar: {car.bahanBakar}</div>
                      <div className="text-sm text-gray-900">Pintu: {car.pintu}</div>
                      <div className="text-sm text-gray-900">Kursi: {car.seats}</div>
                      <div className="text-sm text-gray-900">AC: {car.airConditioner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(car.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a href={`/detail/${car.id}`} className="text-blue-600 hover:text-blue-800 p-1" title="Lihat Detail">
                          <FaEye />
                        </a>
                        <button 
                          onClick={() => setEditingCarId(car.id)} // Set ID mobil yang akan diedit
                          className="text-yellow-600 hover:text-yellow-800 p-1" 
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(car.id)}
                          className="text-red-600 hover:text-red-800 p-1" 
                          title="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FaCar className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada kendaraan ditemukan</h3>
            <p className="text-gray-600 mb-4">Coba ubah filter atau tambah kendaraan baru</p>
            <button 
              onClick={() => setIsAddCarOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <FaPlus />
              Tambah Kendaraan
            </button>
          </div>
        )}
      </div>

      {/* AddCar Pop-up */}
      <TambahMobil
        isOpen={isAddCarOpen}
        onClose={() => setIsAddCarOpen(false)}
        onAddCar={handleAddCar}
      />

      {/* EditCar Pop-up */}
      <EditMobil
        isOpen={editingCarId !== null}
        onClose={() => setEditingCarId(null)}
        onCarUpdated={handleCarUpdated}
        carId={editingCarId || 0}
      />
    </div>
  );
};

export default CarsManagement;