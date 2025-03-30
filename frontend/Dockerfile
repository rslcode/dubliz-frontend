FROM node:18-alpine
ENV PORT 8002

RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /frontend

RUN npm install --global pm2

COPY package*.json .
RUN npm i --production

COPY . .

RUN npm run build

RUN npx next telemetry disable

EXPOSE $PORT

# Запуск приложения через PM2
CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
