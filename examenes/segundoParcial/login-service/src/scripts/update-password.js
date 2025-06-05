// Script para actualizar la contraseña del administrador
require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function updateAdminPassword() {
  // Crear conexión a la base de datos
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    // Generar un nuevo hash para la contraseña: admin123
    const password = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('Hash generado:', hashedPassword);

    // Actualizar la contraseña del administrador en la base de datos
    const [result] = await pool.query(
      'UPDATE usuarios SET password = ? WHERE correo = ?',
      [hashedPassword, 'admin@hotel.com']
    );

    if (result.affectedRows > 0) {
      console.log('Contraseña actualizada correctamente');
    } else {
      console.log('No se encontró el usuario administrador');
      console.log('Intentando crear el usuario administrador...');

      // Insertar el usuario administrador si no existe
      const [insertResult] = await pool.query(
        'INSERT INTO usuarios (correo, password) VALUES (?, ?)',
        ['admin@hotel.com', hashedPassword]
      );

      if (insertResult.affectedRows > 0) {
        console.log('Usuario administrador creado correctamente');
      } else {
        console.error('Error al crear el usuario administrador');
      }
    }
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await pool.end();
  }
}

// Ejecutar la función
updateAdminPassword();
