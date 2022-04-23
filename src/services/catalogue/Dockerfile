ARG IMAGE=node:14.15.0-alpine

FROM $IMAGE AS build

WORKDIR .

COPY . .

RUN apk add --no-cache make gcc g++ python && \
    npx @microsoft/rush update --purge && \
    npx @microsoft/rush build

EXPOSE 4000


RUN ls

CMD ["node", "src/services/catalogue/dist"]