FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm i

CMD ["node", "/app/app.js"]