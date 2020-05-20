FROM node:lts-alpine AS base
WORKDIR /app

#####################################
#        BACKEND ENVIRONMENT        #
#####################################

FROM base AS backend-base
COPY backend/package.json backend/yarn.lock ./

FROM backend-base AS backend-dev
RUN yarn install && yarn cache clean
CMD ["npm", "run", "dev"]


#####################################
#       FRONTEND ENVIRONMENT        #
#####################################

FROM base AS frontend-base
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install && yarn cache clean
CMD ["yarn", "start"]

FROM frontend-base AS frontend-final
COPY frontend/public ./public
COPY frontend/src ./src
RUN yarn build

#####################################
#       COMBINED ENVIRONMENT        #
#####################################

FROM backend-base AS final
RUN yarn install --production && yarn cache clean
COPY backend/src ./src
COPY --from=frontend-final /app/build /app/src/static
CMD ["node", "/app/src/index.js"]
