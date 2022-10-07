FROM node:lts-alpine as build-stage
WORKDIR /dreamscape_front
COPY package.json ./
RUN npm set progress=false && npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:lts-alpine as prod-stage

ARG APP_USER
ARG SERVER_ADDRESS
ENV APP_USER=$APP_USER
ENV SERVER_ADDRESS=$SERVER_ADDRESS

COPY --from=build-stage /dreamscape_front/dist /dreamscape_front/dist
RUN npm install -g serve