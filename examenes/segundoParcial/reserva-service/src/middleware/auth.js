const jwt = require('jsonwebtoken');
const { generateSecureKey } = require('../utils/jwtHelper');
require('dotenv').config();

const authMiddleware = async (req) => {
  const authHeader = req.headers.authorization || '';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null };
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return { user: null };
  }

  try {
    // Ensure we're using the exact same method to generate the secure key as in login-service
    const secureKey = generateSecureKey(process.env.JWT_SECRET);
    // Use the secureKey buffer for verification
    const decodedToken = jwt.verify(token, secureKey);
    return { user: decodedToken };
  } catch (error) {
    console.error('Error al verificar token JWT:', error);
    return { user: null };
  }
};

module.exports = authMiddleware;
