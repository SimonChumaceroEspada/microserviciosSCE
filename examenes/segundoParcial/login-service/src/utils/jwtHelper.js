// jwtHelper.js
const crypto = require('crypto');

/**
 * Genera una clave segura para JWT usando SHA-256
 * @param {string} secretKey - La clave secreta original
 * @returns {Buffer} - La clave segura generada
 */
exports.generateSecureKey = (secretKey) => {
  return crypto.createHash('sha256').update(secretKey).digest();
};
