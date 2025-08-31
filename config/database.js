// config/database.js
const mysql = require('mysql2');

// Konfigurasi database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rental_rino_data',
  port: 3306, // default MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

// Buat connection pool
const pool = mysql.createPool(dbConfig);

// Verifikasi koneksi
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    console.error('💡 Pastikan MySQL berjalan dan database "rental_rino_data" sudah dibuat');
    console.error('📋 Langkah setup database:');
    console.error('   1. Install MySQL Server');
    console.error('   2. Buat database: CREATE DATABASE rental_rino_data;');
    console.error('   3. Import file database_setup.sql');
    console.error('   4. Update password di config/database.js jika berbeda');
    return;
  }
  console.log('✅ Berhasil terhubung ke database MySQL');
  connection.release();
});

module.exports = pool; 