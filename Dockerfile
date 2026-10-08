# Use the official Node.js image as the base image
FROM node:24-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Dependências de sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Install the application dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]

