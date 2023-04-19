# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies in the container
RUN npm install --production

# Copy the rest of the application files to the container
COPY ./app/ ./

# Expose the port that the container will listen on
EXPOSE 3000

# Start the application when the container is run
CMD ["node", "index.js"]
