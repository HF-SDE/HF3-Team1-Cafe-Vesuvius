FROM nginx:alpine

# Generate SSL certificates if they do not exist
RUN apk add --no-cache openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" -keyout /etc/ssl/private/nginx-selfsigned.local.key -out /etc/ssl/certs/nginx-selfsigned.local.crt
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj "/C=US/ST=State/L=City/O=Organization/CN=10.130.54.94" -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
RUN openssl dhparam -out /etc/nginx/dhparam.pem 4096