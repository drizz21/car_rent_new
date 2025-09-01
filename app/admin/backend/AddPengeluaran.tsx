"use client";

import React, { useState } from 'react';
import { FaTimes, FaSave, FaMoneyBillWave } from 'react-icons/fa';

interface AddPengeluaranProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expenseData: any) => void;
}

const AddPengeluaran: React.FC<AddPengeluaranProps> = ({ isOpen, onClose, onAddExpense }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Operasional',
    date: new Date().toISOString().split('T')[0],  // Perbaikan: Hanya mengambil tanggal
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const categories = [
    'Operasional',
    'Maintenance',
    'Bahan Bakar',
    'Asuransi',
    'Pajak',
    'Gaji',
    'Marketing',
    'Lainnya'
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi harus diisi';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0';
    }

    if (!formData.date) {
      newErrors.date = 'Tanggal harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onAddExpense(result);
        handleClose();
        alert('Pengeluaran berhasil ditambahkan!');
      } else {
        alert(`Error: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Terjadi kesalahan saat menambahkan pengeluaran');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      amount: '',
      category: 'Operasional',
      date: new Date().toISOString().split('T')[0],  // Perbaikan: Hanya mengambil tanggal
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/[^0-9]/g, ''));
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');  // Hanya izinkan angka
    setFormData(prev => ({
      ...prev,
      amount: value
    }));
    
    if (errors.amount) {
      setErrors(prev => ({
        ...prev,
        amount: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tambah Pengeluaran</h2>
              <p className="text-sm text-gray-500">Catat pengeluaran baru</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <FaTimes className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Pengeluaran *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              // ✅ Tambahkan text-gray-900 untuk teks input dan placeholder-gray-500
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-gray-900 placeholder-gray-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: Bensin mobil Avanza, Service rutin, dll"
              rows={3}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Pengeluaran *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                type="text"
                name="amount"
                value={formatCurrency(formData.amount)}
                onChange={handleAmountChange}
                // ✅ Tambahkan text-gray-900 untuk teks input
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                required
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              // ✅ Tambahkan text-gray-900 untuk teks select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
              required
            >
              {categories.map(category => (
                <option key={category} value={category} className="text-gray-900">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              // ✅ Tambahkan text-gray-900 untuk teks input date
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Preview */}
          {formData.amount && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="text-sm font-medium text-red-800 mb-2">Preview:</h4>
              <div className="text-sm text-red-700">
                <p><strong>Deskripsi:</strong> {formData.description || 'Belum diisi'}</p>
                <p><strong>Jumlah:</strong> Rp {formatCurrency(formData.amount)}</p>
                <p><strong>Kategori:</strong> {formData.category}</p>
                <p><strong>Tanggal:</strong> {new Date(formData.date).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  <span>Simpan Pengeluaran</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPengeluaran;