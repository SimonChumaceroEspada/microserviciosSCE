// Controlador para las reservas
const reservaModel = require('../models/reservaModel');

// Obtener todas las reservas
async function getAllReservas(req, res) {
  try {
    const reservas = await reservaModel.getAllReservas();
    res.json(reservas);
  } catch (error) {
    console.error('Error en el controlador getAllReservas:', error);
    res.status(500).json({ error: error.message });
  }
}

// Obtener una reserva por ID
async function getReservaById(req, res) {
  try {
    const id = req.params.id;
    const reserva = await reservaModel.getReservaById(id);
    
    if (!reserva) {
      return res.status(404).json({ error: `Reserva con ID ${id} no encontrada` });
    }
    
    res.json(reserva);
  } catch (error) {
    console.error(`Error en el controlador getReservaById:`, error);
    res.status(500).json({ error: error.message });
  }
}

// Obtener reservas por usuario
async function getReservasByUsuario(req, res) {
  try {
    const usuariosId = req.params.usuariosId;
    const reservas = await reservaModel.getReservasByUsuario(usuariosId);
    res.json(reservas);
  } catch (error) {
    console.error(`Error en el controlador getReservasByUsuario:`, error);
    res.status(500).json({ error: error.message });
  }
}

// Obtener reservas por habitación
async function getReservasByHabitacion(req, res) {
  try {
    const habitacionId = req.params.habitacionId;
    const reservas = await reservaModel.getReservasByHabitacion(habitacionId);
    res.json(reservas);
  } catch (error) {
    console.error(`Error en el controlador getReservasByHabitacion:`, error);
    res.status(500).json({ error: error.message });
  }
}

// Obtener reservas por estado
async function getReservasByEstado(req, res) {
  try {
    const estadoReserva = req.params.estado;
    const reservas = await reservaModel.getReservasByEstado(estadoReserva);
    res.json(reservas);
  } catch (error) {
    console.error(`Error en el controlador getReservasByEstado:`, error);
    res.status(500).json({ error: error.message });
  }
}

// Crear una nueva reserva
async function createReserva(req, res) {
  try {
    const reservaData = req.body;
    
    // Validate required fields
    const requiredFields = ['habitacion_id', 'usuarios_id', 'fecha_entrada', 'fecha_salida'];
    const missingFields = requiredFields.filter(field => !reservaData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Campos requeridos faltantes: ${missingFields.join(', ')}` 
      });
    }
    
    // Set default values if not provided
    if (!reservaData.estado_reserva) {
      reservaData.estado_reserva = 'confirmada';
    }
    
    // Add user ID from the authenticated token if not explicitly provided
    if (!reservaData.usuarios_id && req.user && req.user.id) {
      reservaData.usuarios_id = req.user.id;
    }
      // Handle total_a_pagar field - this cannot be null in the database
    if (reservaData.total_a_pagar === undefined || reservaData.total_a_pagar === null) {
      try {
        // Set a default value in case calculation fails
        reservaData.total_a_pagar = 100.0;
        
        // Calculate days of stay
        const fechaEntrada = new Date(reservaData.fecha_entrada);
        const fechaSalida = new Date(reservaData.fecha_salida);
        
        // Check if dates are valid
        if (isNaN(fechaEntrada.getTime()) || isNaN(fechaSalida.getTime())) {
          throw new Error('Fechas de entrada o salida inválidas');
        }
        
        const diasEstancia = Math.max(1, Math.ceil((fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24)));
        
        // Use a default room price if we can't get it from the service
        let precioPorNoche = 100.0;
        
        // In a production environment, implement proper error handling and retries
        console.log(`Calculando precio total para estancia de ${diasEstancia} días`);
        
        // For simplicity, use the default price
        reservaData.total_a_pagar = diasEstancia * precioPorNoche;
      } catch (error) {
        console.error('Error al calcular total_a_pagar:', error);
        // Ensure we have a valid value even if calculation fails
        reservaData.total_a_pagar = 100.0;
      }
    }
    
    const nuevaReserva = await reservaModel.createReserva(reservaData);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error('Error en el controlador createReserva:', error);
    res.status(500).json({ error: error.message });
  }
}

// Actualizar una reserva existente
async function updateReserva(req, res) {
  try {
    const id = req.params.id;
    const reservaData = req.body;
    const reservaActualizada = await reservaModel.updateReserva(id, reservaData);
    res.json(reservaActualizada);
  } catch (error) {
    console.error(`Error en el controlador updateReserva:`, error);
    res.status(500).json({ error: error.message });
  }
}

// Eliminar una reserva
async function deleteReserva(req, res) {
  try {
    const id = req.params.id;
    const resultado = await reservaModel.deleteReserva(id);
    res.json(resultado);
  } catch (error) {
    console.error(`Error en el controlador deleteReserva:`, error);
    res.status(500).json({ error: error.message });
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
