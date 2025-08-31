// Memasukkan module yang diperlukan
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = 5000;

// Tambahkan middleware CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003'], // Izinkan akses dari frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Konfigurasi multer untuk file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Endpoint root untuk test server
app.get('/', (req, res) => {
  res.send('API Rental Mobil berjalan!');
});

// Menambahkan body parser untuk menerima data POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup koneksi MySQL dengan POOLING
const pool = require('./config/database');


// ==================== ENDPOINT UNTUK CARS ====================

// Endpoint untuk menambahkan mobil baru
app.post('/add-car', upload.single('mainImage'), (req, res) => {
  const { 
    name, 
    type, 
    price, 
    transmisi, 
    bahanBakar, 
    pintu, 
    airConditioner, 
    seats,  
    description, 
    status 
  } = req.body;
  const mainImage = req.file ? req.file.buffer : null;
  const query = `
    INSERT INTO cars 
    (name, type, price, transmisi, bahanBakar, pintu, airConditioner, seats, description, status, mainImage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  pool.query(query, 
    [
      name, 
      type, 
      parseFloat(price),
      transmisi, 
      bahanBakar, 
      parseInt(pintu),
      airConditioner, 
      parseInt(seats),
      description, 
      status,
      mainImage
    ], 
    (err, results) => {
      if (err) {
        console.error('Gagal menambahkan data mobil:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Terjadi kesalahan saat menambahkan mobil',
          error: err.message
        });
      }
      // Ambil data mobil terbaru setelah insert
      pool.query('SELECT * FROM cars ORDER BY id DESC', (err2, cars) => {
        if (err2) {
          return res.status(200).json({ 
            success: true,
            message: 'Data mobil berhasil ditambahkan, gagal mengambil data terbaru',
            carId: results.insertId
          });
        }
        const carsWithImages = cars.map(car => {
          if (car.mainImage) {
            return { ...car, mainImage: car.mainImage.toString('base64') };
          }
          return car;
        });
        res.status(200).json({ 
          success: true,
          message: 'Data mobil berhasil ditambahkan',
          carId: results.insertId,
          cars: carsWithImages
        });
      });
    }
  );
});

// Endpoint untuk mendapatkan semua mobil
app.get('/cars', (req, res) => {
  pool.query('SELECT * FROM cars', (err, results) => {
    if (err) {
      console.error('Gagal mengambil data mobil:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Terjadi kesalahan saat mengambil data mobil'
      });
    }

    const carsWithImages = results.map(car => {
      if (car.mainImage) {
        return {
          ...car,
          mainImage: car.mainImage.toString('base64')
        };
      }
      return car;
    });

    res.json(carsWithImages);
  });
});
// Endpoint untuk mendapatkan mobil berdasarkan ID
app.get('/cars/:id', (req, res) => {
  const carId = req.params.id;
  const query = 'SELECT * FROM cars WHERE id = ?';
  
  pool.query(query, [carId], (err, results) => {
    if (err) {
      console.error('Gagal mengambil data mobil:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Terjadi kesalahan saat mengambil data mobil'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Mobil tidak ditemukan'
      });
    }

    const car = results[0];
    // Konversi gambar ke base64 jika ada
    if (car.mainImage) {
      car.mainImage = car.mainImage.toString('base64');
    }

    res.json(car);
  });
});
// ==================== ENDPOINT UNTUK BOOKINGS ====================

// Endpoint untuk menambahkan booking baru
app.post('/bookings', (req, res) => {
  const { 
    customer_name, 
    unit, 
    jenis, 
    order_id, 
    start_date, 
    end_date, 
    status 
  } = req.body;

  // Validasi tanggal (tetap diperlukan untuk logika bisnis)
  if (start_date && end_date) {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format tanggal tidak valid'
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal selesai harus lebih besar dari tanggal mulai'
      });
    }
  }

  // Query untuk insert booking
  const query = `
    INSERT INTO bookings 
    (customer_name, unit, jenis, order_id, start_date, end_date, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  pool.query(query, 
    [customer_name, unit, jenis, order_id, start_date, end_date, status], 
    (err, results) => {
      if (err) {
        console.error('Gagal menambahkan booking:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ 
            success: false,
            message: 'Order ID sudah ada, gunakan Order ID yang berbeda'
          });
        }
        
        // ✅ PERBAIKAN: Handle semua error lainnya
        return res.status(500).json({ 
          success: false,
          message: 'Terjadi kesalahan saat menambahkan booking',
          error: err.message
        });
      }

      // ✅ Success response - hanya dijalankan jika tidak ada error
      res.status(201).json({ 
        success: true,
        message: 'Booking berhasil ditambahkan',
        id: results.insertId
      });
    }
  );
});

