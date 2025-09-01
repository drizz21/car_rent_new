'use client';

import React from 'react';
import Link from 'next/link';
import Cars from './car-list/CarList';

const Car = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Pilih Kendaraan
            </h2>
            <h3 className="text-3xl font-bold text-gray-800">
              Ternyamanmu
            </h3>
          </div>
          <Link
            href="/vehicles"
            className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
          >
            View All
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Panggil CarsList dengan limit 6 dan sembunyikan filter */}
        <Cars limit={6} hideFilter={true} title="" />
      </div>
    </section>
  );
};

export default Car;
