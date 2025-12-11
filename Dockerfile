# Étape 1 : Build Angular
FROM node:18-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Build production
RUN npm run build -- --configuration production

# Debug : voir ce qui a été généré
RUN echo "=== Checking build output ===" && \
    ls -la dist/ && \
    echo "=== Content of dist folder ===" && \
    ls -la dist/*/

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés (détection automatique du bon dossier)
# On copie tout le contenu de dist vers nginx
COPY --from=build /app/dist /tmp/dist

# Script pour copier le bon dossier
RUN if [ -d "/tmp/dist/proj-ang/browser" ]; then \
      echo "Found Angular 17+ structure (browser folder)" && \
      cp -r /tmp/dist/proj-ang/browser/* /usr/share/nginx/html/; \
    elif [ -d "/tmp/dist/proj-ang" ]; then \
      echo "Found standard Angular structure" && \
      cp -r /tmp/dist/proj-ang/* /usr/share/nginx/html/; \
    else \
      echo "Copying all dist content" && \
      cp -r /tmp/dist/* /usr/share/nginx/html/; \
    fi && \
    rm -rf /tmp/dist && \
    echo "=== Files in nginx html ===" && \
    ls -la /usr/share/nginx/html/

# S'assurer que index.html existe
RUN if [ ! -f "/usr/share/nginx/html/index.html" ]; then \
      echo "ERROR: index.html not found!" && \
      exit 1; \
    fi

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]