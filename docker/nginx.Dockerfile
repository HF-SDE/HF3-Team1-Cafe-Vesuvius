FROM nginx:1.19.0-alpine

# Generate SSL certificates if they do not exist
RUN mkdir -p /usr/src/app/cert
RUN apk add --no-cache openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
RUN openssl dhparam -out /etc/nginx/dhparam.pem 4096
RUN 