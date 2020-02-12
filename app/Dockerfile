FROM node:13

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && \
    apt-get -y install gcc && \
    npm install -g node-gyp && \
    npm install

COPY . .

RUN npm update

CMD ["npm", "start"]
