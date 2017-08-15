FROM node:8-alpine

# Install git & stuff (req for npm install)
RUN apk update && apk upgrade && \
    apk add --no-cache git curl make gcc g++ python linux-headers binutils-gold gnupg libstdc++

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . /app

# Create app directory
WORKDIR /app

CMD [ "node", "app" ]
