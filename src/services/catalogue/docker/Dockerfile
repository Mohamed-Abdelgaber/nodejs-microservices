ARG IMAGE=node:14.17.0-alpine
FROM $IMAGE AS builder

ENV APP_PORT=4000

WORKDIR /app

RUN npm i -g @microsoft/rush

RUN apk add --no-cache bash curl git py-pip make && \ 
    npx node-prune && \
    npm install node-dev -g && \
    npm cache clean --force

FROM builder

COPY ./src/building-blocks ./app/src/building-blocks

COPY ./src/database ./app/src/database

COPY ./src/services/catalogue ./app/src/services/catalogue

COPY ./src/services/catalogue/docker/rush.json ./app/src/services/catalogue/

RUN cd app/src/services/catalogue && rush update && rush build

EXPOSE $APP_PORT

USER node

CMD ["node", "app/src/services/catalogue/dist"]
