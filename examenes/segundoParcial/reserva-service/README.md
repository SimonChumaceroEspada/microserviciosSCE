# Reserva Microservice

Este microservicio gestiona las reservas del hotel utilizando una API REST para las operaciones CRUD, implementando JWT para autenticación y MySQL como base de datos.

## Funcionalidades

- Creación, consulta, actualización y eliminación de reservas
- Consulta de reservas por usuario, habitación o estado
- Cancelación de reservas
- Validación de disponibilidad de habitaciones
- Autenticación mediante JWT

## Tecnologías utilizadas

- Node.js
- Express
- REST API
- MySQL para almacenamiento de datos
- JWT para autenticación

## Estructura de base de datos

La tabla `reservas` tiene la siguiente estructura:

```sql
CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habitacion_id INT NOT NULL,
  usuarios_id INT NOT NULL,
  fecha_reserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  estado_reserva VARCHAR(20) NOT NULL, -- confirmada, pendiente, cancelada
  total_a_pagar DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id),
  FOREIGN KEY (usuarios_id) REFERENCES usuarios(id)
);
```

## Instalación y configuración

1. Instalar dependencias:
   ```
   npm install
   ```

2. Configurar variables de entorno:
   Crear un archivo `.env` con las siguientes variables:
   ```
   PORT=3003
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=hotel_db
   JWT_SECRET=tu_clave_secreta
   ```

3. Iniciar el servidor:
   ```
   npm start
   ```

   Para desarrollo:
   ```
   npm run dev
   ```

## API REST

### Endpoints

#### Públicos
- `GET /api/reservas/status` - Verificar estado del servicio

#### Protegidos (requieren token JWT)
- `GET /api/reservas` - Obtener todas las reservas
- `GET /api/reservas/:id` - Obtener reserva por ID
- `GET /api/reservas/usuario/:usuariosId` - Obtener reservas por usuario
- `GET /api/reservas/habitacion/:habitacionId` - Obtener reservas por habitación
- `GET /api/reservas/estado/:estado` - Obtener reservas por estado
- `POST /api/reservas` - Crear nueva reserva
- `PUT /api/reservas/:id` - Actualizar reserva existente
- `DELETE /api/reservas/:id` - Eliminar reserva

## Autenticación

Para acceder a los endpoints protegidos, se debe incluir el token JWT en el encabezado de la solicitud:

```
Authorization: Bearer token_jwt
```

El token JWT debe ser obtenido desde el microservicio de login.
