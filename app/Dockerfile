FROM node:13

WORKDIR /usr/src/app
ENV HOME=/usr/src/app

COPY package*.json ./

RUN apt-get update && \
    apt-get -y install gcc

# COPY . .

# CMD ["npm", "start"]
