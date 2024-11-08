#!/bin/bash
# Сгенерировать самоподписанные сертификаты
curl https://get.acme.sh | sh

DOMAIN="109.120.180.70"
CERT_DIR="/etc/letsencrypt"

mkdir -p $CERT_DIR

~/.acme.sh/acme.sh --issue -d 109.120.180.70 -d 109.120.180.70:8005 --webroot /var/www/html

~/.acme.sh/acme.sh --install-cert -d 109.120.180.70 -d 109.120.180.70:8005 \
  --cert-file $CERT_DIR/fullchain.pem \
  --key-file $CERT_DIR/privkey.pem

echo "Сертификаты на фронт и бэк успешно получены и установлены в $CERT_DIR."

cp $CERT_DIR/fullchain.pem .
cp $CERT_DIR/privkey.pem .
