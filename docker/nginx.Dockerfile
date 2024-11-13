FROM nginx:alpine

# Copy the SAN configuration file into the container
COPY config/openssl-san.cnf /etc/ssl/openssl-san.cnf

# Copy the Nginx configuration file into the container
COPY config/nginx.conf /etc/nginx/nginx.conf

# Install OpenSSL
RUN apk add --no-cache openssl

# Generate SSL certificates if they do not exist
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -config /etc/ssl/openssl-san.cnf
RUN openssl dhparam -out /etc/nginx/dhparam.pem 2048