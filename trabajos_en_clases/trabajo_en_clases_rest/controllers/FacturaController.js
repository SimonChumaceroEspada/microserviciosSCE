const { Factura, Cliente, Producto } = require('../models');
const sequelize = require('../config/database');

// Crear una factura
exports.createFactura = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { cliente_id, fecha, detalles = [] } = req.body;
    
    if (!cliente_id) {
      await transaction.rollback();
      return res.status(400).json({ message: 'ID del cliente es obligatorio' });
    }
    
    // Verificar si el cliente existe
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    let total = 0;
    const detallesConSubtotal = [];
    
    // Procesar los detalles si existen
    if (detalles.length > 0) {
      for (const detalle of detalles) {
        const { producto_id, cantidad } = detalle;
        if (!producto_id || !cantidad || cantidad <= 0) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Todos los detalles deben tener producto_id y cantidad válida' });
        }
        
        // Verificar producto y stock
        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
          await transaction.rollback();
          return res.status(404).json({ message: `Producto ID ${producto_id} no encontrado` });
        }
        
        if (producto.stock < cantidad) {
          await transaction.rollback();
          return res.status(400).json({ 
            message: `Stock insuficiente para el producto ${producto.nombre}`, 
            disponible: producto.stock 
          });
        }
        
        // Calcular subtotal y actualizar stock
        const precio_unitario = parseFloat(producto.precio);
        const subtotal = precio_unitario * cantidad;
        total += subtotal;
        
        // Actualizar stock
        await producto.update({
          stock: producto.stock - cantidad
        }, { transaction });
        
        detallesConSubtotal.push({
          producto_id,
          cantidad,
          precio_unitario,
          subtotal,
          nombre_producto: producto.nombre,
          marca: producto.marca
        });
      }
    }
    
    // Crear la factura con los detalles
    const factura = await Factura.create({
      cliente_id,
      fecha: fecha || new Date(),
      total,
      detalles: detallesConSubtotal
    }, { transaction });
    
    await transaction.commit();
    
    // Obtener la factura con datos del cliente para la respuesta
    const facturaConCliente = await Factura.findByPk(factura.id, {
      include: [{ model: Cliente, attributes: ['id', 'ci', 'nombres', 'apellidos'] }]
    });
    
    res.status(201).json(facturaConCliente);
  } catch (error) {
    await transaction.rollback();
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
      include: [{ model: Cliente, attributes: ['id', 'ci', 'nombres', 'apellidos'] }]
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
      order: [['fecha', 'DESC']]
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
  const transaction = await sequelize.transaction();
  try {
    const { fecha, cliente_id, detalles } = req.body;
    const factura = await Factura.findByPk(req.params.id);
    
    if (!factura) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    
    // Si se cambia el cliente, verificar que exista
    if (cliente_id && cliente_id !== factura.cliente_id) {
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
    }
    
    // Si se actualizan los detalles
    if (detalles) {
      const detallesActuales = factura.detalles || [];
      
      // Devolver el stock a los productos actuales
      for (const detalle of detallesActuales) {
        const producto = await Producto.findByPk(detalle.producto_id);
        if (producto) {
          await producto.update({
            stock: producto.stock + detalle.cantidad
          }, { transaction });
        }
      }
      
      let total = 0;
      const nuevosDetalles = [];
      
      // Procesar los nuevos detalles
      for (const detalle of detalles) {
        const { producto_id, cantidad } = detalle;
        
        if (!producto_id || !cantidad || cantidad <= 0) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Todos los detalles deben tener producto_id y cantidad válida' });
        }
        
        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
          await transaction.rollback();
          return res.status(404).json({ message: `Producto ID ${producto_id} no encontrado` });
        }
        
        if (producto.stock < cantidad) {
          await transaction.rollback();
          return res.status(400).json({ 
            message: `Stock insuficiente para el producto ${producto.nombre}`, 
            disponible: producto.stock 
          });
        }
        
        const precio_unitario = parseFloat(producto.precio);
        const subtotal = precio_unitario * cantidad;
        total += subtotal;
        
        // Actualizar stock
        await producto.update({
          stock: producto.stock - cantidad
        }, { transaction });
        
        nuevosDetalles.push({
          producto_id,
          cantidad,
          precio_unitario,
          subtotal,
          nombre_producto: producto.nombre,
          marca: producto.marca
        });
      }
      
      // Actualizar la factura con los nuevos detalles
      await factura.update({
        fecha: fecha || factura.fecha,
        cliente_id: cliente_id || factura.cliente_id,
        detalles: nuevosDetalles,
        total
      }, { transaction });
    } else {
      // Actualizar solo los campos básicos
      await factura.update({
        fecha: fecha || factura.fecha,
        cliente_id: cliente_id || factura.cliente_id
      }, { transaction });
    }
    
    await transaction.commit();
    
    const facturaActualizada = await Factura.findByPk(factura.id, {
      include: [{ model: Cliente, attributes: ['id', 'ci', 'nombres', 'apellidos'] }]
    });
    
    res.status(200).json(facturaActualizada);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al actualizar la factura', error: error.message });
  }
};

