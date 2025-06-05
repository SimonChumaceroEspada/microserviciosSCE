// jwt-key-helper.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// La clave secreta original
const originalSecret = 'hotel_jwt_secret_key';

// Información sobre la clave original
console.log('==== Información de clave JWT ====');
console.log('Clave secreta original:', originalSecret);
console.log('Longitud en caracteres:', originalSecret.length);
console.log('Longitud en bytes:', Buffer.from(originalSecret).length);
console.log('Longitud en bits:', Buffer.from(originalSecret).length * 8);

// Generar una versión segura usando SHA-256 (misma técnica que en Java)
console.log('\n==== Versión mejorada de la clave (SHA-256) ====');
const hash = crypto.createHash('sha256').update(originalSecret).digest();
console.log('SHA-256 hash (hex):', hash.toString('hex'));
console.log('Longitud en bytes:', hash.length);
console.log('Longitud en bits:', hash.length * 8);
console.log('Base64 key:', hash.toString('base64'));

// Crear un token de ejemplo usando la clave segura
const payload = {
  id: 123,
  correo: 'test@example.com',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
};

// Generar token con clave original
const originalToken = jwt.sign(payload, originalSecret);
console.log('\n==== Token con clave original ====');
console.log(originalToken);

// Generar token con clave mejorada (SHA-256)
const secureToken = jwt.sign(payload, hash);
console.log('\n==== Token con clave mejorada (SHA-256) ====');
console.log(secureToken);

// Verificación
try {
  const verifiedOriginal = jwt.verify(originalToken, originalSecret);
  console.log('\nVerificación con clave original: OK');
} catch (err) {
  console.error('\nError verificando con clave original:', err.message);
}

try {
  const verifiedSecure = jwt.verify(secureToken, hash);
  console.log('Verificación con clave mejorada: OK');
} catch (err) {
  console.error('Error verificando con clave mejorada:', err.message);
}

// Guardar la nueva clave en un archivo para usar en los servicios
fs.writeFileSync('secure-jwt-key.txt', hash.toString('base64'));
console.log('\nNueva clave guardada en secure-jwt-key.txt');
