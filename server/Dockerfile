FROM node:13

WORKDIR /usr/src/server
ENV HOME=/usr/src/server

COPY package*.json ./

RUN apt-get update && \
    apt-get -y install gcc
