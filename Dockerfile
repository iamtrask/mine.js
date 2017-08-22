FROM node:8-alpine

# Install git & stuff (req for npm install)
RUN apk update && apk upgrade && \
    apk add --no-cache git curl make gcc g++ python linux-headers binutils-gold gnupg libstdc++

# Bundle app source
COPY . /app

# Create app directory
WORKDIR /app

RUN npm install

CMD [ "node", "bin/cli", "train", "--mine-address", "auto", "--contract-address", "0xdde11dad6a87e03818aea3fde7b790b644353ccc" ]
