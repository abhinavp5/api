#!/usr/bin/env bash
set -euo pipefail

: "${DUCKDNS_DOMAIN:?Set DUCKDNS_DOMAIN in the environment or .env}"
: "${DUCKDNS_TOKEN:?Set DUCKDNS_TOKEN in the environment or .env}"

curl -fsS "https://www.duckdns.org/update?domains=${DUCKDNS_DOMAIN}&token=${DUCKDNS_TOKEN}&ip="
