FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["sh", "-c", "npm run migrate:dev && npm run start:$APP_NAME"]
