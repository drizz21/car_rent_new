"use client";

import React, { useState, useEffect } from 'react';
import {
  FaMoneyBillWave,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaCalendarAlt,
  FaChartLine,
  FaSearch
} from 'react-icons/fa';
import TambahPengeluaran from '../backend/AddPengeluaran';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
  updated_at: string;
}

const PengeluaranPage = () => {
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const categories = [
    'Semua',
    'Operasional',
    'Maintenance',
    'Bahan Bakar',
    'Asuransi',
    'Pajak',
    'Gaji',
    'Marketing',
    'Lainnya'
  ];

  const getISODate = (date: Date) => date.toISOString().split('T')[0];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/expenses');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Expenses response:', result);
      
      if (result.success && Array.isArray(result.data)) {
        const cleanedData = result.data.map((expense: any) => ({
          ...expense,
          amount: parseFloat(expense.amount) || 0
        }));
        setExpenseData(cleanedData);
      } else if (Array.isArray(result)) {
        const cleanedData = result.map((expense: any) => ({
          ...expense,
          amount: parseFloat(expense.amount) || 0
        }));
        setExpenseData(cleanedData);
      } else {
        console.error('Unexpected response format:', result);
        setExpenseData([]);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Terjadi kesalahan saat mengambil data pengeluaran');
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const formatCurrency = (amount: number) => {
    const validAmount = isNaN(amount) ? 0 : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(validAmount);
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

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const isDateInRange = (targetDate: Date, startDate: Date, endDate: Date) => {
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return target >= start && target <= end;
  };

  const getFilteredExpenses = () => {
    let filtered = expenseData;

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'Semua') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return isDateInRange(expenseDate, startDate, endDate);
      });
    }

    return filtered;
  };

  const filteredExpenses = getFilteredExpenses();

  const calculateStats = () => {
    const allExpenses = expenseData;
    const today = new Date();
   
    const totalExpenses = allExpenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount.toString()) || 0;
      return total + amount;
    }, 0);
   
    const todayExpenses = allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isSameDate(expenseDate, today);
    }).reduce((total, expense) => {
      const amount = parseFloat(expense.amount.toString()) || 0;
      return total + amount;
    }, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
   
    const monthlyExpenses = allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isDateInRange(expenseDate, firstDayOfMonth, lastDayOfMonth);
    }).reduce((total, expense) => {
      const amount = parseFloat(expense.amount.toString()) || 0;
      return total + amount;
    }, 0);

    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      const amount = parseFloat(expense.amount.toString()) || 0;
      acc[expense.category] += amount;
      return acc;
    }, {} as Record<string, number>);

    let topCategory = 'Belum ada data';
    let topAmount = 0;
   
    if (Object.keys(expensesByCategory).length > 0) {
      const entries = Object.entries(expensesByCategory);
      entries.sort((a, b) => b[1] - a[1]);
      topCategory = entries[0][0];
      topAmount = entries[0][1];
    }

    const filteredTotal = filteredExpenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount.toString()) || 0;
      return total + amount;
    }, 0);

    return {
      totalExpenses,
      filteredTotal,
      totalTransactions: filteredExpenses.length,
      expensesByCategory,
      todayExpenses,
      monthlyExpenses,
      topCategory,
      topAmount
    };
  };

  const stats = calculateStats();

  const handleAddExpense = async (newExpenseData: any) => {
    try {
      console.log('🔄 handleAddExpense called with:', newExpenseData);
      await fetchExpenses();
      setIsAddExpenseOpen(false);
      console.log('✅ Expenses refreshed successfully');
    } catch (error) {
      console.error('❌ Error in handleAddExpense:', error);
      await fetchExpenses();
      setIsAddExpenseOpen(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
      try {
        const response = await fetch(`/api/expenses/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (response.ok && result.success) {
          await fetchExpenses();
          alert('Pengeluaran berhasil dihapus!');
        } else {
          alert(`Error: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Terjadi kesalahan saat menghapus pengeluaran');
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Semua');
    setDateFilter({ startDate: '', endDate: '' });
  };

  const setThisMonthFilter = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setDateFilter({
      startDate: getISODate(firstDay),
      endDate: getISODate(lastDay)
    });
  };

  const setLastWeekFilter = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    setDateFilter({
      startDate: getISODate(lastWeek),
      endDate: getISODate(today)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data pengeluaran...</p>
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
            onClick={fetchExpenses}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Pengeluaran */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalExpenses)}</p>
                  <p className="text-xs text-gray-500">{expenseData.length} transaksi</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaMoneyBillWave className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            {/* Pengeluaran Hari Ini */}
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.todayExpenses)}</p>
                  <p className="text-xs text-gray-500">Pengeluaran hari ini</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Pengeluaran Bulan Ini */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyExpenses)}</p>
                  <p className="text-xs text-gray-500">Pengeluaran bulan ini</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Kategori Terbanyak */}
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kategori Terbanyak</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stats.topCategory}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(stats.topAmount)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaFilter className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700 placeholder-gray-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Date From */}
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
              />

              {/* Date To */}
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Menampilkan {filteredExpenses.length} dari {expenseData.length} pengeluaran
                {dateFilter.startDate && dateFilter.endDate && (
                  <span className="ml-2 text-blue-600">
                    ({formatDate(dateFilter.startDate)} - {formatDate(dateFilter.endDate)})
                  </span>
                )}
              </div>
              <button onClick={resetFilters} className="text-sm text-red-600 hover:text-red-700 font-medium">
                Reset Filter
              </button>
            </div>
          </div>

          {/* Expenses by Category */}
          {Object.keys(stats.expensesByCategory).length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengeluaran per Kategori (Filtered)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(stats.expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">{category}</p>
                      <p className="text-lg font-bold text-red-600 mt-1">{formatCurrency(amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Header with Add Button */}
          <div className="flex items-center justify-between bg-white rounded-t-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Pengeluaran</h2>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center space-x-2 transition-colors shadow-lg"
            >
              <FaPlus className="w-4 h-4" />
              <span>Tambah Pengeluaran</span>
            </button>
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FaMoneyBillWave className="text-4xl text-gray-300 mb-4" />
                          <p className="text-lg font-medium">Tidak ada pengeluaran</p>
                          <p className="text-sm">
                            {searchTerm || selectedCategory !== 'Semua' || dateFilter.startDate || dateFilter.endDate
                              ? 'Tidak ada pengeluaran yang sesuai dengan filter'
                              : 'Belum ada pengeluaran yang tercatat'
                            }
                          </p>
                          {!searchTerm && selectedCategory === 'Semua' && !dateFilter.startDate && !dateFilter.endDate && (
                            <button
                              onClick={() => setIsAddExpenseOpen(true)}
                              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                            >
                              <FaPlus className="w-4 h-4" />
                              <span>Tambah Pengeluaran Pertama</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(expense.date)}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(expense.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs">
                            {expense.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-red-600">
                            {formatCurrency(expense.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                alert('Fitur edit akan segera tersedia');
                              }}
                              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Pengeluaran"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Pengeluaran"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredExpenses.length > 0 && (
              <div className="bg-red-50 px-6 py-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Total {filteredExpenses.length} pengeluaran
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    Total: {formatCurrency(stats.filteredTotal)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
              <div className="space-y-3">
                {expenseData.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {expense.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {expense.category} • {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-red-600 ml-4">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                ))}
                {expenseData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FaMoneyBillWave className="text-3xl text-gray-300 mx-auto mb-2" />
                    <p>Belum ada aktivitas</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button
                  onClick={setThisMonthFilter}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>Pengeluaran Bulan Ini</span>
                </button>
                <button
                  onClick={setLastWeekFilter}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaChartLine className="w-4 h-4" />
                  <span>7 Hari Terakhir</span>
                </button>
                <button
                  onClick={() => setSelectedCategory('Operasional')}
                  className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaFilter className="w-4 h-4" />
                  <span>Pengeluaran Operasional</span>
                </button>
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Tambah Pengeluaran Baru</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-center text-sm text-gray-500">
              <p>
                Data terakhir diperbarui: {formatDate(new Date().toISOString())} |
                Total {expenseData.length} pengeluaran tercatat
              </p>
              {(searchTerm || selectedCategory !== 'Semua' || dateFilter.startDate || dateFilter.endDate) && (
                <p className="mt-1">
                  Filter aktif: {filteredExpenses.length} pengeluaran ditampilkan
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <TambahPengeluaran
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
};

export default PengeluaranPage;