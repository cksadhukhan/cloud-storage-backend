# Use Node.js official image as a base
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the app's port
EXPOSE 8000

# Use a non-root user to run the application (optional but recommended)
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser

# Command to run the app
CMD ["npm", "run", "start"]
