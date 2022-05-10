ARG IMAGE=node:14.17.0-alpine
FROM $IMAGE AS builder

ENV APP_PORT=9500

WORKDIR /app

RUN npm i -g @microsoft/rush

RUN apk add --no-cache bash curl git py-pip make && \ 
    npx node-prune && \
    npm install node-dev -g && \
    npm cache clean --force

FROM builder

COPY ./src/building-blocks ./app/src/building-blocks

COPY ./src/database ./app/src/database

COPY ./src/api-gateway ./app/src/api-gateway

COPY ./src/api-gateway/docker/rush.json ./app/src/api-gateway/

RUN cd app/src/api-gateway && rush update && rush build

EXPOSE $APP_PORT

USER node

CMD ["node", "app/src/api-gateway/dist"]
