import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'http://localhost:5000';

export async function GET(req: NextRequest) {
  try {
    // Fetch data dari server backend
    const [carsRes, bookingsRes] = await Promise.all([
      fetch(`${API_URL}/cars`),
      fetch(`${API_URL}/bookings`)
    ]);

    if (!carsRes.ok || !bookingsRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const cars = await carsRes.json();
    const bookings = await bookingsRes.json();

    // Hitung statistik yang akurat
    const totalCars = cars.length;
    const availableCars = cars.filter((car: any) => car.availability === true || car.availability === 1).length;
    const rentedCars = totalCars - availableCars;
    
    // Hitung total pendapatan dari booking yang selesai
    const completedBookings = bookings.data?.filter((booking: any) => 
      booking.status?.toLowerCase() === 'selesai' || 
      booking.status?.toLowerCase() === 'completed'
    ) || [];
    
    const totalRevenue = completedBookings.reduce((total: number, booking: any) => {
      const car = cars.find((c: any) => c.name === booking.unit);
      if (car && car.price) {
        return total + parseFloat(car.price);
      }
      return total;
    }, 0);

    // Generate data pendapatan 6 bulan terakhir
    const monthlyRevenue = generateMonthlyRevenue(bookings.data || [], cars);
    
    // Data untuk chart
    const chartData = monthlyRevenue.map((item, index) => ({
      month: item.month,
      revenue: item.revenue,
      bookings: item.bookings,
      color: getChartColor(index)
    }));

    return NextResponse.json({
      success: true,
      data: {
        statistics: {
          totalCars,
          availableCars,
          rentedCars,
          totalBookings: bookings.data?.length || 0,
          totalRevenue
        },
        chartData
      }
    });

  } catch (err) {
    console.error('Dashboard API Error:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal mengambil data dashboard', 
      error: String(err) 
    }, { status: 500 });
  }
}

function generateMonthlyRevenue(bookings: any[], cars: any[]) {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
    
    // Filter booking untuk bulan ini
    const monthBookings = bookings.filter((booking: any) => {
      if (!booking.created_at) return false;
      const bookingDate = new Date(booking.created_at);
      return bookingDate.getMonth() === date.getMonth() && 
             bookingDate.getFullYear() === date.getFullYear();
    });
    
    // Hitung pendapatan untuk bulan ini
    const monthRevenue = monthBookings.reduce((total: number, booking: any) => {
      if (booking.status?.toLowerCase() === 'selesai' || 
          booking.status?.toLowerCase() === 'completed') {
        const car = cars.find((c: any) => c.name === booking.unit);
        if (car && car.price) {
          return total + parseFloat(car.price);
        }
      }
      return total;
    }, 0);
    
    months.push({
      month: monthName,
      revenue: monthRevenue,
      bookings: monthBookings.length
    });
  }
  
  return months;
}

function getChartColor(index: number): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4'  // Cyan
  ];
  return colors[index % colors.length];
} 