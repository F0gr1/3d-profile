FROM node:24.16.0-alpine3.22@sha256:191c9f0080fcbbc6547a85dc0ff7988072214a355aabdc1d2ec55a7dae5eea8a AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=optional --ignore-scripts --no-audit --no-fund --maxsockets=50

COPY . .
RUN npm run build

FROM nginx:1.29.1-alpine3.22@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx /tmp \
  && chown -R nginx:nginx /var/cache/nginx /tmp

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider --quiet http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
