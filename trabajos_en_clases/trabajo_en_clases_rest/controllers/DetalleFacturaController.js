const { DetalleFactura, Factura, Producto } = require('../models');
const sequelize = require('../config/database');

// Añadir un detalle a una factura
exports.createDetalle = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { factura_id, producto_id, cantidad } = req.body;
    
    if (!factura_id || !producto_id || !cantidad) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Factura ID, Producto ID y cantidad son obligatorios' });
    }
    
    // Verificar si la factura existe
    const factura = await Factura.findByPk(factura_id);
    if (!factura) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    
    // Verificar si el producto existe
    const producto = await Producto.findByPk(producto_id);
    if (!producto) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Verificar stock disponible
    if (producto.stock < cantidad) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Stock insuficiente', 
        disponible: producto.stock 
      });
    }
    
    // Calcular el subtotal
    const precio_unitario = producto.precio;
    const subtotal = precio_unitario * cantidad;
    
    // Crear el detalle
    const detalle = await DetalleFactura.create({
      factura_id,
      producto_id,
      cantidad,
      precio_unitario,
      subtotal
    }, { transaction });
    
    // Actualizar el stock del producto
    await producto.update({
      stock: producto.stock - cantidad
    }, { transaction });
    
    // Actualizar el total de la factura
    const nuevoTotal = parseFloat(factura.total) + parseFloat(subtotal);
    await factura.update({
      total: nuevoTotal
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json(detalle);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al crear el detalle de factura', error: error.message });
  }
};

// Obtener todos los detalles de una factura
exports.getDetallesByFactura = async (req, res) => {
  try {
    const factura_id = req.params.facturaId;
    
    // Verificar si la factura existe
    const factura = await Factura.findByPk(factura_id);
    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    
    const detalles = await DetalleFactura.findAll({
      where: { factura_id },
      include: [{ model: Producto, attributes: ['id', 'nombre', 'marca', 'precio'] }],
      order: [['id', 'ASC']]
    });
    
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener detalles de la factura', error: error.message });
  }
};

// Obtener un detalle específico
exports.getDetalleById = async (req, res) => {
  try {
    const detalle = await DetalleFactura.findByPk(req.params.id, {
      include: [{ model: Producto, attributes: ['id', 'nombre', 'marca', 'precio'] }]
    });
    
    if (!detalle) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    
    res.status(200).json(detalle);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el detalle', error: error.message });
  }
};

// Actualizar un detalle de factura
exports.updateDetalle = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { cantidad } = req.body;
    if (!cantidad || cantidad <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cantidad debe ser mayor que cero' });
    }
    
    const detalle = await DetalleFactura.findByPk(req.params.id, { include: [{ model: Producto }] });
    if (!detalle) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    
    const factura = await Factura.findByPk(detalle.factura_id);
    const producto = await Producto.findByPk(detalle.producto_id);
    
    // Calcular la diferencia de cantidad
    const diferencia = cantidad - detalle.cantidad;
    
    // Verificar stock si la cantidad aumenta
    if (diferencia > 0 && producto.stock < diferencia) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Stock insuficiente', 
        disponible: producto.stock 
      });
    }
    
    // Calcular el nuevo subtotal
    const nuevoSubtotal = detalle.precio_unitario * cantidad;
    
    // Actualizar el detalle
    await detalle.update({
      cantidad,
      subtotal: nuevoSubtotal
    }, { transaction });
    
    // Actualizar el stock del producto
    await producto.update({
      stock: producto.stock - diferencia
    }, { transaction });
    
    // Actualizar el total de la factura
    const diferenciaMonto = nuevoSubtotal - detalle.subtotal;
    await factura.update({
      total: parseFloat(factura.total) + parseFloat(diferenciaMonto)
    }, { transaction });
    
    await transaction.commit();
    
    res.status(200).json(await DetalleFactura.findByPk(detalle.id, { 
      include: [{ model: Producto }] 
    }));
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al actualizar el detalle', error: error.message });
  }
};

// Eliminar un detalle de factura
exports.deleteDetalle = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const detalle = await DetalleFactura.findByPk(req.params.id);
    if (!detalle) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    
    const factura = await Factura.findByPk(detalle.factura_id);
    const producto = await Producto.findByPk(detalle.producto_id);
    
    // Devolver el stock al producto
    await producto.update({
      stock: producto.stock + detalle.cantidad
    }, { transaction });
    
    // Actualizar el total de la factura
    await factura.update({
      total: parseFloat(factura.total) - parseFloat(detalle.subtotal)
    }, { transaction });
    
    // Eliminar el detalle
    await detalle.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({ message: 'Detalle eliminado correctamente' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al eliminar el detalle', error: error.message });
  }
};
