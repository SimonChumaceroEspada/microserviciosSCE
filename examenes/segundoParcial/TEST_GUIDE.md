# Guía de Pruebas para Microservicios del Hotel

Esta guía describe cómo probar los tres microservicios del sistema de gestión de hotel:
1. Login Service (Autenticación - Puerto 3001)
2. Habitaciones Service (Gestión de Habitaciones - Puerto 3002)
3. Reservas Service (Gestión de Reservas - Puerto 3003)

## Opción Rápida: Script Automatizado

Para una prueba rápida de los tres servicios, puede utilizar el script automatizado:

```powershell
.\test-all-services.ps1
```

Este script proporciona un menú interactivo para probar todas las funcionalidades principales de los tres microservicios, y mantiene el JWT token y otros IDs necesarios entre operaciones.

## Requisitos Previos

1. MongoDB en ejecución para el servicio de habitaciones
2. MySQL en ejecución para los servicios de login y reservas
3. Node.js y Maven instalados
4. Postman para realizar las pruebas

## Paso 1: Iniciar los Servicios

Ejecute el script PowerShell para iniciar todos los servicios:

```powershell
.\test-microservices.ps1
```

## Paso 2: Probar el Servicio de Login (Puerto 3001)

### 2.1 Registrar un Nuevo Usuario

**Endpoint**: POST http://localhost:3001/api/auth/register

**Body**:
```json
{
  "nombre": "Usuario Prueba",
  "correo": "test@example.com",
  "password": "password123",
  "tipoUsuario": "cliente"
}
```

### 2.2 Iniciar Sesión

**Endpoint**: POST http://localhost:3001/api/auth/login

**Body**:
```json
{
  "correo": "test@example.com",
  "password": "password123"
}
```

**Respuesta Esperada**: Token JWT y datos del usuario

```json
{
  "success": true,
  "token": "eyJhbGciOiJ...",
  "user": {
    "id": 1,
    "nombre": "Usuario Prueba",
    "correo": "test@example.com",
    "tipoUsuario": "cliente"
  }
}
```

⚠️ **IMPORTANTE**: Guarde este token para las siguientes pruebas.

### 2.3 Verificar el Perfil

**Endpoint**: GET http://localhost:3001/api/auth/profile

**Headers**:
```
Authorization: Bearer [TOKEN_JWT]
```

## Paso 3: Probar el Servicio de Habitaciones (Puerto 3002)

### 3.1 Crear un Tipo de Habitación

**Endpoint**: POST http://localhost:3002/api/tipos-habitacion

**Body**:
```json
{
  "nombre": "Suite Presidencial",
  "descripcion": "Suite de lujo",
  "precioPorNoche": 350.00,
  "capacidad": 2
}
```

### 3.2 Listar Tipos de Habitaciones

**Endpoint**: GET http://localhost:3002/api/tipos-habitacion

### 3.3 Crear una Habitación

**Endpoint**: POST http://localhost:3002/api/habitaciones

**Body**:
```json
{
  "numeroHabitacion": "101",
  "tipoHabitacionId": "[ID_TIPO_HABITACION]",
  "estado": "disponible",
  "descripcion": "Habitación con vista al mar"
}
```

⚠️ **IMPORTANTE**: Reemplace [ID_TIPO_HABITACION] con el ID real obtenido en el paso 3.1

### 3.4 Listar Habitaciones

**Endpoint**: GET http://localhost:3002/api/habitaciones

## Paso 4: Probar el Servicio de Reservas (Puerto 3003)

### 4.1 Verificar Estado del Servicio

**Endpoint**: GET http://localhost:3003/api/reservas/status

### 4.2 Crear una Reserva

**Endpoint**: POST http://localhost:3003/api/reservas

**Headers**:
```
Authorization: Bearer [TOKEN_JWT]
```

**Body**:
```json
{
  "habitacion_id": "[ID_HABITACION]",
  "usuarios_id": "[ID_USUARIO]",
  "fecha_entrada": "2025-06-01",
  "fecha_salida": "2025-06-05",
  "estado_reserva": "confirmada",
  "total_a_pagar": 1750.00
}
```

⚠️ **IMPORTANTE**: 
- Reemplace [ID_HABITACION] con el ID obtenido en el paso 3.3
- Reemplace [ID_USUARIO] con el ID obtenido en el paso 2.2
- Si el token incluye el ID del usuario, puede omitir el campo "usuarios_id"
- El campo "total_a_pagar" es obligatorio y no puede ser null. Este valor debería calcularse multiplicando el precio por noche de la habitación por el número de días de la estancia.

### 4.3 Listar Reservas

**Endpoint**: GET http://localhost:3003/api/reservas

**Headers**:
```
Authorization: Bearer [TOKEN_JWT]
```

### 4.4 Consultar Reserva por ID

**Endpoint**: GET http://localhost:3003/api/reservas/[ID_RESERVA]

**Headers**:
```
Authorization: Bearer [TOKEN_JWT]
```

## Paso 5: Verificación en la Base de Datos

### 5.1 Verificar Datos en MongoDB (Habitaciones)

```bash
mongosh
use habitaciones_db
db.tipos_habitacion.find()
db.habitaciones.find()
```

### 5.2 Verificar Datos en MySQL (Login y Reservas)

```bash
mysql -u root -p
USE hotel_db;
SELECT * FROM usuarios;
SELECT * FROM reservas;
```

## Problemas Comunes y Soluciones

### Error de JWT (Invalid Signature)

Si aparece el error "invalid signature" al verificar un token JWT, asegúrese de que:
1. El valor de JWT_SECRET es el mismo en todos los servicios
2. El método `generateSecureKey()` se utiliza de la misma manera en todos los servicios

### Error al Crear Reserva (NULL values)

Si aparece un error de "Column 'X' cannot be null", asegúrese de:
1. Enviar todos los campos requeridos en el cuerpo de la petición
2. Verificar que los IDs (habitacion_id, usuarios_id) sean válidos y existan en sus respectivas bases de datos

### Errores de CORS

Si hay errores de CORS al probar desde una aplicación frontend:
1. Asegúrese de que los middlewares CORS estén configurados correctamente en cada servicio
2. Verifique que las solicitudes preflight OPTIONS sean manejadas correctamente
