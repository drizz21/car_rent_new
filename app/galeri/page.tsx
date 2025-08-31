import React from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const galleryImages = [
  '/images/galeri-rent/foto-1.png',
  '/images/galeri-rent/foto-2.png',
  '/images/galeri-rent/foto-3.png',
  '/images/galeri-rent/foto-4.png',
  '/images/galeri-rent/foto-5.png',
  '/images/galeri-rent/foto-6.png',
  '/images/galeri-rent/foto-7.png',
  '/images/galeri-rent/foto-8.png',
  '/images/galeri-rent/foto-9.png',
  '/images/galeri-rent/foto-10.png',
  '/images/galeri-rent/foto-11.png',
  '/images/galeri-rent/foto-12.png',
  '/images/galeri-rent/foto-13.png',
  '/images/galeri-rent/foto-14.png',
  '/images/galeri-rent/foto-15.png',
];

const visitorStats = [
  {
    title: 'Pengunjung Hari Ini',
    value: '23',
    icon: (
      <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    title: 'Total Pengunjung',
    value: '5.421',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-8 0v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    title: 'Rating Pengunjung',
    value: '4.9/5',
    icon: (
      <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  }
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Header Section */}
      <header className="w-full max-w-6xl mx-auto px-4 md:px-6 mt-24 mb-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Galeri Kami
          </h1>
          <p className="text-gray-600">
            Koleksi foto mobil rental terbaik kami
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 space-y-12">
        {/* Gallery Grid */}
        <section className="space-y-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((src, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={src} 
                    alt={`Galeri mobil rental ${index + 1}`} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
