const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { generateSecureKey } = require('../utils/jwtHelper');

// Login controller
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validate input
    if (!correo || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Correo y contraseña son requeridos' 
      });
    }

    // Find user by email
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ?', 
      [correo]
    );

    // Check if user exists
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const user = rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }    // Generate JWT token with secure key
    const secureKey = generateSecureKey(process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      secureKey,
      { expiresIn: '24h' }
    );

    // Return token and user info (without password)
    delete user.password;
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// Register controller (optional for user creation)
exports.register = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validate input
    if (!correo || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Correo y contraseña son requeridos' 
      });
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ?', 
      [correo]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'El usuario ya existe' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.query(
      'INSERT INTO usuarios (correo, password) VALUES (?, ?)',
      [correo, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, correo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: result.insertId,
        correo
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// Get user info
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      'SELECT id, correo, created_at, updated_at FROM usuarios WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      user: rows[0]
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};
