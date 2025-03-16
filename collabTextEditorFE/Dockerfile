# React uses node and alpine here refers to lightweight image which saves space
FROM node:20.11.1-alpine as build

# This creates a directory inside the container for the application
WORKDIR /app

# package.json contains all the packages of the application
COPY package.json .

# Install dependencies of the react app
RUN npm install

# Copy all the files and folders from first dot (.) which is current to app directory (.) which is docker
COPY . .

# Build the React app for production
RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine

# copy nginx configuration in side conf.d folder
COPY --from=build app/nginx /etc/nginx/conf.d

# Copy the build output from the dist folder into the Nginx html directory
COPY --from=build app/dist /usr/share/nginx/html


# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]