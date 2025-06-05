# Sistema de Gestión Hotelera - Microservicios

Este proyecto implementa un sistema de gestión hotelera utilizando una arquitectura de microservicios que incluye:

1. **Microservicio de Login** (Node.js + MySQL)
2. **Microservicio de Habitaciones** (Java + MongoDB)
3. **Microservicio de Reservas** (Node.js + GraphQL + MySQL)

## Arquitectura del Sistema

Los microservicios se comunican entre sí a través de API REST y GraphQL, compartiendo autenticación mediante tokens JWT.

### Diagrama de la Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Login Service  │◄────►│ Habitaciones    │◄────►│  Reserva        │
│  (Node.js+MySQL)│      │ Service         │      │  Service        │
│  Puerto: 3001   │      │ (Java+MongoDB)  │      │  (Node+GraphQL) │
│                 │      │  Puerto: 3002   │      │  Puerto: 3003   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │                     │
                       │  Cliente / Frontend │
                       │                     │
                       └─────────────────────┘
```

## Bases de Datos

- **MySQL**: Almacena información de usuarios y reservas
- **MongoDB**: Almacena información de habitaciones y tipos de habitación

## Requisitos del Sistema

- Java 17 o superior
- Node.js 14 o superior
- MySQL 8.0 o superior
- MongoDB 4.4 o superior

## Configuración e Instalación

### 1. Preparar la Base de Datos MySQL

Ejecutar el script SQL para configurar la base de datos:

```bash
mysql -u root -p < hotel_db.sql
```

### 2. Configurar MongoDB

Asegurarse de tener MongoDB instalado y ejecutándose en el puerto predeterminado (27017).

### 3. Iniciar el Microservicio de Login

```bash
cd login-service
npm install
npm start
```

El servicio estará disponible en: http://localhost:3001

### 4. Iniciar el Microservicio de Habitaciones

```bash
cd habitaciones-service
./mvnw spring-boot:run
```

O utilizando Maven directamente:

```bash
cd habitaciones-service
mvn spring-boot:run
```

El servicio estará disponible en: http://localhost:3002

### 5. Iniciar el Microservicio de Reservas

```bash
cd reserva-service
npm install
npm start
```

El servicio GraphQL estará disponible en: http://localhost:3003/graphql

## Flujo de Funcionamiento

1. El usuario se autentica mediante el microservicio de login y obtiene un token JWT
2. El token JWT se utiliza para hacer peticiones a los demás microservicios
3. El microservicio de habitaciones proporciona información sobre las habitaciones disponibles
4. El microservicio de reservas permite crear y gestionar reservas de habitaciones

## Estructura de Datos

### Usuarios
- id: identificador único de usuario
- correo: correo electrónico
- password: contraseña de usuario

### Habitaciones
- id: identificador único de la habitación
- numero_habitacion
- tipo_habitacion_id: tipo de habitación (ejm, individual, doble, suite)
- estado: estado actual (disponible, ocupada, en mantenimiento)
- descripción

### Reservas
- habitación_id: identificador de la habitación reservada
- usuarios_id: identificador del usuario que realiza la reserva
- fecha_reserva: fecha en la que se realizó la reserva
- fecha_entrada: fecha de inicio de la estadía
- fecha_salida: fecha fin de la estadía
- estado_reserva: estado de la reserva (confirmada, pendiente, cancelada)
- total_a_pagar: Monto total calculado para la estadía

## Servicios API

Consultar los README.md individuales de cada microservicio para obtener detalles específicos sobre los endpoints y operaciones disponibles.
