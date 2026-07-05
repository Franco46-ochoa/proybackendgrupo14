# SmartMargin AI - Documentación API

## Información General

- **URL Base**: `http://localhost:3000`
- **Formato**: JSON
- **Autenticación**: JWT Bearer Token
- **Protección CSRF**: Cookie `XSRF-TOKEN` + Header `X-XSRF-Token`

## Autenticación

### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "string",
  "email": "string",
  "password": "string (min 6)",
  "rol": "dueno|gerente|empleado|administrador",
  "sector": "ventas|finanzas|stock"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": { "id": 1, "nombre": "...", "email": "...", "rol": "..." },
  "token": "jwt_token",
  "message": "Login exitoso"
}
```

### Perfil
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### CSRF Token
```http
GET /api/csrf-token
```

---

## Usuarios

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/usuarios` | Listar | dueno |
| POST | `/api/usuarios` | Crear | dueno |
| PUT | `/api/usuarios/:id` | Actualizar | dueno |
| DELETE | `/api/usuarios/:id` | Desactivar | dueno |

### Filtros GET
- `page` (default: 1)
- `limit` (default: 10)
- `rol` - filtrar por rol
- `activo` - true/false
- `busqueda` - buscar por nombre o email

---

## Zonas

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/zonas` | Listar | dueno, gerente |
| POST | `/api/zonas` | Crear | dueno |
| PUT | `/api/zonas/:id` | Actualizar | dueno |
| DELETE | `/api/zonas/:id` | Eliminar | dueno |

### Filtros GET
- `page` (default: 1)
- `limit` (default: 10)

---

## Sucursales

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/sucursales` | Listar | dueno, gerente, empleado |
| POST | `/api/sucursales` | Crear | dueno |
| PUT | `/api/sucursales/:id` | Actualizar | dueno |
| DELETE | `/api/sucursales/:id` | Eliminar | dueno |

### Filtros GET
- `page` (default: 1)
- `limit` (default: 10)

---

## Productos

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/productos` | Listar | dueno, gerente, empleado |
| POST | `/api/productos` | Crear | dueno, gerente, empleado |
| PUT | `/api/productos/:id` | Actualizar | dueno, gerente, empleado |
| DELETE | `/api/productos/:id` | Eliminar | dueno, gerente |

### Campos Producto
- `nombre` (requerido)
- `codigo` (requerido, único)
- `categoria` (opcional)
- `descripcion` (opcional)
- `precioCompra` (requerido, > 0)
- `unidadMedida` (opcional, default: "unidad")

### Filtros GET
- `page` (default: 1)
- `limit` (default: 10)
- `categoria` - filtrar por categoría
- `busqueda` - buscar por nombre

---

## Inventario

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/inventario` | Listar | dueno, gerente, empleado |
| POST | `/api/inventario` | Crear | dueno, gerente, empleado |
| PUT | `/api/inventario/:id` | Actualizar | dueno, gerente, empleado |
| DELETE | `/api/inventario/:id` | Eliminar | dueno, gerente |

### Campos Inventario
- `productoId` (requerido)
- `sucursalId` (requerido)
- `stockActual` (requerido, >= 0)
- `stockMinimo` (requerido, >= 0)
- `stockMaximo` (opcional)
- `precioVenta` (requerido, > 0)

### Filtros GET
- `page` (default: 1)
- `limit` (default: 10)
- `stockCritico` - true para stock < stockMinimo

---

## Transacciones

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/transacciones` | Listar | dueno, gerente, empleado |
| POST | `/api/transacciones` | Crear | dueno, gerente, empleado |
| PUT | `/api/transacciones/:id` | Actualizar | dueno, gerente, empleado |
| DELETE | `/api/transacciones/:id` | Eliminar | dueno, gerente |

### Campos Transacción
- `tipo` (requerido): "venta" o "compra"
- `cantidad` (requerido, >= 1)
- `precioUnitario` (requerido, > 0)
- `total` (calculado automáticamente)
- `productoId` (requerido)
- `sucursalId` (requerido)
- `fecha` (opcional, ISO8601)
- `observaciones` (opcional)

### Filtros GET
- `page` (default: 1)
- `limit` (default: 10)
- `fechaDesde` - fecha inicio
- `fechaHasta` - fecha fin
- `sucursalId` - filtrar por sucursal
- `tipo` - "venta" o "compra"

---

## Gastos

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/gastos` | Listar | dueno, gerente, empleado |
| POST | `/api/gastos` | Crear | dueno, gerente, empleado |
| PUT | `/api/gastos/:id` | Actualizar | dueno, gerente, empleado |
| DELETE | `/api/gastos/:id` | Eliminar | dueno, gerente |

### Campos Gasto
- `tipo` (requerido): "Alquiler", "Servicios", "Sueldos", "Mantenimiento", "Impuestos"
- `monto` (requerido, > 0)
- `descripcion` (opcional)
- `fecha` (opcional, ISO8601)
- `anomalia` (opcional, default: false)
- `proveedorId` (opcional)
- `sucursalId` (requerido)

### Filtros GET
- `page` (default: 1)
- `limit` (default: 10)
- `sucursalId` - filtrar por sucursal
- `proveedorId` - filtrar por proveedor
- `tipo` - filtrar por tipo de gasto
- `fechaDesde` - fecha inicio
- `fechaHasta` - fecha fin

---

## Proveedores

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/proveedores` | Listar | dueno, gerente |
| POST | `/api/proveedores` | Crear | dueno, gerente |
| PUT | `/api/proveedores/:id` | Actualizar | dueno, gerente |
| DELETE | `/api/proveedores/:id` | Eliminar | dueno |

### Campos Proveedor
- `nombre` (requerido)
- `cuit` (requerido, único)
- `contacto` (opcional)

### Filtros GET
- `page` (default: 1)
- `limit` (default: 10)
- `busqueda` - buscar por nombre, CUIT o contacto

---

## Respuestas Estándar

### Éxito
```json
{
  "success": true,
  "data": { ... },
  "message": "Descripción del éxito"
}
```

### Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    { "campo": "email", "mensaje": "Email invalido" }
  ]
}
```

### Listado Paginado
```json
{
  "success": true,
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado |
| 400 | Bad Request (validación) |
| 401 | No autenticado |
| 403 | No autorizado (rol insuficiente) |
| 404 | No encontrado |
| 500 | Error del servidor |

---

## Roles

| Rol | Permisos |
|-----|----------|
| `dueno` | Total acceso |
| `gerente` | Lectura general, escritura limitada |
| `empleado` | Lectura y escritura básica |
| `administrador` | (Próximamente - V3) |

---

## Usar la Collection de Postman

1. Importar `SmartMargin.postman_collection.json` en Postman
2. Ejecutar login para obtener el token automáticamente
3. Todos los requests usan el token de la variable `token`
