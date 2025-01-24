# Use Node.js as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the client directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend code
COPY . .

# Build the frontend
RUN npm run build

# Use NGINX to serve the built frontend
FROM nginx:alpine

# Remove default NGINX configuration
RUN rm -rf /etc/nginx/conf.d

# Copy our custom NGINX config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy React build files to NGINX's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose NGINX port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
