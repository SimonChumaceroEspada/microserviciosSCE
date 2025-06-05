# Login Microservice

Este microservicio se encarga de la autenticación de usuarios y generación de tokens JWT.

## Funcionalidades

- Login de usuarios
- Registro de usuarios
- Verificación de tokens JWT
- Obtención de información del usuario autenticado

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- JWT para autenticación
- bcrypt para encriptación de contraseñas

## Estructura de base de datos

La tabla `usuarios` tiene la siguiente estructura:

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

## Instalación y configuración

1. Instalar dependencias:
   ```
   npm install
   ```

2. Configurar variables de entorno:
   Crear un archivo `.env` con las siguientes variables:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=hotel_db
   JWT_SECRET=tu_clave_secreta
   ```

3. Inicializar la base de datos:
   ```
   node src/config/setup.js
   ```

4. Iniciar el servidor:
   ```
   npm start
   ```

   Para desarrollo:
   ```
   npm run dev
   ```

## Endpoints API

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
  - Body: `{ "correo": "email@example.com", "password": "password" }`
  - Response: `{ "success": true, "token": "jwt_token", "user": { ... } }`

- `POST /api/auth/register` - Registrar nuevo usuario
  - Body: `{ "correo": "email@example.com", "password": "password" }`
  - Response: `{ "success": true, "token": "jwt_token", "user": { ... } }`

- `GET /api/auth/me` - Obtener información del usuario autenticado
  - Headers: `Authorization: Bearer jwt_token`
  - Response: `{ "success": true, "user": { ... } }`
