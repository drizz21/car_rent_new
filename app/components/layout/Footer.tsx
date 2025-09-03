import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageSquare } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <a href="#" className="flex items-center space-x-2">
              <Image
                src="/logo-rino.svg"
                alt="Rino Rental Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg"
              />
              <div className="hidden sm:block">
                <span className="text-2xl font-extrabold text-gradient bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent tracking-tight">
                  Rino Rental
                </span>
                <span className="text-xs font-medium text-orange-700/70 block leading-none mt-1 uppercase tracking-wider">
                  Sorong
                </span>
              </div>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Solusi terpercaya untuk kebutuhan rental mobil di Sorong. Armada lengkap, 
              pelayanan prima, dan harga terjangkau untuk perjalanan yang nyaman.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigasi</h3>
            <ul className="space-y-2">
              {[
                { name: 'Beranda', href: '/' },
                { name: 'Kendaraan', href: '/kendaraan' },
                { name: 'Galeri', href: '/galeri' },
                { name: 'Tentang Kami', href: '/tentang' },
                { name: 'Kontak', href: '/kontak' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm page-link"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 text-secondary" />
                <span className="text-black/70 text-sm font-normal">
                  Jl. Basuki Rahmat No. 123<br />
                  Sorong, Papua Barat 98411
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary" />
                <a
                  href="tel:+6285244129181"
                  className="text-black/70 hover:text-black transition-colors text-sm font-normal"
                >
                  +62 812-3456-789
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-secondary" />
                <a
                  href="mailto:info@rinorental.com"
                  className="text-black/70 hover:text-black transition-colors text-sm font-normal"
                >
                  info@rinorental.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-4 h-4 mt-0.5 text-secondary" />
                <span className="text-black/70 text-sm font-normal">
                  Senin - Minggu<br />
                  08:00 - 20:00 WITA
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media & CTA */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Ikuti Kami</h3>
            <div className="flex space-x-3 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/6285244129181"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:text-secondary transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
            <a
              href="https://wa.me/6285244129181"
              className="inline-flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Rino Rental Sorong. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;