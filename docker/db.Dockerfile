# syntax=docker/dockerfile:1
FROM mongo

# Update all packes
RUN apt update

# Install open ssl to use later
RUN apt install openssl -y

# Generate key to use for standalone replSet
RUN openssl rand -base64 756 > /data/keyfile.pem

# Make dir
RUN mkdir -p /data/logs

# Set perms
RUN chmod 777 -R /data/logs
RUN chmod 400 /data/keyfile.pem
RUN chown -R 999:999 /data
RUN chown 999:999 /data/keyfile.pem

# Copy files and set perms to allowing running the file
COPY ./init.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init.sh

# Clean up
RUN apt remove openssl -y
RUN apt autoremove -y
RUN rm -rf /var/lib/apt/lists/*
