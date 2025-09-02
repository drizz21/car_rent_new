'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from "../../app/components/layout/Header";
import Footer from "../../app/components/layout/Footer";
import { FaCar, FaGasPump, FaCogs, FaDoorOpen, FaUsers, FaCheckCircle, FaWhatsapp, FaArrowRight, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { Button } from "../../app/components/ui/button";
import { Card, CardContent } from "../../app/components/ui/card";
import { Badge } from "../../app/components/ui/badge";

interface Car {
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

type Duration = '4 Jam' | '8 Jam' | '12 Jam' | '1 Hari' | '2 Hari' | '3 Hari' | '4 Hari';
type RentalType = 'Lepas Kunci' | 'Mobil + Supir';

const DetailCar = () => {
  const params = useParams();
  const id = params.id;
  const [car, setCar] = useState<Car | null>(null);
  const [otherCars, setOtherCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState<Duration>('1 Hari');
  const [rentalType, setRentalType] = useState<RentalType>('Lepas Kunci');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculatePrice = () => {
    if (!car) return 0;
    
    let price = 0;
    const dailyPrice = car.price; // Harga per hari dari database
    
    switch (duration) {
      case '4 Jam':
        price = dailyPrice * 0.25; // 25% dari harga harian
        break;
      case '8 Jam':
        price = dailyPrice * 0.5; // 50% dari harga harian
        break;
      case '12 Jam':
        price = dailyPrice * 0.75; // 75% dari harga harian
        break;
      case '1 Hari':
        price = dailyPrice;
        break;
      case '2 Hari':
        price = dailyPrice * 2;
        break;
      case '3 Hari':
        price = dailyPrice * 3;
        break;
      case '4 Hari':
        price = dailyPrice * 4;
        break;
      default:
        price = dailyPrice;
    }
    
    // Diskon 20% untuk layanan dengan supir
    if (rentalType === 'Mobil + Supir') {
      price = price * 0.8;
    }
    
    return Math.round(price);
  };

  useEffect(() => {
    if (car) {
      const price = calculatePrice();
      setCalculatedPrice(price);
    }
  }, [car, duration, rentalType]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) throw new Error('Failed to fetch cars');
        const data = await response.json();
        const carData = data.find((item: Car) => item.id === parseInt(id as string));
        if (carData) {
          setCar(carData);
          setCalculatedPrice(carData.price);
        } else {
          setCar(null);
        }
      } catch (error) {
        console.error('Gagal fetch mobil:', error);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCar();
  }, [id]);

  useEffect(() => {
    const fetchOtherCars = async () => {
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) throw new Error('Failed to fetch cars');
        const data = await response.json();
        const filtered = data
          .filter((item: Car) => item.id !== parseInt(id as string) && item.status === 'Tersedia')
          .slice(0, 6);
        setOtherCars(filtered);
      } catch (error) {
        console.error('Gagal fetch semua mobil:', error);
      }
    };

    if (id) fetchOtherCars();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail mobil...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaCar className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Mobil tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-8 md:h-22" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <FaArrowRight className="text-xs" />
          <Link href="/kendaraan" className="hover:text-blue-600">Kendaraan</Link>
          <FaArrowRight className="text-xs" />
          <span className="text-gray-900 font-medium">{car.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {car.type}
                    </Badge>
                    <Badge className={`${
                      car.status === 'Tersedia' ? 'bg-green-500 text-white' :
                      car.status === 'rented' ? 'bg-orange-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {car.status === 'Tersedia' ? 'Tersedia' :
                       car.status === 'rented' ? 'Disewa' : 'Maintenance'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Harga Dasar</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(car.price)}
                  </div>
                  <div className="text-sm text-gray-500">/ hari</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-80 md:h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Image
                  src={car.mainImage}
                  alt={car.name}
                  width={600}
                  height={400}
                  className="object-contain w-full h-full p-6"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <FaCogs className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Spesifikasi Unit</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <FaCogs className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Transmisi</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{car.specifications.transmisi}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <FaGasPump className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Bahan Bakar</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{car.specifications.bahanBakar}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <FaDoorOpen className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Pintu</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{car.specifications.pintu}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <FaUsers className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Penumpang</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{car.specifications.seats} orang</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">AC</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{car.specifications.airConditioner}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Kelengkapan Unit</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {car.features.primary.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-2">
                      <FaCheckCircle className="text-green-500 text-sm" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {car.features.secondary.map((feature, idx) => (
                    <div key={`secondary-${idx}`} className="flex items-center gap-3 py-2">
                      <FaCheckCircle className="text-green-500 text-sm" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Syarat Menyewa */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Syarat Menyewa Kendaraan</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Dokumen yang Diperlukan:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      KTP/SIM yang masih berlaku
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      Kartu Keluarga (KK)
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      Bukti alamat (tagihan listrik/air)
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Ketentuan Sewa:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      Minimal usia 21 tahun
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      Deposit sesuai ketentuan
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      Pengembalian sesuai jadwal
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi Kendaraan</h3>
              <p className="text-gray-600 leading-relaxed">{car.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h3 className="text-xl font-bold text-center flex items-center justify-center gap-2">
                  <FaClock className="text-xl" />
                  Pilih Durasi Sewa
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Durasi Sewa</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {(['4 Jam', '8 Jam', '12 Jam', '1 Hari', '2 Hari', '3 Hari', '4 Hari'] as Duration[]).map((dur) => (
                      <button 
                        key={dur}
                        onClick={() => setDuration(dur)}
                        className={`py-3 px-2 rounded-lg transition-all text-sm font-medium border-2 ${
                          duration === dur 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Jenis Layanan</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setRentalType('Lepas Kunci')}
                      className={`w-full p-4 rounded-lg transition-all text-left border-2 ${
                        rentalType === 'Lepas Kunci' 
                          ? 'bg-blue-50 text-blue-900 border-blue-200' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Lepas Kunci</div>
                      <div className="text-sm opacity-75">Hanya mobil tanpa supir</div>
                    </button>
                    
                    <button 
                      onClick={() => setRentalType('Mobil + Supir')}
                      className={`w-full p-4 rounded-lg transition-all text-left border-2 ${
                        rentalType === 'Mobil + Supir' 
                          ? 'bg-blue-50 text-blue-900 border-blue-200' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Mobil + Supir</div>
                      <div className="text-sm opacity-75">Diskon 20% dari total harga</div>
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-sm text-gray-600">Total Harga:</div>
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(calculatedPrice)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Untuk</div>
                        <div className="font-semibold text-gray-900">{duration}</div>
                        <div className="text-sm text-gray-600">{rentalType}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>* Harga dasar: {formatCurrency(car.price)}/hari</div>
                      {duration.includes('Jam') && (
                        <div>* Harga per jam: {formatCurrency(Math.round(car.price / 24))}/jam</div>
                      )}
                      {rentalType === 'Mobil + Supir' && (
                        <div>* Diskon 20% untuk layanan dengan supir</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all duration-300"
            >
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20ingin%20sewa%20${encodeURIComponent(car.name)}%0A%0AJenis%20Layanan%3A%20${encodeURIComponent(rentalType)}%0ADurasi%3A%20${encodeURIComponent(duration)}%0A%0AHarga%3A%20${encodeURIComponent(formatCurrency(calculatedPrice))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3"
              >
                <FaWhatsapp className="text-2xl" />
                Pesan Sekarang
              </a>
            </Button>
          </div>
        </div>
      </div>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Kendaraan Tersedia Lainnya</h2>
            <Link href="/kendaraan" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2">
              Lihat Semua
              <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCars.map((item) => (
              <Card key={item.id} className="group card-hover border-border/50 overflow-hidden">
                <div className="relative">
                  <Image
                    src={item.mainImage}
                    alt={item.name}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white text-xs font-bold shadow">
                      Tersedia
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-1">{item.name}</h3>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(item.price)}
                        <span className="text-sm font-normal text-muted-foreground">/hari</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <FaCogs className="w-4 h-4" />
                      <span>{item.specifications.transmisi}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <FaUsers className="w-4 h-4" />
                      <span>{item.specifications.seats} orang</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <FaGasPump className="w-4 h-4" />
                      <span>{item.specifications.bahanBakar}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/detail/${item.id}`} className="flex items-center justify-center space-x-2">
                      <span>Lihat Detail</span>
                      <FaArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default DetailCar;