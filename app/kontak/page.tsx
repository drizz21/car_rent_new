"use client"

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import Image from 'next/image';
import Header from "../components/layout/Header";


export default function KontakPage() {
  const kontakInfo = [
    { icon: Phone, title: 'Telepon', info: '+62 812-3456-7890', description: 'Hubungi kami kapan saja, layanan 24/7' },
    { icon: Mail, title: 'Email', info: 'info@rinorental.com', description: 'Kirim pertanyaan atau permintaan penawaran' },
    { icon: MapPin, title: 'Alamat', info: 'Jl. Basuki Rahmat No. 123, Sorong', description: 'Kunjungi kantor kami untuk konsultasi langsung' },
    { icon: Clock, title: 'Jam Operasional', info: '24 Jam / 7 Hari', description: 'Siap melayani Anda kapan saja' }
  ];

  const team = [
    { name: "Rino Saputra", role: "Founder & CEO", image: "/professional-indonesian-man-business-suit-ceo.png", description: "Memimpin Rino Rental dengan visi memberikan layanan rental terbaik di Sorong" },
    { name: "Adit", role: "Operations Manager", image: "/professional-indonesian-woman-business-attire-manager.png", description: "Mengawasi operasional harian dan memastikan kualitas layanan tetap prima" },
    { name: "Ahmad Fauzi", role: "Fleet Manager", image: "/professional-indonesian-man-mechanic-uniform-fleet.png", description: "Bertanggung jawab atas perawatan dan kondisi seluruh armada kendaraan" },
  ];

  return (
    <>
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Kami siap membantu Anda dengan kebutuhan rental mobil</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {kontakInfo.map((item, index) => (
              <motion.div
                key={index}
                className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-indigo-600 font-medium mb-2">{item.info}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Informasi Tambahan</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Layanan WhatsApp</h4>
                  <p className="text-gray-600">Untuk kemudahan, Anda dapat langsung menghubungi kami melalui WhatsApp di nomor +62 812-3456-7890. Admin kami akan merespon dengan cepat.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reservasi Online</h4>
                  <p className="text-gray-600">Lakukan reservasi secara online melalui WhatsApp atau datang langsung ke kantor kami. Kami akan memproses permintaan Anda dengan cepat.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Layanan Darurat</h4>
                  <p className="text-gray-600">Kami menyediakan layanan darurat 24/7 untuk customer yang sedang dalam perjalanan dan mengalami kendala dengan kendaraan rental.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-center items-center mb-16">
                <Image
                  src="/images/contact-us/display-contactUs.png"
                  width={900}
                  height={600}
                  alt="Contact Us"
                  className="w-full h-auto object-cover max-w-3xl"
                />
              </div>
            </div>
          </div>
        </div>

        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Tim Profesional</Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Bertemu Tim Kami</h2>
              <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
                Orang-orang berpengalaman yang berkomitmen memberikan pelayanan terbaik untuk Anda
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3 justify-items-center">
              {team.map((member, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-shadow mx-auto w-full max-w-xs">
                  <CardContent className="p-6 flex flex-col items-center">
                  <div className="aspect-square w-32 mb-4 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                    <Image
                    src={
                      [
                      "/images/owner/owner.png",
                      "/images/owner/admin.png",
                      "/images/owner/supir.png"
                      ][index]
                    }
                    alt={member.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <Badge variant="outline" className="mb-3">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}