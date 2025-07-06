
FROM node:18


WORKDIR /usr/src/app


COPY package*.json ./

COPY . .

RUN npm install 



EXPOSE 3009


CMD ["node", "server.js"]
