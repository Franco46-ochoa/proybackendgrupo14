# Estrategia de Migración de Datos Legado — SmartMargin AI

## Overview

Documentación de la estrategia para importar datos desde sistemas legados de empresas con años de historia. No se implementa en el Sprint 2, pero deja el camino listo para una extensión futura.

---

## Flujo de Importación (ETL)

```
┌──────────────────────────────────────────────────────────────┐
│  FLUJO ETL: Sistema Legado → SmartMargin AI                  │
│                                                              │
│  1. EXPORTACIÓN                                               │
│     Sistema legado → CSV/Excel (productos, ventas, stock)     │
│                                                              │
│  2. SCRIPT ETL (Node.js + csv-parser)                        │
│     ├── Leer CSV fila por fila                               │
│     ├── Mapear columnas del legado al esquema SmartMargin    │
│     │   ej: "COD_ARTICULO" → "codigo"                        │
│     │   ej: "STOCK_ACT" → "stockActual"                      │
│     │   ej: "PRECIO_VTA" → "precioVenta"                     │
│     └── Transformar tipos (string → number, fecha → Date)    │
│                                                              │
│  3. VALIDACIÓN Y DEDUPLICACIÓN                                │
│     ├── Validar campos obligatorios (nombre, codigo)         │
│     ├── Detectar duplicados por CUIT (proveedores)           │
│     ├── Detectar duplicados por codigo (productos)           │
│     ├── Log de filas rechazadas con motivo                   │
│     └── Reporte: X válidas, Y duplicadas, Z inválidas        │
│                                                              │
│  4. CARGA MASIVA                                              │
│     ├── Opción A: Sequelize bulkCreate({ validate: false })  │
│     │   → hasta ~50.000 registros en segundos                │
│     ├── Opción B: PostgreSQL COPY (para +100K registros)     │
│     │   → copia directa a nivel BD, sin pasar por ORM        │
│     └── Transacciones atómicas: todo o nada                  │
│                                                              │
│  5. REGISTRO EN AUDITORÍA                                     │
│     Tabla auditoria:                                          │
│     ├── accion: 'IMPORT'                                      │
│     ├── entidad: 'Productos' / 'Transacciones' / etc.        │
│     ├── datosNuevos: { cantidad: 5420, errores: 12 }         │
│     └── usuarioId: quién ejecutó la importación              │
└──────────────────────────────────────────────────────────────┘
```

---

## Ejemplo de Script ETL

```javascript
// scripts/importar-productos.js
const csv = require('csv-parser');
const fs = require('fs');
const { Producto, Inventario, sequelize } = require('../src/models');

const MAPEO_COLUMNAS = {
  'COD_ARTICULO': 'codigo',
  'DESCRIPCION': 'nombre',
  'RUBRO': 'categoria',
  'P_COSTO': 'precioCompra',
  'UNIDAD': 'unidadMedida',
};

async function importar(rutaCSV, sucursalId) {
  const productos = [];
  const errores = [];

  // 1. Leer y mapear
  fs.createReadStream(rutaCSV)
    .pipe(csv())
    .on('data', (row) => {
      const mapped = {};
      for (const [legacy, nuevo] of Object.entries(MAPEO_COLUMNAS)) {
        mapped[nuevo] = row[legacy] || null;
      }

      // 2. Validar
      if (!mapped.codigo || !mapped.nombre) {
        errores.push({ fila: row, motivo: 'codigo o nombre vacío' });
        return;
      }
      mapped.activo = true;
      productos.push(mapped);
    })
    .on('end', async () => {
      // 3. Deduplicar
      const codigos = productos.map(p => p.codigo);
      const existentes = await Producto.findAll({ where: { codigo: codigos } });
      const codigosExistentes = new Set(existentes.map(p => p.codigo));
      const nuevos = productos.filter(p => !codigosExistentes.has(p.codigo));

      // 4. Carga masiva
      await sequelize.transaction(async (t) => {
        await Producto.bulkCreate(nuevos, { validate: false, transaction: t });
      });

      // 5. Auditoría
      console.log(`Importados: ${nuevos.length}, Errores: ${errores.length}`);
    });
}
```

---

## Consideraciones para Grandes Volúmenes

| Volumen | Estrategia | Tiempo Estimado |
|---------|------------|-----------------|
| 1 - 10.000 | `bulkCreate()` de Sequelize | Segundos |
| 10.000 - 50.000 | `bulkCreate({ validate: false })` en lotes de 1.000 | 1-5 minutos |
| 50.000 - 500.000 | PostgreSQL COPY FROM (carga directa a nivel BD) | Segundos a 1 minuto |
| +500.000 | COPY + índices deshabilitados durante carga + recrear post-carga | Variable |

---

## Dependencias Necesarias

```bash
npm install csv-parser
```

---

## Mapeo de Columnas Comunes

### Productos

| Columna Legado | Columna SmartMargin |
|----------------|---------------------|
| COD_ARTICULO | codigo |
| DESCRIPCION | nombre |
| RUBRO | categoria |
| P_COSTO | precioCompra |
| UNIDAD | unidadMedida |

### Proveedores

| Columna Legado | Columna SmartMargin |
|----------------|---------------------|
| CUIT | cuit |
| RAZON_SOCIAL | nombre |
| CONTACTO | contacto |

### Transacciones

| Columna Legado | Columna SmartMargin |
|----------------|---------------------|
| TIPO_OPERACION | tipo |
| CANTIDAD | cantidad |
| PRECIO_UNITARIO | precioUnitario |
| FECHA | fecha |

---

## Validaciones

1. **Campos obligatorios**: nombre, codigo (productos); cuit, nombre (proveedores)
2. **Detección de duplicados**: por CUIT (proveedores), por código (productos)
3. **Integridad referencial**: verificar que sucursalId, productoId, etc. existan
4. **Formato de fechas**: validar ISO8601 o formato local

---

## Registro de Auditoría

Cada importación debe registrarse en la tabla `auditoria`:

```json
{
  "accion": "IMPORT",
  "entidad": "Productos",
  "entidadId": null,
  "datosAnteriores": null,
  "datosNuevos": {
    "cantidad": 5420,
    "errores": 12,
    "duplicados": 8,
    "archivo": "productos_legado.csv"
  },
  "usuarioId": 1
}
```

---

## Roadmap de Implementación

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Documentar estrategia ETL | ✅ Completado |
| 2 | Crear script base de importación | Pendiente |
| 3 | Implementar deduplicación | Pendiente |
| 4 | Agregar registro de auditoría | Pendiente |
| 5 | Crear interfaz web para importación | Pendiente |

---

## Notas para la Defensa del TFI

- **Estrategia ETL**: demuestra conocimiento de integración de sistemas
- **Escalabilidad**: manejo de grandes volúmenes con estrategias diferentes
- **Auditoría**: trazabilidad completa de cada importación
- **Validación**: integridad de datos antes de la carga
