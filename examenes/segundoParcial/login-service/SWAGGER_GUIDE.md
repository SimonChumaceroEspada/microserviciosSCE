# Instrucciones para instalar y usar Swagger en login-service

## 1. Instalar dependencias

Ejecuta el siguiente comando en la carpeta del proyecto login-service:

```bash
npm install swagger-jsdoc swagger-ui-express --save
```

## 2. Iniciar el servicio

Después de instalar las dependencias, inicia el servicio con:

```bash
npm start
```

## 3. Acceder a la documentación Swagger

Una vez que el servicio esté corriendo, puedes acceder a la documentación Swagger en:

http://localhost:3001/api-docs

## Funcionalidades documentadas

La documentación Swagger incluye los siguientes endpoints:

### Autenticación

- **POST /api/auth/login** - Iniciar sesión con correo y contraseña
  - Cuerpo de la solicitud: `{ "correo": "usuario@ejemplo.com", "password": "contraseña" }`
  - Respuesta exitosa: Token JWT y datos del usuario

- **POST /api/auth/register** - Registrar un nuevo usuario
  - Cuerpo de la solicitud: `{ "correo": "nuevo@ejemplo.com", "password": "contraseña" }`
  - Respuesta exitosa: Token JWT y datos del usuario creado

### Usuarios

- **GET /api/auth/me** - Obtener información del usuario autenticado
  - Requiere: Token JWT en el encabezado de autorización
  - Respuesta exitosa: Datos del usuario autenticado

## Cómo usar los endpoints

1. Para **registrar** un nuevo usuario, usa el endpoint `/api/auth/register` con un correo y contraseña.
2. Para **iniciar sesión**, usa el endpoint `/api/auth/login` con las credenciales.
3. Guarda el token JWT devuelto en la respuesta.
4. Para acceder a rutas protegidas como `/api/auth/me`, incluye el token en el encabezado de autorización:
   - `Authorization: Bearer [tu_token_jwt]`

## Pruebas desde Swagger UI

1. Ejecuta operaciones de login o register para obtener un token.
2. Haz clic en el botón "Authorize" en la parte superior de la página de Swagger.
3. Ingresa tu token en el formato: `Bearer [tu_token_jwt]`
4. Ahora puedes probar los endpoints protegidos directamente desde la interfaz Swagger.
