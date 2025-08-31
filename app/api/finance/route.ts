import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'http://localhost:5000';

export async function GET(req: NextRequest) {
  try {
    // Fetch data dari server backend
    const [carsRes, bookingsRes, expensesRes] = await Promise.all([
      fetch(`${API_URL}/cars`),
      fetch(`${API_URL}/bookings`),
      fetch(`${API_URL}/expenses`)
    ]);

    if (!carsRes.ok || !bookingsRes.ok || !expensesRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const cars = await carsRes.json();
    const bookings = await bookingsRes.json();
    const expenses = await expensesRes.json();

    // Hitung statistik yang akurat sesuai dengan fitur lainnya
    const totalCars = cars.length;
    const availableCars = cars.filter((car: any) => car.status === 'available').length;
    const rentedCars = cars.filter((car: any) => car.status === 'rented').length;
    const maintenanceCars = cars.filter((car: any) => car.status === 'maintenance').length;
    
    // Hitung total pendapatan dari booking yang selesai dengan durasi
    const completedBookings = bookings.data?.filter((booking: any) => 
      booking.status?.toLowerCase() === 'selesai' || 
      booking.status?.toLowerCase() === 'completed'
    ) || [];
    
    const totalRevenue = completedBookings.reduce((total: number, booking: any) => {
      const car = cars.find((c: any) => c.name === booking.unit);
      if (car && car.price) {
        // Hitung durasi sewa
        const startDate = new Date(booking.start_date);
        const endDate = new Date(booking.end_date);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        
        let totalPrice = car.price * diffDays;
        
        // Apply 20% discount if jenis includes "sopir"
        if (booking.jenis && booking.jenis.toLowerCase().includes('sopir')) {
          totalPrice = totalPrice * 0.8;
        }
        
        return total + totalPrice;
      }
      return total;
    }, 0);

    // Hitung total pengeluaran
    const totalExpenses = expenses.data?.reduce((total: number, expense: any) => {
      return total + (expense.amount ? parseFloat(expense.amount) : 0);
    }, 0) || 0;

    // Hitung profit
    const totalProfit = totalRevenue - totalExpenses;

    // Generate data keuangan 6 bulan terakhir
    const monthlyFinance = generateMonthlyFinance(bookings.data || [], expenses.data || [], cars);
    
    return NextResponse.json({
      success: true,
      data: {
        statistics: {
          totalCars,
          availableCars,
          rentedCars,
          maintenanceCars,
          totalBookings: bookings.data?.length || 0,
          totalRevenue,
          totalExpenses,
          totalProfit
        },
        chartData: monthlyFinance
      }
    });

  } catch (err) {
    console.error('Finance API Error:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal mengambil data keuangan', 
      error: String(err) 
    }, { status: 500 });
  }
}

function generateMonthlyFinance(bookings: any[], expenses: any[], cars: any[]) {
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
    
    // Hitung pendapatan untuk bulan ini dengan durasi
    const monthRevenue = monthBookings.reduce((total: number, booking: any) => {
      if (booking.status?.toLowerCase() === 'selesai' || 
          booking.status?.toLowerCase() === 'completed') {
        const car = cars.find((c: any) => c.name === booking.unit);
        if (car && car.price) {
          // Hitung durasi sewa
          const startDate = new Date(booking.start_date);
          const endDate = new Date(booking.end_date);
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          
          let totalPrice = car.price * diffDays;
          
          // Apply 20% discount if jenis includes "sopir"
          if (booking.jenis && booking.jenis.toLowerCase().includes('sopir')) {
            totalPrice = totalPrice * 0.8;
          }
          
          return total + totalPrice;
        }
      }
      return total;
    }, 0);
    
    // Filter pengeluaran untuk bulan ini
    const monthExpenses = expenses.filter((expense: any) => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear();
    });
    
    // Hitung pengeluaran untuk bulan ini
    const monthExpense = monthExpenses.reduce((total: number, expense: any) => {
      return total + (expense.amount ? parseFloat(expense.amount) : 0);
    }, 0);
    
    // Hitung profit untuk bulan ini
    const monthProfit = monthRevenue - monthExpense;
    
    months.push({
      month: monthName,
      pemasukan: monthRevenue,
      pengeluaran: monthExpense,
      profit: monthProfit
    });
  }
  
  return months;
} 