// Endpoint untuk mendapatkan semua bookings
app.get('/bookings', (req, res) => {
  const query = 'SELECT * FROM bookings ORDER BY created_at DESC';
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Gagal mengambil data booking:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Terjadi kesalahan saat mengambil data booking'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Endpoint untuk mendapatkan booking berdasarkan ID
app.get('/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const query = 'SELECT * FROM bookings WHERE id = ?';
  
  pool.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error('Gagal mengambil data booking:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Terjadi kesalahan saat mengambil data booking'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Endpoint untuk mengupdate booking
app.put('/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const { 
    customer_name, 
    unit, 
    jenis, 
    order_id, 
    start_date, 
    end_date, 
    status 
  } = req.body;

  const query = `
    UPDATE bookings 
    SET customer_name = ?, unit = ?, jenis = ?, order_id = ?, 
        start_date = ?, end_date = ?, status = ?, updated_at = NOW()
    WHERE id = ?
  `;

  pool.query(query, 
    [customer_name, unit, jenis, order_id, start_date, end_date, status, bookingId], 
    (err, results) => {
      if (err) {
        console.error('Gagal mengupdate booking:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ 
            success: false,
            message: 'Order ID sudah ada, gunakan Order ID yang berbeda'
          });
        }
        return res.status(500).json({ 
          success: false,
          message: 'Terjadi kesalahan saat mengupdate booking',
          error: err.message
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Booking tidak ditemukan'
        });
      }

      res.status(200).json({ 
        success: true,
        message: 'Booking berhasil diupdate'
      });
    }
  );
});

// Endpoint untuk menghapus booking
app.delete('/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const query = 'DELETE FROM bookings WHERE id = ?';
  
  pool.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error('Gagal menghapus booking:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Terjadi kesalahan saat menghapus booking'
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Booking berhasil dihapus'
    });
  });
});
// ==================== ENDPOINT UNTUK EXPENSES ====================

// Endpoint untuk menambahkan pengeluaran baru
app.post('/expenses', (req, res) => {
  console.log('Endpoint /expenses dipanggil (POST)');
  const { description, amount, category, date } = req.body;

  // Validasi input
  if (!description || !amount || !category || !date) {
    return res.status(400).json({
      success: false,
      message: 'Semua field harus diisi'
    });
  }

  const amountFloat = parseFloat(amount);
  if (isNaN(amountFloat) || amountFloat <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Jumlah harus berupa angka positif'
    });
  }

  // Validasi format tanggal
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Format tanggal tidak valid'
    });
  }

  const query = `
    INSERT INTO expenses (description, amount, category, date, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  pool.query(query, [description, amountFloat, category, date], (err, results) => {
    if (err) {
      console.error('Gagal menambahkan pengeluaran:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menambahkan pengeluaran',
        error: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Pengeluaran berhasil ditambahkan',
      id: results.insertId
    });
  });
});

// Endpoint untuk mendapatkan semua pengeluaran
app.get('/expenses', (req, res) => {
  console.log('Endpoint /expenses dipanggil (GET all)');
  const query = 'SELECT * FROM expenses ORDER BY date DESC, created_at DESC';
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Gagal mengambil data pengeluaran:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data pengeluaran'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Endpoint untuk mendapatkan pengeluaran berdasarkan ID
app.get('/expenses/:id', (req, res) => {
  console.log(`Endpoint /expenses/${req.params.id} dipanggil (GET by ID)`);
  const expenseId = req.params.id;
  const query = 'SELECT * FROM expenses WHERE id = ?';
  
  pool.query(query, [expenseId], (err, results) => {
    if (err) {
      console.error('Gagal mengambil data pengeluaran:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data pengeluaran'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengeluaran tidak ditemukan'
      });
    }

    res.json({
  success: true,
  data: results, // results di sini bisa berupa array atau objek
});

  });
});

// Endpoint untuk mengupdate pengeluaran
app.put('/expenses/:id', (req, res) => {
  console.log(`Endpoint /expenses/${req.params.id} dipanggil (PUT)`);
  const expenseId = req.params.id;
  const { description, amount, category, date } = req.body;

  // Validasi input
  if (!description || !amount || !category || !date) {
    return res.status(400).json({
      success: false,
      message: 'Semua field harus diisi'
    });
  }

  const amountFloat = parseFloat(amount);
  if (isNaN(amountFloat) || amountFloat <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Jumlah harus berupa angka positif'
    });
  }

  // Validasi format tanggal
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Format tanggal tidak valid'
    });
  }

  const query = `
    UPDATE expenses 
    SET description = ?, amount = ?, category = ?, date = ?, updated_at = NOW()
    WHERE id = ?
  `;

  pool.query(query, [description, amountFloat, category, date, expenseId], (err, results) => {
    if (err) {
      console.error('Gagal mengupdate pengeluaran:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengupdate pengeluaran',
        error: err.message
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengeluaran tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pengeluaran berhasil diupdate'
    });
  });
});

// Endpoint untuk menghapus pengeluaran
app.delete('/expenses/:id', (req, res) => {
  console.log(`Endpoint /expenses/${req.params.id} dipanggil (DELETE)`);
  const expenseId = req.params.id;
  const query = 'DELETE FROM expenses WHERE id = ?';
  
  pool.query(query, [expenseId], (err, results) => {
    if (err) {
      console.error('Gagal menghapus pengeluaran:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menghapus pengeluaran'
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengeluaran tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pengeluaran berhasil dihapus'
    });
  });
});
// Endpoint untuk menghapus mobil
app.delete('/cars/:id', (req, res) => {
  const carId = req.params.id;
  if (!carId || isNaN(parseInt(carId))) {
    return res.status(400).json({
      success: false,
      message: 'ID mobil tidak valid'
    });
  }
  const deleteQuery = 'DELETE FROM cars WHERE id = ?';
  pool.query(deleteQuery, [parseInt(carId)], (err, results) => {
    if (err) {
      console.error('Gagal menghapus mobil:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menghapus mobil',
        error: err.message
      });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mobil tidak ditemukan'
      });
    }
    // Ambil data mobil terbaru setelah delete
    pool.query('SELECT * FROM cars ORDER BY id DESC', (err2, cars) => {
      if (err2) {
        return res.status(200).json({
          success: true,
          message: 'Mobil berhasil dihapus, gagal mengambil data terbaru'
        });
      }
      const carsWithImages = cars.map(car => {
        if (car.mainImage) {
          return { ...car, mainImage: car.mainImage.toString('base64') };
        }
        return car;
      });
      res.status(200).json({
        success: true,
        message: 'Mobil berhasil dihapus',
        cars: carsWithImages
      });
    });
  });
});
// Endpoint untuk mengupdate mobil
app.put('/cars/:id', upload.single('mainImage'), (req, res) => {
  const carId = req.params.id;
  const { 
    name, 
    type, 
    price, 
    transmisi, 
    bahanBakar, 
    pintu, 
    airConditioner, 
    seats, 
    description, 
    status 
  } = req.body;

  // Validasi input
  if (!name || !type || !price || !transmisi || !bahanBakar || !pintu || !seats || !status) {
    return res.status(400).json({
      success: false,
      message: 'Field wajib harus diisi (name, type, price, transmisi, bahanBakar, pintu, seats, status)'
    });
  }

  // Validasi tipe data
  const priceFloat = parseFloat(price);
  const pintuInt = parseInt(pintu);
  const seatsInt = parseInt(seats);

  if (isNaN(priceFloat)) {
    return res.status(400).json({
      success: false,
      message: 'Harga harus berupa angka'
    });
  }

  // Cek apakah ada gambar baru yang diupload
  const mainImage = req.file ? req.file.buffer : null;

  let query;
  let queryParams;

  if (mainImage) {
    // Update dengan gambar baru
    query = `
  UPDATE cars 
  SET name = ?, type = ?, price = ?, transmisi = ?, bahanBakar = ?, 
      pintu = ?, airConditioner = ?, seats = ?, , 
      description = ?, status = ?, mainImage = ?
  WHERE id = ?
