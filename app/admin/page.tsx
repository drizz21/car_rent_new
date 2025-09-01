
'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FinanceSummary {
  month: string;
  pemasukan: number;
  pengeluaran: number;
  profit: number;
  order_selesai: number;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<FinanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/api/finance-summary');
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          setError('Gagal mengambil data keuangan');
        }
      } catch (err) {
        setError('Gagal mengambil data keuangan');
      } finally {
        setLoading(false);
      }
    };
    const fetchCars = async () => {
      try {
        const res = await fetch('/api/cars');
        const result = await res.json();
        if (Array.isArray(result)) {
          setCars(result);
        } else if (result.data && Array.isArray(result.data)) {
          setCars(result.data);
        }
      } catch {}
    };
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        const result = await res.json();
        if (Array.isArray(result)) {
          setBookings(result);
        } else if (result.data && Array.isArray(result.data)) {
          setBookings(result.data);
        }
      } catch {}
    };
    fetchFinance();
    fetchCars();
    fetchBookings();
  }, []);

  if (loading) return <div className="py-12 text-center">Loading chart...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;

  // Card Data Calculation
  const formatRupiah = (value: number) => value ? value.toLocaleString('id-ID') : '0';
  const totalPemasukan = data.reduce((sum, d) => sum + Math.round(d.pemasukan), 0);
  const totalPengeluaran = data.reduce((sum, d) => sum + Math.round(d.pengeluaran), 0);
  const totalProfit = data.reduce((sum, d) => sum + Math.round(d.profit), 0);
  const totalOrderSelesai = data.reduce((sum, d) => sum + d.order_selesai, 0);
  // Unit Tersedia: dari fitur katalog (status === 'available')
  const unitTersedia = cars.filter(car => car.status === 'available').length;
  // Unit Booking: dari fitur order (status === 'Booking')
  const unitBooking = bookings.filter(b => b.status === 'Booking').length;
  // Unit Berjalan: dari fitur order (status === 'Berjalan')
  const unitJalan = bookings.filter(b => b.status === 'Berjalan').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-6 px-2 md:px-6 lg:px-0">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Card Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-start justify-center border-b-4 border-blue-500">
            <span className="text-xs font-semibold text-gray-500 mb-1">Total Pemasukan</span>
            <span className="text-2xl font-bold text-blue-700 mb-1">{formatRupiah(totalPemasukan)}</span>
            <span className="text-xs text-gray-400">Akumulasi tahun berjalan</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-start justify-center border-b-4 border-red-500">
            <span className="text-xs font-semibold text-gray-500 mb-1">Total Pengeluaran</span>
            <span className="text-2xl font-bold text-red-600 mb-1">{formatRupiah(totalPengeluaran)}</span>
            <span className="text-xs text-gray-400">Akumulasi tahun berjalan</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-start justify-center border-b-4 border-green-500">
            <span className="text-xs font-semibold text-gray-500 mb-1">Total Profit</span>
            <span className="text-2xl font-bold text-green-600 mb-1">{formatRupiah(totalProfit)}</span>
            <span className="text-xs text-gray-400">Akumulasi tahun berjalan</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-start justify-center border-b-4 border-indigo-500">
            <span className="text-xs font-semibold text-gray-500 mb-1">Unit Tersedia</span>
            <span className="text-2xl font-bold text-indigo-600 mb-1">{unitTersedia}</span>
            <span className="text-xs text-gray-400">Unit ready</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-start justify-center border-b-4 border-yellow-500">
            <span className="text-xs font-semibold text-gray-500 mb-1">Unit Booking</span>
            <span className="text-2xl font-bold text-yellow-600 mb-1">{unitBooking}</span>
            <span className="text-xs text-gray-400">Booking belum lunas</span>
          </div>
        </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Multiline Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col justify-center items-center">
              <h2 className="font-bold text-lg mb-2 md:mb-4 text-blue-700">Grafik Keuangan</h2>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="6 6" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#1C3F94' }} />
            <YAxis 
              tick={{ fontSize: 12, fill: '#1C3F94' }} 
              domain={[0, 30000000]} 
              ticks={[0, 1000000, 3000000, 10000000, 30000000]}
              tickFormatter={(value) => {
                if (value === 0) return '0';
                if (value === 1000000) return '1 Jt';
                if (value === 3000000) return '3 Jt';
                if (value === 10000000) return '10 Jt';
                if (value === 30000000) return '30 Jt';
                return '';
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`${Math.round(value).toLocaleString('id-ID')}`, name]}
              labelStyle={{ fontWeight: 'bold', color: '#1C3F94' }}
              itemStyle={{ fontWeight: 'bold' }}
              contentStyle={{ borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb' }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Line type="monotone" dataKey="pemasukan" stroke="#2563eb" name="Pemasukan" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="pengeluaran" stroke="#dc2626" name="Pengeluaran" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="profit" stroke="#16a34a" name="Profit" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col justify-center items-center">
            <h2 className="font-bold text-lg mb-2 md:mb-4 text-yellow-700">Order Selesai per Bulan</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="6 6" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#CA8A04' }} />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 12, fill: '#CA8A04' }} 
                  domain={[0, 30]} 
                  ticks={[0, 5, 10, 20, 30]}
                  tickFormatter={(value) => {
                    if (value === 0) return '0';
                    if (value === 5) return '5';
                    if (value === 10) return '10';
                    if (value === 20) return '20';
                    if (value === 30) return '30';
                    return value;
                  }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [`${Math.round(value)}`, name]}
                  labelStyle={{ fontWeight: 'bold', color: '#CA8A04' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  contentStyle={{ borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb' }}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Bar dataKey="order_selesai" fill="#facc15" name="Order Selesai" radius={[8, 8, 0, 0]} label={{ position: 'top', fontSize: 13, fill: '#CA8A04', fontWeight: 'bold' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List Data Keuangan Detail */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="font-bold text-lg mb-4 text-gray-700">Detail Data Keuangan Bulanan</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Bulan</th>
                  <th className="px-4 py-2 text-right">Pemasukan</th>
                  <th className="px-4 py-2 text-right">Pengeluaran</th>
                  <th className="px-4 py-2 text-right">Profit</th>
                  <th className="px-4 py-2 text-right">Order Selesai</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.month} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-700">{row.month}</td>
                    <td className="px-4 py-2 text-right text-blue-700 font-bold">{formatRupiah(Math.round(row.pemasukan))}</td>
                    <td className="px-4 py-2 text-right text-red-600 font-bold">{formatRupiah(Math.round(row.pengeluaran))}</td>
                    <td className="px-4 py-2 text-right text-green-600 font-bold">{formatRupiah(Math.round(row.profit))}</td>
                    <td className="px-4 py-2 text-right text-yellow-700 font-bold">{row.order_selesai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}