# Use Node.js as the base image
FROM node:14.15.0-alpine3.12

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Start a new stage to minimize the final image size
FROM node:14.15.0-alpine3.12

# Set the working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=0 /app/package*.json ./

# Install the dependencies for production
RUN npm ci --only=production

COPY --from=0 /app/.next ./

# Expose the port 8080
EXPOSE 8080

# Start the app
CMD ["npm", "run", "start"]
