FROM node:24-alpine as build

WORKDIR /data
ADD . /data

RUN npm install && NODE_ENV=production npm run build

FROM node:24-alpine

WORKDIR /app
EXPOSE 8080

COPY --from=build /data/build /app
RUN npm install -g http-server

CMD [ "http-server", "--port", "8080", "/app" ]
