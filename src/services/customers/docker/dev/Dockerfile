ARG IMAGE=node:14.17.0-alpine
FROM $IMAGE as builder

WORKDIR /app

RUN apk add --no-cache bash curl git py-pip make && \ 
    npx node-prune && \
    npm install node-dev -g && \
    npm cache clean --force

RUN npm i -g @microsoft/rush

FROM builder

COPY ./src/services/customers/package.json rush.json ./

COPY . .

RUN rush update --purge

RUN rush build

RUN cd ./src/services/customer && npm run start
