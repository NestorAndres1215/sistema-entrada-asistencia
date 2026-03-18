# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias ignorando conflictos de peer deps
RUN npm install --legacy-peer-deps

# Copiamos todo el proyecto
COPY . .

# Build del proyecto (React + Vite)
RUN npm run build

# Etapa 2: Producción con nginx
FROM nginx:alpine

# Copiamos build de React
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando para levantar nginx
CMD ["nginx", "-g", "daemon off;"]