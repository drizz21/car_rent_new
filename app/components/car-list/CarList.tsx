'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaCarSide, FaTruckPickup, FaShuttleVan, FaCaravan, FaCar } from 'react-icons/fa';
import { Car, Users, Fuel, Settings, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface Car {
  id: number;
  name: string;
  type: string;
  price: number;
  transmisi: string;
  bahanBakar: string;
  pintu: number;
  airConditioner: string;
  seats: number;
  konsumsBBM: number;
  description: string;
  status: 'available' | 'rented' | 'maintenance';
  mainImage: string | null;
}

interface CarsListProps {
  showStatus?: boolean;  
  limit?: number;
  hideFilter?: boolean;
  title?: string;
  cars?: Car[];
}

const typeIcons: Record<string, React.ReactNode> = {
  Semua: <FaCar className="inline-block mr-2" />,
  Sedan: <FaCarSide className="inline-block mr-2" />,
  Minivan: <FaShuttleVan className="inline-block mr-2" />,
  SUV: <FaCaravan className="inline-block mr-2" />,
  Pickup: <FaTruckPickup className="inline-block mr-2" />,
  Cabriolet: <FaCarSide className="inline-block mr-2" />,
  MPV: <FaShuttleVan className="inline-block mr-2" />,
  Hatchback: <FaCar className="inline-block mr-2" />,
};

const Cars: React.FC<CarsListProps> = ({ 
  limit, 
  hideFilter = false, 
  title = "Pilih Unit", 
  cars = [], 
  showStatus = false 
}) => {
  const [activeFilter, setActiveFilter] = useState('Semua');

  const carList = cars;
  const filteredCars =
    activeFilter === 'Semua'
      ? carList
      : carList.filter((car) => car.type === activeFilter);

  const displayedCars = limit ? filteredCars.slice(0, limit) : filteredCars;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Tersedia';
      case 'rented':
        return 'Sedang Disewa';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-orange-100 text-orange-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format harga ke Rupiah
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{title}</h2>

          {!hideFilter && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {['Semua', ...Array.from(new Set(carList.map(car => car.type)))].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`flex items-center px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                    activeFilter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {typeIcons[type] || <FaCar className="inline-block mr-2" />}
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid Mobil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCars.map((car, index) => (
            <Card
              key={car.id}
              className={`group card-hover border-border/50 overflow-hidden animate-fade-in [animation-delay:${index * 0.1}s]`}
            >
              <div className="relative">
                <Image
                  src={car.mainImage ? `data:image/jpeg;base64,${car.mainImage}` : '/images/mobil-display.png'}
                  alt={car.name}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {car.status === 'available' && (
                    <Badge className="bg-green-500 text-white text-xs font-bold shadow">
                      Tersedia
                    </Badge>
                  )}
                  {car.status === 'rented' && (
                    <Badge className="bg-red-500 text-white text-xs font-bold shadow">
                      Disewa
                    </Badge>
                  )}
                  {car.status === 'maintenance' && (
                    <Badge className="bg-yellow-500 text-black text-xs font-bold shadow">
                      Perbaikan
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-1">{car.name}</h3>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(car.price)}
                      <span className="text-sm font-normal text-muted-foreground">/hari</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                      {car.type}
                    </Badge>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Settings className="w-4 h-4" />
                    <span>{car.transmisi}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{car.seats} orang</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Fuel className="w-4 h-4" />
                    <span>{car.bahanBakar}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full btn-hero" asChild disabled={car.status !== 'available'}>
                    <a href={`https://wa.me/628123456789?text=Halo, saya tertarik untuk menyewa ${car.name} dengan harga ${formatCurrency(car.price)}/hari`}>
                      Pesan Sekarang
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`/detail/${car.id}`} className="flex items-center justify-center space-x-2">
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logo Mobil */}
        <section className="bg-white py-22 px-4 rounded-xl mb-8 mt-8">
          <div className="flex justify-center flex-wrap gap-20 items-center">
            {[
              'toyota.png', 'honda.png', 'mitsubishi.png',
              'daihatsu.png', 'wuling.png', 'hyundai.png', 'suzuki.png'
            ].map((logo, i) => (
              <Image
                key={i}
                src={`/images/logo-mobil/${logo}`}
                alt={`Brand ${i}`}
                width={60}
                height={60}
                className="object-contain"
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Cars;