// Actualizar parcialmente una factura (PATCH)
exports.patchFactura = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { fecha, cliente_id, detalles_a_agregar, detalles_a_eliminar } = req.body;
    const factura = await Factura.findByPk(req.params.id);
    
    if (!factura) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    
    // Si se cambia el cliente, verificar que exista
    if (cliente_id && cliente_id !== factura.cliente_id) {
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      await factura.update({ cliente_id }, { transaction });
    }
    
    // Si se cambia la fecha
    if (fecha) {
      await factura.update({ fecha }, { transaction });
    }
    
    let detallesActuales = factura.detalles || [];
    let totalFactura = parseFloat(factura.total);
    
    // Eliminar detalles especificados
    if (detalles_a_eliminar && Array.isArray(detalles_a_eliminar) && detalles_a_eliminar.length > 0) {
      for (const idDetalle of detalles_a_eliminar) {
        const detalleIndex = detallesActuales.findIndex(d => d.producto_id === idDetalle);
        
        if (detalleIndex !== -1) {
          const detalle = detallesActuales[detalleIndex];
          
          // Devolver stock al producto
          const producto = await Producto.findByPk(detalle.producto_id);
          if (producto) {
            await producto.update({
              stock: producto.stock + detalle.cantidad
            }, { transaction });
          }
          
          // Restar del total
          totalFactura -= parseFloat(detalle.subtotal);
          
          // Eliminar de los detalles
          detallesActuales.splice(detalleIndex, 1);
        }
      }
    }
    
    // Agregar nuevos detalles
    if (detalles_a_agregar && Array.isArray(detalles_a_agregar) && detalles_a_agregar.length > 0) {
      for (const detalle of detalles_a_agregar) {
        const { producto_id, cantidad } = detalle;
        
        if (!producto_id || !cantidad || cantidad <= 0) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Cada detalle debe tener producto_id y cantidad válida' });
        }
        
        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
          await transaction.rollback();
          return res.status(404).json({ message: `Producto con ID ${producto_id} no encontrado` });
        }
        
        if (producto.stock < cantidad) {
          await transaction.rollback();
          return res.status(400).json({ 
            message: `Stock insuficiente para producto ${producto.nombre}`, 
            disponible: producto.stock 
          });
        }
        
        // Calcular subtotal y añadir al total
        const precio_unitario = parseFloat(producto.precio);
        const subtotal = precio_unitario * cantidad;
        totalFactura += subtotal;
        
        // Añadir a detalles
        detallesActuales.push({
          producto_id,
          cantidad,
          precio_unitario,
          subtotal,
          nombre_producto: producto.nombre,
          marca: producto.marca
        });
        
        // Actualizar stock
        await producto.update({
          stock: producto.stock - cantidad
        }, { transaction });
      }
    }
    
    // Actualizar factura con detalles modificados y total recalculado
    await factura.update({
      detalles: detallesActuales,
      total: totalFactura
    }, { transaction });
    
    await transaction.commit();
    
    // Devolver factura actualizada con datos de cliente
    const facturaActualizada = await Factura.findByPk(factura.id, {
      include: [{ model: Cliente, attributes: ['id', 'ci', 'nombres', 'apellidos'] }]
    });
    
    res.status(200).json(facturaActualizada);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al actualizar parcialmente la factura', error: error.message });
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
    
    // Devolver el stock de los productos
    const detalles = factura.detalles || [];
    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.producto_id);
      if (producto) {
        await producto.update({
          stock: producto.stock + detalle.cantidad
        }, { transaction });
      }
    }
    
    // Eliminar la factura
    await factura.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al eliminar la factura', error: error.message });
  }
};
