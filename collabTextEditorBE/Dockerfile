# Alpine creates a lightweight image
FROM node:20.11.1-alpine

# This creates a directory inside the container for the application
WORKDIR /app

# package.json contains all the packages of the application
COPY package.json .

# Install dependencies of the node app
RUN npm install

# Copy all the files and folders from first dot (.) which is current to app directory (.) which is docker
COPY . .

# Here node app listens to 4000 port
EXPOSE 4000

# For node app we use node and server file (node server.js)
CMD ["node", "server"]