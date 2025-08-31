'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaMoneyBillWave, FaCar, FaFilter } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// --- INTERFACES ---
interface Booking {
  id: number;
  customer_name: string;
  unit: string;
  jenis: string;
  order_id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

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

// --- CAR FORM COMPONENT ---
function CarForm({ 
  open, 
  onClose, 
  onSubmit, 
  initialData 
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Car>, editId?: number | null) => void;
  initialData?: Partial<Car>;
}) {
  const [form, setForm] = useState<Partial<Car>>({
    name: '',
    type: '',
    price: '',
    period: 'per day',
    mainImage: '',
    description: '',
    specifications: {
      transmisi: '',
      bahanBakar: '',
      pintu: '',
      airConditioner: '',
      seats: '',
    },
    features: {
      primary: [],
      secondary: []
    },
    images: [],
    availability: true,
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          ...initialData,
          specifications: initialData.specifications || {
            transmisi: '',
            bahanBakar: '',
            pintu: '',
            airConditioner: '',
            seats: '',
          },
          features: initialData.features || {
            primary: [],
            secondary: []
          },
          images: initialData.images || []
        });
      } else {
        setForm({
          name: '',
          type: '',
          price: '',
          period: 'per day',
          mainImage: '',
          description: '',
          specifications: {
            transmisi: '',
            bahanBakar: '',
            pintu: '',
            airConditioner: '',
            seats: '',
          },
          features: {
            primary: [],
            secondary: []
          },
          images: [],
          availability: true,
        });
      }
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('specifications.')) {
      const key = name.split('.')[1] as keyof CarSpecifications;
      setForm(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications!,
          [key]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeaturesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>, 
    type: 'primary' | 'secondary'
  ) => {
    const features = e.target.value.split('\n').filter(Boolean);
    setForm(prev => ({
      ...prev,
      features: {
        ...prev.features!,
        [type]: features
      }
    }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const images = e.target.value.split('\n').filter(Boolean);
    setForm(prev => ({ ...prev, images }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, initialData && (initialData as any).id ? (initialData as any).id : null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-4 text-gray-500 text-2xl hover:text-red-500 transition"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-blue-800">
          {initialData ? 'Edit Mobil' : 'Tambah Mobil'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              placeholder="Nama Mobil"
              className="p-3 border rounded-lg focus:outline-blue-400"
              required
            />
            <input
              name="type"
              value={form.type || ''}
              onChange={handleChange}
              placeholder="Tipe"
              className="p-3 border rounded-lg focus:outline-blue-400"
              required
            />
            <input
              name="price"
              value={form.price || ''}
              onChange={handleChange}
              placeholder="Harga"
              className="p-3 border rounded-lg focus:outline-blue-400"
              required
            />
            <input
              name="period"
              value={form.period || ''}
              onChange={handleChange}
              placeholder="Periode"
              className="p-3 border rounded-lg focus:outline-blue-400"
            />
            <input
              name="mainImage"
              value={form.mainImage || ''}
              onChange={handleChange}
              placeholder="URL Gambar Utama"
              className="p-3 border rounded-lg focus:outline-blue-400"
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            placeholder="Deskripsi"
            className="w-full p-3 border rounded-lg focus:outline-blue-400"
          />

          {/* Additional Images */}
          <textarea
            value={form.images?.join('\n') || ''}
            onChange={handleImagesChange}
            placeholder="Gambar Tambahan (1 per baris)"
            className="w-full p-3 border rounded-lg focus:outline-blue-400"
          />

          {/* Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input
              name="specifications.transmisi"
              value={form.specifications?.transmisi || ''}
              onChange={handleChange}
              placeholder="Transmisi"
              className="p-3 border rounded-lg focus:outline-blue-400"
            />
            <input
              name="specifications.bahanBakar"
              value={form.specifications?.bahanBakar || ''}
              onChange={handleChange}
              placeholder="Bahan Bakar"
              className="p-3 border rounded-lg focus:outline-blue-400"
            />
            <input
              name="specifications.pintu"
              value={form.specifications?.pintu || ''}
              onChange={handleChange}
              placeholder="Jumlah Pintu"
              className="p-3 border rounded-lg focus:outline-blue-400"
            />
            <input
              name="specifications.seats"
              value={form.specifications?.seats || ''}
              onChange={handleChange}
              placeholder="Jumlah Kursi"
              className="p-3 border rounded-lg focus:outline-blue-400"
            />
            <input
              name="specifications.airConditioner"
              value={form.specifications?.airConditioner || ''}
              onChange={handleChange}
              placeholder="AC (Yes/No)"
              className="p-3 border rounded-lg focus:outline-blue-400"
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              value={form.features?.primary?.join('\n') || ''}
              onChange={(e) => handleFeaturesChange(e, 'primary')}
              placeholder="Fitur Utama (1 per baris)"
              className="w-full p-3 border rounded-lg focus:outline-blue-400"
            />
            <textarea
              value={form.features?.secondary?.join('\n') || ''}
              onChange={(e) => handleFeaturesChange(e, 'secondary')}
              placeholder="Fitur Tambahan (1 per baris)"
              className="w-full p-3 border rounded-lg focus:outline-blue-400"
            />
          </div>

          {/* Availability */}
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.availability}
              onChange={(e) => setForm(prev => ({ ...prev, availability: e.target.checked }))}
            />
            <span>Tersedia</span>
          </label>

          {/* Submit Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {initialData ? 'Update' : 'Tambah'} Mobil
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN ADMIN DASHBOARD COMPONENT ---
export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk CRUD Mobil
  const [showForm, setShowForm] = useState(false);
  const [formInitial, setFormInitial] = useState<Partial<Car> | undefined>(undefined);
  const [editId, setEditId] = useState<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Authentication & Data Loading
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.replace('/login');
        return;
      }
    }
    
    const loadData = async () => {
      setLoading(true);
      try {
        const carsRes = await axios.get('/api/cars');
        const bookingsRes = await axios.get('/api/bookings'); 
        
        setCars(carsRes.data);
        setBookingData(bookingsRes.data.data || bookingsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data dari server.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [router]);

  // CRUD Functions
  const fetchCars = async () => {
    try {
      const res = await axios.get('/api/cars');
      setCars(res.data);
    } catch (err) {
      console.error('Error fetching cars:', err);
    }
  };

  const handleAdd = () => {
    setFormInitial(undefined);
    setShowForm(true);
    setEditId(null);
  };

  const handleEdit = (car: Car) => {
    setEditId(car.id);
    setFormInitial(car);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Partial<Car>, editId?: number | null) => {
    try {
      // Kirim data sebagai FormData agar sesuai dengan API Next.js dan backend
      const formData = new FormData();
      // Field utama
      formData.append('name', data.name || '');
      formData.append('type', data.type || '');
      formData.append('price', data.price || '');
      formData.append('period', data.period || '');
      formData.append('mainImage', data.mainImage || '');
      formData.append('description', data.description || '');
      formData.append('availability', data.availability ? '1' : '0');
      // Specifications
      if (data.specifications) {
        formData.append('transmisi', data.specifications.transmisi || '');
        formData.append('bahanBakar', data.specifications.bahanBakar || '');
        formData.append('pintu', data.specifications.pintu || '');
        formData.append('airConditioner', data.specifications.airConditioner || '');
        formData.append('seats', data.specifications.seats || '');
      }
      // Features
      if (data.features) {
        formData.append('primaryFeatures', JSON.stringify(data.features.primary || []));
        formData.append('secondaryFeatures', JSON.stringify(data.features.secondary || []));
      }
      // Images
      if (data.images) {
        formData.append('images', JSON.stringify(data.images));
      }
      // Status
      if (data.status) {
        formData.append('status', data.status);
      }
      if (editId) {
        await axios.put(`/api/cars/${editId}`, formData);
      } else {
        await axios.post('/api/cars', formData);
      }
      setShowForm(false);
      setEditId(null);
      fetchCars();
    } catch (err) {
      console.error("Failed to submit form", err);
      alert("Gagal menyimpan data mobil.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Anda yakin ingin menghapus mobil ini?")) {
      try {
        await axios.delete(`/api/cars/${id}`);
        fetchCars();
      } catch (err) {
        console.error("Failed to delete car", err);
        alert("Gagal menghapus data mobil.");
      }
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdminLoggedIn');
    }
    router.replace('/login');
  };

  // Statistics Calculation
  const calculateRealStats = () => {
    const totalBookings = bookingData.length;
    
    const availableCars = cars.filter(car => 
      car.status === 'available' || (car.status === undefined && car.availability)
    ).length;
    
    const rentedCars = cars.filter(car => 
      car.status === 'rented' || (car.status === undefined && !car.availability)
    ).length;
    
    const maintenanceCars = cars.filter(car => car.status === 'maintenance').length;
    
    const totalRevenue = bookingData
      .filter(b => b.status.toLowerCase() === 'selesai')
      .reduce((total, booking) => {
        const car = cars.find(c => c.name === booking.unit);
        return total + (car ? parseFloat(car.price) : 0);
      }, 0);

    return { 
      totalRevenue, 
      availableCars, 
      rentedCars, 
      totalBookings,
      maintenanceCars 
    };
  };

  // Loading & Error States
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const realStats = calculateRealStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex text-gray-800">
      <main className="flex-1 p-4 md:p-10 space-y-8">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Pemasukan</p>
            <p className="text-2xl font-bold text-gray-900">
              Rp {realStats.totalRevenue.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Unit Tersedia</p>
            <p className="text-2xl font-bold text-gray-900">{realStats.availableCars} Unit</p>
            <p className="text-xs text-gray-500">Status: Available</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Unit Disewa</p>
            <p className="text-2xl font-bold text-gray-900">{realStats.rentedCars} Unit</p>
            <p className="text-xs text-gray-500">Status: Rented</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Booking</p>
            <p className="text-2xl font-bold text-gray-900">{realStats.totalBookings}</p>
          </div>
        </div>

        
      </main>
      
      {/* Car Form Modal */}
      <CarForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={formInitial}
      />
    </div>
  );
}