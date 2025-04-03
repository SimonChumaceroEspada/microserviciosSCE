const { Cliente } = require('../models');

// Crear un cliente
exports.createCliente = async (req, res) => {
  try {
    const { ci, nombres, apellidos, sexo } = req.body;
    
    if (!ci || !nombres || !apellidos || !sexo) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    
    if (sexo !== 'M' && sexo !== 'F') {
      return res.status(400).json({ message: 'El sexo debe ser "M" o "F"' });
    }
    
    const clienteExistente = await Cliente.findOne({ where: { ci } });
    if (clienteExistente) {
      return res.status(400).json({ message: 'Ya existe un cliente con ese CI' });
    }
    
    const cliente = await Cliente.create({
      ci,
      nombres,
      apellidos,
      sexo
    });
    
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

//  paginación
exports.getAllClientes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Cliente.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']]
    });
    
    res.status(200).json({
      clientes: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes', error: error.message });
  }
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
  }
};

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
  try {
    const { ci, nombres, apellidos, sexo } = req.body;
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    if (ci && ci !== cliente.ci) {
      const clienteExistente = await Cliente.findOne({ where: { ci } });
      if (clienteExistente) {
        return res.status(400).json({ message: 'Ya existe un cliente con ese CI' });
      }
    }
    
    if (sexo && sexo !== 'M' && sexo !== 'F') {
      return res.status(400).json({ message: 'El sexo debe ser "M" o "F"' });
    }
    
    await cliente.update({
      ci: ci || cliente.ci,
      nombres: nombres || cliente.nombres,
      apellidos: apellidos || cliente.apellidos,
      sexo: sexo || cliente.sexo
    });
    
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
  }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    await cliente.destroy();
    
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'No se puede eliminar el cliente porque tiene facturas asociadas' 
      });
    }
    res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
  }
};
