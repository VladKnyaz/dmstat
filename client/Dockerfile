# syntax=docker/dockerfile:1
FROM node:18-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn run build


FROM ubuntu AS runner

RUN apt-get update
RUN apt-get install nginx -y

COPY --from=builder /app/dist /var/www/html/
EXPOSE 80

CMD ["nginx","-g","daemon off;"]