# syntax=docker/dockerfile:1
# "base" is targeted if we run docker compose on our "default" docker compose file, it's defined in the "target" value.
# "production" is targeted if we run docker-componse on our prod version of the file.
# That means all the steps are individual depending on the environment running them.

FROM node:22.9-alpine AS base

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


# Set our working directory on the virutal machine
WORKDIR /usr/src/app

# Copy our package.json to the /usr/src/app
COPY package.json ./

# Run NPM install
RUN npm install

# Copy all files from our local machine to the virutal machine (uses .dockerignore!)
COPY . .

# Generate prisma types
RUN npx prisma generate

# Deploy Prisma changes to prod
RUN ["chmod", "+x", "./entrypoint.sh"]

# Fix the file format from windows CRLF to linux LF
RUN sed -i -e 's/\r$//' ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]