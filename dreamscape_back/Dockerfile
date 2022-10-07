FROM node:lts-alpine as build-stage
WORKDIR /dreamscape_back
COPY package.json ./
RUN npm set progress=false && npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:lts-alpine as prod-stage
COPY --from=build-stage /dreamscape_back/dist /dreamscape_back/dist
COPY --from=build-stage /dreamscape_back/node_modules /dreamscape_back/node_modules