FROM node:18 AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias incluyendo devDependencies
RUN npm ci

# Reconstruir bcrypt para Linux
RUN npm rebuild bcrypt --build-from-source

# Generar Prisma Client
RUN npx prisma generate

# Copiar el resto de archivos y compilar
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-slim

WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Generar Prisma Client
RUN npx prisma generate

# Copiar archivos compilados desde la etapa builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

# Ejecutar la aplicación
CMD ["npm", "start"]
