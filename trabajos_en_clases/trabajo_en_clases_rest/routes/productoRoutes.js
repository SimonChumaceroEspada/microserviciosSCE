const express = require('express');
const router = express.Router();
const productoController = require('../controllers/ProductoController');

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               marca:
 *                 type: string
 *               stock:
 *                 type: integer
 *               precio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', productoController.createProducto);

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
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
 *         description: Lista de productos
 */
router.get('/', productoController.getAllProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del producto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', productoController.getProductoById);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               marca:
 *                 type: string
 *               stock:
 *                 type: integer
 *               precio:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', productoController.updateProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', productoController.deleteProducto);

module.exports = router;
