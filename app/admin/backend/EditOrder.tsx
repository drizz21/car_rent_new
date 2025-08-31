"use client";

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface Car {
  id: number;
  name: string;
  price: number;
  status: string;
}

interface Booking {
  id: number;
  customer_name: string;
  unit: string;
  jenis: string;
  order_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface EditOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onEditOrder: (booking: Booking) => void;
  booking: Booking | null;
  cars: Car[];
}

const EditOrder: React.FC<EditOrderProps> = ({ 
  isOpen, 
  onClose, 
  onEditOrder, 
  booking,
  cars 
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    customer_name: '',
    unit: '',
    jenis: '',
    order_id: '',
    start_date: '',
    end_date: '',
    status: ''
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        id: booking.id,
        customer_name: booking.customer_name,
        unit: booking.unit,
        jenis: booking.jenis,
        order_id: booking.order_id,
        start_date: booking.start_date ? booking.start_date.split('T')[0] : '',
        end_date: booking.end_date ? booking.end_date.split('T')[0] : '',
        status: booking.status
      });
    }
  }, [booking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditOrder(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
      <div className="border border-gray-200 shadow-xl rounded-lg p-6 w-full max-w-md" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)'}}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Booking</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Customer
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Mobil
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-500">Pilih Mobil</option>
              {cars.map((car) => (
                <option key={car.id} value={car.name} className="text-gray-900">
                  {car.name} - {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(car.price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Sewa
            </label>
            <select
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-500">Pilih Jenis</option>
              <option value="Lepas kunci" className="text-gray-900">Lepas kunci</option>
              <option value="Mobil + sopir" className="text-gray-900">Mobil + sopir</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              required
            >
              <option value="Booking" className="text-gray-900">Booking</option>
              <option value="Berjalan" className="text-gray-900">Berjalan</option>
              <option value="Selesai" className="text-gray-900">Selesai</option>
              <option value="Batal" className="text-gray-900">Batal</option>
              <option value="Out for delivery" className="text-gray-900">Out for delivery</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;