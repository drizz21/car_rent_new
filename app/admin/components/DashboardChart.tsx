'use client';

import React from 'react';
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

interface ChartData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
  profit: number;
}

interface DashboardChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-4">
        <p className="text-gray-600 font-semibold mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {entry.name}:
              </span>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                Rp {entry.value?.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardChart({ data }: DashboardChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 text-center">
        <div className="text-gray-400 text-lg">Tidak ada data untuk ditampilkan</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl p-6 shadow-2xl border border-white/20 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Grafik Keuangan 6 Bulan</h3>
        <p className="text-gray-600">Analisis tren Pemasukan, Pengeluaran, dan Profit</p>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{
                paddingBottom: '20px'
              }}
            />
            
            {/* Line Pemasukan */}
            <Line
              type="monotone"
              dataKey="pemasukan"
              name="Pemasukan"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
            />
            
            {/* Line Pengeluaran */}
            <Line
              type="monotone"
              dataKey="pengeluaran"
              name="Pengeluaran"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#EF4444', strokeWidth: 2 }}
            />
            
            {/* Line Profit */}
            <Line
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {data.slice(-3).map((item, index) => (
          <div key={index} className="bg-white/60 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-sm text-gray-600 mb-1">{item.month}</div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-green-600">
                Pemasukan: Rp {item.pemasukan.toLocaleString('id-ID')}
              </div>
              <div className="text-sm font-semibold text-red-600">
                Pengeluaran: Rp {item.pengeluaran.toLocaleString('id-ID')}
              </div>
              <div className="text-sm font-bold text-blue-600">
                Profit: Rp {item.profit.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 