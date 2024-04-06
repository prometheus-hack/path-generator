FROM node:slim

COPY . .
RUN npm i

CMD ["node", "app.js"]