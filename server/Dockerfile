FROM node:16

WORKDIR /usr/src/server
ENV HOME=/usr/src/server
COPY package*.json ./

RUN apt-get update && \
    apt-get -y install gcc && \
    npm install -g node-gyp && \
    npm install && \
    npm update

COPY . .

# EXPOSE 3001

CMD ["npm", "start"]
