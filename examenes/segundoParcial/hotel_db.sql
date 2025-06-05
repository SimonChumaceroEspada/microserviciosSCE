-- hotel_db.sql
-- Script para crear la base de datos y tablas para el sistema de hotel

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de tipos de habitación
CREATE TABLE IF NOT EXISTS tipos_habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  precio_por_noche DECIMAL(10,2) NOT NULL,
  capacidad INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de habitaciones
CREATE TABLE IF NOT EXISTS habitaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_habitacion VARCHAR(20) NOT NULL UNIQUE,
  tipo_habitacion_id INT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'disponible', -- disponible, ocupada, en mantenimiento
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tipo_habitacion_id) REFERENCES tipos_habitacion(id)
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habitacion_id INT NOT NULL,
  usuarios_id INT NOT NULL,
  fecha_reserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  estado_reserva VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- confirmada, pendiente, cancelada
  total_a_pagar DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id),
  FOREIGN KEY (usuarios_id) REFERENCES usuarios(id)
);

-- Insertar tipos de habitación de ejemplo
INSERT INTO tipos_habitacion (nombre, descripcion, precio_por_noche, capacidad) VALUES
('Individual', 'Habitación con una cama individual', 80.00, 1),
('Doble', 'Habitación con una cama matrimonial', 120.00, 2),
('Suite', 'Suite de lujo con jacuzzi y vista al mar', 250.00, 2),
('Familiar', 'Habitación amplia con dos camas matrimoniales', 180.00, 4);

-- Insertar habitaciones de ejemplo
INSERT INTO habitaciones (numero_habitacion, tipo_habitacion_id, estado, descripcion) VALUES
('101', 1, 'disponible', 'Habitación individual en el primer piso'),
('102', 1, 'disponible', 'Habitación individual en el primer piso'),
('201', 2, 'disponible', 'Habitación doble en el segundo piso'),
('202', 2, 'disponible', 'Habitación doble en el segundo piso'),
('301', 3, 'disponible', 'Suite en el tercer piso con vista al mar'),
('401', 4, 'disponible', 'Habitación familiar en el cuarto piso');

-- Insertar usuario administrador de ejemplo (contraseña: admin123)
INSERT INTO usuarios (correo, password) VALUES
('admin@hotel.com', '$2b$10$XZDVSYv8Vhw9.vCF1awF7uqEAD.QfMWJyK4xCEfcSCOUxV9WVs9Aa');
