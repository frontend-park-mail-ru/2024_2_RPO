#!/bin/bash
# Сгенерировать самоподписанные сертификаты
openssl genpkey -algorithm RSA -out private.key
openssl req -new -key private.key -out request.csr
openssl x509 -req -days 365 -in request.csr -signkey private.key -out certificate.crt
