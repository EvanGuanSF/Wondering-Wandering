FROM node:16

WORKDIR /temp/app
ENV HOME=/temp/app

COPY package*.json ./

RUN apt-get update
RUN apt-get upgrade
