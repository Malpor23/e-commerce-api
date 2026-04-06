# E-commerce REST API

API REST completamente pública para e-commerce construida con **NestJS**, **TypeORM** y **PostgreSQL**, **Docker**.

---

## Stack tecnológico

| Capa            | Tecnología                          |
|-----------------|-------------------------------------|
| Framework       | NestJS 11                           |
| ORM             | TypeORM 0.3                         |
| Base de datos   | PostgreSQL 16                       |
| Validación      | class-validator + class-transformer |
| Documentación   | Swagger / OpenAPI                   |
| Contenerización | Docker + Docker Compose             |
| Lenguaje        | TypeScript 5                        |

---

## Estructura del proyecto

```
src/
├── common/
│   ├── constants/
│   ├── dto/
│   ├── filters/
│   ├── interceptors/
│   └── interfaces/
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── database.module.ts
│   ├── env.validation.ts
│   ├── swagger.config.ts
│   └── typeorm.cli.ts
└── modules/
    ├── categories/
    ├── brands/
    ├── products/
    ├── tags/
    ├── reviews/
    ├── coupons/
    └── orders/
        └── order-calculator.ts
```

---

## Inicio rápido

### 1. Clonar y configurar

```bash
git clone https://github.com/Malpor23/e-commerce-api.git
cd ecommerce-api
cp .env.example .env   # editar los valores según sea necesario
```

### 2. Iniciar con Docker (recomendado)

```bash
# Iniciar API + PostgreSQL
docker compose up -d

# Opcionalmente incluir pgAdmin
docker compose --profile tools up -d
```

### 3. Desarrollo local (sin Docker)

```bash
npm install
# Asegúrate de que PostgreSQL esté corriendo localmente, luego:
npm run start:dev
```

### 4. Acceso

| Recurso    | URL                          |
|------------|------------------------------|
| API        | http://localhost:3000/api/v1 |
| Swagger UI | http://localhost:3000/docs   |
| pgAdmin    | http://localhost:5050        |

---

## Variables de entorno

| Variable      | Por defecto   | Descripción                             |
|---------------|---------------|-----------------------------------------|
| `NODE_ENV`    | `development` | `development` / `production` / `test`   |
| `PORT`        | `3000`        | Puerto HTTP                             |
| `API_PREFIX`  | `api/v1`      | Prefijo global de rutas                 |
| `DB_HOST`     | `localhost`   | Host de PostgreSQL                      |
| `DB_PORT`     | `5432`        | Puerto de PostgreSQL                    |
| `DB_USERNAME` | `postgres`    | Usuario de la base de datos             |
| `DB_PASSWORD` | `postgres`    | Contraseña de la base de datos          |
| `DB_NAME`     | `ecommerce`   | Nombre de la base de datos              |
| `DB_SYNC`     | `false`       | Sincronización automática (solo en dev) |
| `DB_LOGGING`  | `false`       | Registrar consultas SQL                 |

---

## Endpoints de la API

Todos los endpoints tienen el prefijo `/api/v1`.

### Categorías

| Método | Ruta              | Descripción                     |
|--------|-------------------|---------------------------------|
| GET    | `/categories`     | Listar (paginado, con búsqueda) |
| GET    | `/categories/:id` | Obtener con padre e hijos       |
| POST   | `/categories`     | Crear                           |
| PATCH  | `/categories/:id` | Actualizar                      |
| DELETE | `/categories/:id` | Eliminar                        |

### Marcas

| Método | Ruta          | Descripción                     |
|--------|---------------|---------------------------------|
| GET    | `/brands`     | Listar (paginado, con búsqueda) |
| GET    | `/brands/:id` | Obtener por id                  |
| POST   | `/brands`     | Crear                           |
| PATCH  | `/brands/:id` | Actualizar                      |
| DELETE | `/brands/:id` | Eliminar                        |

### Productos

| Método | Ruta            | Descripción                                                                                  |
|--------|-----------------|----------------------------------------------------------------------------------------------|
| GET    | `/products`     | Listar con filtros: `categoryId`, `brandId`, `minPrice`, `maxPrice`, `isActive`, `search`    |
| GET    | `/products/:id` | Obtener con todas las relaciones (categoría, marca, imágenes, variantes, etiquetas, reseñas) |
| POST   | `/products`     | Crear con imágenes, variantes e ids de etiquetas anidados                                    |
| PATCH  | `/products/:id` | Actualizar                                                                                   |
| DELETE | `/products/:id` | Eliminar                                                                                     |

### Etiquetas

| Método | Ruta        | Descripción       |
|--------|-------------|-------------------|
| GET    | `/tags`     | Listar (paginado) |
| GET    | `/tags/:id` | Obtener por id    |
| POST   | `/tags`     | Crear             |
| PATCH  | `/tags/:id` | Actualizar        |
| DELETE | `/tags/:id` | Eliminar          |

### Reseñas

| Método | Ruta           | Descripción                                 |
|--------|----------------|---------------------------------------------|
| GET    | `/reviews`     | Listar — filtrar por `productId` o `rating` |
| GET    | `/reviews/:id` | Obtener por id                              |
| POST   | `/reviews`     | Crear (nombre + email, sin autenticación)   |
| PATCH  | `/reviews/:id` | Actualizar                                  |
| DELETE | `/reviews/:id` | Eliminar                                    |

### Cupones

| Método | Ruta                  | Descripción                    |
|--------|-----------------------|--------------------------------|
| GET    | `/coupons`            | Listar (paginado)              |
| GET    | `/coupons/:id`        | Obtener por id                 |
| GET    | `/coupons/code/:code` | Buscar por código              |
| POST   | `/coupons`            | Crear (`percentage` o `fixed`) |
| PATCH  | `/coupons/:id`        | Actualizar                     |
| DELETE | `/coupons/:id`        | Eliminar                       |

### Órdenes

| Método | Ruta                 | Descripción                                                       |
|--------|----------------------|-------------------------------------------------------------------|
| GET    | `/orders`            | Listar — filtrar por `status` o `customerEmail`                   |
| GET    | `/orders/:id`        | Obtener con ítems completos                                       |
| POST   | `/orders`            | Crear orden (verificación de stock + cupón + transacción atómica) |
| PATCH  | `/orders/:id/status` | Avanzar estado (`pending → paid → shipped → delivered`)           |
| DELETE | `/orders/:id`        | Eliminar                                                          |

---

## Formatos de respuesta estándar

**Recurso individual:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    ...
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Colección paginada:**

```json
{
  "success": true,
  "data": [
    ...
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product",
  "errors": "Product with id \"...\" not found",
  "path": "/api/v1/products/...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Migraciones

```bash
# Generar una migración a partir de cambios en las entidades
npm run migration:generate -- src/database/migrations/NombreMigracion

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir la última migración
npm run migration:revert
```

> Establece `DB_SYNC=false` en producción y usa siempre migraciones.

---

## Paginación y filtros

Todos los endpoints de listado aceptan:

| Parámetro | Tipo   | Descripción                                      |
|-----------|--------|--------------------------------------------------|
| `page`    | number | Número de página (por defecto: 1)                |
| `limit`   | number | Elementos por página (por defecto: 10, máx: 100) |
| `search`  | string | Búsqueda en campos de nombre / código            |

---

## Licencia

MIT
