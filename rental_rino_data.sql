-- Database setup untuk Car Rental System
-- Jalankan file ini di phpMyAdmin atau MySQL command line

-- Buat database
CREATE DATABASE IF NOT EXISTS rental_rino_data;
USE rental_rino_data;

-- Tabel cars
CREATE TABLE IF NOT EXISTS cars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  transmisi VARCHAR(50),
  bahanBakar VARCHAR(50),
  pintu INT,
  airConditioner VARCHAR(10),
  seats INT,
  description TEXT,
  status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
  mainImage LONGBLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel bookings
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(100) NOT NULL,
  unit VARCHAR(100) NOT NULL,
  jenis VARCHAR(50),
  order_id VARCHAR(100) UNIQUE NOT NULL,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel expenses
CREATE TABLE IF NOT EXISTS expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel users untuk admin
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES 
('superadmin1', '$2a$12$1ye1uhvWA.lV4LS1pY0Bp.mQYHFQfOdXY45jK1p4.FLSQgDbozKcC', 'admin'),
('manager2', '$2a$12$9d4scRVhWgxobZiugLE44.uISNBf3YxXpkhNN/QzaacM4r7F4hiOq', 'admin'),
('operator3', '$2a$12$MhEXIzCaPxo91DX5A1g4J.Y7ntHVeHfzwz1dwjKyU3Dl7ctS6un4i', 'admin');

-- Insert sample data untuk cars
INSERT INTO cars (name, type, price, transmisi, bahanBakar, pintu, airConditioner, seats, description, status) VALUES
('Toyota Avanza', 'Minivan', 350000.00, 'Matic', 'Gasoline', 5, 'Yes', 7, 13.0, 'Toyota Avanza adalah kendaraan keluarga yang sempurna dengan kapasitas 7 penumpang.', 'available'),
('Toyota Vios', 'Sedan', 400000.00, 'Matic', 'Gasoline', 4, 'Yes', 5, 15.0, 'Toyota Vios menawarkan kenyamanan berkendara dengan desain sedan yang elegan.', 'available'),
('Honda Civic', 'Sedan', 550000.00, 'Matic', 'Gasoline', 4, 'Yes', 5, 14.0, 'Honda Civic dengan performa tinggi dan desain sporty.', 'available'),
('Toyota Innova', 'MPV', 450000.00, 'Matic', 'Gasoline', 5, 'Yes', 8, 12.0, 'Toyota Innova cocok untuk keluarga besar dengan kenyamanan maksimal.', 'available'),
('Suzuki Ertiga', 'MPV', 300000.00, 'Matic', 'Gasoline', 5, 'Yes', 7, 16.0, 'Suzuki Ertiga dengan efisiensi bahan bakar yang baik.', 'available');

-- Insert sample data untuk expenses
INSERT INTO expenses (description, amount, category, date) VALUES
('Bensin', 500000.00, 'Operasional', '2024-01-15'),
('Servis Mobil', 750000.00, 'Maintenance', '2024-01-10'),
('Asuransi', 1200000.00, 'Asuransi', '2024-01-01'),
('Pajak Kendaraan', 800000.00, 'Pajak', '2024-01-05');

-- Insert sample data untuk bookings
INSERT INTO bookings (customer_name, unit, jenis, order_id, start_date, end_date, status) VALUES


