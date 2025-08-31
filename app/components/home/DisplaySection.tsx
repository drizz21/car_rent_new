import { Car, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from "../ui/button";

const DisplaySection = () => {
  const features = [
    'Mudah Di Akses',
    'Proses Cepat',
    'Harga Terjangkau'
  ];

  return (
    <section className="relative py-30 sm:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background Container with Image Only */}
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(/images/mobil-display.png)` }}
      >
        {/* Main Content Container */}
        <div className="relative z-10">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="px-8 xl:px-16 py-16">
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8">
            {/* Main Heading */}
            <h1 className="text-4xl xl:text-6xl font-bold leading-tight text-white drop-shadow-lg">
            Nikmati Mudahnya
            <span className="block text-secondary">Sewa Kendaraan</span>
            <span className="block">di Sorong</span>
            </h1>
            {/* Subtitle */}
            <p className="text-lg xl:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Rental mobil terpercaya dengan armada lengkap, pelayanan prima, 
            dan proses booking yang mudah untuk perjalanan nyaman Anda
            </p>
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
            {features.map((feature, index) => (
              <div
              key={feature}
              className="flex items-center space-x-2 bg-background/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-background/30 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.2}s` }}
              >
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-400 text-white border-none px-8 py-4 text-lg"
              asChild
            >
              <a href="https://wa.me/628123456789" className="flex items-center space-x-2">
              <span>Pesan Sekarang</span>
              <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-background/20 backdrop-blur-sm border-background/30 text-white hover:bg-background/30 px-8 py-4 text-lg"
              asChild
            >
              <a href="/kendaraan" className="flex items-center space-x-2">
              <Car className="w-5 h-5" />
              <span>Lihat Kendaraan</span>
              </a>
            </Button>
            </div>
            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-background/30">
            <p className="text-white/80 text-sm mb-4">
              Dipercaya oleh ribuan pelanggan
            </p>
            <div className="flex justify-center items-center space-x-8 text-white/70">
              <div className="text-center">
              <div className="text-2xl font-bold text-secondary">10.000+</div>
              <div className="text-sm">Pelanggan Puas</div>
              </div>
              <div className="w-px h-12 bg-background/30"></div>
              <div className="text-center">
              <div className="text-2xl font-bold text-secondary">15+</div>
              <div className="text-sm">Unit Kendaraan</div>
              </div>
              <div className="w-px h-12 bg-background/30"></div>
              <div className="text-center">
              <div className="text-2xl font-bold text-secondary">20+</div>
              <div className="text-sm">Tahun Pengalaman</div>
              </div>
            </div>
            </div>
          </div>
          </div>
        </div>
        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden">
          <div className="px-4 py-10 text-center">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4 leading-tight">
            Nikmati Mudahnya
            <span className="block text-secondary">Sewa Kendaraan</span>
            <span className="block">di Sorong</span>
          </h1>
          {/* Subtitle */}
          <p className="text-base md:text-lg text-white/90 mb-6 max-w-xl mx-auto leading-relaxed">
            Rental mobil terpercaya dengan armada lengkap, pelayanan prima, 
            dan proses booking yang mudah untuk perjalanan nyaman Anda
          </p>
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {features.map((feature, index) => (
            <div
              key={feature}
              className="flex items-center space-x-2 bg-background/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-background/30 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CheckCircle className="w-4 h-4 text-secondary" />
              <span className="text-white text-sm font-medium">{feature}</span>
            </div>
            ))}
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 justify-center items-center animate-scale-in">
            <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-400 text-white border-none px-6 py-3 text-base"
            asChild
            >
            <a href="https://wa.me/628123456789" className="flex items-center space-x-2">
              <span>Pesan Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            </Button>
            <Button
            variant="outline"
            size="lg"
            className="bg-background/20 backdrop-blur-sm border-background/30 text-white hover:bg-background/30 px-6 py-3 text-base"
            asChild
            >
            <a href="/kendaraan" className="flex items-center space-x-2">
              <Car className="w-5 h-5" />
              <span>Lihat Kendaraan</span>
            </a>
            </Button>
          </div>
          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-background/30">
            <p className="text-white/80 text-xs mb-3">
            Dipercaya oleh ribuan pelanggan
            </p>
            <div className="flex justify-center items-center space-x-6 text-white/70">
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">10.000+</div>
              <div className="text-xs">Pelanggan Puas</div>
            </div>
            <div className="w-px h-8 bg-background/30"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">15+</div>
              <div className="text-xs">Unit Kendaraan</div>
            </div>
            <div className="w-px h-8 bg-background/30"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">20+</div>
              <div className="text-xs">Tahun Pengalaman</div>
            </div>
            </div>
          </div>
          </div>
        </div>
        
  {/* Overlay dihapus agar warna asli gambar tampil */}
      </div>
      </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-background/30 rounded-full p-1">
          <div className="w-1 h-3 bg-background/60 rounded-full mx-auto animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default DisplaySection;