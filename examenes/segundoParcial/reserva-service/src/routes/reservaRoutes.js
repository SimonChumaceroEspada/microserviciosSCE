// Rutas para las reservas
const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middleware/auth');

// Middleware de autenticación para proteger las rutas
const protectRoute = async (req, res, next) => {
  const { user } = await authMiddleware(req);
  
  if (!user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  req.user = user;
  next();
};

/**
 * @swagger
 * /api/reservas/status:
 *   get:
 *     summary: Verificar el estado del servicio
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Servicio funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Servicio de Reservas funcionando
 */
// Rutas públicas
router.get('/status', (req, res) => {
  res.json({ status: 'Servicio de Reservas funcionando' });
});

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Rutas protegidas
router.get('/', protectRoute, reservaController.getAllReservas);

/**
 * @swagger
 * /api/reservas/{id}:
 *   get:
 *     summary: Obtener una reserva por ID
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Detalle de la reserva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', protectRoute, reservaController.getReservaById);

/**
 * @swagger
 * /api/reservas/usuario/{usuariosId}:
 *   get:
 *     summary: Obtener reservas por usuario
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuariosId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:usuariosId', protectRoute, reservaController.getReservasByUsuario);

/**
 * @swagger
 * /api/reservas/habitacion/{habitacionId}:
 *   get:
 *     summary: Obtener reservas por habitación
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: habitacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la habitación
 *     responses:
 *       200:
 *         description: Lista de reservas para la habitación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/habitacion/:habitacionId', protectRoute, reservaController.getReservasByHabitacion);

/**
 * @swagger
 * /api/reservas/estado/{estado}:
 *   get:
 *     summary: Obtener reservas por estado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [confirmada, pendiente, cancelada]
 *         description: Estado de la reserva
 *     responses:
 *       200:
 *         description: Lista de reservas con el estado especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/estado/:estado', protectRoute, reservaController.getReservasByEstado);

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - habitacion_id
 *               - usuarios_id
 *               - fecha_entrada
 *               - fecha_salida
 *             properties:
 *               habitacion_id:
 *                 type: integer
 *                 description: ID de la habitación a reservar
 *               usuarios_id:
 *                 type: integer
 *                 description: ID del usuario que realiza la reserva
 *               fecha_entrada:
 *                 type: string
 *                 format: date
 *                 description: Fecha de check-in (YYYY-MM-DD)
 *               fecha_salida:
 *                 type: string
 *                 format: date
 *                 description: Fecha de check-out (YYYY-MM-DD)
 *               estado_reserva:
 *                 type: string
 *                 enum: [confirmada, pendiente, cancelada]
 *                 description: Estado de la reserva (opcional, valor por defecto "confirmada")
 *               total_a_pagar:
 *                 type: number
 *                 format: float
 *                 description: Monto total a pagar (opcional, se calcula automáticamente)
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', protectRoute, reservaController.createReserva);

/**
 * @swagger
 * /api/reservas/{id}:
 *   put:
 *     summary: Actualizar una reserva existente
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               habitacion_id:
 *                 type: integer
 *                 description: ID de la habitación
 *               usuarios_id:
 *                 type: integer
 *                 description: ID del usuario
 *               fecha_entrada:
 *                 type: string
 *                 format: date
 *                 description: Fecha de check-in (YYYY-MM-DD)
 *               fecha_salida:
 *                 type: string
 *                 format: date
 *                 description: Fecha de check-out (YYYY-MM-DD)
 *               estado_reserva:
 *                 type: string
 *                 enum: [confirmada, pendiente, cancelada]
 *                 description: Estado de la reserva
 *               total_a_pagar:
 *                 type: number
 *                 format: float
 *                 description: Monto total a pagar
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', protectRoute, reservaController.updateReserva);

/**
 * @swagger
 * /api/reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva eliminada correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', protectRoute, reservaController.deleteReserva);

module.exports = router;
