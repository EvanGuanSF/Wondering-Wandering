FROM node:16

WORKDIR /usr/src/server
ENV HOME=/usr/src/server
COPY package*.json ./

RUN apt-get update
RUN apt-get -y install gcc
RUN npm update -g npm
RUN npm install -g node-gyp npm-check-updates
RUN ncu -u
RUN npm install

COPY . .

# EXPOSE 3001

CMD ["npm", "start"]
