# Étape 1 : construire Angular
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Étape 2 : servir Angular avec Nginx
FROM nginx:alpine
# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/proj-ang /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
