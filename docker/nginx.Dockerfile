# syntax=docker/dockerfile:1
FROM nginx:alpine

# Copy the SAN configuration file into the container
COPY config/openssl-san.cnf /etc/ssl/openssl-san.cnf

# Copy the Nginx configuration file into the container
COPY config/nginx.conf /etc/nginx/nginx.conf

# Install OpenSSL
RUN apk add --no-cache openssl

# Generate Root CA
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/root.key -out /etc/ssl/certs/root.crt  -subj "/C=US/ST=State/L=City/O=RootOrganization/CN=DinMor" -extensions v3_ca -config /etc/ssl/openssl-san.cnf

# Generate SSL certificates if they do not exist
RUN openssl req -x509 -nodes -days 365 -CA /etc/ssl/certs/root.crt -CAkey /etc/ssl/private/root.key -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -config /etc/ssl/openssl-san.cnf -extensions req_ext
RUN openssl dhparam -out /etc/nginx/dhparam.pem 2048

# Clean up
RUN rm /etc/ssl/openssl-san.cnf
RUN rm /etc/ssl/certs/root.crt
RUN rm /etc/ssl/private/root.key
RUN apk del openssl