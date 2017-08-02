# Mine.js 🗻⚒

> nodeJS implementation of an [Open Mined](http://openmined.org) data mine

<!-- TOC depthFrom:2 -->

- [🏃‍ Usage](#🏃‍-usage)
    - [📦 Installation](#📦-installation)
    - [🏁 Start](#🏁-start)
- [⚙️ (Missing) Features](#⚙️-missing-features)
- [🐞 Known Issues](#🐞-known-issues)
- [⚖️ License](#⚖️-license)

<!-- /TOC -->

## 🏃‍ Usage

### 📦 Installation

The code was developed using node **v8.1.2** and it is recommend to stick around this version.

```sh
npm install
```

### 🏁 Start

You need to start the following things before you can use your mine:
* blockchain (testrpc for now)
* ipfs daemon

This repository comes with a [docker-compose file](setup/docker-compose.yml) that allows you to bootstrap _ethereum_, _ipfs_ and any other services via one command.

```sh
# to start the development environment
npm run env-start

# or to stop
npm run env-stop
```

After you have the surrounding services mocked you can star the `Mine` using `npm start` which will put the application into a developer mode with [nodemon](https://github.com/remy/nodemon) acting as as serversided live-reload.

```sh
npm start
```

## ⚙️ (Missing) Features

Currently the `Mine` polls a fixed `contractAddress` for available models and lists statistics.
Features that should follow: 

* [x] Poll `Sonar` for available models
* [ ] Download the model/weights via `IPFS`
* [ ] Train the model using `syft`
* [ ] Get `contractAddress`/`mineAddress` via arguments/env variables
* [ ] Filter models for those matching available training data (requires feature change on Sonar contract)

## 🐞 Known Issues

* the `npm install` requires a python executable `>= v2.5.0 & < 3.0.0` (child-dep of web3)

## ⚖️ License

This code is licensed under [AGPL-3.0](LICENSE). If you have valid reason for us to consider going for a more permissive license please get in touch, we're not monsters 👾
