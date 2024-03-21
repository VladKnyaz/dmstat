# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /crp-frontend

COPY package.json ./
COPY yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile

ENV SERVER_HOST app
ENV SERVER_PORT 5001

COPY . .

CMD ["yarn", "dev"]
EXPOSE 5173