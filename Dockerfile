# Stage 1: Builder
FROM node:18 AS builder

WORKDIR /app

# Copiar archivos de dependencias y configuración de Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias (incluye devDependencies para compilar TypeScript)
RUN npm ci

# Reconstruir bcrypt para la arquitectura Linux
RUN npm rebuild bcrypt --build-from-source

# Generar Prisma Client
RUN npx prisma generate

# Copiar el resto de la aplicación
COPY . .

# Compilar el código TypeScript a JavaScript (asegúrate de tener un script "build" en package.json)
RUN npm run build

# Stage 2: Imagen de producción
FROM node:18 AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma ./prisma

EXPOSE 3000


ENV NODE_ENV=production


CMD ["npm", "start"]
