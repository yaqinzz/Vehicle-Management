#!/bin/bash
# Script to enable HTTPS after SSL certificate is obtained

set -e

DOMAIN=${1:-$DOMAIN}
if [ -z "$DOMAIN" ]; then
  echo "Usage: $0 <domain> or set DOMAIN environment variable"
  exit 1
fi

echo "Enabling HTTPS for $DOMAIN..."

# Create nginx config with HTTPS enabled
cat > nginx.conf <<EOF
server {
  listen 80;
  server_name $DOMAIN;

  # ACME challenge
  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  # Redirect other http to https
  location / {
    return 301 https://\$host\$request_uri;
  }
}

server {
  listen 443 ssl http2;
  server_name $DOMAIN;

  ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:10m;

  location /api/ {
    proxy_pass http://backend:4000/;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location / {
    proxy_pass http://frontend:80/;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF

echo "Reloading nginx with HTTPS enabled..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "HTTPS enabled successfully for $DOMAIN"
