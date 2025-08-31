// app/admin/page.tsx
"use client";
import * as XLSX from 'xlsx';
import React, { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, 
  FaCar, 
  FaChartLine, 
  FaDownload,
  FaCalendarAlt,
  FaFilter,
  FaPrint,
  FaFileExcel
} from 'react-icons/fa';

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

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
}

const LaporanPage = () => {
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [activeTab, setActiveTab] = useState<'summary' | 'income' | 'expense'>('summary');

  // Helper untuk format tanggal ke YYYY-MM-DD
  const getISODate = (date: Date) => date.toISOString().split('T')[0];

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setBookingData(result.data);
      } else if (Array.isArray(result)) {
        setBookingData(result);
      } else {
        setBookingData([]);
      }
    } catch (err) {
      setBookingData([]);
    }
  };

  // Fetch cars from API
  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (Array.isArray(result)) {
        setCarsData(result);
      } else if (result.success && Array.isArray(result.data)) {
        setCarsData(result.data);
      } else {
        setCarsData([]);
      }
    } catch (err) {
      setCarsData([]);
    }
  };

  // Fetch expenses from API or localStorage
  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (response.ok) {
        const result = await response.json();
        let expenses = Array.isArray(result) ? result : (result.success ? result.data : []);
        expenses = expenses.map((expense: any) => ({
          ...expense,
          amount: Number(expense.amount) || 0,
          category: expense.category || 'Lainnya'
        }));
        setExpenseData(expenses);
      } else {
        const localExpenses = localStorage.getItem('expenses');
        if (localExpenses) {
          const parsed = JSON.parse(localExpenses);
          setExpenseData(Array.isArray(parsed) ? parsed : []);
        }
      }
    } catch (err) {
      const localExpenses = localStorage.getItem('expenses');
      if (localExpenses) {
        const parsed = JSON.parse(localExpenses);
        setExpenseData(Array.isArray(parsed) ? parsed : []);
      }
    }
  };
  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchBookings(), fetchCars(), fetchExpenses()]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Helper function to calculate days between dates
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Helper function to calculate booking price with duration and driver discount
  const calculateBookingPrice = (booking: Booking) => {
    const car = carsData.find(car => car.name === booking.unit);
    if (!car) return 0;
    
    const days = calculateDays(booking.start_date, booking.end_date);
    let totalPrice = car.price * days;
    
    // Apply 20% discount if jenis includes "sopir"
    if (booking.jenis && booking.jenis.toLowerCase().includes('sopir')) {
      totalPrice = totalPrice * 0.8;
    }
    
    return totalPrice;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Format date
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

  // Filter data based on date range
  const getFilteredData = () => {
    let filteredBookings = bookingData;
    let filteredExpenses = expenseData;

    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      
      // Set time to start and end of day for proper filtering
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      filteredBookings = bookingData.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate >= startDate && bookingDate <= endDate;
      });

      filteredExpenses = expenseData.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    }

    return { filteredBookings, filteredExpenses };
  };

  const { filteredBookings, filteredExpenses } = getFilteredData();

  // Calculate financial statistics
 const calculateStats = () => {
  const completedBookings = filteredBookings.filter(b => b.status === 'Selesai');
  const runningBookings = filteredBookings.filter(b => b.status === 'Berjalan');
  
  // Calculate revenue from completed bookings
  const totalRevenue = completedBookings.reduce((total, booking) => {
    const price = calculateBookingPrice(booking) || 0;
    return total + price;
  }, 0);

  // Calculate potential revenue from running bookings
  const potentialRevenue = runningBookings.reduce((total, booking) => {
    const price = calculateBookingPrice(booking) || 0;
    return total + price;
  }, 0);

  // Calculate total expenses - ensure each amount is a valid number
  const totalExpenses = filteredExpenses.reduce((total, expense) => {
    const amount = Number(expense.amount) || 0;
    return total + amount;
  }, 0);

  // Calculate net profit
  const netProfit = totalRevenue - totalExpenses;

  // Group expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    if (!expense.category) expense.category = 'Lainnya';
    const amount = Number(expense.amount) || 0;
    
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    potentialRevenue,
    completedBookings: completedBookings.length,
    runningBookings: runningBookings.length,
    totalBookings: filteredBookings.length,
    totalExpenseTransactions: filteredExpenses.length,
    expensesByCategory
  };
};
  const stats = calculateStats();

  // Export to CSV function


