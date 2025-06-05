// Modelo para las reservas
const db = require('../config/db');

// Obtener todas las reservas
async function getAllReservas() {
  try {
    const [rows] = await db.query(`
      SELECT * FROM reservas
      ORDER BY fecha_reserva DESC
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw new Error('Error al obtener todas las reservas');
  }
}

// Obtener una reserva por ID
async function getReservaById(id) {
  try {
    const [rows] = await db.query(`
      SELECT * FROM reservas
      WHERE id = ?
    `, [id]);
    
    return rows[0] || null;
  } catch (error) {
    console.error(`Error al obtener reserva con ID ${id}:`, error);
    throw new Error(`Error al obtener reserva con ID ${id}`);
  }
}

// Obtener reservas por usuario
async function getReservasByUsuario(usuariosId) {
  try {
    const [rows] = await db.query(`
      SELECT * FROM reservas
      WHERE usuarios_id = ?
      ORDER BY fecha_reserva DESC
    `, [usuariosId]);
    
    return rows;
  } catch (error) {
    console.error(`Error al obtener reservas del usuario ${usuariosId}:`, error);
    throw new Error(`Error al obtener reservas del usuario ${usuariosId}`);
  }
}

// Obtener reservas por habitación
async function getReservasByHabitacion(habitacionId) {
  try {
    const [rows] = await db.query(`
      SELECT * FROM reservas
      WHERE habitacion_id = ?
      ORDER BY fecha_reserva DESC
    `, [habitacionId]);
    
    return rows;
  } catch (error) {
    console.error(`Error al obtener reservas de la habitación ${habitacionId}:`, error);
    throw new Error(`Error al obtener reservas de la habitación ${habitacionId}`);
  }
}

// Obtener reservas por estado
async function getReservasByEstado(estadoReserva) {
  try {
    const [rows] = await db.query(`
      SELECT * FROM reservas
      WHERE estado_reserva = ?
      ORDER BY fecha_reserva DESC
    `, [estadoReserva]);
    
    return rows;
  } catch (error) {
    console.error(`Error al obtener reservas con estado ${estadoReserva}:`, error);
    throw new Error(`Error al obtener reservas con estado ${estadoReserva}`);
  }
}

// Crear una nueva reserva
async function createReserva(reservaData) {
  try {
    const { habitacion_id, usuarios_id, fecha_entrada, fecha_salida, estado_reserva, total_a_pagar } = reservaData;
    
    const [result] = await db.query(`
      INSERT INTO reservas (habitacion_id, usuarios_id, fecha_entrada, fecha_salida, estado_reserva, total_a_pagar)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [habitacion_id, usuarios_id, fecha_entrada, fecha_salida, estado_reserva, total_a_pagar]);
    
    if (result.affectedRows === 0) {
      throw new Error('No se pudo crear la reserva');
    }
    
    const nuevaReservaId = result.insertId;
    return getReservaById(nuevaReservaId);
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    throw new Error('Error al crear la reserva');
  }
}

// Actualizar una reserva existente
async function updateReserva(id, reservaData) {
  try {
    const { habitacion_id, usuarios_id, fecha_entrada, fecha_salida, estado_reserva, total_a_pagar } = reservaData;
    
    const [result] = await db.query(`
      UPDATE reservas 
      SET habitacion_id = ?, 
          usuarios_id = ?, 
          fecha_entrada = ?, 
          fecha_salida = ?, 
          estado_reserva = ?, 
          total_a_pagar = ?
      WHERE id = ?
    `, [habitacion_id, usuarios_id, fecha_entrada, fecha_salida, estado_reserva, total_a_pagar, id]);
    
    if (result.affectedRows === 0) {
      throw new Error(`Reserva con ID ${id} no encontrada`);
    }
    
    return getReservaById(id);
  } catch (error) {
    console.error(`Error al actualizar reserva con ID ${id}:`, error);
    throw new Error(`Error al actualizar reserva con ID ${id}`);
  }
}

// Eliminar una reserva
async function deleteReserva(id) {
  try {
    const reserva = await getReservaById(id);
    
    if (!reserva) {
      throw new Error(`Reserva con ID ${id} no encontrada`);
    }
    
    const [result] = await db.query(`
      DELETE FROM reservas
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      throw new Error(`No se pudo eliminar la reserva con ID ${id}`);
    }
    
    return { id, message: `Reserva con ID ${id} eliminada correctamente` };
  } catch (error) {
    console.error(`Error al eliminar reserva con ID ${id}:`, error);
    throw new Error(`Error al eliminar reserva con ID ${id}`);
  }
}

module.exports = {
  getAllReservas,
  getReservaById,
  getReservasByUsuario,
  getReservasByHabitacion,
  getReservasByEstado,
  createReserva,
  updateReserva,
  deleteReserva
};
