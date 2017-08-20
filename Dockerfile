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

CMD [ "node", "bin/cli", "train", "--mine-address", "0xE8cd631a35daEA6c76cF9a8c04C1a326fE69f9A9", "--contract-address", "0xdde11dad6a87e03818aea3fde7b790b644353ccc" ]
