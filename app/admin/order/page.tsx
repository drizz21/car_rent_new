"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, 
  FaCar, 
  FaChartLine, 
  FaPlus, 
  FaFilter,
  FaEdit
} from 'react-icons/fa';
import TambahOrder from '../backend/AddOrder';
import Edi from '../backend/EditOrder';
import EditOrder from '../backend/EditOrder';

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
  car_price?: number;
}

interface Car {
  id: number;
  name: string;
  price: number;
  status: string;
}

const OrderDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('Booking response:', result);
      
      if (result.success && Array.isArray(result.data)) {
        setBookingData(result.data);
      } else if (Array.isArray(result)) {
        // Fallback jika response langsung array
        setBookingData(result);
      } else {
        console.error('Unexpected response format:', result);
        setBookingData([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Terjadi kesalahan saat mengambil data booking');
      setBookingData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars from API
  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Cars response:', result);
      
      if (Array.isArray(result)) {
        setCarsData(result);
      } else if (result.success && Array.isArray(result.data)) {
        setCarsData(result.data);
      } else {
        console.error('Unexpected cars response format:', result);
        setCarsData([]);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setCarsData([]);
    }
  };

  // Load bookings and cars on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBookings(), fetchCars()]);
    };
    
    loadData();
  }, []);

  // Helper function to calculate days between dates
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  };

  // Helper function to calculate price with duration and driver discount
  const calculateBookingPrice = (booking: Booking) => {
    const car = carsData.find(car => car.name === booking.unit);
    if (!car) return 0;
    
    const days = calculateDays(booking.start_date, booking.end_date);
    let totalPrice = car.price * days;
    
    // Apply 20% discount if jenis includes "sopir" (case insensitive)
    if (booking.jenis && booking.jenis.toLowerCase().includes('sopir')) {
      totalPrice = totalPrice * 0.8; // 20% discount
    }
    
    return totalPrice;
  };

  // Calculate statistics from real data with actual car prices and duration
  const calculateStats = () => {
    const totalBookings = bookingData.length;
    const completedBookings = bookingData.filter(b => b.status === 'Selesai');
    const runningBookings = bookingData.filter(b => b.status === 'Berjalan').length;
    
    // Calculate actual revenue from completed bookings with duration
    const totalRevenue = completedBookings.reduce((total, booking) => {
      return total + calculateBookingPrice(booking);
    }, 0);

    // Calculate running bookings potential revenue
    const runningRevenue = bookingData
      .filter(b => b.status === 'Berjalan')
      .reduce((total, booking) => {
        return total + calculateBookingPrice(booking);
      }, 0);
    
    // Calculate today's bookings
    const today = new Date().toDateString();
    const todayBookings = bookingData.filter(b => 
      new Date(b.created_at).toDateString() === today
    ).length;

    return {
      total: totalBookings,
      completed: completedBookings.length,
      running: runningBookings,
      today: todayBookings,
      totalRevenue,
      runningRevenue
    };
  };

  const stats = calculateStats();

  // Debug function for revenue calculation
  const debugRevenue = () => {
    console.log('=== REVENUE DEBUG ===');
    const completed = bookingData.filter(b => b.status === 'Selesai');
    
    completed.forEach(booking => {
      const car = carsData.find(car => car.name === booking.unit);
      if (car) {
        const days = calculateDays(booking.start_date, booking.end_date);
        const basePrice = car.price * days;
        const finalPrice = calculateBookingPrice(booking);
        
        console.log(`${booking.customer_name}: ${days} hari × ${formatCurrency(car.price)} = ${formatCurrency(basePrice)} ${booking.jenis?.toLowerCase().includes('sopir') ? '(-20% sopir)' : ''} = ${formatCurrency(finalPrice)}`);
      }
    });
    
    console.log(`Total Revenue: ${formatCurrency(stats.totalRevenue)}`);
  };

  // Debug revenue when data changes
  useEffect(() => {
    if (bookingData.length > 0 && carsData.length > 0) {
      debugRevenue();
    }
  }, [bookingData, carsData]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    
    switch (status) {
      case 'Selesai':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Booking':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Out for delivery':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Berjalan':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'Batal':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Handle adding new order - Fixed to match AddOrder component expectations
  const handleAddOrder = async (newOrderData: any) => {
    try {
      console.log('🔄 handleAddOrder called with:', newOrderData);
      
      // Refresh data dari server untuk memastikan sinkronisasi
      await fetchBookings();
      
      // Close modal
      setIsAddOrderOpen(false);
      
      console.log('✅ Orders refreshed successfully');
      
    } catch (error) {
      console.error('❌ Error in handleAddOrder:', error);
      // Tetap refresh data dan close modal
      await fetchBookings();
      setIsAddOrderOpen(false);
    }
  };

  // Handle editing order
  const handleEditOrder = async (updatedOrder: any) => {
    try {
      console.log('Updating order:', updatedOrder);
      
              const response = await fetch(`/api/bookings/${updatedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: updatedOrder.customer_name,
          unit: updatedOrder.unit,
          jenis: updatedOrder.jenis,
          order_id: updatedOrder.order_id,
          start_date: updatedOrder.start_date,
          end_date: updatedOrder.end_date,
          status: updatedOrder.status
        }),
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        await fetchBookings();
        setIsEditOrderOpen(false);
        setSelectedBooking(null);
        alert('Booking berhasil diupdate!');
      } else {
        alert(`Error: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Terjadi kesalahan saat mengupdate booking');
    }
  };

  // Handle edit button click
  const handleEditClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditOrderOpen(true);
  };

  // Handle refresh button
  const handleRefresh = async () => {
    await Promise.all([fetchBookings(), fetchCars()]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="space-y-6">
          {/* Stats Cards - Updated with colored boxes */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total Booking Card */}
  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Total Booking</p>
        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        <p className="text-xs text-gray-500">Semua waktu</p>
      </div>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
        <FaChartLine className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>

  {/* Total Selesai Card */}
  <div className="bg-green-50 rounded-2xl p-6 border border-green-100 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Total Selesai</p>
        <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
        <p className="text-xs text-green-600 font-medium">Booking Selesai</p>
      </div>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
        <FaMoneyBillWave className="w-6 h-6 text-green-600" />
      </div>
    </div>
    <div className="mt-2">
      <p className="text-lg font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
      <p className="text-xs text-gray-500">Total Pemasukan</p>
    </div>
  </div>

  {/* Total Berjalan Card */}
  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Total Berjalan</p>
        <p className="text-2xl font-bold text-gray-900">{stats.running}</p>
        <p className="text-xs text-gray-500">Saat ini</p>
      </div>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
        <FaCar className="w-6 h-6 text-orange-600" />
      </div>
    </div>
    <div className="mt-2">
      <p className="text-sm font-medium text-gray-900">{formatCurrency(stats.runningRevenue)}</p>
      <p className="text-xs text-gray-500">Potensi Pemasukan</p>
    </div>
  </div>

  {/* Booking Hari Ini Card */}
  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Booking Hari ini</p>
        <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
        <p className="text-xs text-gray-500">Hari ini</p>
      </div>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
        <FaChartLine className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
</div>

          {/* Booking Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Booking</h2>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsAddOrderOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Tambah Booking</span>
                  </button>
                  <button 
                    onClick={handleRefresh}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                  >
                    <FaFilter className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Harga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FaCar className="text-4xl text-gray-300 mb-4" />
                          <p className="text-lg font-medium">Belum ada booking</p>
                          <p className="text-sm">Klik "Tambah Booking" untuk membuat booking pertama</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    bookingData.map((booking) => {
                      const car = carsData.find(car => car.name === booking.unit);
                      const days = calculateDays(booking.start_date, booking.end_date);
                      const totalPrice = calculateBookingPrice(booking);
                      const hasDriverDiscount = booking.jenis && booking.jenis.toLowerCase().includes('sopir');
                      
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.unit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {car ? (
                                <div>
                                  <div className="font-bold text-green-600">{formatCurrency(totalPrice)}</div>
                                  <div className="text-xs text-gray-500">
                                    {days} hari × {formatCurrency(car.price)}
                                    {hasDriverDiscount && 
                                      <span className="text-green-600 ml-1">(-20% sopir)</span>
                                    }
                                  </div>
                                </div>
                              ) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.jenis}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">{booking.order_id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div>{formatDate(booking.start_date)}</div>
                              <div className="text-gray-500">sampai</div>
                              <div>{formatDate(booking.end_date)}</div>
                              <div className="text-xs text-blue-600 font-medium">{days} hari</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusBadge(booking.status)}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => handleEditClick(booking)}
                              className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                              title="Edit booking"
                            >
                              <FaEdit className="w-4 h-4 text-blue-600" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer with info */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Menampilkan {bookingData.length} booking
              </div>
              <div className="text-sm text-gray-500">
                Total Pendapatan: <span className="font-bold text-green-600">{formatCurrency(stats.totalRevenue + stats.runningRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Order Modal */}
      <TambahOrder 
        isOpen={isAddOrderOpen} 
        onClose={() => setIsAddOrderOpen(false)} 
        onAddOrder={handleAddOrder}
        cars={carsData}
      />
      
      {/* Edit Order Modal */}
      <EditOrder 
        isOpen={isEditOrderOpen}
        onClose={() => {
          setIsEditOrderOpen(false);
          setSelectedBooking(null);
        }}
        onEditOrder={handleEditOrder}
        booking={selectedBooking}
        cars={carsData}
      />
    </div>
  );
};

export default OrderDashboard;