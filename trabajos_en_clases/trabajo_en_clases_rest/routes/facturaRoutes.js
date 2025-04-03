const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/FacturaController');

/**
 * @swagger
 * /api/facturas:
 *   post:
 *     summary: Crear una nueva factura
 *     tags: [Facturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *             properties:
 *               cliente_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente no encontrado
 */
router.post('/', facturaController.createFactura);

/**
 * @swagger
 * /api/facturas:
 *   get:
 *     summary: Obtener todas las facturas
 *     tags: [Facturas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de items por página
 *     responses:
 *       200:
 *         description: Lista de facturas
 */
router.get('/', facturaController.getAllFacturas);

/**
 * @swagger
 * /api/facturas/{id}:
 *   get:
 *     summary: Obtener una factura por ID
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la factura
 *       404:
 *         description: Factura no encontrada
 */
router.get('/:id', facturaController.getFacturaById);

/**
 * @swagger
 * /api/facturas/cliente/{clienteId}:
 *   get:
 *     summary: Obtener facturas por cliente
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de facturas del cliente
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/cliente/:clienteId', facturaController.getFacturasByCliente);

/**
 * @swagger
 * /api/facturas/{id}:
 *   put:
 *     summary: Actualizar una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               cliente_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Factura actualizada
 *       404:
 *         description: Factura o cliente no encontrado
 */
router.put('/:id', facturaController.updateFactura);

/**
 * @swagger
 * /api/facturas/{id}:
 *   delete:
 *     summary: Eliminar una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Factura eliminada
 *       404:
 *         description: Factura no encontrada
 */
router.delete('/:id', facturaController.deleteFactura);

module.exports = router;