const exportToExcel = () => {
  const periodText = dateFilter.startDate && dateFilter.endDate 
    ? `${formatDate(dateFilter.startDate)} - ${formatDate(dateFilter.endDate)}`
    : 'Semua Periode';

  // Helper function to format numbers with thousand separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Helper function to escape CSV values and handle commas
  const escapeCSV = (value: any) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Menghitung rata-rata dan margin
  const avgRevenuePerBooking = stats.completedBookings > 0 ? stats.totalRevenue / stats.completedBookings : 0;
  const avgExpensePerTransaction = stats.totalExpenseTransactions > 0 ? stats.totalExpenses / stats.totalExpenseTransactions : 0;
  const profitMargin = stats.totalRevenue > 0 ? (stats.netProfit / stats.totalRevenue) * 100 : 0;

  // Membuat struktur data untuk Excel
  const sheetData = [
    ['LAPORAN KEUANGAN RENTAL MOBIL'],
    [''],
    ['Informasi Laporan'],
    ['Periode', 'Tanggal Export'],
    [periodText, formatDate(new Date().toISOString())],
    [''],

    ['RINGKASAN KEUANGAN'],
    ['Kategori', 'Jumlah (Rp)', 'Keterangan'],
    ['Total Pemasukan', formatNumber(stats.totalRevenue), `${stats.completedBookings} booking selesai`],
    ['Total Pengeluaran', formatNumber(stats.totalExpenses), `${stats.totalExpenseTransactions} transaksi`],
    ['Keuntungan Bersih', formatNumber(stats.netProfit), stats.netProfit >= 0 ? 'Untung' : 'Rugi'],
    ['Potensi Pemasukan', formatNumber(stats.potentialRevenue), `${stats.runningBookings} booking berjalan`],
    [''],

    ['STATISTIK BOOKING'],
    ['Metrik', 'Nilai', 'Satuan'],
    ['Total Booking', stats.totalBookings, 'unit'],
    ['Booking Selesai', stats.completedBookings, 'unit'],
    ['Booking Berjalan', stats.runningBookings, 'unit'],
    ['Rata-rata per Booking', formatNumber(Math.round(avgRevenuePerBooking)), 'Rp'],
    ['Rata-rata Pengeluaran', formatNumber(Math.round(avgExpensePerTransaction)), 'Rp'],
    ['Margin Keuntungan', profitMargin.toFixed(2), '%'],
    [''],

    // DETAIL PEMASUKAN TABLE
    ['DETAIL PEMASUKAN'],
    ['No', 'Tanggal', 'Customer', 'Unit', 'Durasi', 'Periode Sewa', 'Jenis', 'Order ID', 'Harga Dasar', 'Diskon', 'Total Harga']
  ];

  const completedBookings = filteredBookings.filter(b => b.status === 'Selesai');
  completedBookings.forEach((booking, index) => {
    const days = calculateDays(booking.start_date, booking.end_date);
    const car = carsData.find(car => car.name === booking.unit);
    const basePrice = car ? car.price * days : 0;
    const hasDriverDiscount = booking.jenis && booking.jenis.toLowerCase().includes('sopir');
    const totalPrice = calculateBookingPrice(booking);
    const discountAmount = hasDriverDiscount ? basePrice * 0.2 : 0;

    sheetData.push([
      index + 1,
      formatDate(booking.created_at),
      booking.customer_name,
      booking.unit,
      `${days} hari`,
      `${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`,
      booking.jenis,
      booking.order_id,
      formatNumber(basePrice),
      formatNumber(discountAmount),
      formatNumber(totalPrice)
    ]);
  });

  sheetData.push(['']);
  sheetData.push(['SUBTOTAL PEMASUKAN']);
  sheetData.push(['Item', 'Jumlah']);
  sheetData.push([`Total Booking Selesai`, `${completedBookings.length} booking`]);
  sheetData.push([`Total Pemasukan`, `Rp ${formatNumber(stats.totalRevenue)}`]);

  sheetData.push(['']);

  // DETAIL PENGELUARAN TABLE
  sheetData.push(['DETAIL PENGELUARAN']);
  sheetData.push(['No', 'Tanggal', 'Deskripsi', 'Kategori', 'Jumlah (Rp)']);

  const filteredExpenses = expenseData; // assume expensesData is your expenses data array
  filteredExpenses.forEach((expense, index) => {
    sheetData.push([
      index + 1,
      formatDate(expense.date),
      expense.description,
      expense.category || 'Lainnya',
      formatNumber(expense.amount)
    ]);
  });

  sheetData.push(['']);
  sheetData.push(['SUBTOTAL PENGELUARAN']);
  sheetData.push(['Item', 'Jumlah']);
  sheetData.push([`Total Transaksi`, `${filteredExpenses.length} transaksi`]);
  sheetData.push([`Total Pengeluaran`, `Rp ${formatNumber(stats.totalExpenses)}`]);

  sheetData.push(['']);

  // PENGELUARAN PER KATEGORI TABLE
  sheetData.push(['PENGELUARAN PER KATEGORI']);
  sheetData.push(['Kategori', 'Jumlah (Rp)', 'Persentase (%)']);

  Object.entries(stats.expensesByCategory).sort(([, a], [, b]) => b - a).forEach(([category, amount]) => {
    const percentage = stats.totalExpenses > 0 ? (amount / stats.totalExpenses) * 100 : 0;
    sheetData.push([category, formatNumber(amount), percentage.toFixed(2)]);
  });

  sheetData.push(['']);
  sheetData.push(['TOTAL PENGELUARAN']);
  sheetData.push(['Item', 'Nilai']);
  sheetData.push([`Total Pengeluaran`, `Rp ${formatNumber(stats.totalExpenses)}`]);
  sheetData.push([`Persentase`, '100.00%']);

  // BOOKING BERJALAN TABLE
  const runningBookings = filteredBookings.filter(b => b.status === 'Berjalan');
  if (runningBookings.length > 0) {
    sheetData.push(['BOOKING BERJALAN (POTENSI PEMASUKAN)']);
    sheetData.push(['No', 'Customer', 'Unit', 'Durasi', 'Periode Sewa', 'Jenis', 'Order ID', 'Potensi Harga (Rp)']);

    runningBookings.forEach((booking, index) => {
      const days = calculateDays(booking.start_date, booking.end_date);
      const potentialPrice = calculateBookingPrice(booking);

      sheetData.push([
        index + 1,
        booking.customer_name,
        booking.unit,
        `${days} hari`,
        `${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`,
        booking.jenis,
        booking.order_id,
        formatNumber(potentialPrice)
      ]);
    });

    sheetData.push(['']);
    sheetData.push(['SUBTOTAL BOOKING BERJALAN']);
    sheetData.push(['Item', 'Jumlah']);
    sheetData.push([`Total Booking Berjalan`, `${runningBookings.length} booking`]);
    sheetData.push([`Total Potensi Pemasukan`, `Rp ${formatNumber(stats.potentialRevenue)}`]);
  }

  sheetData.push(['']);
  sheetData.push(['INFORMASI LAPORAN']);
  sheetData.push(['Item', 'Detail']);
  sheetData.push([`Dibuat pada`, formatDate(new Date().toISOString())]);
  sheetData.push([`Total Data Booking`, `${filteredBookings.length} record`]);
  sheetData.push([`Total Data Pengeluaran`, `${filteredExpenses.length} record`]);
  sheetData.push([`Filter Periode`, periodText]);
  sheetData.push([`Status Export`, 'Berhasil']);

  // Membuat worksheet dan workbook
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');

  // Menyimpan file Excel
  XLSX.writeFile(wb, `laporan-keuangan_${new Date().toISOString().split('T')[0]}.xlsx`);
};

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Reset date filter
  const resetDateFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data laporan...</p>
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
            onClick={() => window.location.reload()}
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
          {/* Date Filter */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
             <div className="flex items-center space-x-4">
  <div className="flex items-center space-x-2">
    <FaCalendarAlt className="w-5 h-5 text-blue-600" />
    <span className="text-sm font-medium text-gray-700">Filter Periode:</span>
  </div>
  <input
    type="date"
    value={dateFilter.startDate}
    onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" // Tambahkan text-black di sini
    placeholder="Tanggal Mulai"
  />
  <span className="text-gray-500 font-medium">sampai</span> {/* Ubah text-gray-500 menjadi text-black */}
  <input
    type="date"
    value={dateFilter.endDate}
    onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" // Tambahkan text-black di sini
    placeholder="Tanggal Akhir"
  />
                <button 
                  onClick={resetDateFilter}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 flex items-center space-x-2 transition-colors"
                >
                  <FaFilter className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {dateFilter.startDate && dateFilter.endDate ? (
                  <span>Periode: {formatDate(dateFilter.startDate)} - {formatDate(dateFilter.endDate)}</span>
                ) : (
                  <span>Menampilkan semua data</span>
                )}
              </div>
            </div>
          </div>

         {/* Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total Revenue Card */}
  <div className="bg-green-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Total Pemasukan</p>
        <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
        <p className="text-xs text-gray-500">{stats.completedBookings} booking selesai</p>
      </div>
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
        <FaMoneyBillWave className="w-6 h-6 text-green-600" />
      </div>
    </div>
  </div>

  {/* Total Expenses Card */}
  <div className="bg-red-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Total Pengeluaran</p>
        <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
        <p className="text-xs text-gray-500">{stats.totalExpenseTransactions} transaksi</p>
      </div>
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
        <FaCar className="w-6 h-6 text-red-600" />
      </div>
    </div>
  </div>

  {/* Net Profit Card */}
  <div className={`${stats.netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Keuntungan Bersih</p>
        <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(stats.netProfit)}
        </p>
        <p className="text-xs text-gray-500">Pemasukan - Pengeluaran</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
        <FaChartLine className={`w-6 h-6 ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
      </div>
    </div>
  </div>

  {/* Potential Revenue Card */}
  <div className="bg-orange-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Potensi Pemasukan</p>
        <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.potentialRevenue)}</p>
        <p className="text-xs text-gray-500">{stats.runningBookings} booking berjalan</p>
      </div>
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
        <FaChartLine className="w-6 h-6 text-orange-600" />
      </div>
    </div>
  </div>
