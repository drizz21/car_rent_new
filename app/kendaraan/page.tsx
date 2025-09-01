"use client";

import React, { useEffect, useState } from "react";
import { Users, Fuel, Settings, ArrowRight } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Image from "next/image";

// Format harga ribuan tanpa desimal
const formatCurrency = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\D/g, '')) : price;
  return 'Rp' + (numPrice ? numPrice.toLocaleString('id-ID') : '0');
};
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import axios from "axios";


const KendaraanPage: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/cars');
        setCars(res.data);
      } catch (err) {
        setError('Gagal memuat data kendaraan.');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Daftar Kendaraan</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Armada lengkap dengan berbagai pilihan kendaraan berkualitas untuk memenuhi kebutuhan perjalanan Anda
          </p>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <span className="text-lg text-muted-foreground">Memuat data kendaraan...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <span className="text-lg text-red-500">{error}</span>
          </div>
) : (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cars.map((mobil, index) => {
        return (
          <Card
            key={mobil.id}
            className={`group card-hover border-border/50 overflow-hidden animate-fade-in [animation-delay:${index * 0.1}s]`}
          >
            <div className="relative">
              <Image
                src={
                  mobil.mainImage
                    ? mobil.mainImage.startsWith('data:image')
                      ? mobil.mainImage
                      : mobil.mainImage.startsWith('/')
                        ? mobil.mainImage
                        : `/images/car-list/${mobil.mainImage}`
                    : '/images/mobil-display.png'
                }
                alt={mobil.name}
                width={400}
                height={192}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.src = '/images/mobil-display.png'; }}
              />
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                {mobil.status === 'available' && (
                  <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow">Tersedia</span>
                )}
                {mobil.status === 'rented' && (
                  <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow">Disewa</span>
                )}
                {mobil.status === 'maintenance' && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold shadow">Perbaikan</span>
                )}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-1">{mobil.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(mobil.price)}
                      <span className="text-sm font-normal text-muted-foreground">/{mobil.period || 'hari'}</span>
                    </div>
                    {/* Kategori Badge */}
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm ml-2">
                      {mobil.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Settings className="w-4 h-4" />
                  <span>{mobil.specifications?.transmisi}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{mobil.specifications?.seats} orang</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Fuel className="w-4 h-4" />
                  <span>{mobil.specifications?.bahanBakar}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full btn-hero" asChild disabled={mobil.status !== 'available'}>
                  <a href={`https://wa.me/628123456789?text=Halo, saya tertarik untuk menyewa ${mobil.name} dengan harga ${formatCurrency(mobil.price)}/${mobil.period || 'hari'}`}>
                    Pesan Sekarang
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`/detail/${mobil.id}`} className="flex items-center justify-center space-x-2">
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
    {/* Logo Mobil Section */}
    <section className="bg-white py-10 px-4 rounded-xl mb-8 mt-20">
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
  </>
)}
      </div>
      <Footer />
    </div>
  );
}

export default KendaraanPage;