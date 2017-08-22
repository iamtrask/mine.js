FROM openmined/pysyft:edge AS pysyft

FROM node:8-alpine

# Install git & stuff (req for npm install)
RUN apk update && apk upgrade && \
    apk add --no-cache git curl make gcc g++ python linux-headers binutils-gold gnupg libstdc++

RUN ["apk", "add", "--no-cache", "python3", "python3-dev", "musl-dev", "linux-headers", "g++", "lapack-dev", "gfortran", "gmp-dev", "mpfr-dev", "mpc1-dev"]
COPY --from=pysyft /usr/lib/python3.6/site-packages/syft-*.egg /usr/lib/python3.6/site-packages
COPY --from=pysyft /usr/bin/syft_cmd /usr/bin/syft_cmd
RUN ["pip3", "install", "clint", "pytest", "pytest-flake8", "pyRserve", "numpy", "phe", "line_profiler", "numpy", "scipy"]

# Bundle app source
COPY . /app

# Create app directory
WORKDIR /app

RUN npm install

CMD [ "node", "bin/cli", "train", "--mine-address", "auto", "--contract-address", "0xdde11dad6a87e03818aea3fde7b790b644353ccc" ]
