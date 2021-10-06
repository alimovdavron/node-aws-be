FROM node:12-alpine AS build

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app/
RUN npm run build

FROM mhart/alpine-node:12 as release

WORKDIR /app

COPY --from=build ./app/package*.json /app/
RUN npm ci --only=production && npm cache clean --force

COPY --from=build ./app/dist /app/

EXPOSE 4000

ENTRYPOINT ["node", "main"]