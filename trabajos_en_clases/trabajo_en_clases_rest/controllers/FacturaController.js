const { Factura, Cliente, DetalleFactura, Producto } = require('../models');
const sequelize = require('../config/database');

// Crear una factura
exports.createFactura = async (req, res) => {
  try {
    const { cliente_id, fecha } = req.body;
    
    if (!cliente_id) {
      return res.status(400).json({ message: 'ID del cliente es obligatorio' });
    }
    
    // Verificar si el cliente existe
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    // Crear la factura
    const factura = await Factura.create({
      cliente_id,
      fecha: fecha || new Date(),
      total: 0
    });
    
    res.status(201).json(factura);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la factura', error: error.message });
  }
};

// Obtener todas las facturas con paginación
exports.getAllFacturas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Factura.findAndCountAll({
      limit,
      offset,
      order: [['id', 'DESC']],
      include: [{ model: Cliente, attributes: ['id', 'ci', 'nombres', 'apellidos'] }]
    });
    
    res.status(200).json({
      facturas: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener facturas', error: error.message });
  }
};

// Obtener una factura por ID
exports.getFacturaById = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id, {
      include: [
        { model: Cliente, attributes: ['id', 'ci', 'nombres', 'apellidos'] },
        { 
          model: DetalleFactura,
          include: [{ model: Producto, attributes: ['id', 'nombre', 'marca'] }]
        }
      ]
    });
    
    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    
    res.status(200).json(factura);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la factura', error: error.message });
  }
};

// Obtener facturas por cliente
exports.getFacturasByCliente = async (req, res) => {
  try {
    const cliente_id = req.params.clienteId;
    
    // Verificar si el cliente existe
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Factura.findAndCountAll({
      where: { cliente_id },
      limit,
      offset,
      order: [['fecha', 'DESC']],
      include: [{ 
        model: DetalleFactura,
        include: [{ model: Producto, attributes: ['id', 'nombre'] }]
      }]
    });
    
    res.status(200).json({
      facturas: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener facturas del cliente', error: error.message });
  }
};

// Actualizar una factura
exports.updateFactura = async (req, res) => {
  try {
    const { fecha, cliente_id } = req.body;
    const factura = await Factura.findByPk(req.params.id);
    
    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    
    // Si se cambia el cliente, verificar que exista
    if (cliente_id && cliente_id !== factura.cliente_id) {
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
    }
    
    await factura.update({
      fecha: fecha || factura.fecha,
      cliente_id: cliente_id || factura.cliente_id
    });
    
    res.status(200).json(factura);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la factura', error: error.message });
  }
};

// Eliminar una factura
exports.deleteFactura = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const factura = await Factura.findByPk(req.params.id);
    
    if (!factura) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    
    // Eliminar todos los detalles asociados
    await DetalleFactura.destroy({
      where: { factura_id: factura.id },
      transaction
    });
    
    // Eliminar la factura
    await factura.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({ message: 'Factura y sus detalles eliminados correctamente' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al eliminar la factura', error: error.message });
  }
};