`;
    queryParams = [
      name, type, priceFloat, transmisi, bahanBakar, 
      pintuInt, airConditioner, seatsInt, 
      description, status, mainImage, carId
    ];
  } else {
    // Update tanpa mengubah gambar
   query = `
  UPDATE cars 
  SET name = ?, type = ?, price = ?, transmisi = ?, bahanBakar = ?, 
      pintu = ?, airConditioner = ?, seats = ?, , 
      description = ?, status = ?
  WHERE id = ?
`;
    queryParams = [
      name, type, priceFloat, transmisi, bahanBakar, 
      pintuInt, airConditioner, seatsInt, 
      description, status, carId
    ];
  }

  pool.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Gagal mengupdate mobil:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengupdate mobil',
        error: err.message
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mobil tidak ditemukan'
      });
    }

    // Ambil data mobil yang baru diupdate untuk dikembalikan ke frontend
    pool.query('SELECT * FROM cars WHERE id = ?', [carId], (err, updatedResults) => {
      if (err) {
        console.error('Gagal mengambil data mobil setelah update:', err);
        return res.status(200).json({
          success: true,
          message: 'Data mobil berhasil diupdate tetapi gagal mengambil data terbaru'
        });
      }

      if (updatedResults.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'Data mobil berhasil diupdate tetapi data tidak ditemukan'
        });
      }

      const updatedCar = updatedResults[0];
      // Konversi gambar ke base64 jika ada
      if (updatedCar.mainImage) {
        updatedCar.mainImage = updatedCar.mainImage.toString('base64');
      }

      res.status(200).json({
        success: true,
        message: 'Data mobil berhasil diupdate',
        data: updatedCar
      });
    });
  });
});
// ==================== ERROR HANDLING & SERVER START ====================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server'
  });
});

// Menjalankan server pada port 3000
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// Tangani proses yang tidak tertangkap
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});