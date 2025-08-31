"user client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
/**
 * Section fasilitas yang tersedia
 * Menampilkan daftar fasilitas yang diberikan kepada pelanggan
 */
function FasilitasSection() {
  const fasilitas = [
    'Kendaraan terawat dan bersih',
    'Dokumen lengkap (STNK, Asuransi)',
    'BBM penuh saat penyerahan',
    'Driver berpengalaman (optional)',
    'Layanan antar jemput gratis',
    'Customer service 24/7',
    'Harga transparan tanpa biaya tersembunyi',
    'Proses rental yang cepat dan mudah'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            >
            <Image
              src="/images/display-home-2/display-2.png"
              alt="Fasilitas Rino Rental"
              width={400}
              height={300}
              className="rounded-lg shadow-lg w-full h-auto"
            />
            </motion.div>

          <div>
            <h3 className="text-2xl font-bold mb-2">Fasilitas Lengkap</h3>
            <p className="text-gray-600 mb-6">
              Kami menyediakan berbagai fasilitas untuk kenyamanan dan keamanan perjalanan Anda
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {fasilitas.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-800">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FasilitasSection;