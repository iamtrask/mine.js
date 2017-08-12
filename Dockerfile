FROM node:8-alpine

# Create app directory
WORKDIR /app

# Install git
RUN apk update && apk upgrade && \
    apk add --no-cache git curl make gcc g++ python linux-headers binutils-gold gnupg libstdc++

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . /app

CMD [ "npm", "start" ]
