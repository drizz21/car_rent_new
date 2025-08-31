"use client";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Next.js: gunakan usePathname agar Link bekerja tanpa reload
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Kendaraan', href: '/kendaraan' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Tentang Kami', href: '/tentang' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+628123456789" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Hubungi</span>
              </a>
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-400 text-white border-none"
              size="sm"
              asChild
            >
              <a href="https://wa.me/628123456789" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Pesan Sekarang</span>
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push(item.href);
                  }}
                  type="button"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href="tel:+628123456789" className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Hubungi Kami</span>
                  </a>
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-400 text-white border-none w-full" asChild>
                  <a href="https://wa.me/628123456789" className="flex items-center justify-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Pesan Sekarang</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;