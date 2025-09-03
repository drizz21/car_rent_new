'use client';

import React, { useState, useEffect } from 'react';
import { Car, Users, Fuel, Settings, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import Image from 'next/image';

interface CarData {
  id: number;
  name: string;
  type: string;
  price: number;
  status: string;
  mainImage: string;
  images: string[];
  specifications: {
    transmisi: string;
    bahanBakar: string;
    pintu: number;
    airConditioner: string;
    seats: number;
  };
  features: {
    primary: string[];
    secondary: string[];
  };
  description: string;
}

const KendaraanSection = () => {
  const [vehicles, setVehicles] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  // Format harga ke Rupiah
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Ambil data mobil dari backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        // Filter hanya kendaraan yang tersedia dan ambil maksimal 6
        const availableCars = data
          .filter((car: CarData) => car.status === 'available')
          .slice(0, 6);
        setVehicles(availableCars);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <section id="kendaraan" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pilihan Kendaraan Terbaik
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Armada lengkap dengan berbagai pilihan kendaraan berkualitas untuk 
              memenuhi kebutuhan perjalanan Anda
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data kendaraan...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="kendaraan" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pilihan Kendaraan Terbaik
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Armada lengkap dengan berbagai pilihan kendaraan berkualitas untuk 
            memenuhi kebutuhan perjalanan Anda
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-20">
            <Car className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Tidak ada kendaraan tersedia saat ini</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle, index) => (
                <Card
                  key={vehicle.id}
                  className={`group card-hover border-border/50 overflow-hidden animate-fade-in [animation-delay:${index * 0.1}s]`}
                >
                  <div className="relative">
                    <Image
                      src={vehicle.mainImage || '/images/mobil-display.png'}
                      alt={vehicle.name}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Status Badge - Tersedia */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-500 text-white text-xs font-bold shadow">
                        Tersedia
                      </Badge>
                    </div>
                    {/* Type Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                        {vehicle.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-card-foreground mb-1">
                          {vehicle.name}
                        </h3>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(vehicle.price)}
                          <span className="text-sm font-normal text-muted-foreground">/hari</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Settings className="w-4 h-4" />
                        <span>{vehicle.specifications.transmisi}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{vehicle.specifications.seats} orang</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Fuel className="w-4 h-4" />
                        <span>{vehicle.specifications.bahanBakar}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full btn-hero" asChild>
                        <a href={`https://wa.me/6285244129181?text=Halo, saya tertarik untuk menyewa ${vehicle.name} dengan harga ${formatCurrency(vehicle.price)}/hari`}>
                          Pesan Sekarang
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`/detail/${vehicle.id}`} className="flex items-center justify-center space-x-2">
                          <span>Lihat Detail</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8" asChild>
                <a href="/kendaraan" className="flex items-center space-x-2">
                  <Car className="w-5 h-5" />
                  <span>Lihat Semua Kendaraan</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default KendaraanSection;