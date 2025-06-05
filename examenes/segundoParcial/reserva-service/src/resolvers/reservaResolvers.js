const db = require('../config/db');

const reservaResolvers = {
  Query: {
    // Obtener todas las reservas
    reservas: async (_, __, { user }) => {
      if (!user) throw new Error('No autenticado');
      
      try {
        const [rows] = await db.query(`
          SELECT * FROM reservas
          ORDER BY fecha_reserva DESC
        `);
        return rows;
      } catch (error) {
        console.error('Error al obtener reservas:', error);
        throw new Error('Error al obtener reservas');
      }
    },
    
    // Obtener una reserva por ID
    reserva: async (_, { id }, { user }) => {
      if (!user) throw new Error('No autenticado');
      
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
    },
    
    // Obtener reservas por usuario
    reservasByUsuario: async (_, { usuarios_id }, { user }) => {
      if (!user) throw new Error('No autenticado');
      
      try {
        const [rows] = await db.query(`
          SELECT * FROM reservas
          WHERE usuarios_id = ?
          ORDER BY fecha_reserva DESC
        `, [usuarios_id]);
        
        return rows;
      } catch (error) {
        console.error(`Error al obtener reservas del usuario ${usuarios_id}:`, error);
        throw new Error(`Error al obtener reservas del usuario`);
      }
    },
    
    // Obtener reservas por habitación
    reservasByHabitacion: async (_, { habitacion_id }, { user }) => {
      if (!user) throw new Error('No autenticado');
      
      try {
        const [rows] = await db.query(`
          SELECT * FROM reservas
          WHERE habitacion_id = ?
          ORDER BY fecha_reserva DESC
        `, [habitacion_id]);
        
        return rows;
      } catch (error) {
        console.error(`Error al obtener reservas de la habitación ${habitacion_id}:`, error);
        throw new Error(`Error al obtener reservas de la habitación`);
      }
    },
    
    // Obtener reservas por estado
    reservasByEstado: async (_, { estado_reserva }, { user }) => {
      if (!user) throw new Error('No autenticado');
      
      try {
        const [rows] = await db.query(`
          SELECT * FROM reservas
          WHERE estado_reserva = ?
          ORDER BY fecha_reserva DESC
        `, [estado_reserva]);
        
        return rows;
      } catch (error) {
        console.error(`Error al obtener reservas con estado ${estado_reserva}:`, error);
        throw new Error(`Error al obtener reservas con estado ${estado_reserva}`);
      }
    },
  },
  
  Mutation: {
    // Crear una nueva reserva
    crearReserva: async (_, { input }, { user }) => {
      if (!user) throw new Error('No autenticado');
      
      const { 
        habitacion_id, 
        usuarios_id, 
        fecha_entrada, 
        fecha_salida, 
        estado_reserva = 'pendiente', 
        total_a_pagar 
      } = input;
      
      try {
        // Verificar si la habitación está disponible
        const [habitacionRows] = await db.query(`
          SELECT * FROM habitaciones
          WHERE id = ? AND estado = 'disponible'
        `, [habitacion_id]);
        
        if (habitacionRows.length === 0) {
          throw new Error('La habitación no existe o no está disponible');
        }
        
        // Verificar si hay otras reservas para la misma habitación en las mismas fechas
        const [reservasExistentes] = await db.query(`
          SELECT * FROM reservas
          WHERE habitacion_id = ?
            AND estado_reserva IN ('confirmada', 'pendiente')
            AND (
              (fecha_entrada <= ? AND fecha_salida >= ?) OR
              (fecha_entrada <= ? AND fecha_salida >= ?) OR
              (fecha_entrada >= ? AND fecha_salida <= ?)
            )
        `, [
          habitacion_id,
          fecha_entrada, fecha_entrada,
          fecha_salida, fecha_salida,
          fecha_entrada, fecha_salida
        ]);
        
        if (reservasExistentes.length > 0) {
          throw new Error('La habitación ya está reservada para las fechas seleccionadas');
        }
        
        // Insertar la nueva reserva
        const [result] = await db.query(`
          INSERT INTO reservas (
            habitacion_id,
            usuarios_id,
            fecha_reserva,
            fecha_entrada,
            fecha_salida,
            estado_reserva,
            total_a_pagar
          ) VALUES (?, ?, NOW(), ?, ?, ?, ?)
        `, [
          habitacion_id,
          usuarios_id,
          fecha_entrada,
          fecha_salida,
          estado_reserva,
          total_a_pagar
        ]);
        
        // Obtener la reserva recién creada
        const [nuevaReserva] = await db.query(`
          SELECT * FROM reservas WHERE id = ?
        `, [result.insertId]);
        
        return nuevaReserva[0];
      } catch (error) {
        console.error('Error al crear reserva:', error);
        throw new Error(error.message || 'Error al crear reserva');
      }
    },
    
    // Actualizar una reserva existente
    actualizarReserva: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('No autenticado');
      
      try {
        // Verificar que la reserva exista
        const [reservaExistente] = await db.query(`
          SELECT * FROM reservas WHERE id = ?
        `, [id]);
        
        if (reservaExistente.length === 0) {
          throw new Error(`No se encontró la reserva con ID ${id}`);
        }
        
        // Construir la consulta de actualización
        let updateQuery = 'UPDATE reservas SET ';
        const updateValues = [];
        const fields = [];
        
        // Verificar cada campo para ver si necesita ser actualizado
        if (input.habitacion_id !== undefined) {
          fields.push('habitacion_id = ?');
          updateValues.push(input.habitacion_id);
        }
        
        if (input.fecha_entrada !== undefined) {
          fields.push('fecha_entrada = ?');
          updateValues.push(input.fecha_entrada);
        }
        
        if (input.fecha_salida !== undefined) {
          fields.push('fecha_salida = ?');
          updateValues.push(input.fecha_salida);
        }
        
        if (input.estado_reserva !== undefined) {
          fields.push('estado_reserva = ?');
          updateValues.push(input.estado_reserva);
        }
        
        if (input.total_a_pagar !== undefined) {
          fields.push('total_a_pagar = ?');
          updateValues.push(input.total_a_pagar);
        }
        
        // Agregar campo de actualización
        fields.push('updated_at = NOW()');
        
        // Si no hay campos para actualizar, devolver la reserva sin cambios
        if (fields.length === 1) {
          return reservaExistente[0];
        }
        
        // Completar la consulta
        updateQuery += fields.join(', ');
        updateQuery += ' WHERE id = ?';
        updateValues.push(id);
        
        // Ejecutar la actualización
        await db.query(updateQuery, updateValues);
        
        // Obtener la reserva actualizada
        const [reservaActualizada] = await db.query(`
          SELECT * FROM reservas WHERE id = ?
        `, [id]);
        
        return reservaActualizada[0];
      } catch (error) {
        console.error(`Error al actualizar reserva con ID ${id}:`, error);
        throw new Error(error.message || `Error al actualizar reserva con ID ${id}`);
      }
    },
    
    // Cancelar una reserva
    cancelarReserva: async (_, { id }, { user }) => {
      if (!user) throw new Error('No autenticado');
      
      try {
        // Verificar que la reserva exista
        const [reservaExistente] = await db.query(`
          SELECT * FROM reservas WHERE id = ?
        `, [id]);
        
        if (reservaExistente.length === 0) {
          throw new Error(`No se encontró la reserva con ID ${id}`);
        }
        
        // Actualizar el estado de la reserva a 'cancelada'
        await db.query(`
          UPDATE reservas
          SET estado_reserva = 'cancelada', updated_at = NOW()
          WHERE id = ?
        `, [id]);
        
        // Obtener la reserva actualizada
        const [reservaActualizada] = await db.query(`
          SELECT * FROM reservas WHERE id = ?
        `, [id]);
        
        return reservaActualizada[0];
      } catch (error) {
        console.error(`Error al cancelar reserva con ID ${id}:`, error);
        throw new Error(`Error al cancelar reserva con ID ${id}`);
      }
    },
    
    // Eliminar una reserva
    eliminarReserva: async (_, { id }, { user }) => {
      if (!user) throw new Error('No autenticado');
      
      try {
        // Verificar que la reserva exista
        const [reservaExistente] = await db.query(`
          SELECT * FROM reservas WHERE id = ?
        `, [id]);
        
        if (reservaExistente.length === 0) {
          throw new Error(`No se encontró la reserva con ID ${id}`);
        }
        
        // Eliminar la reserva
        await db.query(`
          DELETE FROM reservas
          WHERE id = ?
        `, [id]);
        
        return true;
      } catch (error) {
        console.error(`Error al eliminar reserva con ID ${id}:`, error);
        throw new Error(`Error al eliminar reserva con ID ${id}`);
      }
    },
  },
  
  // Resolvers para los campos de relación
  Reserva: {
    // Obtener los datos de la habitación relacionada
    habitacion: async (reserva) => {
      try {
        const [rows] = await db.query(`
          SELECT * FROM habitaciones
          WHERE id = ?
        `, [reserva.habitacion_id]);
        
        return rows[0] || null;
      } catch (error) {
        console.error(`Error al obtener habitación ${reserva.habitacion_id}:`, error);
        return null;
      }
    },
    
    // Obtener los datos del usuario relacionado
    usuario: async (reserva) => {
      try {
        const [rows] = await db.query(`
          SELECT id, correo FROM usuarios
          WHERE id = ?
        `, [reserva.usuarios_id]);
        
        return rows[0] || null;
      } catch (error) {
        console.error(`Error al obtener usuario ${reserva.usuarios_id}:`, error);
        return null;
      }
    },
  },
};

module.exports = reservaResolvers;
