FROM openmined/pysyft:edge AS pysyft

FROM node:8-alpine

# Install git & stuff (req for npm install)
RUN apk update && apk upgrade && \
    apk add --no-cache git curl make gcc g++ python linux-headers binutils-gold gnupg libstdc++

RUN ["apk", "add", "--no-cache", "python3", "python3-dev", "musl-dev", "linux-headers", "g++", "lapack-dev", "gfortran", "gmp-dev", "mpfr-dev", "mpc1-dev"]
COPY --from=pysyft /usr/lib/python3.6/site-packages/syft-*.egg /usr/lib/python3.6/site-packages
COPY --from=pysyft /usr/bin/syft_cmd /usr/bin/syft_cmd
COPY --from=pysyft /PySyft/requirements.txt /PySyft/requirements.txt
RUN ["pip3", "install", "-r", "/PySyft/requirements.txt"]
COPY --from=pysyft /PySyft /PySyft
RUN ["python3", "/PySyf/setup.py", "install"]

# Bundle app source
COPY . /app

# Create app directory
WORKDIR /app

RUN npm install

CMD [ "node", "bin/cli", "train", "--mine-address", "auto" ]
