# syntax=docker/dockerfile:1
FROM node:18
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile

COPY . .

EXPOSE 5000/tcp
EXPOSE 5000/udp

CMD ["yarn", "start:dev"]