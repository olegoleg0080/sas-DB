FROM node:23.6.0-alpine

WORKDIR /front

COPY package*.json /front/

RUN npm install
RUN npm install vite --save-dev
COPY . .

CMD ["npm", "run", "dev"]