'use client';

import React from 'react';
import { FaMoneyBillWave, FaCar, FaChartLine, FaCalculator } from 'react-icons/fa';

interface ModernStatsCardsProps {
  totalRevenue: number;
  availableCars: number;
  rentedCars: number;
  totalBookings: number;
}

export default function ModernStatsCards({ 
  totalRevenue, 
  availableCars, 
  rentedCars, 
  totalBookings 
}: ModernStatsCardsProps) {
  const stats = [
    {
      title: 'Total Pemasukan',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      icon: FaMoneyBillWave,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-100',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Unit Tersedia',
      value: `${availableCars} Unit`,
      icon: FaCar,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Unit Disewa',
      value: `${rentedCars} Unit`,
      icon: FaChartLine,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-100',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Total Booking',
      value: totalBookings.toString(),
      icon: FaCalculator,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-100',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-6 shadow-2xl border border-white/20 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-3xl group`}
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Icon */}
          <div className={`relative z-10 w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
            <stat.icon className={`w-8 h-8 ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`} />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className={`text-sm font-medium ${stat.textColor} mb-2 opacity-80`}>
              {stat.title}
            </h3>
            <p className={`text-2xl font-bold ${stat.textColor} group-hover:scale-105 transition-transform duration-300`}>
              {stat.value}
            </p>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 