# syntax=docker/dockerfile:1
FROM node:22.9-alpine AS base

# Install OpenSSL to generate certificates
RUN apk add --no-cache openssl

# Setting the timezone
RUN apk add -U tzdata
RUN cp /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime

# Add MongoDB Shell
RUN wget https://downloads.mongodb.com/compass/mongosh-2.3.3-linux-arm64.tgz
RUN tar -xvzf mongosh-2.3.3-linux-arm64.tgz
RUN cp /mongosh-2.3.3-linux-arm64/bin/mongosh /usr/bin/mongosh
# Clean up
RUN rm -rf mongosh-2.3.3-linux-arm64.tgz
RUN rm -rf /mongosh-2.3.3-linux-arm64

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy other application files
COPY . .

# Generate Prisma types
RUN npx prisma generate

# Ensure entrypoint.sh is executable
RUN chmod +x ./entrypoint.sh

# Expose port 3001 for HTTPS
EXPOSE 3001

# Command to start the application (using HTTPS on port 3001)
ENTRYPOINT ["./entrypoint.sh"]
