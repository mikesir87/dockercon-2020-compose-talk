FROM node:lts-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

FROM base AS dev
RUN yarn install && yarn cache clean
CMD ["npm", "run", "dev"]

FROM base AS prod
RUN yarn install --production && yarn cache clean
COPY src ./src
CMD ["node", "/app/src/index.js"]