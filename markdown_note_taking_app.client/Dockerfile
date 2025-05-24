FROM node:20 AS build
WORKDIR /app
# Set docker environment variable
ENV DOCKER_CONTAINER=true

COPY . .
COPY .env.docker .env
RUN npm install
# List directory contents to debug during build
RUN ls -la public/assets || echo "No assets directory in public"
RUN npm run build
# List the build output to confirm assets were copied
RUN ls -la dist/assets || echo "No assets directory in dist"

FROM nginx:alpine
# Copy the built files including assets directory
COPY --from=build /app/dist /usr/share/nginx/html
# Debug: List files to verify assets were copied
RUN ls -la /usr/share/nginx/html/assets || echo "No assets directory in nginx html"
# Ensure proper permissions for all files
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; && find /usr/share/nginx/html -type f -exec chmod 644 {} \;
# Custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80