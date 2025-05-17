FROM node:20 AS build
WORKDIR /app
# Set docker environment variable
ENV DOCKER_CONTAINER=true

COPY . .
COPY .env.docker .env
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80