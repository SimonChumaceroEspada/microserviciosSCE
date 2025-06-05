# Habitaciones Microservice

Este microservicio gestiona las habitaciones del hotel y sus tipos, implementando operaciones CRUD protegidas con JWT.

## Funcionalidades

- Gestión de habitaciones (crear, consultar, actualizar, eliminar)
- Gestión de tipos de habitación (crear, consultar, actualizar, eliminar)
- Autenticación mediante JWT
- Endpoints públicos para consultar habitaciones disponibles

## Tecnologías utilizadas

- Java 17
- Spring Boot
- Spring Security
- JWT para autenticación
- MongoDB para almacenamiento de datos

## Estructura de base de datos

La base de datos MongoDB contiene dos colecciones:

1. `habitaciones`:
   - id: identificador único de la habitación
   - numeroHabitacion: número de la habitación
   - tipoHabitacionId: referencia al tipo de habitación
   - estado: disponible, ocupada, en mantenimiento
   - descripcion: descripción de la habitación
   - createdAt: fecha de creación
   - updatedAt: fecha de actualización

2. `tipos_habitacion`:
   - id: identificador único del tipo de habitación
   - nombre: nombre del tipo (individual, doble, suite, etc.)
   - descripcion: descripción del tipo de habitación
   - precioPorNoche: precio por noche
   - capacidad: número de personas que pueden alojarse
   - createdAt: fecha de creación
   - updatedAt: fecha de actualización

## Instalación y configuración

1. Asegúrate de tener instalado:
   - Java 17 o superior
   - MongoDB
   - Maven

2. Configurar las variables de entorno en `application.properties`

3. Construir el proyecto:
   ```
   mvn clean install
   ```

4. Ejecutar:
   ```
   java -jar target/habitaciones-service-0.0.1-SNAPSHOT.jar
   ```

## Endpoints API

### Habitaciones

- `GET /api/habitaciones` - Obtener todas las habitaciones
- `GET /api/habitaciones/{id}` - Obtener habitación por ID
- `GET /api/habitaciones/estado/{estado}` - Obtener habitaciones por estado
- `POST /api/habitaciones` - Crear nueva habitación
- `PUT /api/habitaciones/{id}` - Actualizar habitación
- `DELETE /api/habitaciones/{id}` - Eliminar habitación
- `GET /api/habitaciones/public/disponibles` - Obtener habitaciones disponibles (público)

### Tipos de Habitación

- `GET /api/tipos-habitacion` - Obtener todos los tipos de habitación
- `GET /api/tipos-habitacion/{id}` - Obtener tipo de habitación por ID
- `POST /api/tipos-habitacion` - Crear nuevo tipo de habitación
- `PUT /api/tipos-habitacion/{id}` - Actualizar tipo de habitación
- `DELETE /api/tipos-habitacion/{id}` - Eliminar tipo de habitación
- `GET /api/tipos-habitacion/public` - Obtener todos los tipos de habitación (público)

## Autenticación

Para acceder a los endpoints protegidos, se debe incluir el token JWT en el encabezado:

```
Authorization: Bearer token_jwt
```

El token JWT debe ser obtenido desde el microservicio de login.
