FROM node:12-alpine as build

WORKDIR /data
ADD . /data

RUN yarn install && yarn build

FROM node:12-alpine

WORKDIR /app
EXPOSE 8080

COPY --from=build /data/build /app
RUN yarn global add http-server

CMD [ "http-server", "--port", "8080", "/app" ]
