# syntax=docker/dockerfile:1
# "base" is targeted if we run docker compose on our "default" docker compose file, it's defined in the "target" value.
# "production" is targeted if we run docker-componse on our prod version of the file.
# That means all the steps are individual depending on the environment running them.

FROM node:22.9-alpine AS base

# Setting the timezone
RUN apk add -U tzdata
RUN cp /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime

# Set our working directory on the virutal machine
WORKDIR /usr/src/app

# Copy our package.json to the /usr/src/app
COPY package.json ./

# Copy our tsconfig.build.json to the /usr/src/app
COPY tsconfig.build.json ./

# Run NPM install
RUN npm install

# Copy all files from our local machine to the virutal machine (uses .dockerignore!)
COPY . .

# Generate prisma types
RUN npx prisma generate

# Create a new step
FROM base AS dev

# Remove everything besides the dist folder.


# Set NODE_PATH (might not be nessecary)
ENV NODE_PATH=./dist

# Build the production version of the application.
RUN npm run build:tsc

# CMD ["node", "dist/index.js"]
CMD ["npm", "run", "start"]