</div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-100">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'summary'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Ringkasan
                </button>
                <button
                  onClick={() => setActiveTab('income')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'income'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Detail Pemasukan
                </button>
                <button
                  onClick={() => setActiveTab('expense')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'expense'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Detail Pengeluaran
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Financial Summary */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Keuangan</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Pemasukan:</span>
                          <span className="font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Pengeluaran:</span>
                          <span className="font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 font-medium">Keuntungan Bersih:</span>
                          <span className={`font-bold text-lg ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(stats.netProfit)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Booking</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Booking:</span>
                          <span className="font-bold text-blue-600">{stats.totalBookings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Booking Selesai:</span>
                          <span className="font-bold text-green-600">{stats.completedBookings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Booking Berjalan:</span>
                          <span className="font-bold text-orange-600">{stats.runningBookings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Potensi Pemasukan:</span>
                          <span className="font-bold text-orange-600">{formatCurrency(stats.potentialRevenue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expense by Category */}
                  {Object.keys(stats.expensesByCategory).length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengeluaran per Kategori</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(stats.expensesByCategory).map(([category, amount]) => (
                          <div key={category} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 text-sm">{category}</span>
                              <span className="font-bold text-red-600">{formatCurrency(amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'income' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Harga</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.filter(b => b.status === 'Selesai').length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <FaMoneyBillWave className="text-4xl text-gray-300 mb-4" />
                              <p className="text-lg font-medium">Tidak ada pemasukan</p>
                              <p className="text-sm">Belum ada booking yang selesai pada periode ini</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredBookings
                          .filter(b => b.status === 'Selesai')
                          .map((booking) => {
                            const days = calculateDays(booking.start_date, booking.end_date);
                            const totalPrice = calculateBookingPrice(booking);
                            const hasDriverDiscount = booking.jenis && booking.jenis.toLowerCase().includes('sopir');
                            
                            return (
                              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{formatDate(booking.created_at)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{booking.unit}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{days} hari</div>
                                  <div className="text-xs text-gray-500">
                                    {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{booking.jenis}</div>
                                  {hasDriverDiscount && (
                                    <div className="text-xs text-green-600">Diskon sopir 20%</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-mono">{booking.order_id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-bold text-green-600">{formatCurrency(totalPrice)}</div>
                                  {hasDriverDiscount && (
                                    <div className="text-xs text-gray-500">
                                      Sebelum diskon: {formatCurrency(totalPrice / 0.8)}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  
                  {/* Income Summary Footer */}
                  <div className="mt-6 bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Total {filteredBookings.filter(b => b.status === 'Selesai').length} booking selesai
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        Total Pemasukan: {formatCurrency(stats.totalRevenue)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'expense' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <FaCar className="text-4xl text-gray-300 mb-4" />
                              <p className="text-lg font-medium">Tidak ada pengeluaran</p>
                              <p className="text-sm">Belum ada pengeluaran pada periode ini</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredExpenses.map((expense) => (
                          <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(expense.date)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                {expense.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-red-600">{formatCurrency(expense.amount)}</div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  
                  {/* Expense Summary Footer */}
                  <div className="mt-6 bg-red-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Total {filteredExpenses.length} transaksi pengeluaran
                      </div>
                      <div className="text-lg font-bold text-red-600">
                        Total Pengeluaran: {formatCurrency(stats.totalExpenses)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend (if you want to add this later) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tambahan</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Rata-rata per booking:</span>
                  <span className="font-medium text-gray-900">
                    {stats.completedBookings > 0 
                      ? formatCurrency(stats.totalRevenue / stats.completedBookings)
                      : formatCurrency(0)
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Rata-rata pengeluaran:</span>
                  <span className="font-medium text-gray-900">
                    {stats.totalExpenseTransactions > 0 
                      ? formatCurrency(stats.totalExpenses / stats.totalExpenseTransactions)
                      : formatCurrency(0)
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Margin keuntungan:</span>
                  <span className={`font-medium ${stats.totalRevenue > 0 ? 
                    (stats.netProfit / stats.totalRevenue * 100) >= 0 ? 'text-green-600' : 'text-red-600'
                    : 'text-gray-900'}`}>
                    {stats.totalRevenue > 0 
                      ? `${((stats.netProfit / stats.totalRevenue) * 100).toFixed(2)}%`
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const today = new Date();
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    
                    setDateFilter({
                      startDate: getISODate(firstDay),
                      endDate: getISODate(lastDay),
                    });
                  }}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>Laporan Bulan Ini</span>
                </button>
                
                <button
                  onClick={() => {
                    const today = new Date();
                    const firstDay = new Date(today.getFullYear(), 0, 1);
                    const lastDay = new Date(today.getFullYear(), 11, 31);
                    
                    setDateFilter({
                      startDate: getISODate(firstDay),
                      endDate: getISODate(lastDay),
                    });
                  }}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaChartLine className="w-4 h-4" />
                  <span>Laporan Tahun Ini</span>
                </button>

                <button
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    
                    setDateFilter({
                      startDate: getISODate(lastWeek),
                      endDate: getISODate(today),
                    });
                  }}
                  className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaFilter className="w-4 h-4" />
                  <span>7 Hari Terakhir</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="text-center text-sm text-gray-500">
                <p>
                  Laporan dibuat pada: {formatDate(new Date().toISOString())} | 
                  Total data: {filteredBookings.length} booking, {filteredExpenses.length} pengeluaran
                </p>
                {dateFilter.startDate && dateFilter.endDate && (
                  <p className="mt-1">
                    Periode: {formatDate(dateFilter.startDate)} - {formatDate(dateFilter.endDate)}
                  </p>
                )}
              </div>
              
              {/* Moved Print and Export buttons here */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handlePrint}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                >
                  <FaPrint className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button 
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2 transition-colors"
                >
                  <FaFileExcel className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .bg-gray-50 {
            background-color: white !important;
          }
          
          .shadow-sm,
          .shadow-md {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LaporanPage;