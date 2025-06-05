const jwt = require('jsonwebtoken');
const fs = require('fs');

// Secret key
const secret = 'hotel_jwt_secret_key';

// Create payload
const payload = {
  correo: 'test@example.com',
  id: 123
};

// Token options (no algorithm specified to use default HS256)
const options = {
  expiresIn: '1h'
};

// Generate token
const token = jwt.sign(payload, secret, options);

// Print token
console.log('\nGenerated JWT Token:');
console.log(token);

// Decode and verify token
const decoded = jwt.verify(token, secret);
console.log('\nVerified Decoded Token:');
console.log(JSON.stringify(decoded, null, 2));

// Print base64 encoded secret (for comparison)
console.log('\nKey in Base64:');
console.log(Buffer.from(secret).toString('base64'));

// Write to file
fs.writeFileSync('test-token.txt', token);
console.log('\nToken saved to test-token.txt');
