# API de Red Social

API RESTful para una aplicación de red social con funcionalidades de autenticación, publicaciones, comentarios y likes.

## Características

- **Autenticación**: Registro, inicio de sesión y actualización de perfil con JWT
- **Publicaciones**: Crear, leer, actualizar y eliminar publicaciones
- **Interacciones sociales**: Comentarios y likes en publicaciones
- **Almacenamiento de imágenes**: Subida de imágenes de perfil y publicaciones a AWS S3
- **Documentación API**: Swagger UI integrado
- **Dockerizado**: Fácil de desplegar con Docker Compose

## Tecnologías

- **Backend**: Node.js, Express, TypeScript
- **Base de datos**: PostgreSQL con Prisma ORM
- **Almacenamiento**: AWS S3
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: Swagger/OpenAPI
- **Contenedores**: Docker y Docker Compose

## Requisitos previos

- Node.js (v14 o superior)
- Docker y Docker Compose
- Git
- Cuenta de AWS con acceso a S3

## Instalación y configuración

### Opción 1: Desarrollo local

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. Ejecutar migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

### Opción 2: Usando Docker

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. Iniciar los servicios con Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Estructura del proyecto

```
backend/
├── prisma/                  # Esquema y migraciones de Prisma
├── src/
│   ├── configs/             # Configuraciones (S3, Swagger)
│   ├── controllers/         # Controladores de la API
│   ├── middlewares/         # Middlewares (auth, validación)
│   ├── model/               # Interfaces y modelos
│   ├── repositories/        # Capa de acceso a datos
│   ├── routes/              # Definición de rutas
│   ├── seeders/             # Datos iniciales
│   ├── services/            # Lógica de negocio
│   ├── types/               # Tipos TypeScript
│   ├── utils/               # Utilidades
│   └── index.ts             # Punto de entrada
├── .env.example             # Ejemplo de variables de entorno
├── docker-compose.yml       # Configuración de Docker Compose
├── Dockerfile               # Configuración de Docker
├── package.json             # Dependencias y scripts
└── tsconfig.json            # Configuración de TypeScript
```

## Endpoints API

La API incluye los siguientes endpoints principales:

### Autenticación

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `PUT /auth/update` - Actualización de perfil (protegido)

### Publicaciones

- `GET /publications` - Obtener todas las publicaciones
- `GET /publications/:id` - Obtener una publicación específica
- `POST /publications` - Crear una publicación (protegido)
- `PUT /publications/:id` - Actualizar una publicación (protegido)
- `DELETE /publications/:id` - Eliminar una publicación (protegido)
- `GET /publications/user/:userId` - Obtener publicaciones de un usuario

### Comentarios

- `POST /publications/:id/comments` - Añadir un comentario (protegido)
- `GET /publications/:id/comments` - Obtener comentarios de una publicación

### Likes

- `POST /publications/:id/like` - Dar/quitar like a una publicación (protegido)
- `GET /publications/:id/likes` - Obtener likes de una publicación

## Documentación

La documentación completa de la API está disponible a través de Swagger UI:

- Local: http://localhost:3000/api-docs
- Docker: http://localhost:3000/api-docs

## Configuración de AWS S3

Para utilizar el almacenamiento de imágenes, necesitas configurar las siguientes variables de entorno:

```
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=nombre_bucket
AWS_ENDPOINT=https://nombre_bucket.s3.us-east-1.amazonaws.com
```

## Variables de entorno

Las principales variables de entorno que debes configurar son:

```
# Puerto del servidor
PORT=3000

# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_db

# JWT
JWT_SECRET=tu_clave_secreta_jwt

# AWS S3
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=nombre_bucket
AWS_ENDPOINT=https://nombre_bucket.s3.us-east-1.amazonaws.com
```

## Desarrollo

### Scripts disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm run build` - Compila el proyecto TypeScript
- `npm start` - Inicia el servidor en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

