import { MessageSquare, Phone, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button'

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 gradient-primary"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary-foreground/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-primary-foreground/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-foreground/10 rounded-lg rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary-foreground/10 rounded-lg rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Siap Memulai Perjalanan Anda?
          </h2>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed">
            Hubungi kami sekarang untuk booking kendaraan impian Anda. 
            Tim customer service kami siap membantu 24/7
          </p>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            <div className="stats-card">
              <Phone className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Telepon Langsung</h3>
              <p className="text-primary-foreground/80 mb-4">
                Hubungi langsung untuk konsultasi dan booking
              </p>
              <Button
                variant="outline"
                className="bg-background/20 backdrop-blur-sm border-background/30 text-primary-foreground hover:bg-background/30"
                asChild
              >
                <a href="tel:+6285244129181" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+62 852-4412-9181</span>
                </a>
              </Button>
            </div>

            <div className="stats-card">
              <MessageSquare className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chat WhatsApp</h3>
              <p className="text-primary-foreground/80 mb-4">
                Chat langsung untuk respon cepat dan mudah
              </p>
              <Button
                className="btn-hero-secondary"
                asChild
              >
                <a href="https://wa.me/6285244129181" className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Sekarang</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Main CTA */}
          <div className="space-y-6">
            <p className="text-lg text-primary-foreground/80">
              Atau langsung booking kendaraan pilihan Anda
            </p>
            <Button
              size="lg"
              className="btn-hero-secondary px-12 py-4 text-lg"
              asChild
            >
              <a href="/kendaraan" className="flex items-center space-x-2">
                <span>Pilih Kendaraan</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-primary-foreground/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-primary-foreground/80">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Respon dalam 5 menit</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Gratis konsultasi</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Booking 24 jam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;