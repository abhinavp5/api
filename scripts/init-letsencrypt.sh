#!/usr/bin/env bash
set -euo pipefail

DOMAIN="abhinav-api.duckdns.org"
EMAIL="${LETSENCRYPT_EMAIL:?Set LETSENCRYPT_EMAIL in the environment or .env}"
RSA_KEY_SIZE=4096

DATA_PATH="./certbot"

if [ -d "${DATA_PATH}/conf/live/${DOMAIN}" ]; then
  echo "Existing certificate found for ${DOMAIN}, skipping."
  exit 0
fi

echo "Downloading recommended TLS parameters..."
mkdir -p "${DATA_PATH}/conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "${DATA_PATH}/conf/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "${DATA_PATH}/conf/ssl-dhparams.pem"

echo "Creating dummy certificate for ${DOMAIN}..."
mkdir -p "${DATA_PATH}/conf/live/${DOMAIN}"
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:${RSA_KEY_SIZE} -days 1 \
    -keyout '/etc/letsencrypt/live/${DOMAIN}/privkey.pem' \
    -out '/etc/letsencrypt/live/${DOMAIN}/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "Starting nginx..."
docker compose up -d nginx

echo "Deleting dummy certificate for ${DOMAIN}..."
docker compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/${DOMAIN} \
  /etc/letsencrypt/archive/${DOMAIN} \
  /etc/letsencrypt/renewal/${DOMAIN}.conf" certbot

echo "Requesting real certificate for ${DOMAIN}..."
docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email '${EMAIL}' \
    -d '${DOMAIN}' \
    --rsa-key-size ${RSA_KEY_SIZE} \
    --agree-tos \
    --non-interactive" certbot

echo "Reloading nginx..."
docker compose exec nginx nginx -s reload
