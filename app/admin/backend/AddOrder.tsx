// components/AddOrder.tsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface Car {
  id: number;
  name: string;
  price: number;
  status: string;
}

interface AddOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (newOrder: any) => void;
  cars: Car[];
}

const AddOrder: React.FC<AddOrderProps> = ({ isOpen, onClose, onAddOrder, cars }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    jenis: 'Lepas kunci',
    orderID: '',
    durasiStart: '',
    durasiEnd: '',
    status: 'Booking',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
      console.log('❌ Submit blocked - already loading');
      return;
    }
    
    console.log('🚀 Starting submit process...');
    setIsLoading(true);

    // Validasi tanggal
    if (formData.durasiStart && formData.durasiEnd) {
      const startDate = new Date(formData.durasiStart);
      const endDate = new Date(formData.durasiEnd);
      
      if (startDate >= endDate) {
        console.log('❌ Date validation failed');
        alert('Tanggal selesai harus lebih besar dari tanggal mulai!');
        setIsLoading(false);
        return;
      }
    }

    // Format data untuk backend
    const bookingData = {
      customer_name: formData.name,
      unit: formData.unit,
      jenis: formData.jenis,
      order_id: formData.orderID,
      start_date: formData.durasiStart,
      end_date: formData.durasiEnd,
      status: formData.status
    };

    console.log('📤 Sending data to server:', bookingData);

    try {
      const response = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('📥 Response received:');
      console.log('- Status:', response.status);
      console.log('- Status Text:', response.statusText);
      console.log('- OK:', response.ok);

      let result;
      try {
        result = await response.json();
        console.log('📄 Response JSON:', result);
      } catch (jsonError) {
        console.error('❌ JSON Parse Error:', jsonError);
        alert('Server mengirim response yang tidak valid');
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        console.log('✅ SUCCESS - Processing success response');
        
        // Reset form
        setFormData({
          name: '',
          unit: '',
          jenis: 'Lepas kunci',
          orderID: '',
          durasiStart: '',
          durasiEnd: '',
          status: 'Booking',
        });

        // Callback ke parent
        onAddOrder({
          ...bookingData,
          id: result.id,
          durasi: `${formData.durasiStart} - ${formData.durasiEnd}`,
          statusColor: getStatusColor(formData.status),
        });

        alert('Booking berhasil ditambahkan!');
        setIsLoading(false);
        onClose();
        
      } else {
        console.error('❌ Server Error Response:', result);
        alert(`Gagal menambahkan booking: ${result.message || 'Unknown error'}`);
        setIsLoading(false);
      }

    } catch (error) {
      console.error('❌ Network/Fetch Error:', error);
      
      // Cek apakah server berjalan
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Tidak dapat terhubung ke server. Pastikan:\n1. Server berjalan di port 3000\n2. Tidak ada firewall yang memblokir\n3. URL server benar');
      } else {
        alert(`Terjadi kesalahan: ${error}`);
      }
      
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    console.log('🔄 Closing modal and resetting form');
    setFormData({
      name: '',
      unit: '',
      jenis: 'Lepas kunci',
      orderID: '',
      durasiStart: '',
      durasiEnd: '',
      status: 'Booking',
    });
    setIsLoading(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Booking':
        return 'bg-blue-100 text-blue-800';
      case 'Out for delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'Berjalan':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getSelectedCarPrice = () => {
    const selectedCar = cars.find(car => car.name === formData.unit);
    return selectedCar ? selectedCar.price : 0;
  };

  // Fungsi untuk menghitung durasi dalam hari
  const calculateDays = () => {
    if (!formData.durasiStart || !formData.durasiEnd) return 0;
    const startDate = new Date(formData.durasiStart);
    const endDate = new Date(formData.durasiEnd);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Fungsi untuk menghitung harga total
  const calculateTotalPrice = () => {
    const basePrice = getSelectedCarPrice();
    const days = calculateDays();
    
    if (!basePrice || !days) return 0;
    
    let totalPrice = basePrice * days;
    
    // Kurangi 20% jika dengan sopir
    if (formData.jenis === 'Mobil + sopir') {
      totalPrice = totalPrice * 0.8; // 80% dari harga asli (dikurangi 20%)
    }
    
    return totalPrice;
  };

  // Fungsi untuk mendapatkan detail perhitungan harga
  const getPriceBreakdown = () => {
    const basePrice = getSelectedCarPrice();
    const days = calculateDays();
    const isWithDriver = formData.jenis === 'Mobil + sopir';
    
    if (!basePrice || !days) return null;
    
    const subtotal = basePrice * days;
    
    return {
      basePrice,
      days,
      isWithDriver,
      subtotal: subtotal,
      discount: isWithDriver ? (subtotal * 0.2) : 0, // Diskon 20%
      discountedPrice: isWithDriver ? (subtotal * 0.8) : subtotal, // Harga setelah diskon
      total: calculateTotalPrice()
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl border-2 border-gray-300 my-8">
        <div className="border-b-2 border-blue-200 px-6 py-4 flex justify-between items-center bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-800">Tambah Booking</h3>
          <button 
            onClick={handleClose} 
            className="text-blue-600 hover:text-blue-800 transition-colors"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Nama Customer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
                placeholder="Masukkan nama customer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Unit Mobil <span className="text-red-500">*</span>
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              >
                <option value="">Pilih Mobil</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.name}>
                    {car.name} - {formatCurrency(car.price)}
                  </option>
                ))}
              </select>
              {formData.unit && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Harga Sewa:</strong> {formatCurrency(getSelectedCarPrice())}/hari
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Jenis <span className="text-red-500">*</span>
              </label>
              <select
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              >
                <option value="Lepas kunci">Lepas kunci</option>
                <option value="Mobil + sopir">Mobil + sopir</option>
              </select>
              {formData.jenis === 'Mobil + sopir' && (
                <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Diskon:</strong> Hemat 20% dengan paket mobil + sopir!
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Order ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orderID"
                value={formData.orderID}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
                placeholder="Contoh: ORD-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="durasiStart"
                value={formData.durasiStart}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
                min={new Date().toISOString().substring(0, 10)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="durasiEnd"
                value={formData.durasiEnd}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
                min={formData.durasiStart || new Date().toISOString().substring(0, 10)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              >
                <option value="Booking">Booking</option>
                <option value="Berjalan">Berjalan</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* Enhanced Summary Section */}
          {formData.unit && formData.durasiStart && formData.durasiEnd && (() => {
            const breakdown = getPriceBreakdown();
            return breakdown && (
              <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                  📊 Ringkasan Booking
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Mobil:</span>
                      <span className="font-semibold text-gray-900">{formData.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Jenis:</span>
                      <span className="font-semibold text-gray-900">{formData.jenis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Durasi:</span>
                      <span className="font-semibold text-gray-900">{breakdown.days} hari</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Harga per hari:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(breakdown.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal ({breakdown.days} hari):</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(breakdown.subtotal)}</span>
                    </div>
                    {breakdown.isWithDriver && (
                      <div className="flex justify-between text-green-700">
                        <span>Diskon mobil + sopir (-20%):</span>
                        <span className="font-semibold">-{formatCurrency(breakdown.discount)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t-2 border-blue-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Biaya:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(breakdown.total)}
                    </span>
                  </div>
                  
                  {/* Calculation Formula Display */}
                  <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                    <div className="font-medium text-gray-700 mb-1">Perhitungan:</div>
                    <div className="space-y-1">
                      {breakdown.isWithDriver ? (
                        <div>
                          {formatCurrency(breakdown.basePrice)} × {breakdown.days} hari - 20% = {formatCurrency(breakdown.total)}
                        </div>
                      ) : (
                        <div>
                          {formatCurrency(breakdown.basePrice)} × {breakdown.days} hari = {formatCurrency(breakdown.total)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex justify-end space-x-3 pt-4 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border-2 border-gray-400 rounded-md text-gray-800 bg-white hover:bg-gray-100 shadow-sm transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;