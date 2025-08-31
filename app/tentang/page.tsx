"use client";

import Navbar from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent } from '../components/ui/card';
import { reviewPelanggan } from '../data/MockData';
import { motion } from 'framer-motion';
import { User, Star } from 'lucide-react';
import Image from 'next/image';


import { 

  ChevronDown, 
  ChevronUp, 
  Shield, 
  Clock, 
  Settings,
  Car,
  MapPin,
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    title: 'Brand Beragam',
    description: 'Di Rino Rental Mobil kami menyediakan berbagai mobil dan tipe dari berbagai jenis brand yang ada.',
    icon: <Car className="w-6 h-6" />
  },
  {
    title: 'Layanan 24/7',
    description: 'Kami siap melayani Anda kapan saja, dengan layanan pelanggan yang tersedia 24 jam sehari, 7 hari seminggu untuk memenuhi kebutuhan anda.',
    icon: <Clock className="w-6 h-6" />
  },
  {
    title: 'Dukungan Teknis',
    description: 'Tim kami selalu siap memberikan dukungan teknis jika terjadi masalah selama Anda menggunakan kendaraan dari kami, demi kenyamanan maksimal.',
    icon: <Settings className="w-6 h-6" />
  },
  {
    title: 'Asuransi Kendaraan',
    description: 'Semua kendaraan kami dilengkapi dengan asuransi, memberikan Anda rasa tenang selama berkendara.',
    icon: <Shield className="w-6 h-6" />
  }
];


export default function Tentang() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div />
      {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Teman terbaikmu di <br className="hidden md:block" /> 
                <span className="text-blue-600">setiap perjalananmu</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Memberikan layanan rental mobil terpercaya dengan komitmen kualitas dan kepuasan pelanggan
              </p>
              
              {/* Address Info */}
              <div className="flex items-start space-x-3 pt-4">
                <MapPin className="text-blue-600 w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Lokasi Kami</p>
                  <p className="text-gray-600">
                    Jl. Jend. Basuki Rahmat, Klabulu, Malaimsimsa, Kota Sorong, Papua Barat 98414
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                      {feature.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Maps - Menggunakan iframe dengan marker merah */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.290146966411!2d131.262165!3d-0.866302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d5c2a05b0b8b0a1%3A0x6d8f1e5b3e5e5b1f!2sRino%20Rental%20Mobil%20Sorong!5e0!3m2!1sen!2sid!4v1717130000000!5m2!1sen!2sid&markers=color:red%7Clabel:R%7C-0.866302,131.262165"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              ></iframe>
              
              {/* Marker indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <div className="mt-1 bg-white px-2 py-1 rounded shadow-md text-xs font-semibold text-red-600">
                    Rino Rental
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                <MapPin className="inline-block w-4 h-4 mr-1 text-red-500" />
                Rino Rental Mobil Sorong - Jl. Jend. Basuki Rahmat, Klabulu, Malalmsimsa
              </p>
              <a 
                href="https://maps.app.goo.gl/suSpmm6QPqx3GZm48" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm flex items-center"
              >
                Buka di Google Maps
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Kata Mereka Tentang Kami
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Kepuasan pelanggan adalah prioritas utama kami
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.18
          }
        }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviewPelanggan.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: index * 0.18, type: "spring", bounce: 0.3 }}
          viewport={{ once: true }}
          className="flex"
        >
          <Card className="h-full w-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{review.nama}</h4>
              <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
              i < review.rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
                }`}
              />
            ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed italic">
            "{review.komentar}"
          </p>
            </CardContent>
          </Card>
        </motion.div>
          ))}
        </motion.div>
      </section>


      {/* FAQ Section */}
      <section className="bg-white py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-black">Pertanyaan Umum Pelanggan</h2>
        {[
          {
            question: "Apa saja persyaratan untuk menyewa mobil?",
            answer:
              "Anda memerlukan KTP/SIM A yang masih berlaku, dan beberapa syarat tambahan seperti NPWP atau bukti alamat. Usia minimum penyewa umumnya 21 tahun.",
          },
          {
            question: "Berapa lama minimal dan maksimal durasi penyewaan mobil?",
            answer:
              "Durasi penyewaan minimal adalah 6 jam dan maksimal bisa sampai 30 hari, tergantung jenis mobil dan paket yang dipilih.",
          },
          {
            question: "Apakah ada batasan jarak tempuh (kilometer) selama masa sewa?",
            answer:
              "Beberapa paket memiliki batasan kilometer harian. Namun, kami juga menyediakan paket tanpa batasan km dengan tarif berbeda.",
          },
          {
            question: "Bagaimana prosedur jika terjadi kerusakan atau kecelakaan pada mobil selama masa sewa?",
            answer:
              "Silakan hubungi layanan darurat kami. Kami akan segera membantu proses evakuasi dan asuransi jika berlaku.",
          },
          {
            question: "Apakah saya bisa mengembalikan mobil di lokasi yang berbeda (drop-off)?",
            answer:
              "Bisa. Kami menyediakan layanan drop-off di lokasi yang berbeda dengan biaya tambahan sesuai jarak lokasi pengembalian.",
          },
        ].map((item, idx) => (
          <FAQItem key={idx} question={item.question} answer={item.answer} />
        ))}
      </section>

      {/* Call to Action Section */}
      <section className="bg-white py-12 px-4 rounded-xl mb-12">
        <div className="relative max-w-5xl mx-auto bg-violet-600 text-white rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 shadow-lg text-center">
          <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">Butuh Mobil?</h2>
        <p className="text-lg font-semibold mb-1">085244129181</p>
        <p className="text-sm mb-4">Hubungi kami sekarang!</p>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded-md font-medium hover:bg-yellow-300 transition">
          Pesan Sekarang
        </button>
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-1/2 z-0">
        <Image
          src="/images/mobil-display.png"
          alt="Mobil"
          width={600}
          height={400}
          className="object-cover opacity-30 w-full h-full"
        />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}


// Komponen FAQ Accordion
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-300 rounded-xl p-4 mb-4 transition duration-200"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center cursor-pointer">
        <h3 className="font-semibold text-md text-black">{question}</h3>
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>
      {open && <p className="text-sm text-gray-600 mt-2">{answer}</p>}
    </div>
  );
}
