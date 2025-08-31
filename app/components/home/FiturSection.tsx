import { MapPin, Clock, Shield, Star, Users, Car } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Mudah Di Akses',
      description: 'Lokasi strategis di pusat kota Sorong dengan akses mudah dari berbagai tempat',
      color: 'text-primary'
    },
    {
      icon: Clock,
      title: 'Proses Cepat',
      description: 'Booking online dalam hitungan menit, konfirmasi langsung via WhatsApp',
      color: 'text-secondary'
    },
    {
      icon: Shield,
      title: 'Terjamin Aman',
      description: 'Semua kendaraan terawat dan asuransi lengkap untuk keamanan perjalanan',
      color: 'text-success'
    },
    {
      icon: Star,
      title: 'Layanan Prima',
      description: 'Tim customer service profesional siap membantu 24/7 untuk kepuasan Anda',
      color: 'text-warning'
    },
    {
      icon: Users,
      title: 'Driver Berpengalaman',
      description: 'Driver profesional dan berpengalaman yang mengenal medan Sorong dengan baik',
      color: 'text-primary'
    },
    {
      icon: Car,
      title: 'Armada Lengkap',
      description: 'Berbagai pilihan kendaraan dari city car hingga bus pariwisata untuk semua kebutuhan',
      color: 'text-secondary'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mengapa Memilih Rino Rental?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kami berkomitmen memberikan pelayanan terbaik dengan keunggulan yang 
            membuat perjalanan Anda lebih nyaman dan terpercaya
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card p-8 rounded-2xl card-hover border border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '10.000+', label: 'Pelanggan Puas', icon: Users },
            { number: '20+', label: 'Unit Kendaraan', icon: Car },
            { number: '100%', label: 'Kepuasan Pelanggan', icon: Star },
            { number: '24/7', label: 'Customer Service', icon: Clock },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;