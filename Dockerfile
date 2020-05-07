FROM node:14-buster

WORKDIR /usr/app

# Install npm deps
COPY package.json yarn.lock ./
RUN yarn install

EXPOSE 8080
