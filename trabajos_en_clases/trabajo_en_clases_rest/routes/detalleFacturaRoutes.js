const express = require('express');
const router = express.Router();
const detalleFacturaController = require('../controllers/DetalleFacturaController');

/**
 * @swagger
 * /api/detalles:
 *   post:
 *     summary: Crear un nuevo detalle de factura
 *     tags: [Detalles de Factura]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - factura_id
 *               - producto_id
 *               - cantidad
 *             properties:
 *               factura_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Detalle creado exitosamente
 *       400:
 *         description: Datos inválidos o stock insuficiente
 *       404:
 *         description: Factura o producto no encontrado
 */
router.post('/', detalleFacturaController.createDetalle);

/**
 * @swagger
 * /api/detalles/factura/{facturaId}:
 *   get:
 *     summary: Obtener detalles de una factura
 *     tags: [Detalles de Factura]
 *     parameters:
 *       - in: path
 *         name: facturaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de detalles de la factura
 *       404:
 *         description: Factura no encontrada
 */
router.get('/factura/:facturaId', detalleFacturaController.getDetallesByFactura);

/**
 * @swagger
 * /api/detalles/{id}:
 *   get:
 *     summary: Obtener un detalle por ID
 *     tags: [Detalles de Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del detalle
 *       404:
 *         description: Detalle no encontrado
 */
router.get('/:id', detalleFacturaController.getDetalleById);

/**
 * @swagger
 * /api/detalles/{id}:
 *   put:
 *     summary: Actualizar un detalle de factura
 *     tags: [Detalles de Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cantidad
 *             properties:
 *               cantidad:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Detalle actualizado
 *       400:
 *         description: Datos inválidos o stock insuficiente
 *       404:
 *         description: Detalle no encontrado
 */
router.put('/:id', detalleFacturaController.updateDetalle);

/**
 * @swagger
 * /api/detalles/{id}:
 *   delete:
 *     summary: Eliminar un detalle de factura
 *     tags: [Detalles de Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle eliminado
 *       404:
 *         description: Detalle no encontrado
 */
router.delete('/:id', detalleFacturaController.deleteDetalle);

module.exports = router;
