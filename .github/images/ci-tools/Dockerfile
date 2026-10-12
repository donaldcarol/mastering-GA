FROM python:3.12-slim

LABEL org.opencontainers.image.source="https://github.com/donaldcarol/mastering-GA"

RUN apt-get update \
    && apt-get install -y --no-install-recommends git curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace